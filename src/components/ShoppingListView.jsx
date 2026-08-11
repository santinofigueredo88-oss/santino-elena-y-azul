import { useApp } from '../context/AppContext.jsx'

export default function ShoppingListView() {
  const { listaCompras, toggleItemLista, quitarItemLista, vaciarLista, quitarComprados, irA } = useApp()

  const pendientes = listaCompras.filter((i) => !i.checked)
  const comprados = listaCompras.filter((i) => i.checked)

  if (listaCompras.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center animate-fade-up">
        <span className="text-7xl" role="img" aria-hidden="true">🛒</span>
        <h2 className="mt-4 text-3xl font-black text-stone-900 dark:text-white">
          Tu lista de compras está vacía
        </h2>
        <p className="mt-2 text-lg font-semibold text-stone-500 dark:text-stone-400">
          Buscá recetas, y cuando a una le falten ingredientes, tocá{" "}
          <strong className="text-stone-700 dark:text-stone-200">"Agregar a la lista de compras"</strong>.
        </p>
        <button onClick={() => irA('resultados')} className="btn-primary mt-6">
          🔍 Ver recetas
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-stone-900 dark:text-white">
            🛒 Lista de compras
          </h1>
          <p className="mt-1 text-sm font-semibold text-stone-500 dark:text-stone-400">
            {pendientes.length} pendiente{pendientes.length === 1 ? '' : 's'} · {comprados.length} comprado{comprados.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex gap-2">
          {comprados.length > 0 && (
            <button
              onClick={quitarComprados}
              className="rounded-xl bg-green-100 px-4 py-2.5 text-sm font-extrabold text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900"
            >
              Quitar comprados
            </button>
          )}
          <button
            onClick={vaciarLista}
            className="rounded-xl bg-red-100 px-4 py-2.5 text-sm font-extrabold text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900"
          >
            Vaciar todo
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {pendientes.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-stone-200/60 transition-colors hover:bg-crema-50 dark:bg-stone-900 dark:ring-stone-800 dark:hover:bg-stone-800"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItemLista(item.id)}
              className="h-6 w-6 accent-green-600"
            />
            <span className="flex-1 text-base font-bold text-stone-800 dark:text-stone-100">
              {item.nombre}
            </span>
            <button
              onClick={() => quitarItemLista(item.id)}
              aria-label={`Eliminar ${item.nombre} de la lista`}
              className="grid h-9 w-9 place-items-center rounded-full text-stone-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900"
            >
              🗑️
            </button>
          </label>
        ))}
      </div>

      {comprados.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-black uppercase tracking-wider text-stone-400">
            Ya tenés ✓
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {comprados.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-stone-50 px-4 py-3 opacity-60 ring-1 ring-stone-200/60 dark:bg-stone-900 dark:ring-stone-800"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItemLista(item.id)}
                  className="h-6 w-6 accent-green-600"
                />
                <span className="flex-1 text-base font-bold text-stone-500 line-through dark:text-stone-400">
                  {item.nombre}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
