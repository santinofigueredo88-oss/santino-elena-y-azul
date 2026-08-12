import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import {
  CATEGORIAS,
  CATEGORIA_POR_ID,
  INGREDIENTES,
  INGREDIENTES_RAPIDOS,
  INGREDIENTE_POR_ID,
} from '../data/ingredientes.js'
import { buscarIngrediente, normalizarTexto } from '../lib/normalizar.js'
import { calcularFaltantes, clasificarRecetas } from '../lib/matching.js'
import { RECETAS } from '../data/recetas.js'
import RecipeCard from './RecipeCard.jsx'

// Recetas destacadas para mostrar en el inicio cuando todavía no hay ingredientes cargados
const DESTACADAS = ['panqueques', 'milanesas-de-carne', 'fideos-con-tuco', 'pizza-casera']

// ---------------- Autocompletado ----------------
function SuggestionList({ query, onSelect }) {
  const { t } = useApp()
  const sugerencias = useMemo(() => {
    const n = normalizarTexto(query)
    if (!n) return []
    const matches = INGREDIENTES.filter((ing) => {
      const hayado = buscarIngrediente(query)
      if (hayado && hayado.id === ing.id) return true
      const todos = [ing.nombre, ing.id, ...ing.sinonimos].map(normalizarTexto)
      return todos.some((t) => t.includes(n) || n.includes(t))
    }).slice(0, 8)
    const exacto = matches.some((m) => normalizarTexto(m.nombre) === n)
    if (matches.length > 0 && !exacto && n.length >= 3) {
      matches.push({ custom: true, nombre: query.trim() })
    }
    return matches
  }, [query])

  if (sugerencias.length === 0) return null

  return (
    <ul
      role="listbox"
      aria-label={t('home.sugerenciasAria')}
      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 dark:border-stone-700 dark:bg-stone-800"
    >
      {sugerencias.map((s, idx) => {
        const cat = s.custom ? null : CATEGORIA_POR_ID[s.categoria]
        return (
          <li key={s.custom ? `custom-${idx}` : s.id}>
            <button
              role="option"
              onClick={() => onSelect(s.nombre)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-green-50 dark:hover:bg-stone-700"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-crema-100 text-lg dark:bg-stone-700">
                {s.custom ? '➕' : (cat?.emoji ?? '🥫')}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-stone-800 dark:text-stone-100">
                  {s.nombre}
                </span>
                <span className="block text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {s.custom ? t('home.agregarPropio') : cat ? t('categoria.' + cat.id, null, cat.nombre) : t('home.ingrediente')}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

// ---------------- Chips de ingredientes agregados ----------------
function ChipsList() {
  const { ingredientes, quitarIngrediente, t } = useApp()
  if (ingredientes.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t('home.ingredientesAria')}>
      {ingredientes.map((ing) => {
        const conocido = INGREDIENTE_POR_ID[ing.id]
        const emoji = conocido
          ? CATEGORIA_POR_ID[conocido.categoria]?.emoji
          : '🥫'
        return (
          <span
            key={ing.id}
            className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white py-1.5 pl-3 pr-1.5 text-sm font-bold text-stone-800 shadow-sm dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
          >
            <span aria-hidden="true">{emoji}</span>
            {ing.nombre}
            <button
              onClick={() => quitarIngrediente(ing.id)}
              aria-label={t('home.quitarAria', { nombre: ing.nombre })}
              className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-red-100 hover:text-red-600 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-red-900 dark:hover:text-red-300"
            >
              ✕
            </button>
          </span>
        )
      })}
    </div>
  )
}

// ---------------- Botones rápidos por categoría ----------------
function QuickButtons() {
  const { ingredientes, agregarIngrediente, t } = useApp()
  const [categoria, setCategoria] = useState('rapidos')
  const ids = useMemo(() => new Set(ingredientes.map((i) => i.id)), [ingredientes])

  const visibles = useMemo(() => {
    if (categoria === 'rapidos') {
      return INGREDIENTES_RAPIDOS.map((id) => INGREDIENTE_POR_ID[id])
    }
    return INGREDIENTES.filter((i) => i.categoria === categoria)
  }, [categoria])

  return (
    <section aria-label={t('home.rapidosAria')} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-800 sm:p-6">
      <h2 className="mb-3 font-display text-lg font-black text-stone-900 dark:text-white">
        {t('home.rapidosTitulo')}
      </h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoria('rapidos')}
          aria-pressed={categoria === 'rapidos'}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
            categoria === 'rapidos'
              ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
              : 'bg-crema-100 text-stone-600 hover:bg-green-100 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
          }`}
        >
          {t('home.masComunes')}
        </button>
        {CATEGORIAS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoria(cat.id)}
            aria-pressed={categoria === cat.id}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
              categoria === cat.id
                ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                : 'bg-crema-100 text-stone-600 hover:bg-green-100 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {cat.emoji} {t('categoria.' + cat.id, null, cat.nombre)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {visibles.map((ing) => {
          const agregado = ids.has(ing.id)
          return (
            <button
              key={ing.id}
              onClick={() => !agregado && agregarIngrediente(ing.nombre)}
              disabled={agregado}
              aria-pressed={agregado}
              className={`rounded-xl border px-3.5 py-2.5 text-sm font-bold transition-all ${
                agregado
                  ? 'cursor-default border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
                  : 'border-stone-200 bg-crema-50 text-stone-700 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:shadow-md dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-green-700 dark:hover:bg-stone-700 dark:hover:text-green-300'
              }`}
            >
              {agregado ? '✅ ' : ''}
              {ing.nombre}
            </button>
          )
        })}
      </div>
    </section>
  )
}

// ---------------- Hero ilustrado (sin fotos) ----------------
function HeroIlustrado({ cantidad }) {
  const { t } = useApp()
  return (
    <section className="relative overflow-hidden">
      {/* Fondo con gradiente verde suave */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-100 via-crema-50 to-white dark:from-green-950/50 dark:via-stone-950 dark:to-stone-950"
        aria-hidden="true"
      />
      {/* Círculo decorativo difuso */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-lime-300/30 blur-3xl dark:bg-lime-500/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-green-400/20 blur-3xl dark:bg-green-600/10"
        aria-hidden="true"
      />
      {/* Emojis de ingredientes flotando */}
      <div className="pointer-events-none absolute inset-0 hidden select-none sm:block" aria-hidden="true">
        <span className="absolute left-[7%] top-10 rotate-[-14deg] text-5xl opacity-25">🍳</span>
        <span className="absolute right-[9%] top-16 rotate-[10deg] text-6xl opacity-25">🥑</span>
        <span className="absolute bottom-12 left-[13%] rotate-[8deg] text-4xl opacity-20">🍅</span>
        <span className="absolute bottom-10 right-[16%] rotate-[-10deg] text-5xl opacity-20">🥕</span>
        <span className="absolute left-[42%] top-6 text-4xl opacity-10">🌿</span>
        <span className="absolute bottom-6 left-[46%] text-3xl opacity-10">🧄</span>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-16 text-center sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-extrabold text-green-800 shadow-sm ring-1 ring-green-200 backdrop-blur dark:bg-green-950/60 dark:text-green-200 dark:ring-green-800">
          {t('home.heroBadge', { n: cantidad })}
        </span>
        <h1 className="mt-4 font-display text-4xl font-black leading-tight tracking-tight text-stone-900 dark:text-white sm:text-6xl">
          {t('home.queCocino')}{' '}
          <span className="bg-gradient-to-r from-green-600 to-lime-500 bg-clip-text text-transparent">
            {t('home.hoy')}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-bold leading-relaxed text-stone-600 dark:text-stone-300 sm:text-xl">
          {t('home.heroP1')} {t('home.heroP2a')}{' '}
          <span className="text-green-600 dark:text-lime-400">{t('home.chefVirtual')}</span>{' '}
          {t('home.heroP2b')}
        </p>
      </div>
    </section>
  )
}

// ---------------- Vista principal ----------------
export default function HomeView() {
  const { ingredientes, agregarIngrediente, limpiarIngredientes, irA, idsIngredientes, abrirReceta, t, tN } = useApp()
  const [texto, setTexto] = useState('')
  const [foco, setFoco] = useState(false)

  const totalPosibles = useMemo(
    () => RECETAS.filter((r) => calcularFaltantes(r, idsIngredientes) === 0).length,
    [idsIngredientes]
  )

  // Sugerencias en vivo: apenas hay ingredientes cargados, mostramos ya
  // las mejores opciones sin esperar a "Buscar recetas". Intercalamos
  // completas (hasta 6) con casi-completas (hasta 2) para que se vean las dos.
  const sugeridas = useMemo(() => {
    if (idsIngredientes.length === 0) return []
    const idsUsuario = new Set(idsIngredientes)
    const { completas, casi } = clasificarRecetas(RECETAS, idsIngredientes)
    const comp = completas.slice(0, 6)
    const cas = casi.slice(0, 2)
    const mezcla = []
    for (let i = 0; i < Math.max(comp.length, cas.length) && mezcla.length < 8; i++) {
      if (comp[i]) mezcla.push(comp[i])
      if (cas[i]) mezcla.push(cas[i])
    }
    return mezcla.map(({ receta, faltantes }) => ({ receta, faltantes, idsUsuario }))
  }, [idsIngredientes])

  // Destacadas: solo se muestran cuando no hay sugerencias en vivo activas.
  const destacadas = useMemo(() => {
    if (sugeridas.length > 0) return []
    const mapa = new Map(RECETAS.map((r) => [r.id, r]))
    const idsUsuario = new Set(idsIngredientes)
    return DESTACADAS.map((id) => mapa.get(id))
      .filter(Boolean)
      .map((receta) => ({
        receta,
        faltantes: calcularFaltantes(receta, idsIngredientes),
        idsUsuario,
      }))
  }, [sugeridas, idsIngredientes])

  const manejarSubmit = (e) => {
    e.preventDefault()
    const ok = agregarIngrediente(texto)
    if (ok) setTexto('')
  }

  return (
    <div className="animate-fade-up">
      <HeroIlustrado cantidad={RECETAS.length} />

      {/* Input de ingredientes */}
      <section className="mx-auto -mt-10 max-w-3xl px-4">
        <form
          onSubmit={manejarSubmit}
          className="relative rounded-3xl bg-white p-4 shadow-lg shadow-green-900/10 ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-800 sm:p-6"
        >
          <label htmlFor="input-ingrediente" className="mb-2 block text-sm font-extrabold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            {t('home.queTenes')}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="input-ingrediente"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onFocus={() => setFoco(true)}
              onBlur={() => setTimeout(() => setFoco(false), 120)}
              placeholder={t('home.placeholder')}
              autoComplete="off"
              className="w-full flex-1 rounded-2xl border-2 border-stone-200 bg-crema-50 px-5 py-3.5 text-lg font-semibold text-stone-800 placeholder:text-stone-400 focus:border-green-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-stone-900 px-6 py-3.5 text-lg font-extrabold text-white transition-all hover:bg-stone-700 active:scale-95 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              {t('home.agregar')}
            </button>
          </div>
          {foco && <SuggestionList query={texto} onSelect={(nombre) => { agregarIngrediente(nombre); setTexto('') }} />}

          <div className="mt-4 min-h-10">
            <ChipsList />
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => irA('resultados')}
              disabled={ingredientes.length === 0}
              className="btn-primary w-full sm:w-auto"
            >
              {t('home.buscar')}
            </button>
            {ingredientes.length > 0 && (
              <>
                <p className="text-sm font-bold text-stone-500 dark:text-stone-400">
                  {tN('home.recetaLista', 'home.recetasListas', totalPosibles)}
                </p>
                <button
                  type="button"
                  onClick={limpiarIngredientes}
                  className="text-sm font-bold text-stone-400 underline-offset-4 hover:text-red-500 hover:underline dark:text-stone-500 dark:hover:text-red-400"
                >
                  {t('home.vaciar')}
                </button>
              </>
            )}
          </div>
        </form>
      </section>

      {/* Botones rápidos */}
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <QuickButtons />
      </div>

      {/* Sugerencias en vivo (cuando hay ingredientes) */}
      {sugeridas.length > 0 && (
        <section className="mx-auto mt-14 max-w-6xl px-4 pb-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-stone-200/70 pb-5 dark:border-stone-800">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-stone-900 dark:text-white sm:text-3xl">
                {t('home.mejores')}
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {tN('home.conIngredientes', 'home.conIngredientesPlural', ingredientes.length)}
              </p>
            </div>
            <button
              onClick={() => irA('resultados')}
              className="hidden shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-green-600 ring-1 ring-green-200 transition-all hover:bg-green-50 sm:block dark:bg-stone-900 dark:text-green-400 dark:ring-green-800 dark:hover:bg-stone-800"
            >
              {t('home.verTodas')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sugeridas.map((item) => (
              <RecipeCard key={item.receta.id} item={item} onAbrir={abrirReceta} />
            ))}
          </div>
        </section>
      )}

      {/* Destacadas (solo cuando no hay sugerencias activas) */}
      {sugeridas.length === 0 && (
        <section className="mx-auto mt-14 max-w-6xl px-4 pb-24">
          <div className="mb-6 flex items-end justify-between gap-3 border-b border-stone-200/70 pb-5 dark:border-stone-800">
            <div>
              <h2 className="font-display text-2xl font-black tracking-tight text-stone-900 dark:text-white sm:text-3xl">
                {t('home.destacadas')}
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {t('home.destacadasSub')}
              </p>
            </div>
            <button
              onClick={() => irA('resultados')}
              className="hidden shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-green-600 ring-1 ring-green-200 transition-all hover:bg-green-50 sm:block dark:bg-stone-900 dark:text-green-400 dark:ring-green-800 dark:hover:bg-stone-800"
            >
              {t('home.verTodas')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destacadas.map((item) => (
              <RecipeCard key={item.receta.id} item={item} onAbrir={abrirReceta} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
