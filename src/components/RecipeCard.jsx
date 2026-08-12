import { useApp } from '../context/AppContext.jsx'
import { BASICOS, nombreDeIngrediente } from '../data/ingredientes.js'
import { TIPOS_DE_COMIDA } from '../data/recetas.js'
import RecipeImage from './RecipeImage.jsx'

const NIVEL_DIFICULTAD = {
  facil: { emoji: '🙂', color: 'text-green-600 dark:text-green-400' },
  media: { emoji: '😌', color: 'text-lime-600 dark:text-lime-400' },
  dificil: { emoji: '🧑‍🍳', color: 'text-red-600 dark:text-red-400' },
}

export function MatchBadge({ faltantes }) {
  const { t } = useApp()
  if (faltantes === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/95 px-3 py-1 text-xs font-extrabold text-white shadow-md backdrop-blur">
        {t('card.tenesTodo')}
      </span>
    )
  }
  return null
}

export default function RecipeCard({ item, onAbrir }) {
  const { receta, faltantes, idsUsuario } = item
  const { esFavorito, toggleFavorito, t } = useApp()
  const fav = esFavorito(receta.id)

  const faltantesNombres = receta.ingredientes
    .filter((ing) => !BASICOS.has(ing.id))
    .map((ing) => ing.id)
    .filter((id) => !idsUsuario?.has(id))
    .slice(0, 2)
    .map(nombreDeIngrediente)
    .join(', ')

  const tipo = TIPOS_DE_COMIDA.find((t) => t.id === receta.categoria)
  const nivel = NIVEL_DIFICULTAD[receta.dificultad] ?? NIVEL_DIFICULTAD.facil

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/10 hover:ring-green-200 dark:bg-stone-900 dark:ring-stone-800 dark:hover:ring-green-800">
      <button
        onClick={() => onAbrir(receta)}
        className="flex flex-1 flex-col text-left"
        aria-label={t('card.verReceta', { nombre: receta.nombre })}
      >
        {/* Foto */}
        <div className="relative h-44 overflow-hidden">
          <RecipeImage
            receta={receta}
            className="h-full w-full"
            imgClassName="h-full w-full transition-transform duration-500 group-hover:scale-110"
            emojiClassName="text-6xl"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true" />
          <span className="absolute left-3 top-3">
            <MatchBadge faltantes={faltantes} />
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-stone-700 shadow-sm backdrop-blur dark:bg-stone-900/85 dark:text-stone-200">
            {tipo?.emoji} {tipo ? t('tipo.' + tipo.id, null, tipo.nombre) : ''}
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur">
            ⏱️ {receta.tiempoMinutos} min
          </span>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <h3 className="text-lg font-black leading-snug text-stone-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
            {receta.nombre}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-bold text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">👥</span> {t('card.porc', { n: receta.porciones })}
            </span>
            <span className={`inline-flex items-center gap-1 ${nivel.color}`}>
              <span aria-hidden="true">{nivel.emoji}</span> {t('dificultad.' + receta.dificultad, null, nivel.emoji)}
            </span>
          </div>

          {faltantes > 0 ? (
            <p className="mt-auto rounded-xl bg-lime-50 px-3 py-2 text-[13px] font-bold leading-snug text-lime-800 ring-1 ring-lime-200/70 dark:bg-lime-900/40 dark:text-lime-200 dark:ring-lime-800/60">
              {t('card.teFaltan', { nombres: faltantesNombres })}
              {faltantes > 2 ? ` ${t('card.mas', { n: faltantes - 2 })}` : ''}
            </p>
          ) : (
            <p className="mt-auto rounded-xl bg-green-50 px-3 py-2 text-[13px] font-bold text-green-800 ring-1 ring-green-200/70 dark:bg-green-900/40 dark:text-green-200 dark:ring-green-800/60">
              {t('card.lista')}
            </p>
          )}
        </div>
      </button>

      {/* Favorito */}
      <button
        onClick={() => toggleFavorito(receta.id)}
        aria-label={
          fav
            ? t('card.quitarFav', { nombre: receta.nombre })
            : t('card.agregarFav', { nombre: receta.nombre })
        }
        aria-pressed={fav}
        className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-lg shadow-md backdrop-blur transition-all hover:scale-110 active:scale-90 ${
          fav
            ? 'bg-red-500 text-white'
            : 'bg-white/85 text-stone-500 hover:text-red-500 dark:bg-stone-900/80 dark:text-stone-300'
        }`}
      >
        {fav ? '❤️' : '🤍'}
      </button>
    </article>
  )
}
