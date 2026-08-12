import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { RECETAS, TIPOS_DE_COMIDA } from '../data/recetas.js'
import {
  clasificarRecetas,
  agruparCasi,
  aplicarFiltros,
} from '../lib/matching.js'
import RecipeCard from './RecipeCard.jsx'

// ---------- Filtros ----------
function FiltersBar({ filtros, setFiltros, totales }) {
  const { t, tN } = useApp()
  const pill = (activo) =>
    `rounded-full px-3.5 py-2 text-sm font-bold transition-all ${
      activo
        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
        : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-crema-100 dark:bg-stone-800 dark:text-stone-300 dark:ring-stone-700 dark:hover:bg-stone-700'
    }`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('filtros.ariaTipo')}>
        <span className="mr-1 text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">{t('filtros.tipo')}</span>
        <button className={pill(!filtros.tipo)} onClick={() => setFiltros({ ...filtros, tipo: null })}>{t('filtros.todos')}</button>
        {TIPOS_DE_COMIDA.map((t) => (
          <button
            key={t.id}
            className={pill(filtros.tipo === t.id)}
            onClick={() => setFiltros({ ...filtros, tipo: filtros.tipo === t.id ? null : t.id })}
          >
            {t.emoji} {t.nombre}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('filtros.ariaTiempo')}>
        <span className="mr-1 text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">{t('filtros.tiempo')}</span>
        <button className={pill(!filtros.tiempo)} onClick={() => setFiltros({ ...filtros, tiempo: null })}>{t('filtros.todos')}</button>
        <button className={pill(filtros.tiempo === 'rapido')} onClick={() => setFiltros({ ...filtros, tiempo: filtros.tiempo === 'rapido' ? null : 'rapido' })}>⚡ &lt; 20 min</button>
        <button className={pill(filtros.tiempo === 'medio')} onClick={() => setFiltros({ ...filtros, tiempo: filtros.tiempo === 'medio' ? null : 'medio' })}>🕐 20–45 min</button>
        <button className={pill(filtros.tiempo === 'largo')} onClick={() => setFiltros({ ...filtros, tiempo: filtros.tiempo === 'largo' ? null : 'largo' })}>🐢 &gt; 45 min</button>
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t('filtros.ariaDificultad')}>
        <span className="mr-1 text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500">{t('filtros.dificultad')}</span>
        <button className={pill(!filtros.dificultad)} onClick={() => setFiltros({ ...filtros, dificultad: null })}>{t('filtros.todas')}</button>
        <button className={pill(filtros.dificultad === 'facil')} onClick={() => setFiltros({ ...filtros, dificultad: filtros.dificultad === 'facil' ? null : 'facil' })}>🙂 {t('dificultad.facil')}</button>
        <button className={pill(filtros.dificultad === 'media')} onClick={() => setFiltros({ ...filtros, dificultad: filtros.dificultad === 'media' ? null : 'media' })}>😌 {t('dificultad.media')}</button>
        <button className={pill(filtros.dificultad === 'dificil')} onClick={() => setFiltros({ ...filtros, dificultad: filtros.dificultad === 'dificil' ? null : 'dificil' })}>🧑‍🍳 {t('dificultad.dificil')}</button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-300">
          <input
            type="checkbox"
            checked={filtros.soloFavoritos}
            onChange={(e) => setFiltros({ ...filtros, soloFavoritos: e.target.checked })}
            className="h-5 w-5 accent-green-600"
          />
          {t('filtros.soloFavs')}
        </label>
        {totales > 0 && (
          <span className="text-sm font-bold text-stone-400 dark:text-stone-500">
            {tN('filtros.nResultados', 'filtros.nResultadosPlural', totales)}
          </span>
        )}
      </div>
    </div>
  )
}

// ---------- Sección de resultados ----------
function Seccion({ titulo, subtitulo, items, idsUsuario, onAbrir, acento }) {
  if (items.length === 0) return null
  return (
    <section className="animate-fade-up">
      <div className="mb-4">
        <h2 className={`font-display text-2xl font-black text-stone-900 dark:text-white ${acento ?? ''}`}>{titulo}</h2>
        {subtitulo && <p className="mt-0.5 text-sm font-semibold text-stone-500 dark:text-stone-400">{subtitulo}</p>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ receta, faltantes }) => (
          <RecipeCard
            key={receta.id}
            item={{ receta, faltantes, idsUsuario }}
            onAbrir={onAbrir}
          />
        ))}
      </div>
    </section>
  )
}

// ---------- Vista principal de resultados ----------
export default function ResultsView() {
  const { idsIngredientes, favoritos, abrirReceta, irA, ingredientes, t, tN } = useApp()
  const [filtros, setFiltros] = useState({
    tipo: null,
    tiempo: null,
    dificultad: null,
    soloFavoritos: false,
  })

  const idsUsuario = useMemo(() => new Set(idsIngredientes), [idsIngredientes])

  const { completas, casi, explorar } = useMemo(
    () => clasificarRecetas(RECETAS, idsIngredientes),
    [idsIngredientes]
  )
  const { uno, dos } = useMemo(() => agruparCasi(casi), [casi])

  const [verExplorar, setVerExplorar] = useState(false)

  const filtrosConFavs = { ...filtros, favoritos }

  const completasF = aplicarFiltros(completas, filtrosConFavs)
  const unoF = aplicarFiltros(uno, filtrosConFavs)
  const dosF = aplicarFiltros(dos, filtrosConFavs)
  const explorarF = aplicarFiltros(explorar, filtrosConFavs)

  const totales = completasF.length + unoF.length + dosF.length

  if (ingredientes.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-up">
        <span className="text-7xl" role="img" aria-hidden="true">🧺</span>
        <h2 className="mt-4 text-3xl font-black text-stone-900 dark:text-white">{t('resultados.vacioTitulo')}</h2>
        <p className="mt-2 text-lg font-semibold text-stone-500 dark:text-stone-400">
          {t('resultados.vacioSub')}
        </p>
        <button onClick={() => irA('inicio')} className="btn-primary mt-6">
          {t('resultados.irInicio')}
        </button>
      </div>
    )
  }

  if (completasF.length + unoF.length + dosF.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-up">
        <span className="text-7xl" role="img" aria-hidden="true">😅</span>
        <h2 className="mt-4 text-3xl font-black text-stone-900 dark:text-white">
          {t('resultados.sinMatch')}
        </h2>
        <p className="mt-2 text-lg font-semibold text-stone-500 dark:text-stone-400">
          {t('resultados.sinMatchSub')}
        </p>
        <button onClick={() => irA('inicio')} className="btn-primary mt-6">
          {t('resultados.agregarMas')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="py-8">
        <h1 className="font-display text-3xl font-black tracking-tight text-stone-900 dark:text-white sm:text-4xl">
          {t('resultados.titulo')}
        </h1>
        <p className="mt-1 text-base font-semibold text-stone-500 dark:text-stone-400">
          {tN('resultados.sub', 'resultados.subPlural', ingredientes.length)}
        </p>
        {ingredientes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label={t('resultados.tusIng')}>
            {ingredientes.map((i) => (
              <span
                key={i.id}
                className="rounded-full bg-white px-3 py-1 text-xs font-bold text-stone-600 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-700"
              >
                {i.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-800 sm:p-5">
        <FiltersBar filtros={filtros} setFiltros={setFiltros} totales={totales} />
      </div>

      <div className="flex flex-col gap-12">
        <Seccion
          titulo={t('resultados.seccionCompleta')}
          subtitulo={t('resultados.seccionCompletaSub')}
          items={completasF}
          idsUsuario={idsUsuario}
          onAbrir={abrirReceta}
        />
        <Seccion
          titulo={t('resultados.seccionUno')}
          subtitulo={t('resultados.seccionUnoSub')}
          items={unoF}
          idsUsuario={idsUsuario}
          onAbrir={abrirReceta}
        />
        <Seccion
          titulo={t('resultados.seccionDos')}
          subtitulo={t('resultados.seccionDosSub')}
          items={dosF}
          idsUsuario={idsUsuario}
          onAbrir={abrirReceta}
        />
      </div>

      {/* Explorar más */}
      {explorarF.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setVerExplorar(!verExplorar)}
            aria-expanded={verExplorar}
            className="flex w-full items-center justify-between rounded-2xl bg-stone-100 px-5 py-4 text-left font-extrabold text-stone-700 transition-colors hover:bg-stone-200 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            <span>
              {t('resultados.explorar')}
              <span className="ml-2 text-sm font-bold text-stone-400">{t('resultados.explorarN', { n: explorarF.length })}</span>
            </span>
            <span aria-hidden="true" className={`transition-transform ${verExplorar ? 'rotate-180' : ''}`}>▾</span>
          </button>
          {verExplorar && (
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {explorarF.map(({ receta, faltantes }) => (
                <RecipeCard key={receta.id} item={{ receta, faltantes, idsUsuario }} onAbrir={abrirReceta} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
