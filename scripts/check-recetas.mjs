import { RECETAS, PAISES, RECETA_POR_ID, paisDeReceta } from '../src/data/recetas.js'
import { INGREDIENTES } from '../src/data/ingredientes.js'

console.log('Recetas totales:', RECETAS.length)
console.log('Países:', PAISES.map((p) => p.id).join(','))
const int = RECETAS.filter((r) => r.pais)
console.log('Internacionales:', int.length)
console.log('IDs únicos:', new Set(RECETAS.map((r) => r.id)).size)

const VALIDOS = new Set(INGREDIENTES.map((x) => x.id))
let faltan = []
for (const r of RECETAS) {
  for (const ing of r.ingredientes) {
    if (!VALIDOS.has(ing.id)) faltan.push(`${r.id}:${ing.id}`)
  }
}
console.log('Ingredientes inexistentes:', faltan.length ? faltan.join(', ') : 'ninguno')

// Distribución por país
const porPais = {}
for (const r of RECETAS) {
  const p = paisDeReceta(r)
  porPais[p] = (porPais[p] ?? 0) + 1
}
console.log('Por país:', JSON.stringify(porPais))
