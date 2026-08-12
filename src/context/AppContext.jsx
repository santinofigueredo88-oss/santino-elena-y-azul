import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { leerStorage, escribirStorage } from '../lib/storage.js'
import { resolverIngrediente, yaExiste } from '../lib/normalizar.js'
import { nombreDeIngrediente } from '../data/ingredientes.js'
import { traducir } from '../i18n.js'

const CLAVES = {
  ingredientes: 'que-cocino:ingredientes',
  favoritos: 'que-cocino:favoritos',
  lista: 'que-cocino:lista',
  tema: 'que-cocino:tema',
  idioma: 'que-cocino:idioma',
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Ingredientes del usuario: [{ id, nombre }]
  const [ingredientes, setIngredientes] = useState(() =>
    leerStorage(CLAVES.ingredientes, [])
  )
  // Favoritos: array de ids de recetas
  const [favoritos, setFavoritos] = useState(() =>
    leerStorage(CLAVES.favoritos, [])
  )
  // Lista de compras: [{ id, nombre, checked }]
  const [listaCompras, setListaCompras] = useState(() =>
    leerStorage(CLAVES.lista, [])
  )
  // Tema: 'claro' | 'oscuro'. Sin preferencia guardada, sigue al sistema.
  const [tema, setTema] = useState(() => {
    const guardado = leerStorage(CLAVES.tema, null)
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
    return typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'oscuro'
      : 'claro'
  })
  // Idioma: 'es' | 'en'
  const [idioma, setIdioma] = useState(() =>
    leerStorage(CLAVES.idioma, 'es')
  )
  // Navegación
  const [vista, setVista] = useState('inicio') // inicio | resultados | lista | favoritos
  const [recetaActiva, setRecetaActiva] = useState(null) // modal de detalle

  // ---------- Persistencia ----------
  useEffect(() => escribirStorage(CLAVES.ingredientes, ingredientes), [ingredientes])
  useEffect(() => escribirStorage(CLAVES.favoritos, favoritos), [favoritos])
  useEffect(() => escribirStorage(CLAVES.lista, listaCompras), [listaCompras])
  useEffect(() => escribirStorage(CLAVES.tema, tema), [tema])
  useEffect(() => escribirStorage(CLAVES.idioma, idioma), [idioma])

  // ---------- Tema ----------
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', tema === 'oscuro')
    // Barra del navegador (mobile) acorde al tema
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', tema === 'oscuro' ? '#0c0a09' : '#16a34a')
    }
  }, [tema])

  const toggleTema = useCallback(() => {
    // Anima la transición de colores solo durante el cambio
    const root = document.documentElement
    root.classList.add('tema-animado')
    setTimeout(() => root.classList.remove('tema-animado'), 400)
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))
  }, [])

  // ---------- Idioma ----------
  useEffect(() => {
    document.documentElement.lang = idioma === 'en' ? 'en' : 'es'
  }, [idioma])

  const cambiarIdioma = useCallback((nuevo) => setIdioma(nuevo), [])

  // Traducción: t('clave', { params }, fallback)
  const t = useCallback(
    (clave, params, fallback) => traducir(idioma, clave, params, fallback),
    [idioma]
  )

  // Plural: tN('claveSingular', 'clavePlural', n, params)
  const tN = useCallback(
    (singular, plural, n, params) =>
      traducir(idioma, n === 1 ? singular : plural, { ...params, n }),
    [idioma]
  )

  // ---------- Ingredientes ----------
  const agregarIngrediente = useCallback(
    (texto) => {
      const resuelto = resolverIngrediente(texto)
      if (!resuelto) return false
      setIngredientes((prev) =>
        yaExiste(prev, resuelto.id) ? prev : [...prev, resuelto]
      )
      return true
    },
    []
  )

  const quitarIngrediente = useCallback((id) => {
    setIngredientes((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const limpiarIngredientes = useCallback(() => setIngredientes([]), [])

  const idsIngredientes = useMemo(
    () => ingredientes.map((i) => i.id),
    [ingredientes]
  )

  // ---------- Favoritos ----------
  const esFavorito = useCallback(
    (id) => favoritos.includes(id),
    [favoritos]
  )

  const toggleFavorito = useCallback((id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  // ---------- Lista de compras ----------
  const agregarFaltantesALista = useCallback((receta, faltantes) => {
    if (!faltantes || faltantes.length === 0) return
    setListaCompras((prev) => {
      const nuevos = faltantes
        .filter((id) => !prev.some((item) => item.id === id))
        .map((id) => ({ id, nombre: nombreDeIngrediente(id), checked: false }))
      return [...prev, ...nuevos]
    })
  }, [])

  const toggleItemLista = useCallback((id) => {
    setListaCompras((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }, [])

  const quitarItemLista = useCallback((id) => {
    setListaCompras((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const vaciarLista = useCallback(() => setListaCompras([]), [])

  const quitarComprados = useCallback(() => {
    setListaCompras((prev) => prev.filter((item) => !item.checked))
  }, [])

  // ---------- Navegación ----------
  const irA = useCallback((destino) => {
    setVista(destino)
    setRecetaActiva(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const abrirReceta = useCallback((receta) => {
    setRecetaActiva(receta)
  }, [])

  const cerrarReceta = useCallback(() => setRecetaActiva(null), [])

  const value = useMemo(
    () => ({
      ingredientes,
      idsIngredientes,
      agregarIngrediente,
      quitarIngrediente,
      limpiarIngredientes,
      favoritos,
      esFavorito,
      toggleFavorito,
      listaCompras,
      agregarFaltantesALista,
      toggleItemLista,
      quitarItemLista,
      vaciarLista,
      quitarComprados,
      tema,
      toggleTema,
      idioma,
      cambiarIdioma,
      t,
      tN,
      vista,
      irA,
      recetaActiva,
      abrirReceta,
      cerrarReceta,
    }),
    [
      ingredientes,
      idsIngredientes,
      agregarIngrediente,
      quitarIngrediente,
      limpiarIngredientes,
      favoritos,
      esFavorito,
      toggleFavorito,
      listaCompras,
      agregarFaltantesALista,
      toggleItemLista,
      quitarItemLista,
      vaciarLista,
      quitarComprados,
      tema,
      toggleTema,
      idioma,
      cambiarIdioma,
      t,
      tN,
      vista,
      irA,
      recetaActiva,
      abrirReceta,
      cerrarReceta,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
