import { INGREDIENTES } from '../data/ingredientes.js'

/**
 * Normaliza un texto: minúsculas y sin tildes.
 * "Tomates" -> "tomates", "Limón" -> "limon", "PIMIENTA" -> "pimienta"
 */
export function normalizarTexto(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Quita una 's' final de una palabra (plural simple):
 * "tomates" -> "tomate", "supremas" -> "suprema".
 * No afecta palabras como "arroz", "sal" o "panes" (que se manejan como sinónimos).
 */
function quitarPluralPalabra(palabra) {
  if (palabra.length > 3 && palabra.endsWith('s')) return palabra.slice(0, -1)
  return palabra
}

/** Compara dos textos normalizados palabra por palabra ignorando plurales. */
function igualIgnorandoPlural(a, b) {
  if (a === b) return true
  const pa = a.split(/\s+/).map(quitarPluralPalabra)
  const pb = b.split(/\s+/).map(quitarPluralPalabra)
  return pa.length === pb.length && pa.every((palabra, i) => palabra === pb[i])
}

/**
 * Busca un ingrediente de la base por nombre, id o sinónimo (insensible a
 * mayúsculas, tildes y plural final). Devuelve el objeto ingrediente o null.
 */
export function buscarIngrediente(texto) {
  const n = normalizarTexto(texto)
  if (!n) return null
  for (const ing of INGREDIENTES) {
    const candidatos = [normalizarTexto(ing.nombre), normalizarTexto(ing.id)]
    for (const sinonimo of ing.sinonimos) candidatos.push(normalizarTexto(sinonimo))
    for (const c of candidatos) {
      if (igualIgnorandoPlural(n, c)) return ing
    }
  }
  return null
}

/**
 * Convierte un texto ingresado por el usuario en el id canónico del
 * ingrediente. Si no está en la base, lo guarda tal cual (normalizado)
 * como ingrediente personalizado.
 */
export function resolverIngrediente(texto) {
  const ing = buscarIngrediente(texto)
  if (ing) return { id: ing.id, nombre: ing.nombre, conocido: true }
  const n = normalizarTexto(texto)
  if (!n) return null
  // Capitaliza la primera letra para mostrar mejor los ingredientes custom
  const nombre = n.charAt(0).toUpperCase() + n.slice(1)
  return { id: n, nombre, conocido: false }
}

/** ¿Ya existe este id en la lista? (para deduplicar) */
export function yaExiste(lista, id) {
  return lista.some((i) => i.id === id)
}
