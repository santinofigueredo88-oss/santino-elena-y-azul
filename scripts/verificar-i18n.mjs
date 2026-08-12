// Verifica que cada clave usada con t()/tN() en los componentes
// exista en el diccionario ES/EN (src/i18n.js).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

function archivosJsx(dir) {
  let out = []
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) out = out.concat(archivosJsx(p))
    else if (f.endsWith('.jsx')) out.push(p)
  }
  return out
}

const usadas = new Set()
for (const f of [...archivosJsx('src/components'), 'src/App.jsx']) {
  const c = readFileSync(f, 'utf8')
  for (const m of c.matchAll(/t\('([a-z0-9.]+)'/g)) usadas.add(m[1])
  for (const m of c.matchAll(/tN\('([a-z0-9.]+)'/g)) usadas.add(m[1])
}

const i18n = readFileSync('src/i18n.js', 'utf8')
const definidas = new Set(
  [...i18n.matchAll(/^    '([a-z0-9.]+)':/gm)].map((m) => m[1])
)

// Sufijos dinámicos: t('categoria.' + id), t('dificultad.' + id), t('tipo.' + id)
const dinamicos = [...usadas].filter((k) => k.endsWith('.'))
const faltantes = [...usadas].filter(
  (k) => !definidas.has(k) && !k.endsWith('.')
)

console.log(`Claves usadas: ${usadas.size} · Definidas (ES): ${definidas.size}`)
if (dinamicos.length) {
  console.log('Prefijos dinámicos (ok): ' + [...new Set(dinamicos.map((k) => k + '*'))].join(', '))
}
if (faltantes.length) {
  console.log('❌ FALTANTES: ' + faltantes.join(', '))
  process.exit(1)
}
console.log('✅ Todas las claves usadas están definidas')
