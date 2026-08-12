import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nombreDeIngrediente, BASICOS } from '../data/ingredientes.js'
import { escalarIngrediente, formatearCantidad } from '../lib/share.js'
import {
  SUSTITUCIONES,
  textoSustituciones,
} from '../lib/sustituciones.js'
import { normalizarTexto } from '../lib/normalizar.js'
import { useApp } from '../context/AppContext.jsx'

const NIVEL = {
  facil: { emoji: '🙂' },
  media: { emoji: '😌' },
  dificil: { emoji: '🧑‍🍳' },
}

function retardo() {
  return 550 + Math.random() * 500
}

/** Busca un ingrediente de la receta mencionado en el texto del usuario. */
function ingredienteMencionado(receta, texto) {
  const n = normalizarTexto(texto)
  for (const ing of receta.ingredientes) {
    const nombre = normalizarTexto(nombreDeIngrediente(ing.id))
    if (n.includes(nombre)) return ing.id
  }
  return null
}

export default function CocinaBot({ receta, idsIngredientes, porciones, onCerrar }) {
  const { t, tN, idioma } = useApp()
  const sep = idioma === 'en' ? ' or ' : ' o '
  const [mensajes, setMensajes] = useState([])
  const [escribiendo, setEscribiendo] = useState(false)
  const [paso, setPaso] = useState(-1)
  const finRef = useRef(null)
  const idRef = useRef(0)
  const enCola = useRef(0)
  const montado = useRef(true)

  // Evita setState después de desmontar (p. ej. cerrar el modal mientras escribe)
  useEffect(() => {
    montado.current = true
    return () => {
      montado.current = false
    }
  }, [])

  const totalPasos = receta.pasos.length
  const faltantes = useMemo(() => {
    const set = new Set(idsIngredientes)
    return receta.ingredientes.filter(
      (ing) => !BASICOS.has(ing.id) && !set.has(ing.id)
    )
  }, [receta, idsIngredientes])

  const idMsg = () => ++idRef.current

  // Mensaje del bot tras una pausa de "escribiendo…"
  const botDice = useCallback(
    (texto, extras = {}) => {
      const id = idMsg()
      setEscribiendo(true)
      enCola.current++
      setTimeout(() => {
        enCola.current = Math.max(0, enCola.current - 1)
        if (enCola.current === 0) setEscribiendo(false)
        if (montado.current) {
          setMensajes((prev) => [
            ...prev,
            { id, autor: 'bot', texto, ...extras },
          ])
        }
      }, retardo())
    },
    []
  )

  // Saludo inicial
  useEffect(() => {
    const set = new Set(idsIngredientes)
    const tengo = receta.ingredientes.filter(
      (ing) => BASICOS.has(ing.id) || set.has(ing.id)
    )
    let texto = t('bot.saludo', { receta: receta.nombre })
    texto += `\n\n${t('bot.tenesIng', { a: tengo.length, b: receta.ingredientes.length, c: faltantes.length })}`
    if (faltantes.length === 0) {
      texto += `\n\n${t('bot.listos')}`
    } else {
      texto += `\n\n${t('bot.podemosAvanzar')}`
    }
    const t = setTimeout(
      () => botDice(texto, { chips: chipsInicio() }),
      600
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function chipsInicio() {
    return [t('bot.chipEmpezar'), t('bot.chipIngredientes'), t('bot.chipFalta'), t('bot.chipSustituciones')]
  }
  function chipsPasos(actual = paso) {
    const base = [t('bot.chipSiguiente'), t('bot.chipAnterior')]
    if (actual >= totalPasos - 1) base.push(t('bot.chipTermine'))
    base.push(t('bot.chipIngredientes'), t('bot.chipSustituciones'))
    return base
  }

  // ---------- Respuestas ----------
  const verIngredientes = () => {
    const set = new Set(idsIngredientes)
    const lineas = []
    lineas.push(t('bot.ingredientesTitulo', { n: porciones, pers: tN('bot.persona', 'bot.personas', porciones) }))
    for (const ing of receta.ingredientes) {
      const esc = escalarIngrediente(ing, receta.porciones, porciones)
      const falta = !BASICOS.has(ing.id) && !set.has(ing.id)
      const nombre = nombreDeIngrediente(ing.id).toLowerCase()
      lineas.push(`${falta ? '❌' : '✅'} ${formatearCantidad(esc.cantidad)} ${esc.unidad} de ${nombre}`)
    }
    return lineas.join('\n')
  }

  const verFaltantes = () => {
    if (faltantes.length === 0) {
      return t('bot.todosLosIng')
    }
    const lista = faltantes.map((f) => `• ${nombreDeIngrediente(f.id)}`).join('\n')
    const texto = `${t('bot.faltan', { n: faltantes.length })}\n\n${lista}\n\n`
    const sustituciones = textoSustituciones(receta, idsIngredientes)
    return texto + (sustituciones ?? t('bot.tipFaltante'))
  }

  const verSustituciones = () => {
    if (faltantes.length === 0) {
      return t('bot.noFaltaSust')
    }
    const sustituciones = textoSustituciones(receta, idsIngredientes)
    if (sustituciones) {
      return `${sustituciones}\n\n${t('bot.quedaRico')}`
    }
    const ejemplos = faltantes
      .slice(0, 2)
      .map((f) => {
        const opciones = SUSTITUCIONES[f.id]
        return opciones?.length
          ? t('bot.sePuedeCon', {
              ing: nombreDeIngrediente(f.id),
              opciones: opciones.slice(0, 2).map(nombreDeIngrediente).join(sep),
            })
          : null
      })
      .filter(Boolean)
    const base = t('bot.noEncontre')
    return ejemplos.length
      ? `${base}\n\n• ${ejemplos.join('\n• ')}`
      : t('bot.experimentar')
  }

  const verTiempo = () => {
    const total = receta.tiempoMinutos
    const porPaso = Math.round(total / totalPasos)
    return `${t('bot.tiempo', { n: total })}\n\n${t('bot.tiempo2', { a: totalPasos, b: porPaso })}`
  }

  const verPorciones = () => {
    return `${t('bot.porcionesResp', { a: receta.porciones, b: porciones })}\n\n${t('bot.porcionesResp2')}`
  }

  const verDificultad = () => {
    const n = NIVEL[receta.dificultad] ?? NIVEL.facil
    const tips = {
      facil: t('bot.tipFacil'),
      media: t('bot.tipMedia'),
      dificil: t('bot.tipDificil'),
    }
    return `${t('bot.dificultad', { emoji: n.emoji, nombre: t('dificultad.' + receta.dificultad) })}\n\n${tips[receta.dificultad] ?? tips.facil}`
  }

  const verPaso = (indice) => {
    const numero = Math.max(0, Math.min(totalPasos - 1, indice))
    setPaso(numero)
    botDice(receta.pasos[numero], {
      tipo: 'paso',
      numero: numero + 1,
      total: totalPasos,
      chips: chipsPasos(numero),
    })
  }

  const avanzarPaso = () => {
    if (paso === -1) {
      if (faltantes.length > 0) {
        botDice(
          `${t('bot.vamos')}\n\n${tN('bot.antesDeArrancar1', 'bot.antesDeArrancar', faltantes.length)} ${textoSustituciones(receta, idsIngredientes) ?? t('bot.podesReemplazar')}\n\n${t('bot.cuandoListo')}`,
          { chips: [t('bot.chipSiguiente'), t('bot.chipSustituciones')] }
        )
      } else {
        verPaso(0)
      }
      return
    }
    if (paso < totalPasos - 1) {
      verPaso(paso + 1)
    } else {
      setPaso(-1)
      botDice(
        `${t('bot.felicitaciones')}\n\n${t('bot.disfruta', { receta: receta.nombre.toLowerCase() })}`,
        { chips: [t('bot.chipDeNuevo'), t('bot.chipIngredientes'), t('bot.chipSustituciones')] }
      )
    }
  }

  const retrocederPaso = () => {
    if (paso <= 0) {
      botDice(t('bot.primerPaso'), { chips: chipsPasos() })
      return
    }
    verPaso(paso - 1)
  }

  const repetirPaso = () => {
    if (paso === -1) {
      botDice(t('bot.noArrancamos'), {
        chips: chipsInicio(),
      })
      return
    }
    botDice(`${t('bot.repito')}\n\n${receta.pasos[paso]}`, {
      tipo: 'paso',
      numero: paso + 1,
      total: totalPasos,
      chips: chipsPasos(),
    })
  }

  const finalizar = () => {
    setPaso(-1)
    botDice(
      `${t('bot.buenisimo')}\n\n${t('bot.tipSobro')}`,
      { chips: [t('bot.chipDeNuevo'), t('bot.chipIngredientes'), t('bot.chipSustituciones')] }
    )
  }

  const ayuda = () => {
    return ['bot.ayuda', 'bot.ayuda1', 'bot.ayuda2', 'bot.ayuda3', 'bot.ayuda4', 'bot.ayuda5', 'bot.ayuda6']
      .map((clave, i) => (i === 0 ? t(clave) : `• ${t(clave)}`))
      .join('\n')
  }

  // ---------- Procesador de intenciones ----------
  const responderA = (texto) => {
    const n = normalizarTexto(texto)
    if (!n) return

    // Paso N
    const pasoN = n.match(/(paso|step)\s+(\d{1,2})/)
    if (pasoN) {
      verPaso(parseInt(pasoN[2], 10) - 1)
      return
    }
    // "no tengo X" → sustitución específica
    if (
      n.includes('no tengo') ||
      n.includes('no teng') ||
      n.includes('me falta') ||
      n.includes('sin ') ||
      n.includes("i don't have") ||
      n.includes('i dont have') ||
      n.includes("i'm missing") ||
      n.includes('im missing') ||
      n.includes('without ')
    ) {
      const id = ingredienteMencionado(receta, texto)
      if (id) {
        const opciones = SUSTITUCIONES[id] ?? []
        const set = new Set(idsIngredientes)
        const disponibles = opciones.filter((o) => set.has(o))
        const nombre = nombreDeIngrediente(id)
        if (disponibles.length > 0) {
          botDice(
            t('bot.noProblema', { ing: nombre.toLowerCase(), reemplazo: nombreDeIngrediente(disponibles[0]) }),
            { chips: chipsPasos() }
          )
        } else if (opciones.length > 0) {
          botDice(
            t('bot.paraReemplazar', { ing: nombre.toLowerCase(), opciones: opciones.map(nombreDeIngrediente).join(sep) }),
            { chips: chipsPasos() }
          )
        } else {
          botDice(
            t('bot.tranqui', { ing: nombre.toLowerCase() }),
            { chips: chipsPasos() }
          )
        }
        return
      }
    }
    // Intenciones
    if (/(hola|buenas|buen dia|buenas tardes|ey|hey|que tal|hello|\bhi\b)/.test(n)) {
      botDice(t('bot.holaDeNuevo', { receta: receta.nombre }), {
        chips: chipsInicio(),
      })
    } else if (/(empezar|arrancar|cocinar|dale|vamos|adelante|siguiente|continuar|next|si|start)/.test(n)) {
      avanzarPaso()
    } else if (/(anterior|atras|volver|retroceder|anterior paso|back|previous)/.test(n)) {
      retrocederPaso()
    } else if (/(repetir|otra vez|otravez|de nuevo|nuevamente|repeat|again)/.test(n)) {
      repetirPaso()
    } else if (/(ingrediente|que lleva|lista de compras|ingredient)/.test(n)) {
      botDice(verIngredientes(), { chips: chipsPasos() })
    } else if (/(falta|faltante|faltan|faltaria|que me falta|missing)/.test(n)) {
      botDice(verFaltantes(), { chips: chipsPasos() })
    } else if (/(sustitu|reempla|cambio|cambiar|alternativa|en vez de|por cual|por que reemplazo|puedo usar|substitut|swap)/.test(n)) {
      botDice(verSustituciones(), { chips: chipsPasos() })
    } else if (/(tiempo|cuanto tarda|cuanto dura|dura|tarda|demora|minutos|how long|\btime\b)/.test(n)) {
      botDice(verTiempo(), { chips: chipsPasos() })
    } else if (/(porcion|personas|cantidad|para cuantos|racion|serving|servings)/.test(n)) {
      botDice(verPorciones(), { chips: chipsPasos() })
    } else if (/(dificultad|dificil|facil|media|complicado|sencillo|difficult|easy|hard|medium)/.test(n)) {
      botDice(verDificultad(), { chips: chipsPasos() })
    } else if (/(gracias|listo|termine|terminado|fin|completo|me salio|thanks|done|finished)/.test(n)) {
      finalizar()
    } else if (/(ayuda|que podes|que sabes|opciones|ayudame|help|options)/.test(n)) {
      botDice(ayuda(), { chips: chipsInicio() })
    } else {
      const id = ingredienteMencionado(receta, texto)
      if (id) {
        const opciones = SUSTITUCIONES[id] ?? []
        if (opciones.length) {
          botDice(
            t('bot.sobreIng', { ing: nombreDeIngrediente(id).toLowerCase(), opciones: opciones.map(nombreDeIngrediente).join(sep) }),
            { chips: chipsPasos() }
          )
        } else {
          botDice(t('bot.buenaPregunta', { ing: nombreDeIngrediente(id).toLowerCase() }), { chips: chipsPasos() })
        }
      } else {
        botDice(t('bot.noEntendi'), { chips: chipsInicio() })
      }
    }
  }

  const enviar = (texto) => {
    const limpio = texto.trim()
    if (!limpio || escribiendo) return false
    setMensajes((prev) => [...prev, { id: idMsg(), autor: 'user', texto: limpio }])
    responderA(limpio)
    return true
  }

  // Auto-scroll
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes, escribiendo])

  const ultimoBot = [...mensajes].reverse().find((m) => m.autor === 'bot')
  const chips = ultimoBot?.chips ?? []
  const progreso = paso >= 0 ? ((paso + 1) / totalPasos) * 100 : 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Encabezado del chat */}
      <div className="flex items-center gap-3 border-b border-stone-200/70 bg-gradient-to-r from-green-600 to-lime-500 px-4 py-3 dark:border-stone-700">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
          👨‍🍳
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-green-600 bg-green-400" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white">{t('bot.chefGuia')} · {receta.nombre}</p>
          <p className="text-xs font-bold text-green-100">
            {escribiendo ? t('bot.escribiendo') : paso >= 0 ? t('bot.pasoDe', { a: paso + 1, b: totalPasos }) : t('bot.enLinea')}
          </p>
        </div>
        <button
          onClick={onCerrar}
          aria-label={t('bot.cerrarAria')}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-black text-white transition-colors hover:bg-white/30"
        >
          ✕
        </button>
      </div>

      {/* Barra de progreso de pasos */}
      {paso >= 0 && (
        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-lime-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
            role="progressbar"
            aria-valuenow={paso + 1}
            aria-valuemin={1}
            aria-valuemax={totalPasos}
          />
        </div>
      )}

      {/* Mensajes */}
      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-label={t('bot.conversacionAria')}
      >
        {mensajes.map((m) =>
          m.autor === 'user' ? (
            <div key={m.id} className="flex justify-end animate-fade-up">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-green-600 px-4 py-2.5 text-[15px] font-bold text-white shadow-sm">
                {m.texto}
              </div>
            </div>
          ) : m.tipo === 'paso' ? (
            <div key={m.id} className="animate-fade-up">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-green-600 text-sm font-black text-white shadow-sm">
                  {m.numero}
                </span>
                <span className="text-xs font-black uppercase tracking-wide text-stone-400">
                  {t('bot.pasoLabel', { a: m.numero, b: m.total })}
                </span>
              </div>
              <div className="mt-1.5 ml-4 max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[15px] font-semibold leading-relaxed text-stone-800 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-700">
                {m.texto}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex items-end gap-2 animate-fade-up">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-crema-100 text-base dark:bg-stone-800" aria-hidden="true">
                👨‍🍳
              </span>
              <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[15px] font-semibold leading-relaxed text-stone-700 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700">
                {m.texto}
              </div>
            </div>
          )
        )}

        {escribiendo && (
          <div className="flex items-end gap-2 animate-fade-in">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-crema-100 text-base dark:bg-stone-800" aria-hidden="true">
              👨‍🍳
            </span>
            <div className="flex gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:ring-stone-700">
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '120ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '240ms' }} />
            </div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      {/* Chips de respuesta rápida */}
      {chips.length > 0 && !escribiendo && (
        <div className="flex flex-wrap gap-1.5 border-t border-stone-200/70 px-3 pt-3 dark:border-stone-700">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => enviar(chip)}
              className="rounded-full bg-green-50 px-3 py-1.5 text-[13px] font-extrabold text-green-700 ring-1 ring-green-200 transition-all hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-sm active:translate-y-0 dark:bg-green-900/40 dark:text-green-200 dark:ring-green-800 dark:hover:bg-green-900/70"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const input = e.currentTarget.querySelector('input')
          const ok = enviar(input.value)
          if (ok) input.value = ''
        }}
        className="flex items-center gap-2 p-3"
      >
        <input
          id="cocina-bot-input"
          type="text"
          placeholder={t('bot.placeholder')}
          aria-label={t('bot.inputAria')}
          className="w-full flex-1 rounded-2xl border-2 border-stone-200 bg-crema-50 px-4 py-2.5 text-[15px] font-semibold text-stone-800 placeholder:text-stone-400 focus:border-green-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
        />
        <button
          type="submit"
          aria-label={t('bot.enviarAria')}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-600 text-lg text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-500 active:scale-90"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
