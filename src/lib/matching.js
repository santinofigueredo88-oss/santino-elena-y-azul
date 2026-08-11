import { BASICOS } from '../data/ingredientes.js'

/**
 * Calcula cuántos ingredientes le faltan a una receta, ignorando los
 * básicos (sal, aceite, agua...) que se asumen siempre disponibles.
 *
 * @returns {number} cantidad de ingredientes faltantes (0 = match completo)
 */
export function calcularFaltantes(receta, idsUsuario) {
  const set = new Set(idsUsuario)
  return receta.ingredientes.filter(
    (ing) => !BASICOS.has(ing.id) && !set.has(ing.id)
  ).length
}

/**
 * Ordena las recetas según el match:
 *   1. Las que se pueden hacer 100% (0 faltantes)
 *   2. Las que faltan 1 ingrediente
 *   3. Las que faltan 2 ingredientes
 * Dentro del mismo grupo, las más rápidas primero.
 *
 * @param {Array} recetas
 * @param {Array<string>} idsUsuario ids canónicos de los ingredientes del usuario
 * @returns {{ completas: Array, casi: Array, explorar: Array }}
 */
export function clasificarRecetas(recetas, idsUsuario) {
  const conMatch = recetas.map((receta) => ({
    receta,
    faltantes: calcularFaltantes(receta, idsUsuario),
  }))

  const porFaltantes = (a, b) =>
    a.faltantes - b.faltantes || a.receta.tiempoMinutos - b.receta.tiempoMinutos

  return {
    completas: conMatch.filter((m) => m.faltantes === 0).sort(porFaltantes),
    casi: conMatch
      .filter((m) => m.faltantes === 1 || m.faltantes === 2)
      .sort(porFaltantes),
    explorar: conMatch
      .filter((m) => m.faltantes >= 3)
      .sort(porFaltantes),
  }
}

/** Agrupa las recetas "casi" por cantidad de faltantes (1 y 2). */
export function agruparCasi(casi) {
  return {
    uno: casi.filter((m) => m.faltantes === 1),
    dos: casi.filter((m) => m.faltantes === 2),
  }
}

/** Filtros de resultados. */
export function aplicarFiltros(lista, filtros) {
  return lista.filter(({ receta }) => {
    if (filtros.tipo && receta.categoria !== filtros.tipo) return false
    if (filtros.dificultad && receta.dificultad !== filtros.dificultad) return false
    if (filtros.tiempo) {
      if (filtros.tiempo === 'rapido' && receta.tiempoMinutos >= 20) return false
      if (filtros.tiempo === 'medio' && (receta.tiempoMinutos < 20 || receta.tiempoMinutos > 45)) return false
      if (filtros.tiempo === 'largo' && receta.tiempoMinutos <= 45) return false
    }
    if (filtros.soloFavoritos && !filtros.favoritos.includes(receta.id)) return false
    return true
  })
}
