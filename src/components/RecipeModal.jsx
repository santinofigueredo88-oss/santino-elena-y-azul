import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import {
  BASICOS,
  nombreDeIngrediente,
} from '../data/ingredientes.js'
import { calcularFaltantes } from '../lib/matching.js'
import {
  escalarIngrediente,
  formatearCantidad,
  compartirPorWhatsApp,
} from '../lib/share.js'
import { TIPOS_DE_COMIDA } from '../data/recetas.js'
import RecipeImage from './RecipeImage.jsx'
import CocinaBot from './CocinaBot.jsx'

const NIVEL_DIFICULTAD = {
  facil: { nombre: 'Fácil', emoji: '🙂' },
  media: { nombre: 'Media', emoji: '😌' },
  dificil: { nombre: 'Difícil', emoji: '🧑‍🍳' },
}

function Stepper({ porciones, setPorciones }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-crema-100 p-1 dark:bg-stone-800">
      <button
        onClick={() => setPorciones((p) => Math.max(1, p - 1))}
        disabled={porciones <= 1}
        aria-label="Menos porciones"
        className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-stone-700 shadow-sm transition-all hover:bg-green-100 disabled:opacity-40 dark:bg-stone-700 dark:text-white dark:hover:bg-stone-600"
      >
        −
      </button>
      <span className="min-w-16 px-2 text-center">
        <span className="block text-lg font-black leading-none text-stone-900 dark:text-white">{porciones}</span>
        <span className="block text-[10px] font-bold uppercase text-stone-400">porc.</span>
      </span>
      <button
        onClick={() => setPorciones((p) => Math.min(12, p + 1))}
        disabled={porciones >= 12}
        aria-label="Más porciones"
        className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg font-black text-stone-700 shadow-sm transition-all hover:bg-green-100 disabled:opacity-40 dark:bg-stone-700 dark:text-white dark:hover:bg-stone-600"
      >
        +
      </button>
    </div>
  )
}

export default function RecipeModal() {
  const {
    recetaActiva,
    cerrarReceta,
    idsIngredientes,
    esFavorito,
    toggleFavorito,
    agregarFaltantesALista,
  } = useApp()

  const [porciones, setPorciones] = useState(recetaActiva?.porciones ?? 4)
  const [botAbierto, setBotAbierto] = useState(false)

  // Resetear porciones y cerrar el bot al abrir otra receta
  useEffect(() => {
    setPorciones(recetaActiva?.porciones ?? 4)
    setBotAbierto(false)
  }, [recetaActiva?.id, recetaActiva?.porciones])

  // Cerrar con Escape (primero el bot, después el modal) y bloquear scroll
  useEffect(() => {
    if (!recetaActiva) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (botAbierto) setBotAbierto(false)
      else cerrarReceta()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [recetaActiva, botAbierto, cerrarReceta])

  const idsUsuario = useMemo(
    () => new Set(idsIngredientes),
    [idsIngredientes]
  )

  // Al abrir el guía, mover el foco al chat
  useEffect(() => {
    if (botAbierto) {
      document.getElementById('cocina-bot-input')?.focus()
    }
  }, [botAbierto])

  const contenido = useMemo(() => {
    if (!recetaActiva) return null
    const faltantes = calcularFaltantes(recetaActiva, idsIngredientes)
    return { faltantes }
  }, [recetaActiva, idsIngredientes])

  if (!recetaActiva) return null
  const receta = recetaActiva
  const faltantes = contenido.faltantes
  const fav = esFavorito(receta.id)

  const faltantesDetalle = receta.ingredientes.filter(
    (ing) => !BASICOS.has(ing.id) && !idsUsuario.has(ing.id)
  )

  const tipo = TIPOS_DE_COMIDA.find((t) => t.id === receta.categoria)
  const nivel = NIVEL_DIFICULTAD[receta.dificultad] ?? NIVEL_DIFICULTAD.facil

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Receta: ${receta.nombre}`}
    >
      {/* Fondo */}
      <button
        onClick={() => {
          if (botAbierto) setBotAbierto(false)
          else cerrarReceta()
        }}
        aria-label="Cerrar detalle de receta"
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Panel */}
      <div
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden bg-white shadow-2xl animate-pop dark:bg-stone-900 sm:rounded-3xl rounded-t-3xl ${
          botAbierto ? 'sm:max-w-4xl lg:flex-row' : 'sm:max-w-2xl'
        }`}
      >
        {/* ---- Columna: receta ---- */}
        <div
          className={`min-h-0 overflow-y-auto ${botAbierto ? 'hidden lg:block lg:w-1/2' : 'flex-1'}`}
        >
          {/* Foto hero */}
          <div className="relative">
            <RecipeImage
              receta={receta}
              className="h-52 w-full sm:h-64"
              imgClassName="h-full w-full"
              emojiClassName="text-8xl"
              eager
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
              aria-hidden="true"
            />
            <button
              onClick={() => {
                if (botAbierto) setBotAbierto(false)
                else cerrarReceta()
              }}
              aria-label="Cerrar"
              autoFocus
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lg font-black text-stone-700 shadow-md backdrop-blur transition-all hover:scale-110 hover:bg-white dark:bg-stone-900/85 dark:text-stone-200"
            >
              ✕
            </button>
            <button
              onClick={() => toggleFavorito(receta.id)}
              aria-pressed={fav}
              aria-label={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-lg shadow-md backdrop-blur transition-all hover:scale-110 active:scale-90 dark:bg-stone-900/85"
            >
              {fav ? '❤️' : '🤍'}
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="font-display text-2xl font-black tracking-tight text-white drop-shadow-md sm:text-3xl">
                {receta.nombre}
              </h2>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">
                  ⏱️ {receta.tiempoMinutos} min
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">
                  👥 {receta.porciones} porciones
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">
                  {nivel.emoji} {nivel.nombre}
                </span>
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur">
                  {tipo?.emoji} {tipo?.nombre}
                </span>
              </div>
              {faltantes === 0 ? (
                <span className="mt-3 inline-block rounded-full bg-green-500 px-4 py-1.5 text-sm font-extrabold text-white shadow-md">
                  ✅ ¡Tenés todos los ingredientes!
                </span>
              ) : (
                <span className="mt-3 inline-block rounded-full bg-lime-600 px-4 py-1.5 text-sm font-extrabold text-white shadow-md">
                  ⚠️ Te faltan {faltantes === 1 ? '1 ingrediente' : `${faltantes} ingredientes`}
                </span>
              )}
            </div>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {/* Bot guía */}
            <button
              onClick={() => setBotAbierto(true)}
              className="group mb-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-600 to-lime-500 px-5 py-4 font-extrabold text-white shadow-lg shadow-green-600/30 transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-xl backdrop-blur transition-transform group-hover:rotate-6" aria-hidden="true">
                🤖
              </span>
              <span className="text-left leading-tight">
                <span className="block text-base">Guíame paso a paso</span>
                <span className="block text-xs font-bold text-green-100">
                  Te acompaño a cocinar y reemplazo lo que te falte
                </span>
              </span>
              <span aria-hidden="true" className="ml-auto text-lg transition-transform group-hover:translate-x-1">→</span>
            </button>

            {/* Porciones */}
            <div className="mb-5 flex flex-col items-start gap-2 rounded-2xl bg-crema-50 p-4 dark:bg-stone-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-extrabold text-stone-900 dark:text-white">👨‍👩‍👧‍👦 Ajustar porciones</p>
                <p className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                  Las cantidades se recalculan solas.
                </p>
              </div>
              <Stepper porciones={porciones} setPorciones={setPorciones} />
            </div>

            {/* Faltantes -> lista de compras */}
            {faltantesDetalle.length > 0 && (
              <button
                onClick={() => {
                  agregarFaltantesALista(
                    receta,
                    faltantesDetalle.map((i) => i.id)
                  )
                }}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-100 px-4 py-3.5 font-extrabold text-green-800 transition-all hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900"
              >
                🛒 Agregar los {faltantesDetalle.length} faltantes a la lista de compras
              </button>
            )}

            {/* Ingredientes */}
            <h3 className="text-xl font-black text-stone-900 dark:text-white">
              Ingredientes{' '}
              <span className="text-sm font-bold text-stone-400">
                (para {porciones} {porciones === 1 ? 'persona' : 'personas'})
              </span>
            </h3>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {receta.ingredientes.map((ing) => {
                const esc = escalarIngrediente(ing, receta.porciones, porciones)
                const esBasico = BASICOS.has(ing.id)
                const falta = !esBasico && !idsUsuario.has(ing.id)
                return (
                  <li
                    key={ing.id}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-semibold ${
                      falta
                        ? 'bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900'
                        : 'bg-green-50/60 text-stone-700 dark:bg-green-950/20 dark:text-stone-200'
                    }`}
                  >
                    <span aria-hidden="true">{falta ? '❌' : '✅'}</span>
                    <span className="min-w-0 flex-1">
                      {formatearCantidad(esc.cantidad)} {esc.unidad} de{' '}
                      <strong>{nombreDeIngrediente(ing.id).toLowerCase()}</strong>
                      {esBasico && (
                        <span className="ml-1.5 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-black uppercase text-stone-500 dark:bg-stone-700 dark:text-stone-300">
                          siempre en casa
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>

            {/* Pasos */}
            <h3 className="mt-7 text-xl font-black text-stone-900 dark:text-white">Pasos 👨‍🍳</h3>
            <ol className="mt-3 flex flex-col gap-3">
              {receta.pasos.map((paso, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-600 text-sm font-black text-white shadow-sm">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 text-[15px] font-semibold leading-relaxed text-stone-700 dark:text-stone-300">
                    {paso}
                  </p>
                </li>
              ))}
            </ol>

            {/* Acciones */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() =>
                  compartirPorWhatsApp(
                    receta,
                    porciones,
                    idsIngredientes,
                    faltantesDetalle.map((i) => nombreDeIngrediente(i.id))
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3.5 font-extrabold text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-500 active:scale-[0.98]"
              >
                💬 Compartir por WhatsApp
              </button>
              <button
                onClick={cerrarReceta}
                className="flex-1 rounded-2xl bg-stone-100 px-5 py-3.5 font-extrabold text-stone-700 transition-colors hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>

        {/* ---- Columna: bot guía ---- */}
        <div
          className={`min-h-0 ${botAbierto ? 'flex w-full flex-1 flex-col lg:w-1/2' : 'hidden'}`}
        >
          <CocinaBot
            receta={receta}
            idsIngredientes={idsIngredientes}
            porciones={porciones}
            onCerrar={() => setBotAbierto(false)}
          />
        </div>
      </div>
    </div>
  )
}
