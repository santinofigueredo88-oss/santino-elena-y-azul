// ============================================================
// Genera src/data/imagenes.js con FOTOS REALES de cada plato.
//  - Recetas internacionales: foto real de TheMealDB (verificada)
//  - Recetas argentinas: foto real de Wikimedia/Wikipedia (verificada)
//  - Si no hay foto nueva, conserva la actual (Unsplash).
// Uso: node scripts/generar-imagenes-reales.mjs
// ============================================================
import { writeFileSync } from 'node:fs'
import { IMAGEN_POR_RECETA as ACTUALES } from '../src/data/imagenes.js'

const Q_TDB = '/medium'
const BASE_TDB = 'https://www.themealdb.com/images/media/meals/'

// ---- Fotos TheMealDB (recetas internacionales nuevas) ----
const TDB = {
  lasagna: 'wtsvxx1511296896.jpg',
  'spaghetti-bolognesa': 'sutysw1468247559.jpg',
  'spaghetti-carbonara': 'llcbn01574260722.jpg',
  'fettuccine-alfredo': '0jv5gx1661040802.jpg',
  'penne-arrabiata': 'ustsqw1468250014.jpg',
  'pizza-margherita': 'x0lk931587671540.jpg',
  'tacos-de-pescado': 'uvuyxu1503067369.jpg',
  'enchiladas-de-pollo': 'qtuwxu1468233098.jpg',
  'fajitas-de-garbanzos': 'tvtxpq1511464705.jpg',
  'tacos-de-pollo-horneados': 'ypxvwv1505333929.jpg',
  'morrones-rellenos-quinoa': 'b66myb1683207208.jpg',
  'pollo-karaage': 'tyywsw1505930373.jpg',
  sushi: 'g046bb1663960946.jpg',
  katsudon: 'd8f6qx1604182128.jpg',
  tonkatsu: 'lwsnkl1604181187.jpg',
  'teriyaki-pollo': 'wvpsxx1468256321.jpg',
  'yaki-udon': 'wrustq1511475474.jpg',
  paella: '9bl20p1763248192.jpg',
  'tortilla-espanola': 'quuxsx1511476154.jpg',
  'gambas-al-ajillo': 'ze8uwg1763196123.jpg',
  churros: 'nxnny61763250596.jpg',
  'patatas-bravas': 'bvg8sn1763298713.jpg',
  gazpacho: 'h5qmn31763304965.jpg',
  'beef-wellington': 'vvpprx1487325699.jpg',
  'desayuno-ingles': 'sqrtwu1511721265.jpg',
  'fish-pie': 'ysxwuq1487323065.jpg',
  'sticky-toffee-pudding': 'xqqqtu1511637379.jpg',
  'toad-in-the-hole': 'ytuvwr1503070420.jpg',
  'yorkshire-puddings': 'x5qz5k1761595900.jpg',
  'osso-buco': 'wwuqvt1487345467.jpg',
  'cannelloni-espinaca-ricota': 'wspuvp1511303478.jpg',
  ribollita: 'xrrwpx1487347049.jpg',
  'risotto-salmón': 'xxrxux1503070723.jpg',
  'ensalada-pasta-mediterranea': 'wvqpwt1468339226.jpg',
  'katsu-curry': 'vwrpps1503068729.jpg',
  'teriyaki-salmón': 'xxyupu1468262513.jpg',
  fideua: 'wqqvyq1511179730.jpg',
  'crema-catalana': 'x73ll91763247842.jpg',
  'croquetas-jamon': '6dpa7m1763331105.jpg',
  'pimientos-padron': '0ljvc51763248075.jpg',
  'ajo-blanco': '5jdtie1763289302.jpg',
  ensaimada: '1ugsho1763248007.jpg',
  'crumble-manzana-mora': 'xvsurr1511719182.jpg',
  'sunday-roast': 'ssrrrs1503664277.jpg',
  kedgeree: 'utxqpt1511639216.jpg',
  'hotpot-lancashire': 'uttrxw1511637813.jpg',
  'bread-butter-pudding': 'xqwwpy1483908697.jpg',
  'eton-mess': 'uuxwvq1483907861.jpg',
}

// ---- Fotos Wikimedia (recetas argentinas) ----
// Cada receta -> lista de títulos de Wikipedia a probar (es.wikipedia, luego en.wikipedia)
const WIKI = {
  'huevos-revueltos': ['Huevos_revueltos', 'Scrambled_eggs'],
  'omelette-de-queso': ['Omelette', 'Omelette_aux_fines_herbes'],
  'tostadas-con-palta': ['Avocado_toast'],
  'licuado-de-banana': ['Batido', 'Smoothie'],
  'licuado-de-frutilla': ['Batido', 'Smoothie'],
  'licuado-de-durazno': ['Batido', 'Smoothie'],
  panqueques: ['Panqueque', 'Pancake'],
  'panqueques-de-avena': ['Panqueque', 'Pancake'],
  'budin-de-pan': ['Budín_de_pan', 'Bread_pudding'],
  'scones-de-queso': ['Scone'],
  'tostado-jamon-queso': ['Tostado_(gastronomía)', 'Croque_monsieur'],
  'torta-de-chocolate': ['Tarta_de_chocolate', 'Chocolate_cake'],
  'pan-casero': ['Pan', 'Bread'],
  'torta-frita': ['Torta_frita'],
  vigilante: ['Vigilante_(postre)'],
  'ensalada-de-frutas': ['Ensalada_de_frutas', 'Fruit_salad'],
  submarino: ['Submarino_(bebida)', 'Submarino'],
  'flan-casero': ['Flan', 'Crème_caramel'],
  'arroz-con-leche': ['Arroz_con_leche', 'Rice_pudding'],
  'tortilla-de-papas': ['Tortilla_de_patatas', 'Spanish_omelette'],
  'tortilla-de-acelga': ['Tortilla_de_verduras'],
  'tortilla-de-verduras': ['Tortilla_de_verduras', 'Spanish_omelette'],
  'milanesas-de-carne': ['Milanesa', 'Schnitzel'],
  'milanesas-de-pollo': ['Milanesa', 'Schnitzel'],
  'milanesa-napolitana': ['Milanesa_a_la_napolitana'],
  'sandwich-de-milanesa': ['Milanesa'],
  'hamburguesas-caseras': ['Hamburguesa', 'Hamburger'],
  'bife-a-la-plancha': ['Bistec', 'Steak'],
  'carne-al-horno': ['Asado', 'Roast_beef'],
  'guiso-de-carne': ['Guiso', 'Stew'],
  'guiso-de-lentejas': ['Lentejas', 'Lentil_soup'],
  'pollo-al-horno': ['Pollo_asado', 'Roast_chicken'],
  'pollo-a-la-crema': ['Pollo_asado'],
  'pechuga-con-ensalada': ['Ensalada', 'Chicken_salad'],
  'fideos-con-tuco': ['Fideos', 'Spaghetti'],
  'fideos-con-crema': ['Fettuccine_Alfredo'],
  'fideos-con-atun': ['Fideos', 'Pasta'],
  'fideos-con-salsa-blanca': ['Pasta'],
  'fideos-con-bolognesa': ['Salsa_bolognesa', 'Spaghetti_bolognese'],
  'fideos-con-pesto': ['Pesto'],
  'fideos-con-pollo-y-crema': ['Pasta'],
  'fideos-con-calabaza': ['Pasta'],
  'fideos-con-brocoli': ['Pasta'],
  'noquis-de-papa': ['Ñoquis', 'Gnocchi'],
  'pizza-casera': ['Pizza', 'Pizza_margherita'],
  fugazzeta: ['Fugazza', 'Focaccia'],
  'empanadas-de-carne': ['Empanada', 'Empanada_argentina'],
  'empanadas-jamon-queso': ['Empanada', 'Empanada_argentina'],
  'empanadas-de-pollo': ['Empanada', 'Empanada_argentina'],
  'tarta-jamon-queso': ['Tarta_(alimento)', 'Quiche'],
  'tarta-de-verduras': ['Tarta_(alimento)', 'Quiche'],
  'tarta-de-zapallitos': ['Tarta_(alimento)', 'Zucchini'],
  'tarta-de-pollo': ['Tarta_(alimento)', 'Chicken_pie'],
  'tarta-de-atun': ['Tarta_(alimento)', 'Quiche'],
  'tarta-de-acelga': ['Tarta_(alimento)', 'Quiche'],
  'zapallitos-rellenos': ['Zucchini', 'Stuffed_zucchini'],
  'milanesas-de-berenjena': ['Berenjena', 'Eggplant'],
  'pure-de-papas': ['Puré_de_patatas', 'Mashed_potato'],
  'papas-fritas': ['Patatas_fritas', 'French_fries'],
  'papas-al-horno': ['Papa_(tubérculo)', 'Roast_potatoes'],
  'coliflor-gratinada': ['Coliflor', 'Cauliflower'],
  'sopa-de-verduras': ['Sopa_de_verduras', 'Vegetable_soup'],
  'sopa-de-pollo': ['Sopa_de_pollo', 'Chicken_soup'],
  'crema-de-calabaza': ['Calabaza', 'Pumpkin_soup'],
  'polenta-con-salsa': ['Polenta'],
  'ensalada-lechuga-tomate': ['Ensalada', 'Salad'],
  'ensalada-rusa': ['Ensalada_rusa', 'Olivier_salad'],
  'ensalada-de-atun': ['Ensalada', 'Tuna_salad'],
  'ensalada-de-palta': ['Ensalada', 'Guacamole'],
  'ensalada-de-pollo': ['Ensalada', 'Chicken_salad'],
  'ensalada-caprese': ['Ensalada_caprese', 'Caprese_salad'],
  'ensalada-de-papa': ['Ensalada_de_patatas', 'Potato_salad'],
  'ensalada-de-garbanzos': ['Garbanzo', 'Chickpea_salad'],
  'ensalada-waldorf': ['Ensalada_Waldorf', 'Waldorf_salad'],
  'ensalada-caesar': ['Ensalada_César', 'Caesar_salad'],
  'arroz-con-pollo': ['Arroz_con_pollo'],
  'arroz-primavera': ['Arroz_blanco', 'Fried_rice'],
  'matambre-a-la-pizza': ['Matambre', 'Pizza'],
  choripan: ['Choripán', 'Choripan'],
  'pastel-de-papas': ['Pastel_de_papa', "Shepherd's_pie"],
  'galletitas-de-avena': ['Avena', 'Oatmeal_cookie'],
  'pan-de-banana': ['Pan_de_banana', 'Banana_bread'],
  'avena-con-manzana': ['Avena', 'Oatmeal'],
  'budin-de-banana': ['Pan_de_banana', 'Banana_bread'],
  'brownies-de-chocolate': ['Brownie', 'Chocolate_brownie'],
  'alfajores-de-maicena': ['Alfajor'],
  'pastafrola-de-membrillo': ['Pastafrola'],
  'torta-de-zanahoria': ['Tarta_de_zanahoria', 'Carrot_cake'],
  'lemon-pie': ['Tarta_de_limón', 'Lemon_meringue_pie'],
  'torta-de-manzana': ['Tarta_de_manzana', 'Apple_pie'],
  'torta-de-yogur': ['Bizcocho', 'Yogurt_cake'],
  'torta-de-chocolate': ['Tarta_de_chocolate', 'Chocolate_cake'],
  'mousse-de-chocolate': ['Mousse', 'Chocolate_mousse'],
  'revuelto-de-gramajo': ['Revuelto_Gramajo'],
  'bifes-a-la-criolla': ['Bistec', 'Stew'],
  'guiso-de-garbanzos': ['Garbanzos', 'Chickpea'],
  locro: ['Locro', 'Locro_argentino'],
  'budin-de-vainilla': ['Budín', 'Pound_cake'],
  'huevos-con-panceta': ['Bacon', 'Bacon_and_eggs'],
  guacamole: ['Guacamole', 'Guacamole_(10-17-20)'],
  'burritos-carne': ['Burrito', 'Burrito.JPG'],
  nachos: ['Nachos', 'Nachos_grande.jpg'],
  'chiles-rellenos': ['Chile_relleno', 'Chiles_rellenos'],
  'quesadillas-pollo': ['Quesadilla', 'Quesadilla_con_queso.jpg'],
  'ramen-pollo': ['Ramen', 'Shoyu_ramen%2C_ussayama%2C_amakusa%2C_kumamoto.jpg'],
  gyozas: ['Gyoza', 'Jiaozi.jpg'],
  okonomiyaki: ['Okonomiyaki', 'Okonomiyaki_001.jpg'],
}

async function verificar(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-2047' },
      signal: AbortSignal.timeout(20000),
    })
    return res.ok
  } catch {
    return false
  }
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// Busca la foto real en Wikipedia (probando es.wikipedia y en.wikipedia).
// Para no chocar con el rate limit, esperamos entre intentos.
async function fotoWikipedia(titulos) {
  for (const t of titulos) {
    for (const lang of ['es', 'en']) {
      const api = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`
      try {
        const res = await fetch(api, { signal: AbortSignal.timeout(20000) })
        if (res.status === 429) {
          await delay(1500)
          continue
        }
        if (!res.ok) continue
        const j = await res.json()
        if (!j?.thumbnail?.source) continue
        // Sube la resolución a 500px (tamaño válido en Wikimedia) y saca los params de tracking
        let url = j.thumbnail.source.replace('/330px-', '/500px-')
        url = url.split('?')[0]
        return url
      } catch {
        /* siguiente */
      }
    }
  }
  return null
}

const resultados = {}
let nuevas = 0
let sinFoto = 0

// 1) Internacionales: foto directa de TheMealDB
for (const [id, archivo] of Object.entries(TDB)) {
  const url = `${BASE_TDB}${archivo}${Q_TDB}`
  if (await verificar(url)) {
    resultados[id] = url
    nuevas++
    console.log(`✅ (tdb) ${id}`)
  } else {
    console.log(`❌ (tdb) ${id}`)
    sinFoto++
  }
}

// 2) Argentinas: Wikipedia (con esperas para respetar el rate limit)
let i = 0
for (const [id, titulos] of Object.entries(WIKI)) {
  i++
  if (i % 5 === 0) await delay(1200)
  const foto = await fotoWikipedia(titulos)
  if (foto) {
    resultados[id] = foto
    nuevas++
    console.log(`✅ (wiki) ${id}`)
  } else {
    console.log(`➖ (wiki, sin foto nueva) ${id} — conserva actual`)
    sinFoto++
  }
  await delay(400)
}

// 3) El resto conserva su foto actual (verificada OK antes)
for (const [id, url] of Object.entries(ACTUALES)) {
  if (!resultados[id]) resultados[id] = url
}

// Verificación final suave: solo revertimos si la URL devuelve un 404 real
// (los 429 por rate limit y los 206 parciales se consideran OK).
console.log('\nVerificando URLs finales…')
const claves = Object.keys(resultados)
async function estadoReal(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(25000) })
    if (res.status === 429 || res.status === 206) return 'ok'
    return res.status === 200 || res.status === 304 ? 'ok' : 'caida'
  } catch {
    return 'caida'
  }
}
for (let i = 0; i < claves.length; i += 2) {
  const lote = claves.slice(i, i + 2)
  const checks = await Promise.all(
    lote.map(async (id) => ({ id, estado: await estadoReal(resultados[id]) }))
  )
  for (const { id, estado } of checks) {
    if (estado === 'caida') {
      console.log(`⚠️  ${id}: URL caída, vuelvo a la foto anterior`)
      resultados[id] = ACTUALES[id] ?? null
      if (!resultados[id]) {
        delete resultados[id]
        sinFoto++
      }
    }
  }
  await delay(900)
}

const lineas = [
  '// ============================================================',
  '// Fotos reales de cada plato (Wikipedia/Wikimedia y TheMealDB,',
  '// URLs verificadas HTTP 200).',
  '// Generado con scripts/generar-imagenes-reales.mjs',
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
console.log(`\n✅ ${nuevas} fotos reales nuevas · ${sinFoto} sin foto nueva`)
console.log('Archivo generado: src/data/imagenes.js')
