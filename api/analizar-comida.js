// ============================================================
// Función serverless de Vercel: "Escaneá tu comida" 📸
// Recibe una foto base64, la manda a Google Gemini (modelo de
// visión) y devuelve el plato, nutrientes aproximados y
// beneficios para la salud en JSON.
//
// La clave de Gemini puede venir de:
//   - La variable de entorno GEMINI_API_KEY (recomendado)
//   - El body de la request (clave del usuario, guardada en su
//     navegador) — así funciona sin configurar nada en Vercel.
// ============================================================

import { PROMPT_ANALISIS_COMIDA as PROMPT } from '../src/lib/prompt-comida.js'

export const config = { runtime: 'nodejs' }

/** Extrae un objeto JSON del texto del modelo (aguanta fences de markdown). */
function extraerJson(texto) {
  if (!texto || typeof texto !== 'string') return null
  const limpio = texto.replace(/```(?:json)?/gi, '').trim()
  try {
    return JSON.parse(limpio)
  } catch {
    /* sigue */
  }
  const inicio = limpio.indexOf('{')
  const fin = limpio.lastIndexOf('}')
  if (inicio >= 0 && fin > inicio) {
    try {
      return JSON.parse(limpio.slice(inicio, fin + 1))
    } catch {
      return null
    }
  }
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'metodo', message: 'Usá POST' })
  }

  // Acepta tanto body ya parseado como string/Buffer (defensivo ante runtimes).
  let body = {}
  try {
    body =
      typeof req.body === 'string'
        ? JSON.parse(req.body || '{}')
        : Buffer.isBuffer(req.body)
          ? JSON.parse(req.body.toString() || '{}')
          : (req.body ?? {})
  } catch {
    /* body inválido: queda vacío */
  }

  const { imageBase64, mimeType = 'image/jpeg', apiKey } = body
  const clave = process.env.GEMINI_API_KEY || apiKey

  if (!clave) {
    return res
      .status(400)
      .json({ error: 'sin-clave', message: 'Falta la clave de Gemini' })
  }
  if (!imageBase64 || typeof imageBase64 !== 'string' || imageBase64.length < 100) {
    return res
      .status(400)
      .json({ error: 'imagen-invalida', message: 'La imagen no es válida' })
  }

  const modelo = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': clave,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: imageBase64 } },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
      }
    )

    const data = await r.json().catch(() => ({}))

    if (!r.ok) {
      const mensaje =
        data?.error?.message ?? `Error de Gemini (HTTP ${r.status})`
      if (r.status === 429) {
        return res
          .status(429)
          .json({ error: 'limite', message: 'Cuota gratuita agotada' })
      }
      if (r.status === 400) {
        return res
          .status(400)
          .json({ error: 'clave-invalida', message: mensaje })
      }
      return res.status(502).json({ error: 'gemini', message: mensaje })
    }

    const texto =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    const json = extraerJson(texto)

    if (!json) {
      return res
        .status(502)
        .json({ error: 'formato', message: 'No se pudo interpretar la respuesta' })
    }

    return res.status(200).json({ ok: true, ...json })
  } catch (e) {
    return res.status(500).json({ error: 'servidor', message: e.message })
  }
}
