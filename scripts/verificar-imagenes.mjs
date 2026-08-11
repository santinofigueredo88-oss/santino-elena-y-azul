// Verifica que todas las fotos de recetas respondan HTTP 200 y
// reporta URLs duplicadas entre recetas.
import { IMAGEN_POR_RECETA } from '../src/data/imagenes.js'

const porUrl = new Map()
for (const [id, url] of Object.entries(IMAGEN_POR_RECETA)) {
  if (!porUrl.has(url)) porUrl.set(url, [])
  porUrl.get(url).push(id)
}

console.log(`Recetas con foto: ${Object.keys(IMAGEN_POR_RECETA).length}`)

// GET con rango corto (más fiable que HEAD en Unsplash) y concurrencia baja
async function chequear(url) {
  try {
    const res = await fetch(url, {
      headers: { Range: 'bytes=0-1023' },
      signal: AbortSignal.timeout(20000),
    })
    return { url, ok: res.ok, status: res.status }
  } catch (e) {
    return { url, ok: false, status: e.name ?? 'error' }
  }
}

const resultados = []
const urls = [...porUrl.keys()]
for (let i = 0; i < urls.length; i += 5) {
  const lote = urls.slice(i, i + 5)
  resultados.push(...(await Promise.all(lote.map(chequear))))
}

const fallidas = resultados.filter((r) => !r.ok)
console.log(
  fallidas.length === 0
    ? `Todas las URLs OK (${resultados.length} únicas) ✅`
    : `FALLARON ${fallidas.length}: ` + fallidas.map((f) => `${f.status} ${f.url}`).join('\n  ')
)

const duplicadas = [...porUrl.entries()].filter(([, ids]) => ids.length > 1)
console.log(
  duplicadas.length === 0
    ? 'Sin fotos duplicadas ✅'
    : 'Fotos compartidas entre recetas (misma familia):\n  ' +
        duplicadas.map(([, ids]) => ids.join(' = ')).join('\n  ')
)

process.exit(fallidas.length === 0 ? 0 : 1)
