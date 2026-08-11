import { BASICOS, nombreDeIngrediente } from '../data/ingredientes.js'

/** Formatea una cantidad legible (0.5 -> 1/2, 1.5 -> 1½ ...). */
export function formatearCantidad(cantidad) {
  const redondeada = Math.round(cantidad * 100) / 100
  if (Number.isInteger(redondeada)) return String(redondeada)
  const medio = redondeada === 0.5
  if (medio) return '1/2'
  return String(redondeada).replace('.', ',')
}

/** Escala una receta a la cantidad de porciones deseada. */
export function escalarIngrediente(ing, porcionesOriginal, porcionesNuevas) {
  const factor = porcionesNuevas / porcionesOriginal
  return {
    ...ing,
    cantidad: ing.cantidad * factor,
  }
}

/**
 * Construye el texto de la receta para compartir por WhatsApp.
 */
export function construirTextoReceta(receta, porciones, idsUsuario, faltantes) {
  const set = new Set(idsUsuario)
  const lineas = []
  lineas.push(`🍳 *${receta.nombre}*`)
  lineas.push(`${receta.emoji} ${receta.tiempoMinutos} min · ${porciones} porciones`)
  lineas.push('')

  lineas.push(`*Ingredientes (para ${porciones} ${porciones === 1 ? 'persona' : 'personas'}):*`)
  for (const ing of receta.ingredientes) {
    const esc = escalarIngrediente(ing, receta.porciones, porciones)
    const check = BASICOS.has(ing.id) || set.has(ing.id) ? '✅' : '⬜'
    lineas.push(`${check} ${formatearCantidad(esc.cantidad)} ${esc.unidad} de ${nombreDeIngrediente(ing.id).toLowerCase()}`)
  }
  if (faltantes && faltantes.length > 0) {
    lineas.push('')
    lineas.push(`⚠️ Te faltan: ${faltantes.join(', ')}`)
  }

  lineas.push('')
  lineas.push('*Pasos:*')
  receta.pasos.forEach((paso, i) => {
    lineas.push(`${i + 1}. ${paso}`)
  })
  lineas.push('')
  lineas.push('¡Hecho con ¿Qué Cocino? 🍳')
  return lineas.join('\n')
}

/** Abre WhatsApp con el texto de la receta. */
export function compartirPorWhatsApp(receta, porciones, idsUsuario, faltantes) {
  const texto = construirTextoReceta(receta, porciones, idsUsuario, faltantes)
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}


