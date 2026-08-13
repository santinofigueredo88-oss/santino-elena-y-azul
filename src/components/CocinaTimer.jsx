import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'

// Duraciones rápidas en minutos
const PRESETS = [5, 10, 15, 20, 30, 45, 60]

function formatear(seg) {
  const m = Math.floor(seg / 60)
  const s = seg % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** Tres beeps cortos con Web Audio API (sin archivos externos). */
function sonarAlarma() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const beep = (inicio) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + inicio)
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + inicio + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + inicio + 0.35)
      osc.start(ctx.currentTime + inicio)
      osc.stop(ctx.currentTime + inicio + 0.4)
    }
    beep(0)
    beep(0.45)
    beep(0.9)
    setTimeout(() => ctx.close().catch(() => {}), 1800)
  } catch {
    /* sin audio disponible: no pasa nada */
  }
}

export default function CocinaTimer() {
  const { t } = useApp()
  const [abierto, setAbierto] = useState(false)
  const [minutos, setMinutos] = useState(null) // duración elegida en minutos
  const [segundos, setSegundos] = useState(0) // segundos restantes
  const [corriendo, setCorriendo] = useState(false)
  const tituloOriginal = useRef(
    typeof document !== 'undefined' ? document.title : ''
  )

  // Cuenta regresiva
  useEffect(() => {
    if (!corriendo) return
    const id = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : s))
    }, 1000)
    return () => clearInterval(id)
  }, [corriendo])

  // Al llegar a cero: parar y avisar
  useEffect(() => {
    if (corriendo && segundos === 0) {
      setCorriendo(false)
      sonarAlarma()
    }
  }, [corriendo, segundos])

  // Mostrar el tiempo restante en la pestaña mientras corre
  useEffect(() => {
    if (corriendo) {
      document.title = `⏱️ ${formatear(segundos)} · ${tituloOriginal.current}`
    } else {
      document.title = tituloOriginal.current
    }
    return () => {
      document.title = tituloOriginal.current
    }
  }, [corriendo, segundos])

  const elegir = (min) => {
    setMinutos(min)
    setSegundos(min * 60)
    setCorriendo(true)
  }

  const reiniciar = () => {
    setCorriendo(false)
    setMinutos(null)
    setSegundos(0)
  }

  const sinTiempo = minutos === null // todavía no se eligió duración
  const terminado = minutos !== null && segundos === 0

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-crema-50 ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700">
      <button
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-label={t('modal.timerAria')}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-extrabold text-stone-800 transition-colors hover:text-green-700 dark:text-stone-100 dark:hover:text-green-300"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="text-lg">
            ⏱️
          </span>
          {t('modal.timer')}
          {corriendo && (
            <span className="rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-black text-white tabular-nums shadow-sm">
              {formatear(segundos)}
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className={`text-stone-400 transition-transform dark:text-stone-500 ${
            abierto ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {abierto && (
        <div className="animate-fade-in border-t border-stone-200/70 px-4 pb-4 pt-3.5 dark:border-stone-700">
          {/* Terminado: 00:00 + aviso + volver a elegir */}
          {terminado ? (
            <div className="flex flex-col items-center gap-3">
              <p
                role="timer"
                aria-live="polite"
                className="font-display text-5xl font-black tabular-nums tracking-tight text-green-600 dark:text-lime-400"
              >
                {formatear(segundos)}
              </p>
              <p className="animate-pop rounded-full bg-green-100 px-4 py-1.5 text-sm font-extrabold text-green-800 dark:bg-green-900/50 dark:text-green-200">
                {t('modal.timerListo')}
              </p>
              <button
                onClick={reiniciar}
                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-500 active:scale-[0.98]"
              >
                {t('modal.timerReiniciar')}
              </button>
            </div>
          ) : sinTiempo ? (
            <>
              <p className="mb-3 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {t('modal.timerElegi')}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label={t('modal.timerAria')}
              >
                {PRESETS.map((min) => (
                  <button
                    key={min}
                    onClick={() => elegir(min)}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-stone-700 ring-1 ring-stone-300 transition-all hover:-translate-y-0.5 hover:bg-green-600 hover:text-white hover:ring-green-600 hover:shadow-md dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-600 dark:hover:bg-green-600 dark:hover:text-white"
                  >
                    {min} min
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p
                role="timer"
                aria-live={corriendo ? 'off' : 'polite'}
                className="font-display text-5xl font-black tabular-nums tracking-tight text-stone-900 dark:text-white"
              >
                {formatear(segundos)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setCorriendo((c) => !c)}
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-green-600/25 transition-all hover:bg-green-500 active:scale-[0.98]"
                >
                  {corriendo ? t('modal.timerPausar') : t('modal.timerReanudar')}
                </button>
                <button
                  onClick={reiniciar}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-stone-700 ring-1 ring-stone-300 transition-colors hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-600 dark:hover:bg-stone-700"
                >
                  {t('modal.timerReiniciar')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
