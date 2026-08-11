// Genera src/data/imagenes.js eligiendo, para cada receta, la primera foto de
// Unsplash (de una lista de candidatos) que responde HTTP 200.
//
// Uso: node scripts/generar-imagenes.mjs
import { writeFileSync } from 'node:fs'

const BASE = 'https://images.unsplash.com/photo-'
const Q = '?auto=format&fit=crop&w=900&q=70'

// Candidatos por receta (orden = prioridad). Cada uno es el id de Unsplash.
const CANDIDATOS = {
  'huevos-revueltos': ['1525351484163-7529414344d8', '1519708227418-c8fd9a32b7a2', '1482049016688-2d3e1b311543'],
  'omelette-de-queso': ['1525351484163-7529414344d8', '1510693206972-df098062cb71', '1519708227418-c8fd9a32b7a2'],
  'tostadas-con-palta': ['1603046891726-36bfd957e0bf', '1482049016688-2d3e1b311543', '1512621776951-a57141f2eefd'],
  'licuado-de-banana': ['1577805947697-89e18249d767', '1550258987-190a2d41a8ba', '1613478223719-2ab802602423'],
  'licuado-de-frutilla': ['1579954115545-a95591f28bfc', '1613478223719-2ab802602423', '1550258987-190a2d41a8ba'],
  'panqueques': ['1567620905732-2d1ec7ab7445', '1533089860892-a7c6f0a88666', '1504754524776-8f4f37790ca0'],
  'budin-de-pan': ['1562440499-64c9a111f713', '1549931319-a545dcf3bc73', '1509440159596-0249088772ff'],
  'scones-de-queso': ['1517433670267-08bbd4be890f', '1565958011703-44f9829ba187', '1549931319-a545dcf3bc73'],
  'tostado-jamon-queso': ['1528735602780-2552fd46c7af', '1553909489-cd47e0907980', '1554520735-0a6b8b6ce8b7'],
  'torta-de-chocolate': ['1578985545062-69928b1d9587', '1606313564200-e75d5e30476c', '1551024506-0bccd828d307'],
  'pan-casero': ['1509440159596-0249088772ff', '1549931319-a545dcf3bc73', '1586444248902-2f64eddc13df'],
  'torta-frita': ['1549931319-a545dcf3bc73', '1509440159596-0249088772ff', '1517433670267-08bbd4be890f'],
  'vigilante': ['1486297678162-eb2a19b0a32d', '1452195100486-9cc805987862', '1562440499-64c9a111f713'],
  'ensalada-de-frutas': ['1490474418585-ba9bad8fd0ea', '1464965911861-746a04b4bca6', '1511690656952-34342bb7c2f2'],
  'submarino': ['1542990253-a781e04c0082', '1516684732162-798a0063be99', '1551024506-0bccd828d307'],
  'flan-casero': ['1562440499-64c9a111f713', '1568607689150-17e625c1586e', '1530651788726-1d27558d900f'],
  'arroz-con-leche': ['1562440499-64c9a111f713', '1530651788726-1d27558d900f', '1541608576-2500a93f4d20'],
  'tortilla-de-papas': ['1510693206972-df098062cb71', '1414235077428-338989a2e8c0', '1490645935967-10de6ba17061'],
  'tortilla-de-acelga': ['1512621776951-a57141f2eefd', '1540420773420-3366772f4999', '1466637574441-749b8f19452f'],
  'tortilla-de-verduras': ['1466637574441-749b8f19452f', '1490645935967-10de6ba17061', '1512621776951-a57141f2eefd'],
  'milanesas-de-carne': ['1603360946369-dc9bb6258143', '1555939594-58d7cb561ad1', '1529692236671-f1f6cf9683ba'],
  'milanesas-de-pollo': ['1607623814075-e51df1bdc82f', '1615937657715-bc7b4b7962c1', '1562967914-608f82629710'],
  'milanesa-napolitana': ['1513104890138-7c749659a591', '1565299624946-b28f40a0ae38', '1574071318508-1cdbab80d002'],
  'sandwich-de-milanesa': ['1553909489-cd47e0907980', '1568901346375-23c9450c58cd', '1554520735-0a6b8b6ce8b7'],
  'hamburguesas-caseras': ['1568901346375-23c9450c58cd', '1550547660-d9450f859349', '1571091718767-18b5b1457add'],
  'bife-a-la-plancha': ['1546833999-b9f581a1996d', '1587654780291-39c9404d746b', '1558030006-450675393462'],
  'carne-al-horno': ['1544025162-d76694265947', '1555939594-58d7cb561ad1', '1603360946369-dc9bb6258143'],
  'guiso-de-carne': ['1547592180-85f173990554', '1547592166-23ac45744acd', '1579751626657-72bc17010498'],
  'guiso-de-lentejas': ['1603105037880-880cd4edfb0d', '1547592180-85f173990554', '1569718212165-3a8278d5f624'],
  'pollo-al-horno': ['1598103442097-8b74394b95c6', '1607623814075-e51df1bdc82f', '1574144611937-0df059b5ef3e'],
  'pollo-a-la-crema': ['1562967914-608f82629710', '1607623814075-e51df1bdc82f', '1598103442097-8b74394b95c6'],
  'pechuga-con-ensalada': ['1512621776951-a57141f2eefd', '1546069901-ba9599a7e63c', '1466637574441-749b8f19452f'],
  'fideos-con-tuco': ['1473093295043-cdd812d0e601', '1621996346565-e3dbc646d9a9', '1551183053-bf91a1d81141'],
  'fideos-con-crema': ['1621996346565-e3dbc646d9a9', '1585036156171-384164a8c675', '1546549032-9571cd6b27df'],
  'fideos-con-atun': ['1551183053-bf91a1d81141', '1585036156171-384164a8c675', '1473093295043-cdd812d0e601'],
  'fideos-con-salsa-blanca': ['1585036156171-384164a8c675', '1621996346565-e3dbc646d9a9', '1551183053-bf91a1d81141'],
  'noquis-de-papa': ['1585036156171-384164a8c675', '1551183053-bf91a1d81141', '1563379926898-05f4575a45d8'],
  'pizza-casera': ['1513104890138-7c749659a591', '1565299624946-b28f40a0ae38', '1574071318508-1cdbab80d002'],
  'fugazzeta': ['1513104890138-7c749659a591', '1574071318508-1cdbab80d002', '1565299624946-b28f40a0ae38'],
  'empanadas-de-carne': ['1601050690597-df0568f70950', '1585032226651-759b368d7246', '1547592180-85f173990554'],
  'empanadas-jamon-queso': ['1601050690597-df0568f70950', '1517433670267-08bbd4be890f', '1585032226651-759b368d7246'],
  'tarta-jamon-queso': ['1565958011703-44f9829ba187', '1517433670267-08bbd4be890f', '1547592180-85f173990554'],
  'tarta-de-verduras': ['1565958011703-44f9829ba187', '1517433670267-08bbd4be890f', '1466637574441-749b8f19452f'],
  'tarta-de-zapallitos': ['1565958011703-44f9829ba187', '1517433670267-08bbd4be890f', '1547592180-85f173990554'],
  'zapallitos-rellenos': ['1563379926898-05f4575a45d8', '1466637574441-749b8f19452f', '1547592180-85f173990554'],
  'milanesas-de-berenjena': ['1563379926898-05f4575a45d8', '1473093295043-cdd812d0e601', '1547592180-85f173990554'],
  'pure-de-papas': ['1414235077428-338989a2e8c0', '1466637574441-749b8f19452f', '1490645935967-10de6ba17061'],
  'papas-fritas': ['1573080499979-de72033e9718', '1518013431117-eb1465fa5752', '1568901346375-23c9450c58cd'],
  'coliflor-gratinada': ['1486297678162-eb2a19b0a32d', '1452195100486-9cc805987862', '1547592180-85f173990554'],
  'sopa-de-verduras': ['1547592166-23ac45744acd', '1579751626657-72bc17010498', '1603105037880-880cd4edfb0d'],
  'crema-de-calabaza': ['1603105037880-880cd4edfb0d', '1547592166-23ac45744acd', '1569718212165-3a8278d5f624'],
  'polenta-con-salsa': ['1512058564366-18510be2db19', '1476224203421-9ac39bcb3327', '1585032226651-759b368d7246'],
  'ensalada-lechuga-tomate': ['1512621776951-a57141f2eefd', '1546069901-ba9599a7e63c', '1572442388796-11668a67e53d'],
  'ensalada-rusa': ['1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd', '1540420773420-3366772f4999'],
  'ensalada-de-atun': ['1546069901-ba9599a7e63c', '1572442388796-11668a67e53d', '1512621776951-a57141f2eefd'],
  'ensalada-de-palta': ['1512621776951-a57141f2eefd', '1603046891726-36bfd957e0bf', '1546069901-ba9599a7e63c'],
  'arroz-con-pollo': ['1512058564366-18510be2db19', '1604908176997-125f25cc6f3d', '1515516969-d4008cc6241a'],
  'matambre-a-la-pizza': ['1513104890138-7c749659a591', '1603360946369-dc9bb6258143', '1565299624946-b28f40a0ae38'],
  'choripan': ['1555939594-58d7cb561ad1', '1544025162-d76694265947', '1558030006-450675393462'],
  'pastel-de-papas': ['1547592180-85f173990554', '1490645935967-10de6ba17061', '1466637574441-749b8f19452f'],
}

const urlsPorReceta = Object.fromEntries(
  Object.entries(CANDIDATOS).map(([id, ids]) => [
    id,
    ids.map((p) => `${BASE}${p}${Q}`),
  ])
)

async function verificar(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return res.ok
  } catch {
    return false
  }
}

const resultados = {}
let ok = 0
let fallidos = 0

for (const [receta, urls] of Object.entries(urlsPorReceta)) {
  let elegida = null
  for (const url of urls) {
    if (await verificar(url)) {
      elegida = url
      break
    }
  }
  resultados[receta] = elegida
  if (elegida) ok++
  else fallidos++
  console.log(`${elegida ? '✅' : '❌'} ${receta}`)
}

const lineas = [
  '// ============================================================',
  '// Fotos reales de cada receta (Unsplash, URLs verificadas).',
  '// Generado con scripts/generar-imagenes.mjs',
  '// ============================================================',
  '',
  'export const IMAGEN_POR_RECETA = {',
]
for (const [receta, url] of Object.entries(resultados)) {
  if (url) lineas.push(`  '${receta}': '${url}',`)
}
lineas.push('}')
lineas.push('')
lineas.push('/** Devuelve la foto de una receta (o null si no hay). */')
lineas.push('export function imagenDeReceta(receta) {')
lineas.push("  return receta?.imagen ?? IMAGEN_POR_RECETA[receta?.id] ?? null")
lineas.push('}')
lineas.push('')

writeFileSync('src/data/imagenes.js', lineas.join('\n'))
console.log(`\n✅ ${ok} recetas con foto · ❌ ${fallidos} sin foto`)
console.log('Archivo generado: src/data/imagenes.js')
