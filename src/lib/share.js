import {
  BASICOS,
  CATEGORIA_POR_ID,
  INGREDIENTE_POR_ID,
  nombreDeIngrediente,
} from '../data/ingredientes.js'

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

/**
 * Construye el texto de la lista de compras para compartir o copiar.
 *
 * @param {object} partes
 * @param {string} partes.titulo  título (traducido)
 * @param {Array<{id: string, nombre: string}>} partes.pendientes  ítems por comprar
 * @param {Array<{id: string, nombre: string}>} partes.comprados  ítems ya comprados
 * @param {string} partes.footer  cierre (traducido)
 */
export function construirTextoListaCompras({ titulo, pendientes, comprados, footer }) {
  const linea = (item) => {
    const conocido = INGREDIENTE_POR_ID[item.id]
    const emoji = conocido ? CATEGORIA_POR_ID[conocido.categoria]?.emoji : null
    return `${emoji ?? '🛒'} ${item.nombre}`
  }
  const lineas = [titulo, '']
  if (pendientes.length > 0) lineas.push(...pendientes.map(linea))
  if (comprados.length > 0) {
    if (pendientes.length > 0) lineas.push('')
    lineas.push(...comprados.map((item) => `✅ ${item.nombre}`))
  }
  lineas.push('', footer)
  return lineas.join('\n')
}

/** Abre WhatsApp con el texto de la lista de compras. */
export function compartirListaWhatsApp(texto) {
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * Arma la URL del sitio con los ingredientes en el query string.
 * Al abrirse, la app carga esos ingredientes automáticamente.
 * Ej: https://quecocino.app/?ing=papa,tomate,cebolla
 */
export function urlConIngredientes(ids) {
  const base = `${window.location.origin}${window.location.pathname}`
  // encodeURIComponent no toca la coma y sí los espacios/caracteres raros
  // de los ingredientes custom (ej: 'jamon crudo' -> 'jamon%20crudo')
  return `${base}?ing=${ids.map(encodeURIComponent).join(',')}`
}

/** Abre WhatsApp con un mensaje y una URL. */
export function compartirUrlWhatsApp(texto, url) {
  compartirListaWhatsApp(`${texto}\n${url}`)
}

/** Copia texto al portapapeles con fallback para navegadores viejos. */
export async function copiarAlPortapapeles(texto) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = texto
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
}


