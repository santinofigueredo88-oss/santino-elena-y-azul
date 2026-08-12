import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nombreDeIngrediente, BASICOS } from '../data/ingredientes.js'
import { escalarIngrediente, formatearCantidad } from '../lib/share.js'
import {
  SUSTITUCIONES,
  textoSustituciones,
} from '../lib/sustituciones.js'
import { normalizarTexto } from '../lib/normalizar.js'

const NIVEL = {
  facil: { nombre: 'Fácil', emoji: '🙂' },
  media: { nombre: 'Media', emoji: '😌' },
  dificil: { nombre: 'Difícil', emoji: '🧑‍🍳' },
}

function retardo() {
  return 550 + Math.random() * 500
}

/** Busca un ingrediente de la receta mencionado en el texto del usuario. */
function ingredienteMencionado(receta, texto) {
  const n = normalizarTexto(texto)
  for (const ing of receta.ingredientes) {
    const nombre = normalizarTexto(nombreDeIngrediente(ing.id))
    if (n.includes(nombre)) return ing.id
  }
  return null
}

export default function CocinaBot({ receta, idsIngredientes, porciones, onCerrar }) {
  const [mensajes, setMensajes] = useState([])
  const [escribiendo, setEscribiendo] = useState(false)
  const [paso, setPaso] = useState(-1)
  const finRef = useRef(null)
  const idRef = useRef(0)
  const enCola = useRef(0)
  const montado = useRef(true)

  // Evita setState después de desmontar (p. ej. cerrar el modal mientras escribe)
  useEffect(() => {
    montado.current = true
    return () => {
      montado.current = false
    }
  }, [])

  const totalPasos = receta.pasos.length
  const faltantes = useMemo(() => {
    const set = new Set(idsIngredientes)
    return receta.ingredientes.filter(
      (ing) => !BASICOS.has(ing.id) && !set.has(ing.id)
    )
  }, [receta, idsIngredientes])

  const idMsg = () => ++idRef.current

  // Mensaje del bot tras una pausa de "escribiendo…"
  const botDice = useCallback(
    (texto, extras = {}) => {
      const id = idMsg()
      setEscribiendo(true)
      enCola.current++
      setTimeout(() => {
        enCola.current = Math.max(0, enCola.current - 1)
        if (enCola.current === 0) setEscribiendo(false)
        if (montado.current) {
          setMensajes((prev) => [
            ...prev,
            { id, autor: 'bot', texto, ...extras },
          ])
        }
      }, retardo())
    },
    []
  )

  // Saludo inicial
  useEffect(() => {
    const set = new Set(idsIngredientes)
    const tengo = receta.ingredientes.filter(
      (ing) => BASICOS.has(ing.id) || set.has(ing.id)
    )
    let texto = `¡Hola! 👨‍🍳 Soy tu guía para hacer *${receta.nombre}*.`
    texto += `\n\nTenés ${tengo.length} de ${receta.ingredientes.length} ingredientes, faltan ${faltantes.length}.`
    if (faltantes.length === 0) {
      texto += '\n\n¡Estás listo para cocinar! ¿Arrancamos? 🚀'
    } else {
      texto += '\n\nIgual podemos avanzar: te voy contando cada paso y te aviso cómo reemplazar lo que falte. 🔁'
    }
    const t = setTimeout(
      () => botDice(texto, { chips: chipsInicio() }),
      600
    )
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function chipsInicio() {
    return ['🚀 Empezar a cocinar', '📋 Ingredientes', '⚠️ Qué me falta', '🔁 Sustituciones']
  }
  function chipsPasos(actual = paso) {
    const base = ['▶️ Siguiente paso', '◀️ Paso anterior']
    if (actual >= totalPasos - 1) base.push('✅ Terminé')
    base.push('📋 Ingredientes', '🔁 Sustituciones')
    return base
  }

  // ---------- Respuestas ----------
  const verIngredientes = () => {
    const set = new Set(idsIngredientes)
    const lineas = []
    lineas.push(`📋 *Ingredientes* (para ${porciones} ${porciones === 1 ? 'persona' : 'personas'}):`)
    for (const ing of receta.ingredientes) {
      const esc = escalarIngrediente(ing, receta.porciones, porciones)
      const falta = !BASICOS.has(ing.id) && !set.has(ing.id)
      const nombre = nombreDeIngrediente(ing.id).toLowerCase()
      lineas.push(`${falta ? '❌' : '✅'} ${formatearCantidad(esc.cantidad)} ${esc.unidad} de ${nombre}`)
    }
    return lineas.join('\n')
  }

  const verFaltantes = () => {
    if (faltantes.length === 0) {
      return '¡Tenés TODOS los ingredientes! 🎉 Nada que comprar, nada que reemplazar. ¡A cocinar! 👨‍🍳'
    }
    const lista = faltantes.map((f) => `• ${nombreDeIngrediente(f.id)}`).join('\n')
    const texto = `⚠️ Te faltan estos ${faltantes.length}:\n\n${lista}\n\n`
    const sustituciones = textoSustituciones(receta, idsIngredientes)
    return texto + (sustituciones ?? 'Tip: podés improvisar con lo que tengas a mano, casi siempre funciona. 😉')
  }

  const verSustituciones = () => {
    if (faltantes.length === 0) {
      return '¡No te falta nada! 😄 No necesitás sustituciones. Igual, si algún día cambiás un ingrediente, decime y te doy ideas.'
    }
    const sustituciones = textoSustituciones(receta, idsIngredientes)
    if (sustituciones) {
      return `${sustituciones}\n\nVas a ver que el resultado queda igual de rico. 🙌`
    }
    const ejemplos = faltantes
      .slice(0, 2)
      .map((f) => {
        const opciones = SUSTITUCIONES[f.id]
        return opciones?.length
          ? `${nombreDeIngrediente(f.id)}: se puede con ${opciones.slice(0, 2).map(nombreDeIngrediente).join(' o ')}`
          : null
      })
      .filter(Boolean)
    const base = 'No encontré un reemplazo directo entre lo que tenés ahora, pero acá van ideas:'
    return ejemplos.length
      ? `${base}\n\n• ${ejemplos.join('\n• ')}`
      : 'La cocina es experimentación: si te falta algo, probá con el ingrediente más parecido que tengas. Seguro sale rico igual. 😉'
  }

  const verTiempo = () => {
    const total = receta.tiempoMinutos
    const porPaso = Math.round(total / totalPasos)
    return `⏱️ Esta receta lleva *${total} minutos* en total.\n\nSon ${totalPasos} pasos, más o menos ${porPaso} minutos por paso. ¡Sin apuro, la cocina espera! 🍳`
  }

  const verPorciones = () => {
    return `👥 Esta receta es para *${receta.porciones} porciones* y la estás viendo en *${porciones}*.\n\nTodas las cantidades ya están recalculadas. Si querés cambiar el número, usá el ajustador arriba en la receta.`
  }

  const verDificultad = () => {
    const n = NIVEL[receta.dificultad] ?? NIVEL.facil
    const tips = {
      facil: '¡Tranqui, no hay pierde! Ideal para arrancar. 😌',
      media: 'Es media: requiere un poquito de atención pero cualquiera la puede hacer. 💪',
      dificil: 'Es de las elaboradas: tomátelo con calma, prepará todo antes de arrancar. 🧑‍🍳',
    }
    return `${n.emoji} Dificultad: *${n.nombre}*.\n\n${tips[receta.dificultad] ?? tips.facil}`
  }

  const verPaso = (indice) => {
    const numero = Math.max(0, Math.min(totalPasos - 1, indice))
    setPaso(numero)
    botDice(receta.pasos[numero], {
      tipo: 'paso',
      numero: numero + 1,
      total: totalPasos,
      chips: chipsPasos(numero),
    })
  }

  const avanzarPaso = () => {
    if (paso === -1) {
      if (faltantes.length > 0) {
        botDice(`¡Vamos! 🚀\n\nAntes de arrancar: te faltan ${faltantes.length} ingrediente${faltantes.length === 1 ? '' : 's'}. ${textoSustituciones(receta, idsIngredientes) ?? 'Podés reemplazarlos o hacerlo sin drama.'}\n\nCuando estés listo, tocá "▶️ Siguiente paso".`, {
          chips: ['▶️ Siguiente paso', '🔁 Sustituciones'],
        })
      } else {
        verPaso(0)
      }
      return
    }
    if (paso < totalPasos - 1) {
      verPaso(paso + 1)
    } else {
      setPaso(-1)
      botDice(
        `¡Felicitaciones, terminaste todos los pasos! 🎉\n\nDejá reposar un minuto, serví y disfrutá tu ${receta.nombre.toLowerCase()}. ¡Buen provecho! 🍽️`,
        { chips: ['🔄 Empezar de nuevo', '📋 Ingredientes', '🔁 Sustituciones'] }
      )
    }
  }

  const retrocederPaso = () => {
    if (paso <= 0) {
      botDice('Estás en el primer paso, no hay más atrás. 😊', { chips: chipsPasos() })
      return
    }
    verPaso(paso - 1)
  }

  const repetirPaso = () => {
    if (paso === -1) {
      botDice('Todavía no arrancamos con los pasos. Decime "Empezar a cocinar" cuando quieras. 🚀', {
        chips: chipsInicio(),
      })
      return
    }
    botDice(`Claro, te lo repito:\n\n${receta.pasos[paso]}`, {
      tipo: 'paso',
      numero: paso + 1,
      total: totalPasos,
      chips: chipsPasos(),
    })
  }

  const finalizar = () => {
    setPaso(-1)
    botDice(
      '¡Buenísimo! 💪 Espero que haya salido riquísimo.\n\nTip: si te sobró, se guarda perfecto en la heladera. ¡Nos vemos en la próxima receta! 👋',
      { chips: ['🔄 Empezar de nuevo', '📋 Ingredientes', '🔁 Sustituciones'] }
    )
  }

  const ayuda = () => {
    return 'Puedo ayudarte con:\n\n• 🚀 "Empezar a cocinar" → te guío paso a paso\n• 📋 "Ingredientes" → te los listo con cantidades\n• ⚠️ "Qué me falta" → faltantes y consejos\n• 🔁 "Sustituciones" → reemplazos con lo que tenés\n• ⏱️ "Cuánto tarda" / 👥 "Porciones" / 🙂 "Dificultad"\n• Decime "no tengo X" y te propongo un reemplazo'
  }

  // ---------- Procesador de intenciones ----------
  const responderA = (texto) => {
    const n = normalizarTexto(texto)
    if (!n) return

    // Paso N
    const pasoN = n.match(/paso\s+(\d{1,2})/)
    if (pasoN) {
      verPaso(parseInt(pasoN[1], 10) - 1)
      return
    }
    // "no tengo X" → sustitución específica
    if (n.includes('no tengo') || n.includes('no teng') || n.includes('me falta') || n.includes('sin ')) {
      const id = ingredienteMencionado(receta, texto)
      if (id) {
        const opciones = SUSTITUCIONES[id] ?? []
        const set = new Set(idsIngredientes)
        const disponibles = opciones.filter((o) => set.has(o))
        const nombre = nombreDeIngrediente(id)
        if (disponibles.length > 0) {
          botDice(
            `¡No hay problema con ${nombre.toLowerCase()}! Podés usar *${nombreDeIngrediente(disponibles[0])}* que ya tenés en casa. 🙌`,
            { chips: chipsPasos() }
          )
        } else if (opciones.length > 0) {
          botDice(
            `Para reemplazar ${nombre.toLowerCase()} podrías usar ${opciones.map(nombreDeIngrediente).join(' o ')}. Si tenés alguno, avisame y seguimos. 😉`,
            { chips: chipsPasos() }
          )
        } else {
          botDice(
            `Tranqui, se puede hacer sin ${nombre.toLowerCase()} o con lo más parecido que tengas. La cocina es así: improvisar. 😄`,
            { chips: chipsPasos() }
          )
        }
        return
      }
    }
    // Intenciones
    if (/(hola|buenas|buen dia|buenas tardes|ey|hey|que tal)/.test(n)) {
      botDice(`¡Hola de nuevo! 👋 ¿Arrancamos con *${receta.nombre}* o querés que te cuente algo de la receta?`, {
        chips: chipsInicio(),
      })
    } else if (/(empezar|arrancar|cocinar|dale|vamos|adelante|siguiente|continuar|next|si)/.test(n)) {
      avanzarPaso()
    } else if (/(anterior|atras|volver|retroceder|anterior paso)/.test(n)) {
      retrocederPaso()
    } else if (/(repetir|otra vez|otravez|de nuevo|nuevamente)/.test(n)) {
      repetirPaso()
    } else if (/(ingrediente|que lleva|lista de compras)/.test(n)) {
      botDice(verIngredientes(), { chips: chipsPasos() })
    } else if (/(falta|faltante|faltan|faltaria|que me falta)/.test(n)) {
      botDice(verFaltantes(), { chips: chipsPasos() })
    } else if (/(sustitu|reempla|cambio|cambiar|alternativa|en vez de|por cual|por que reemplazo|puedo usar)/.test(n)) {
      botDice(verSustituciones(), { chips: chipsPasos() })
    } else if (/(tiempo|cuanto tarda|cuanto dura|dura|tarda|demora|minutos)/.test(n)) {
      botDice(verTiempo(), { chips: chipsPasos() })
    } else if (/(porcion|personas|cantidad|para cuantos|racion)/.test(n)) {
      botDice(verPorciones(), { chips: chipsPasos() })
    } else if (/(dificultad|dificil|facil|media|complicado|sencillo)/.test(n)) {
      botDice(verDificultad(), { chips: chipsPasos() })
    } else if (/(gracias|listo|termine|termine|terminado|fin|completo|me salio)/.test(n)) {
      finalizar()
    } else if (/(ayuda|que podes|que sabes|opciones|ayudame|help)/.test(n)) {
      botDice(ayuda(), { chips: chipsInicio() })
    } else {
      const id = ingredienteMencionado(receta, texto)
      if (id) {
        const opciones = SUSTITUCIONES[id] ?? []
        if (opciones.length) {
          botDice(
            `Sobre ${nombreDeIngrediente(id).toLowerCase()}: si no lo tenés, podés usar ${opciones.map(nombreDeIngrediente).join(' o ')}. 😉`,
            { chips: chipsPasos() }
          )
        } else {
          botDice(`¡Buena pregunta! Sobre ${nombreDeIngrediente(id).toLowerCase()}: lo más fácil es reemplazarlo por el ingrediente más parecido que tengas en casa. ✨`, { chips: chipsPasos() })
        }
      } else {
        botDice(
          'No entendí del todo, perdón 🙈. Podés tocarme una de estas opciones o escribirme algo como "no tengo tomate":',
          { chips: chipsInicio() }
        )
      }
    }
  }

  const enviar = (texto) => {
    const limpio = texto.trim()
    if (!limpio || escribiendo) return false
    setMensajes((prev) => [...prev, { id: idMsg(), autor: 'user', texto: limpio }])
    responderA(limpio)
    return true
  }

  // Auto-scroll
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [mensajes, escribiendo])

  const ultimoBot = [...mensajes].reverse().find((m) => m.autor === 'bot')
  const chips = ultimoBot?.chips ?? []
  const progreso = paso >= 0 ? ((paso + 1) / totalPasos) * 100 : 0

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Encabezado del chat */}
      <div className="flex items-center gap-3 border-b border-stone-200/70 bg-gradient-to-r from-green-600 to-lime-500 px-4 py-3 dark:border-stone-700">
        <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl backdrop-blur">
          👨‍🍳
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-green-600 bg-green-400" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-white">Chef Guía · {receta.nombre}</p>
          <p className="text-xs font-bold text-green-100">
            {escribiendo ? 'escribiendo…' : paso >= 0 ? `Paso ${paso + 1} de ${totalPasos}` : 'en línea · ayudándote a cocinar'}
          </p>
        </div>
        <button
          onClick={onCerrar}
          aria-label="Cerrar el guía de cocina"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 text-sm font-black text-white transition-colors hover:bg-white/30"
        >
          ✕
        </button>
      </div>

      {/* Barra de progreso de pasos */}
      {paso >= 0 && (
        <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-800">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-lime-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
            role="progressbar"
            aria-valuenow={paso + 1}
            aria-valuemin={1}
            aria-valuemax={totalPasos}
          />
        </div>
      )}

      {/* Mensajes */}
      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-label="Conversación con el guía de cocina"
      >
        {mensajes.map((m) =>
          m.autor === 'user' ? (
            <div key={m.id} className="flex justify-end animate-fade-up">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-green-600 px-4 py-2.5 text-[15px] font-bold text-white shadow-sm">
                {m.texto}
              </div>
            </div>
          ) : m.tipo === 'paso' ? (
            <div key={m.id} className="animate-fade-up">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-green-600 text-sm font-black text-white shadow-sm">
                  {m.numero}
                </span>
                <span className="text-xs font-black uppercase tracking-wide text-stone-400">
                  Paso {m.numero} de {m.total}
                </span>
              </div>
              <div className="mt-1.5 ml-4 max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[15px] font-semibold leading-relaxed text-stone-800 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-700">
                {m.texto}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex items-end gap-2 animate-fade-up">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-crema-100 text-base dark:bg-stone-800" aria-hidden="true">
                👨‍🍳
              </span>
              <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[15px] font-semibold leading-relaxed text-stone-700 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700">
                {m.texto}
              </div>
            </div>
          )
        )}

        {escribiendo && (
          <div className="flex items-end gap-2 animate-fade-in">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-crema-100 text-base dark:bg-stone-800" aria-hidden="true">
              👨‍🍳
            </span>
            <div className="flex gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-stone-200/60 dark:bg-stone-800 dark:ring-stone-700">
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '120ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-stone-300 dark:bg-stone-500" style={{ animationDelay: '240ms' }} />
            </div>
          </div>
        )}
        <div ref={finRef} />
      </div>

      {/* Chips de respuesta rápida */}
      {chips.length > 0 && !escribiendo && (
        <div className="flex flex-wrap gap-1.5 border-t border-stone-200/70 px-3 pt-3 dark:border-stone-700">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => enviar(chip)}
              className="rounded-full bg-green-50 px-3 py-1.5 text-[13px] font-extrabold text-green-700 ring-1 ring-green-200 transition-all hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-sm active:translate-y-0 dark:bg-green-900/40 dark:text-green-200 dark:ring-green-800 dark:hover:bg-green-900/70"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const input = e.currentTarget.querySelector('input')
          const ok = enviar(input.value)
          if (ok) input.value = ''
        }}
        className="flex items-center gap-2 p-3"
      >
        <input
          id="cocina-bot-input"
          type="text"
          placeholder='Escribí… ej: "no tengo tomate"'
          aria-label="Escribí tu mensaje al guía"
          className="w-full flex-1 rounded-2xl border-2 border-stone-200 bg-crema-50 px-4 py-2.5 text-[15px] font-semibold text-stone-800 placeholder:text-stone-400 focus:border-green-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-green-600 text-lg text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-500 active:scale-90"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
