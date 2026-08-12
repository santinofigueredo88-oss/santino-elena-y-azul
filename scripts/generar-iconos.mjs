// Genera los iconos PNG del PWA (192, 512 y 180 para iOS) con un encoder
// PNG puro en Node (sin dependencias). Uso:
//   node scripts/generar-iconos.mjs
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SALIDA = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

// ---------------- Encoder PNG mínimo (RGBA) ----------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(bytes) {
  let c = 0xffffffff
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(tipo, datos) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(datos.length)
  const tipoBuf = Buffer.from(tipo, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([tipoBuf, datos])))
  return Buffer.concat([len, tipoBuf, datos, crc])
}

function codificarPNG(rgba, ancho, alto) {
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(ancho, 0)
  ihdr.writeUInt32BE(alto, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type: RGBA
  // Scanlines con filtro 0 (ninguno)
  const filas = Buffer.alloc((ancho * 4 + 1) * alto)
  for (let y = 0; y < alto; y++) {
    filas[y * (ancho * 4 + 1)] = 0
    rgba.copy(filas, y * (ancho * 4 + 1) + 1, y * ancho * 4, (y + 1) * ancho * 4)
  }
  const idat = deflateSync(filas, { level: 9 })
  return Buffer.concat([
    firma,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------------- Formas geométricas (coords 0..1) ----------------
function enCirculo(x, y, cx, cy, r) {
  const dx = x - cx
  const dy = y - cy
  return dx * dx + dy * dy <= r * r
}

function enRectRedondeado(x, y, rx, ry, w, h, radio) {
  const ex = Math.max(rx + radio - x, 0, x - (rx + w - radio))
  const ey = Math.max(ry + radio - y, 0, y - (ry + h - radio))
  return ex * ex + ey * ey <= radio * radio
}

// ---------------- Paleta ----------------
const VERDE_SUPERIOR = [34, 197, 94] // green-500
const VERDE_INFERIOR = [21, 128, 61] // green-700
const LIMA = [163, 230, 53] // lime-400
const BLANCO = [255, 255, 255]
const PAN = [6, 78, 59] // verde oscuro para la sartén

const mezclar = (a, b, t) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

// Dibuja el icono: plato + sartén + vapor sobre fondo verde.
function colorDePunto(x, y) {
  // Fondo: gradiente diagonal
  let color = mezclar(VERDE_SUPERIOR, VERDE_INFERIOR, (x + y) / 2)
  let alpha = 1

  const pintar = (c, a, dentro) => {
    if (!dentro) return
    color = mezclar(color, c, a)
    alpha = alpha * (1 - a) + a
  }

  // Anillo lima alrededor del plato
  pintar(LIMA, 1, enCirculo(x, y, 0.5, 0.6, 0.335))
  // Plato blanco
  pintar(BLANCO, 1, enCirculo(x, y, 0.5, 0.6, 0.3))
  // Sartén (cuerpo)
  pintar(PAN, 1, enCirculo(x, y, 0.43, 0.52, 0.19))
  // Mango de la sartén
  pintar(PAN, 1, enRectRedondeado(x, y, 0.6, 0.47, 0.19, 0.1, 0.05))
  // Vapor: 3 columnas blancas redondeadas
  for (const cx of [0.37, 0.46, 0.55]) {
    pintar(BLANCO, 0.85, enRectRedondeado(x, y, cx - 0.0175, 0.22, 0.035, 0.085, 0.0175))
  }

  return { color, alpha }
}

// ---------------- Rasterizado con supersampling ----------------
function dibujarIcono(size) {
  const SS = 6 // subsamples por eje
  const rgba = Buffer.alloc(size * size * 4)
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0
      for (let j = 0; j < SS; j++) {
        for (let i = 0; i < SS; i++) {
          const u = (px + (i + 0.5) / SS) / size
          const v = (py + (j + 0.5) / SS) / size
          const { color, alpha } = colorDePunto(u, v)
          r += color[0] * alpha
          g += color[1] * alpha
          b += color[2] * alpha
          a += alpha
        }
      }
      const n = SS * SS
      const idx = (py * size + px) * 4
      rgba[idx] = Math.round(r / n)
      rgba[idx + 1] = Math.round(g / n)
      rgba[idx + 2] = Math.round(b / n)
      rgba[idx + 3] = Math.round((a / n) * 255)
    }
  }
  return codificarPNG(rgba, size, size)
}

// ---------------- Generación ----------------
mkdirSync(SALIDA, { recursive: true })
for (const size of [512, 192, 180]) {
  const archivo = join(SALIDA, `icon-${size}.png`)
  writeFileSync(archivo, dibujarIcono(size))
  console.log(`✅ ${archivo} (${size}x${size})`)
}
console.log('Iconos generados.')
