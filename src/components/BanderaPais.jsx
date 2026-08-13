import { useState } from 'react'
import { PAIS_POR_ID } from '../data/recetas.js'

// Tamaños en proporción 3:2 (flagcdn.com entrega así las imágenes)
const TAMANOS = {
  sm: 'h-4 w-6',
  md: 'h-5 w-8',
  lg: 'h-6 w-9',
}

/**
 * Bandera real del país como imagen (flagcdn.com), con fallback al emoji.
 * En Windows los emojis de banderas no se renderizan (aparecen como "IT",
 * "MX"...), por eso usamos imágenes reales.
 */
export default function BanderaPais({ paisId, tamano = 'sm' }) {
  const [fallo, setFallo] = useState(false)
  const pais = PAIS_POR_ID[paisId]
  if (!pais) return null
  if (fallo || !pais.codigo) {
    return (
      <span
        className="inline-block text-base leading-none"
        aria-hidden="true"
      >
        {pais.emoji}
      </span>
    )
  }
  return (
    <img
      src={`https://flagcdn.com/w80/${pais.codigo}.png`}
      srcSet={`https://flagcdn.com/w160/${pais.codigo}.png 2x`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setFallo(true)}
      className={`inline-block shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/15 align-[-2px] ${TAMANOS[tamano] ?? TAMANOS.sm}`}
    />
  )
}
