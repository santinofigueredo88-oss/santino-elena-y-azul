// ============================================================
// Motor de sustituciones: qué ingrediente puede reemplazar a otro
// ============================================================
import { BASICOS, nombreDeIngrediente } from '../data/ingredientes.js'

/**
 * Mapa de sustituciones: id de ingrediente -> ids que pueden reemplazarlo.
 * Solo se sugieren si el usuario ya los tiene en su heladera.
 */
export const SUSTITUCIONES = {
  // Lácteos
  manteca: ['aceite', 'crema', 'yogur', 'queso-crema'],
  crema: ['leche', 'queso-crema', 'yogur'],
  leche: ['crema', 'yogur', 'agua'],
  queso: ['mozzarella', 'parmesano', 'queso-crema', 'ricota'],
  mozzarella: ['queso', 'parmesano'],
  parmesano: ['queso', 'mozzarella'],
  ricota: ['queso-crema', 'queso', 'yogur'],
  'queso-crema': ['ricota', 'queso', 'yogur'],
  yogur: ['leche', 'crema', 'queso-crema'],

  // Verduras
  acelga: ['espinaca'],
  espinaca: ['acelga'],
  zapallito: ['calabaza', 'berenjena'],
  calabaza: ['zapallito', 'batata'],
  batata: ['papa', 'calabaza'],
  papa: ['batata', 'calabaza'],
  cebolla: ['verdeo', 'puerro', 'apio'],
  morron: ['tomate', 'zapallito'],
  lechuga: ['espinaca', 'acelga'],
  tomate: ['pure-tomate'],
  'pure-tomate': ['tomate'],
  zanahoria: ['calabaza', 'batata'],
  hongos: ['berenjena', 'zapallito'],

  // Carnes
  pollo: ['carne', 'carne-picada', 'pescado', 'atun'],
  carne: ['pollo', 'carne-picada', 'pescado'],
  'carne-picada': ['carne', 'pollo'],
  pescado: ['atun', 'pollo'],
  atun: ['pescado', 'pollo'],
  chorizo: ['carne-picada', 'carne'],
  cerdo: ['carne', 'pollo'],

  // Fiambres
  jamon: ['salame', 'mortadela', 'panceta'],
  salame: ['jamon', 'mortadela'],
  panceta: ['jamon'],
  mortadela: ['jamon', 'salame'],

  // Almacén
  arroz: ['fideos', 'polenta'],
  fideos: ['arroz', 'polenta'],
  polenta: ['arroz', 'fideos', 'papa'],
  harina: ['maicena'],
  maicena: ['harina'],
  'pan-rallado': ['harina', 'pan'],
  avena: ['harina', 'maicena'],
  'dulce-de-leche': ['mermelada', 'dulce-batata', 'chocolate'],
  'dulce-batata': ['mermelada', 'dulce-de-leche'],
  mermelada: ['dulce-de-leche', 'dulce-batata'],
  chocolate: ['dulce-de-leche', 'mermelada'],
  mayonesa: ['queso-crema', 'crema', 'mostaza'],

  // Frutas
  banana: ['manzana', 'frutilla', 'durazno'],
  frutilla: ['banana', 'manzana', 'durazno'],
  manzana: ['pera', 'banana', 'durazno'],
  pera: ['manzana', 'banana'],
  durazno: ['pera', 'manzana'],
  naranja: ['limon', 'durazno'],
  limon: ['vinagre', 'naranja'],
}

/**
 * Para una receta, devuelve las sustituciones posibles: los faltantes que el
 * usuario puede reemplazar con un ingrediente que YA tiene en su heladera.
 *
 * @param {object} receta
 * @param {string[]} idsUsuario
 * @returns {Array<{faltante: string, nombreFaltante: string, sustituto: string, nombreSustituto: string}>}
 */
export function sugerirSustituciones(receta, idsUsuario) {
  const set = new Set(idsUsuario)
  const faltantes = receta.ingredientes.filter(
    (ing) => !BASICOS.has(ing.id) && !set.has(ing.id)
  )
  const resultado = []
  for (const ing of faltantes) {
    const opciones = SUSTITUCIONES[ing.id] ?? []
    for (const opcion of opciones) {
      if (set.has(opcion)) {
        resultado.push({
          faltante: ing.id,
          nombreFaltante: nombreDeIngrediente(ing.id),
          sustituto: opcion,
          nombreSustituto: nombreDeIngrediente(opcion),
        })
        break // solo la primera buena opción por faltante
      }
    }
  }
  return resultado
}

/** Devuelve una frase amigable con las sustituciones encontradas. */
export function textoSustituciones(receta, idsUsuario) {
  const sustituciones = sugerirSustituciones(receta, idsUsuario)
  if (sustituciones.length === 0) return null
  const partes = sustituciones.map(
    (s) => `${s.nombreFaltante} → ${s.nombreSustituto}`
  )
  return `Tenés buenas noticias: podés reemplazar ${partes.join(' y ')} y listo. 🎉`
}
