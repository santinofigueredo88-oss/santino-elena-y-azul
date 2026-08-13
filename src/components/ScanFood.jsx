import { useCallback, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { leerStorage, escribirStorage } from '../lib/storage.js'
import { PROMPT_ANALISIS_COMIDA } from '../lib/prompt-comida.js'

const CLAVE_GEMINI = 'que-cocino:gemini-key'
const MODELO = 'gemini-2.5-flash'

// ---------------------------------------------------------------
// Compresión de la imagen: la redimensiona a 1024px como máximo y
// la convierte a JPEG base64 para mandarla a la API (payload chico).
// ---------------------------------------------------------------
async function prepararImagen(file) {
  const dataUrl = await new Promise((resolver, rechazar) => {
    const lector = new FileReader()
    lector.onload = () => resolver(lector.result)
    lector.onerror = () => rechazar(new Error('lectura'))
    lector.readAsDataURL(file)
  })
  const img = new Image()
  await new Promise((resolver, rechazar) => {
    img.onload = resolver
    img.onerror = () => rechazar(new Error('decodificacion'))
    img.src = dataUrl
  })
  const max = 1024
  const escala = Math.min(1, max / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * escala))
  canvas.height = Math.max(1, Math.round(img.height * escala))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  const jpeg = canvas.toDataURL('image/jpeg', 0.82)
  return {
    base64: jpeg.split(',')[1],
    mimeType: 'image/jpeg',
    preview: jpeg,
  }
}

// ---------------------------------------------------------------
// Llamada directa a Gemini desde el navegador (modo desarrollo,
// cuando la función serverless no está disponible en localhost).
// ---------------------------------------------------------------
async function llamarGeminiDirecto(foto, apiKey) {
  // Misma cadena de modelos que la función serverless: si el modelo nuevo
  // no está disponible para la capa gratuita, cae a gemini-2.0-flash.
  const modelos = [...new Set([MODELO, 'gemini-2.0-flash'])]
  for (const modelo of modelos) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT_ANALISIS_COMIDA },
              { inline_data: { mime_type: foto.mimeType, data: foto.base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
      try {
        return { ok: true, ...JSON.parse(texto.replace(/```(?:json)?/gi, '').trim()) }
      } catch {
        return { ok: false, error: 'formato' }
      }
    }
    if (res.status === 429) return { ok: false, error: 'limite' }
    if (res.status === 400) return { ok: false, error: 'clave-invalida' }
    if (res.status === 404 || res.status === 403) continue // probamos el siguiente
    return { ok: false, error: 'gemini' }
  }
  return { ok: false, error: 'gemini' }
}

// Primero intenta la función serverless de Vercel; si no existe (modo
// desarrollo), cae a la llamada directa a Gemini.
async function pedirAnalisis(foto, apiKey) {
  try {
    const res = await fetch('/api/analizar-comida', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: foto.base64,
        mimeType: foto.mimeType,
        apiKey,
      }),
    })
    // En modo desarrollo Vite responde HTML (200) para rutas desconocidas:
    // lo tratamos como "función no disponible" y caemos a la llamada directa.
    const tipo = res.headers.get('content-type') || ''
    if (res.ok && tipo.includes('application/json')) return await res.json()
    if (res.status === 404 || res.ok) throw new Error('not-found')
    const err = await res.json().catch(() => ({}))
    return { ok: false, error: err.error || 'servidor', message: err.message }
  } catch (e) {
    if (e.message === 'not-found') {
      if (apiKey) return llamarGeminiDirecto(foto, apiKey)
      return { ok: false, error: 'sin-clave' }
    }
    return { ok: false, error: 'red' }
  }
}

// ---------------------------------------------------------------
// Componente: subí una foto de comida → análisis + beneficios
// ---------------------------------------------------------------
export default function ScanFood() {
  const { t, agregarIngrediente, irA } = useApp()
  const inputRef = useRef(null)
  const [estado, setEstado] = useState('inicial') // inicial | analizando | resultado | error
  const [foto, setFoto] = useState(null) // { preview }
  const [resultado, setResultado] = useState(null)
  const [mensajeError, setMensajeError] = useState('')
  const [detalleError, setDetalleError] = useState('')
  const [clave, setClave] = useState(() => leerStorage(CLAVE_GEMINI, ''))
  const [textoClave, setTextoClave] = useState('')
  const [configAbierto, setConfigAbierto] = useState(false)
  const [claveGuardada, setClaveGuardada] = useState(false)
  // Guardia contra respuestas lentas: si el usuario sube dos fotos rápido,
  // solo se aplica el resultado de la última.
  const secuenciaRef = useRef(0)

  const mensajeDeError = useCallback(
    (codigo) => {
      switch (codigo) {
        case 'sin-clave':
          return t('scan.errorClave')
        case 'limite':
          return t('scan.errorLimite')
        case 'clave-invalida':
          return t('scan.errorClaveInvalida')
        case 'red':
          return t('scan.errorRed')
        case 'imagen-invalida':
          return t('scan.errorImg')
        default:
          return t('scan.errorGenerico')
      }
    },
    [t]
  )

  const analizarArchivo = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        setMensajeError(t('scan.errorImg'))
        setDetalleError('')
        setEstado('error')
        return
      }
      let img
      try {
        img = await prepararImagen(file)
      } catch {
        setMensajeError(t('scan.errorImg'))
        setDetalleError('')
        setEstado('error')
        return
      }
      setFoto(img)
      setResultado(null)
      setEstado('analizando')
      const miSecuencia = ++secuenciaRef.current
      const data = await pedirAnalisis(img, clave)
      if (secuenciaRef.current !== miSecuencia) return // respuesta vieja
      if (data.ok) {
        setResultado(data)
        setEstado('resultado')
      } else {
        setMensajeError(mensajeDeError(data.error))
        setDetalleError(data.message || '')
        setEstado('error')
        if (data.error === 'sin-clave') setConfigAbierto(true)
      }
    },
    [clave, mensajeDeError, t]
  )

  const elegirArchivo = (e) => {
    const file = e.target.files?.[0]
    if (file) analizarArchivo(file)
    e.target.value = ''
  }

  // Drag & drop de la foto sobre la tarjeta
  const [arrastrando, setArrastrando] = useState(false)

  const guardarClave = () => {
    const valor = textoClave.trim()
    if (!valor) return
    escribirStorage(CLAVE_GEMINI, valor)
    setClave(valor)
    setClaveGuardada(true)
    setConfigAbierto(false)
    setTimeout(() => setClaveGuardada(false), 2500)
  }

  const quitarClave = () => {
    escribirStorage(CLAVE_GEMINI, '')
    setClave('')
    setTextoClave('')
  }

  const usarIngredientes = () => {
    if (!resultado?.ingredientes) return
    for (const ing of resultado.ingredientes) {
      if (typeof ing === 'string') agregarIngrediente(ing)
    }
    irA('resultados')
  }

  const esNoComida =
    resultado?.plato && resultado.plato.toLowerCase().includes('no es comida')

  const veredictoClases = {
    saludable:
      'bg-green-100 text-green-700 ring-green-300 dark:bg-green-900/60 dark:text-green-200 dark:ring-green-700',
    equilibrado:
      'bg-lime-100 text-lime-700 ring-lime-300 dark:bg-lime-900/60 dark:text-lime-200 dark:ring-lime-700',
    ocasional:
      'bg-stone-100 text-stone-600 ring-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-600',
  }

  return (
    <section
      aria-label={t('scan.aria')}
      className="mx-auto mt-10 max-w-5xl px-4"
    >
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-800">
        {/* Encabezado con gradiente */}
        <div className="bg-gradient-to-r from-green-600 to-lime-500 px-6 py-5 dark:from-green-800 dark:to-lime-900 sm:px-8">
          <h2 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
            {t('scan.titulo')}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-bold text-green-100">
            {t('scan.sub')}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* ── Sin clave configurada: banner para activar ── */}
          {!clave && !configAbierto && (
            <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-2xl bg-crema-100 px-4 py-3.5 ring-1 ring-green-200 dark:bg-stone-800 dark:ring-green-900 sm:flex-row sm:items-center">
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200">
                🔑 {t('scan.claveBanner')}
              </p>
              <button
                type="button"
                onClick={() => setConfigAbierto(true)}
                className="shrink-0 rounded-xl bg-green-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-green-500"
              >
                {t('scan.claveConfigurar')}
              </button>
            </div>
          )}

          {/* ── Setup de clave (instrucciones + pegado) ── */}
          {configAbierto && (
            <div className="mb-5 rounded-2xl bg-crema-100 p-5 ring-1 ring-green-200 dark:bg-stone-800 dark:ring-green-900">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-black text-stone-900 dark:text-white">
                  {t('scan.claveTitulo')}
                </h3>
                <button
                  type="button"
                  onClick={() => setConfigAbierto(false)}
                  aria-label={t('scan.claveCerrar')}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 text-sm font-semibold text-stone-600 dark:text-stone-300">
                {t('scan.claveSub')}
              </p>
              <ol className="mt-3 space-y-1.5 text-sm font-semibold text-stone-700 dark:text-stone-200">
                <li>1. {t('scan.clavePaso1')}</li>
                <li>2. {t('scan.clavePaso2')}</li>
                <li>3. {t('scan.clavePaso3')}</li>
              </ol>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-green-700 ring-1 ring-green-300 transition-all hover:-translate-y-0.5 hover:bg-green-50 dark:bg-stone-900 dark:text-green-300 dark:ring-green-800"
              >
                🔗 {t('scan.claveLink')}
              </a>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input
                  type="password"
                  value={textoClave}
                  onChange={(e) => setTextoClave(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && guardarClave()}
                  placeholder={t('scan.clavePlaceholder')}
                  className="w-full flex-1 rounded-xl border-2 border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 placeholder:text-stone-400 focus:border-green-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
                />
                <button
                  type="button"
                  onClick={guardarClave}
                  className="shrink-0 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-extrabold text-white transition-all hover:bg-stone-700 active:scale-95 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
                >
                  {t('scan.claveGuardar')}
                </button>
              </div>
              <p className="mt-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                {t('scan.claveNota')}
              </p>
            </div>
          )}

          {/* ── Estado inicial: subir / sacar foto ── */}
          {estado === 'inicial' && (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setArrastrando(true)
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={(e) => {
                e.preventDefault()
                setArrastrando(false)
                const file = e.dataTransfer.files?.[0]
                if (file) analizarArchivo(file)
              }}
              className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                arrastrando
                  ? 'scale-[1.01] border-green-500 bg-green-50 dark:bg-green-950/40'
                  : 'border-stone-300 bg-crema-50 hover:border-green-400 hover:bg-green-50/60 dark:border-stone-700 dark:bg-stone-800 dark:hover:border-green-700'
              }`}
            >
              <span className="text-5xl" aria-hidden="true">
                🍽️
              </span>
              <p className="mt-3 text-lg font-extrabold text-stone-800 dark:text-stone-100">
                {t('scan.subir')}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {t('scan.dragHint')}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.removeAttribute('capture')
                    inputRef.current?.click()
                  }}
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-green-600/25 transition-all hover:-translate-y-0.5 hover:bg-green-500"
                >
                  {t('scan.subirBoton')}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    inputRef.current?.setAttribute('capture', 'environment')
                    inputRef.current?.click()
                  }}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-stone-700 ring-1 ring-stone-300 transition-all hover:-translate-y-0.5 hover:bg-crema-100 hover:ring-green-300 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-600 dark:hover:bg-stone-700"
                >
                  {t('scan.camara')}
                </button>
              </div>
            </div>
          )}

          {/* ── Analizando… ── */}
          {estado === 'analizando' && (
            <div className="grid place-items-center rounded-2xl bg-crema-50 px-6 py-12 text-center dark:bg-stone-800">
              <span className="animate-bounce text-6xl" aria-hidden="true">
                🍳
              </span>
              <p className="mt-4 text-lg font-extrabold text-stone-800 dark:text-stone-100">
                {t('scan.analizando')}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {t('scan.analizandoSub')}
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {estado === 'error' && (
            <div className="grid place-items-center rounded-2xl bg-red-50 px-6 py-10 text-center ring-1 ring-red-200 dark:bg-red-950/40 dark:ring-red-900">
              <span className="text-5xl" aria-hidden="true">
                😅
              </span>
              <p className="mt-3 text-lg font-extrabold text-red-700 dark:text-red-300">
                {mensajeError}
              </p>
              {detalleError && (
                <p className="mt-2 max-w-md break-words text-xs font-semibold text-red-500/80 dark:text-red-400/80">
                  {detalleError}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-red-500"
                >
                  {t('scan.reintentar')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEstado('inicial')
                    setFoto(null)
                  }}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-stone-700 ring-1 ring-stone-300 transition-all hover:bg-crema-100 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-600"
                >
                  {t('scan.otra')}
                </button>
              </div>
            </div>
          )}

          {/* ── Resultado ── */}
          {estado === 'resultado' && resultado && (
            <div className="grid gap-6 sm:grid-cols-5">
              {/* Foto + veredicto */}
              <div className="sm:col-span-2">
                <div className="overflow-hidden rounded-2xl ring-1 ring-stone-200 dark:ring-stone-700">
                  <img
                    src={foto?.preview}
                    alt={resultado.plato || ''}
                    className="h-52 w-full object-cover sm:h-64"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {resultado.veredicto && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-extrabold ring-1 ${
                        veredictoClases[resultado.veredicto] ??
                        veredictoClases.equilibrado
                      }`}
                    >
                      {t('scan.veredicto.' + resultado.veredicto, null, resultado.veredicto)}
                    </span>
                  )}
                  {resultado.porcion && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-crema-100 px-3.5 py-1.5 text-sm font-extrabold text-stone-600 ring-1 ring-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700">
                      👥 {resultado.porcion}
                    </span>
                  )}
                </div>
              </div>

              {/* Detalle */}
              <div className="sm:col-span-3">
                {esNoComida ? (
                  <div className="grid h-full place-items-center rounded-2xl bg-crema-50 px-6 py-10 text-center dark:bg-stone-800">
                    <span className="text-5xl" aria-hidden="true">
                      🤔
                    </span>
                    <p className="mt-3 text-lg font-extrabold text-stone-700 dark:text-stone-200">
                      {t('scan.noComida')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEstado('inicial')
                        setFoto(null)
                      }}
                      className="mt-4 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-green-500"
                    >
                      {t('scan.otra')}
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-2xl font-black tracking-tight text-stone-900 dark:text-white">
                      {resultado.plato}
                    </h3>
                    {resultado.descripcion && (
                      <p className="mt-1 text-sm font-semibold text-stone-500 dark:text-stone-400">
                        {resultado.descripcion}
                      </p>
                    )}

                    {/* Nutrientes */}
                    <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {t('scan.nutri')}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { valor: resultado.calorias, label: t('scan.calorias') },
                        { valor: resultado.proteinas, label: t('scan.proteinas') },
                        { valor: resultado.carbohidratos, label: t('scan.carbohidratos') },
                        { valor: resultado.grasas, label: t('scan.grasas') },
                      ].map((macro) => (
                        <div
                          key={macro.label}
                          className="rounded-xl bg-crema-100 px-3 py-2.5 text-center ring-1 ring-stone-200/70 dark:bg-stone-800 dark:ring-stone-700"
                        >
                          <span className="block text-lg font-black text-stone-800 dark:text-stone-100">
                            {macro.valor ?? 0}
                          </span>
                          <span className="block text-[11px] font-bold text-stone-500 dark:text-stone-400">
                            {macro.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Beneficios */}
                    {resultado.beneficios?.length > 0 && (
                      <>
                        <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                          {t('scan.beneficios')}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {resultado.beneficios.map((b, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm font-semibold text-stone-700 dark:text-stone-200"
                            >
                              <span aria-hidden="true">✅</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* Ingredientes + acciones */}
                    {resultado.ingredientes?.length > 0 && (
                      <p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        {t('scan.ingredientes')}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {resultado.ingredientes?.map((ing, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-crema-100 px-3 py-1.5 text-sm font-bold text-stone-700 ring-1 ring-stone-200/70 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700"
                        >
                          🧺 {ing}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={usarIngredientes}
                        className="rounded-xl bg-green-600 px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-green-600/25 transition-all hover:-translate-y-0.5 hover:bg-green-500"
                      >
                        {t('scan.usar')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEstado('inicial')
                          setFoto(null)
                          setResultado(null)
                        }}
                        className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-stone-700 ring-1 ring-stone-300 transition-all hover:-translate-y-0.5 hover:bg-crema-100 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-600"
                      >
                        {t('scan.otra')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Clave guardada / quitar */}
          {clave && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/70 pt-4 dark:border-stone-800">
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500">
                {t('scan.claveNota')}
              </p>
              <button
                type="button"
                onClick={quitarClave}
                className="text-xs font-bold text-stone-400 underline-offset-4 hover:text-red-500 hover:underline dark:text-stone-500 dark:hover:text-red-400"
              >
                {t('scan.claveQuitar')}
              </button>
            </div>
          )}

          {/* Aviso de clave guardada */}
          {claveGuardada && (
            <p className="mt-4 rounded-xl bg-green-100 px-4 py-3 text-center text-sm font-extrabold text-green-700 ring-1 ring-green-300 dark:bg-green-900/50 dark:text-green-200 dark:ring-green-700">
              {t('scan.claveGuardada')}
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <p className="border-t border-stone-200/70 bg-crema-50/60 px-6 py-3 text-center text-xs font-semibold text-stone-400 dark:border-stone-800 dark:bg-stone-950/40 dark:text-stone-500">
          {t('scan.disclaimer')}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={elegirArchivo}
      />
    </section>
  )
}
