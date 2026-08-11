/**
 * Lee un valor del localStorage con manejo de errores.
 * Devuelve `defaultValue` si no existe o si el JSON es inválido.
 */
export function leerStorage(clave, defaultValue) {
  try {
    const raw = window.localStorage.getItem(clave)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/** Escribe un valor en localStorage con manejo de errores. */
export function escribirStorage(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // almacenamiento lleno o deshabilitado: no romper la app
  }
}
