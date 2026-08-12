import { AppProvider, useApp } from './context/AppContext.jsx'
import Header from './components/Header.jsx'
import HomeView from './components/HomeView.jsx'
import ResultsView from './components/ResultsView.jsx'
import ShoppingListView from './components/ShoppingListView.jsx'
import FavoritesView from './components/FavoritesView.jsx'
import RecipeModal from './components/RecipeModal.jsx'
import { RECETAS } from './data/recetas.js'

function Footer() {
  const { t } = useApp()
  return (
    <footer className="mt-auto border-t border-stone-200/70 bg-crema-100/60 py-8 text-center dark:border-stone-800 dark:bg-stone-900/40">
      <p className="text-sm font-black text-stone-500 dark:text-stone-400">
        {t('footer.tagline')}
      </p>
      <p className="mt-1 text-xs font-semibold text-stone-400 dark:text-stone-500">
        {t('footer.recetas', { n: RECETAS.length })}
      </p>
    </footer>
  )
}

function Contenido() {
  const { vista, recetaActiva } = useApp()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {vista === 'inicio' && <HomeView />}
        {vista === 'resultados' && <ResultsView />}
        {vista === 'lista' && <ShoppingListView />}
        {vista === 'favoritos' && <FavoritesView />}
      </main>
      <Footer />
      {recetaActiva && <RecipeModal />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Contenido />
    </AppProvider>
  )
}
