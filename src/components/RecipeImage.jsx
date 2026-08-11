import { useState } from 'react'
import { imagenDeReceta } from '../data/imagenes.js'
import { CATEGORIA_POR_ID } from '../data/ingredientes.js'

/**
 * Imagen de una receta: usa la foto real (Unsplash) y si no carga (sin red o
 * URL caída) muestra un plato ilustrado con gradiente cálido y el emoji.
 */
export default function RecipeImage({
  receta,
  className = '',
  imgClassName = '',
  emojiClassName = '',
  eager = false,
}) {
  const [fallo, setFallo] = useState(false)
  const url = imagenDeReceta(receta)

  const tipo = CATEGORIA_POR_ID[receta.categoria]
  const gradient =
    tipo?.id === 'desayuno'
      ? 'from-lime-100 via-green-50 to-emerald-100'
      : tipo?.id === 'postre'
        ? 'from-emerald-100 via-lime-50 to-green-100'
        : tipo?.id === 'merienda'
          ? 'from-lime-100 via-crema-100 to-green-50'
          : 'from-green-100 via-crema-100 to-lime-100'

  if (!url || fallo) {
    return (
      <div
        aria-hidden="true"
        className={`grid place-items-center bg-gradient-to-br ${gradient} dark:from-stone-800 dark:via-stone-900 dark:to-stone-800 ${className}`}
      >
        <span className={`drop-shadow-sm ${emojiClassName}`}>{receta.emoji}</span>
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={`Foto de ${receta.nombre}`}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFallo(true)}
      className={`object-cover ${imgClassName || className}`}
    />
  )
}
