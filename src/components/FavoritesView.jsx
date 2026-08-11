import { useMemo } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { RECETAS } from '../data/recetas.js'
import { calcularFaltantes } from '../lib/matching.js'
import RecipeCard from './RecipeCard.jsx'

export default function FavoritesView() {
  const { favoritos, abrirReceta, idsIngredientes, irA } = useApp()

  const idsUsuario = useMemo(
    () => new Set(idsIngredientes),
    [idsIngredientes]
  )

  const favoritas = useMemo(() => {
    const mapa = new Map(RECETAS.map((r) => [r.id, r]))
    return favoritos
      .map((id) => mapa.get(id))
      .filter(Boolean)
      .map((receta) => ({
        receta,
        faltantes: calcularFaltantes(receta, idsIngredientes),
        idsUsuario,
      }))
  }, [favoritos, idsIngredientes, idsUsuario])

  if (favoritas.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-up">
        <span className="text-7xl" role="img" aria-hidden="true">💛</span>
        <h2 className="mt-4 text-3xl font-black text-stone-900 dark:text-white">
          Todavía no tenés favoritos
        </h2>
        <p className="mt-2 text-lg font-semibold text-stone-500 dark:text-stone-400">
          Tocá el corazón <span aria-hidden="true">🤍</span> en cualquier receta para guardarla acá.
        </p>
        <button onClick={() => irA('inicio')} className="btn-primary mt-6">
          🏠 Ir al inicio
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <div className="py-8">
        <h1 className="font-display text-3xl font-black tracking-tight text-stone-900 dark:text-white sm:text-4xl">
          Tus recetas favoritas
        </h1>
        <p className="mt-1 text-base font-semibold text-stone-500 dark:text-stone-400">
          {favoritas.length} receta{favoritas.length === 1 ? '' : 's'} guardada{favoritas.length === 1 ? '' : 's'}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {favoritas.map((item) => (
          <RecipeCard key={item.receta.id} item={item} onAbrir={abrirReceta} />
        ))}
      </div>
    </div>
  )
}
