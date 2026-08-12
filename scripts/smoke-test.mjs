// Smoke test: valida la integridad de los datos y la lógica de matching.
import { INGREDIENTES, INGREDIENTE_POR_ID, BASICOS } from '../src/data/ingredientes.js'
import { RECETAS, RECETA_POR_ID } from '../src/data/recetas.js'
import { buscarIngrediente, resolverIngrediente, normalizarTexto } from '../src/lib/normalizar.js'
import { calcularFaltantes, clasificarRecetas } from '../src/lib/matching.js'

let fallos = 0
function check(nombre, condicion, detalle = '') {
  if (condicion) {
    console.log(`  ✅ ${nombre}`)
  } else {
    fallos++
    console.error(`  ❌ ${nombre} ${detalle}`)
  }
}

console.log('1) Integridad de datos')
check('hay ingredientes en la base', INGREDIENTES.length > 80, `(${INGREDIENTES.length})`)
check('hay recetas en la base', RECETAS.length >= 40, `(${RECETAS.length})`)
check('ids de recetas únicos', new Set(RECETAS.map((r) => r.id)).size === RECETAS.length)
check('ids de ingredientes únicos', new Set(INGREDIENTES.map((i) => i.id)).size === INGREDIENTES.length)

// Todos los ingredientes de las recetas deben existir en la base
const idsValidos = new Set(INGREDIENTES.map((i) => i.id))
const rotos = []
for (const r of RECETAS) {
  for (const ing of r.ingredientes) {
    if (!idsValidos.has(ing.id)) rotos.push(`${r.id} -> ${ing.id}`)
  }
}
check('todos los ingredientes de las recetas existen', rotos.length === 0, `rotos: ${rotos.join(', ')}`)

// Todos los ingredientes rápidos deben existir
import { INGREDIENTES_RAPIDOS } from '../src/data/ingredientes.js'
check('botones rápidos válidos', INGREDIENTES_RAPIDOS.every((id) => idsValidos.has(id)))

console.log('2) Normalización y sinónimos')
check('tomates -> tomate', buscarIngrediente('tomates')?.id === 'tomate')
check('Patata -> papa', buscarIngrediente('Patata')?.id === 'papa')
check('LIMÓN -> limon', buscarIngrediente('LIMÓN')?.id === 'limon')
check('queso cremoso -> queso', buscarIngrediente('queso cremoso')?.id === 'queso')
check('supremas de pollo -> pollo', buscarIngrediente('supremas de pollo')?.id === 'pollo')
check('ingrediente custom', resolverIngrediente('Kale')?.id === 'kale')

console.log('3) Motor de matching')
// Tortilla de papas: papa, huevo, cebolla (+básicos sal/aceite)
const idsUsuario = ['papa', 'huevo', 'cebolla', 'sal', 'aceite']
const tortilla = RECETA_POR_ID['tortilla-de-papas']
check('tortilla 0 faltantes', calcularFaltantes(tortilla, idsUsuario) === 0)
// Sin cebolla -> 1 faltante
check('tortilla sin cebolla = 1', calcularFaltantes(tortilla, ['papa', 'huevo']) === 1)
// Con solo huevo -> 2 faltantes (papa, cebolla)
check('tortilla solo huevo = 2', calcularFaltantes(tortilla, ['huevo']) === 2)
// Sin nada -> 3 faltantes (papas y cebolla; sal/aceite son básicos)
check('tortilla sin nada = 3', calcularFaltantes(tortilla, []) === 3)

const { completas, casi, explorar } = clasificarRecetas(RECETAS, idsUsuario)
check('hay matches completos', completas.length > 0, `(${completas.length})`)
check('hay matches parciales', casi.length > 0, `(${casi.length})`)
check('hay explorar', explorar.length > 0, `(${explorar.length})`)
const primerosCompletos = completas.map((m) => m.receta.id).slice(0, 3)
console.log('   primeras completas:', primerosCompletos.join(', '))

console.log('4) Básicos no cuentan como faltantes')
const sinNada = calcularFaltantes(RECETA_POR_ID['huevos-revueltos'], [])
// huevos-revueltos: huevo + manteca (+ sal, pimienta básicos) -> faltan 2
check('huevos revueltos sin nada = 2', sinNada === 2, `(${sinNada})`)

console.log('5) Recetas que incluyen básicos en su receta')
const conBasico = RECETAS.filter((r) => r.ingredientes.some((i) => BASICOS.has(i.id)))
check('muchas recetas usan básicos', conBasico.length > 30, `(${conBasico.length})`)

console.log('6) Fotos e imágenes')
import { IMAGEN_POR_RECETA } from '../src/data/imagenes.js'
// No todas las recetas necesitan foto: las que no tienen muestran una
// tarjeta ilustrada (gradiente + emoji) como diseño intencional.
check('fotos son URLs válidas', Object.values(IMAGEN_POR_RECETA).every((u) => u.startsWith('https://')))
check('la mayoría de las recetas tienen foto', Object.keys(IMAGEN_POR_RECETA).length >= 55, `(fotos: ${Object.keys(IMAGEN_POR_RECETA).length} de ${RECETAS.length} recetas)`)

console.log('7) Sustituciones')
import { SUSTITUCIONES, sugerirSustituciones } from '../src/lib/sustituciones.js'
const clavesInvalidas = Object.keys(SUSTITUCIONES).filter((id) => !idsValidos.has(id))
const valoresInvalidos = Object.values(SUSTITUCIONES)
  .flat()
  .filter((id) => !idsValidos.has(id))
check('claves de sustituciones válidas', clavesInvalidas.length === 0, clavesInvalidas.join(', '))
check('valores de sustituciones válidos', valoresInvalidos.length === 0, valoresInvalidos.join(', '))
const sugs = sugerirSustituciones(tortilla, ['huevo', 'cebolla', 'batata'])
check('sugiere sustituto disponible (batata por papa)', sugs.some((s) => s.faltante === 'papa' && s.sustituto === 'batata'), JSON.stringify(sugs))

console.log('8) Texto para compartir (WhatsApp)')
import { construirTextoReceta } from '../src/lib/share.js'
const texto = construirTextoReceta(tortilla, 6, idsUsuario, [])
check('incluye nombre de la receta', texto.includes('Tortilla de papas'))
check('incluye cantidades escaladas', texto.includes('6 unidades de papa'))
check('incluye pasos numerados', texto.includes('1. Pelar'))
check('no lanza error con faltantes', typeof construirTextoReceta(tortilla, 2, ['huevo'], ['papa']) === 'string')

if (fallos > 0) {
  console.error(`\n${fallos} FALLO(S)`)
  process.exit(1)
}
console.log('\n✅ Todos los checks pasaron')
