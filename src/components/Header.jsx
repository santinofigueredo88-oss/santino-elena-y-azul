import { useApp } from '../context/AppContext.jsx'

const NAV = [
  { id: 'inicio', labelKey: 'nav.inicio', emoji: '🏠' },
  { id: 'resultados', labelKey: 'nav.resultados', emoji: '🍲' },
  { id: 'lista', labelKey: 'nav.lista', emoji: '🛒' },
  { id: 'favoritos', labelKey: 'nav.favoritos', emoji: '❤️' },
]

function contadorPara(vista, ctx) {
  if (vista === 'lista') return ctx.listaCompras.filter((i) => !i.checked).length
  if (vista === 'favoritos') return ctx.favoritos.length
  return null
}

export default function Header() {
  const {
    vista,
    irA,
    tema,
    toggleTema,
    listaCompras,
    favoritos,
    t,
    idioma,
    cambiarIdioma,
  } = useApp()
  const oscuro = tema === 'oscuro'

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-crema-50/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <button
          onClick={() => irA('inicio')}
          className="flex items-center gap-2 text-left"
          aria-label={t('header.irInicio')}
        >
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-green-500 to-lime-600 text-2xl shadow-md shadow-green-500/30 ring-2 ring-white/60 dark:ring-white/10"
            role="img"
            aria-hidden="true"
          >
            👨‍🍳
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-black tracking-tight text-stone-900 dark:text-white">
              ¿Qué Cocino?
            </span>
            <span className="block text-xs font-semibold text-stone-500 dark:text-stone-400">
              {t('header.tagline')}
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-1 overflow-x-auto sm:gap-2" aria-label={t('header.navAria')}>
          {NAV.map((item) => {
            const activo = vista === item.id
            const conteo = contadorPara(item.id, { listaCompras, favoritos })
            return (
              <button
                key={item.id}
                onClick={() => irA(item.id)}
                aria-current={activo ? 'page' : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                  activo
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/25'
                    : 'text-stone-600 hover:bg-green-100 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                <span aria-hidden="true">{item.emoji}</span>
                <span>{t(item.labelKey)}</span>
                {conteo > 0 && (
                  <span
                    className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-black ${
                      activo ? 'bg-white/25 text-white' : 'bg-green-600 text-white'
                    }`}
                  >
                    {conteo}
                  </span>
                )}
              </button>
            )
          })}

          {/* Selector de idioma */}
          <div
            role="group"
            aria-label={t('header.cambiarIdioma')}
            className="ml-1 flex items-center gap-0.5 rounded-xl bg-stone-100 p-1 dark:bg-stone-800"
          >
            {['es', 'en'].map((idi) => {
              const activo = idioma === idi
              return (
                <button
                  key={idi}
                  onClick={() => cambiarIdioma(idi)}
                  aria-pressed={activo}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                    activo
                      ? 'bg-green-600 text-white shadow-sm shadow-green-600/30'
                      : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {idi}
                </button>
              )
            })}
          </div>

          {/* Modo oscuro */}
          <button
            onClick={toggleTema}
            aria-label={oscuro ? t('header.cambiarModoClaro') : t('header.cambiarModo')}
            title={oscuro ? t('header.modoClaro') : t('header.modoOscuro')}
            className="ml-1 grid h-11 w-11 place-items-center rounded-xl bg-stone-100 text-xl transition-all hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700"
          >
            {oscuro ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  )
}
