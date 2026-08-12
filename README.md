# 🍳 ¿Qué Cocino?

Web app que te dice **qué cocinar con los ingredientes que tenés en la heladera**.
Cargás lo que tenés, y la app cruza tu lista contra una base local de recetas
caseras de la cocina argentina, priorizando las que podés hacer **100% completas**
y después las que te faltan 1 o 2 ingredientes.

## 🚀 Correr el proyecto

```bash
npm install
npm run dev
```

Abrí la URL que muestra Vite (por defecto http://localhost:5173).

Para build de producción:

```bash
npm run build
npm run preview
```

## ✨ Funcionalidades

- **Carga de ingredientes**: input con autocompletado (sin problemas de
  mayúsculas, tildes, singular/plural o sinónimos: "tomates" → Tomate),
  navegación por **teclado** (↑/↓ para elegir, Enter para agregar, Esc para
  cerrar), podés **agregar varios a la vez** separados por comas
  ("papa, tomate, cebolla"), botones rápidos agrupados por categoría (Lácteos,
  Frutas, Verduras, Carnes, Fiambres, Almacén, Condimentos) y chips removibles.
- **Link compartible con tus ingredientes**: con un toque copiás (o mandás por
  WhatsApp) un link tipo `?ing=papa,tomate`; quien lo abre ve la app con esos
  ingredientes ya cargados y directo a los resultados.
- **Motor de match**: recetas 100% primero, luego las que faltan 1 y 2
  ingredientes (menos faltantes = más arriba), y una sección colapsada
  "Explorá más recetas" para el resto. Los condimentos básicos (sal, aceite,
  agua, pimienta, etc.) se asumen siempre disponibles y no cuentan como faltantes.
- **Fotos reales en cada receta**: las 127 recetas tienen foto real del plato
  (Wikimedia/Wikipedia para las argentinas y TheMealDB para las
  internacionales, URLs verificadas en `src/data/imagenes.js`), con un
  fallback ilustrado (gradiente + emoji) si la imagen no carga.
- **🌍 Cocinas del mundo**: sección en el inicio con 5 cocinas
  internacionales (🇮🇹 Italia, 🇲🇽 México, 🇯🇵 Japón, 🇪🇸 España y
  🇬🇧 Reino Unido) con 29 recetas típicas, cada una con su bandera en las
  tarjetas y filtro por país en los resultados.
- **🤖 Chef Guía (bot paso a paso)**: en cada receta, un chat que te guía
  paso a paso para cocinar. Detecta los ingredientes que tenés, avisa cuáles
  faltan, y **sugiere sustituciones con lo que ya tenés en casa**
  (ej: "no tengo papa" → "usá batata"). Incluye respuesta rápida por chips,
  progreso de pasos, y entendé frases como "siguiente", "atrás",
  "ingredientes", "cuánto tarda", "paso 3", "no tengo X".
- **Resultados con filtros**: por tipo de comida, tiempo de preparación y dificultad.
- **Detalle de receta**: modal con foto hero, ingredientes (marca en verde ✅ lo
  que tenés y en rojo ❌ lo que te falta), **ajustador de porciones** que
  recalcula cantidades, pasos numerados, **imprimir / guardar en PDF** 🖨️ con
  una vista de impresión limpia y un **temporizador de cocina** ⏱️ (presets,
  pausa, reinicio y alarma sonora).
- **Receta al azar**: botón 🎲 que abre una receta sorpresa al instante.
- **Lista de compras**: agregá de un toque los faltantes de una receta, con checklist.
- **Favoritos** ❤️ y **compartir por WhatsApp** 💬 (texto con ingredientes y pasos).
- **Modo oscuro** 🌙 persistente y diseño responsive cálido, con tipografía
  display (Fraunces), fotos con zoom al hover y micro-interacciones.

## 🖼️ Regenerar las fotos

```bash
node scripts/generar-imagenes.mjs
```

Verifica candidatos de Unsplash por receta y regenera `src/data/imagenes.js`
con las primeras URLs que respondan 200.

## 🧪 Tests

```bash
node scripts/smoke-test.mjs
```

Valida integridad de datos, matching, fotos y sustituciones.

## 🗂️ Estructura

```
src/
├── data/
│   ├── ingredientes.js   # Base de ingredientes (categorías, sinónimos, básicos)
│   ├── recetas.js        # 98 recetas caseras argentinas
│   └── recetas-internacionales.js  # 29 recetas de otros países
├── lib/
│   ├── matching.js       # Motor de match (faltantes, clasificación, filtros)
│   ├── normalizar.js     # Normalización de texto y resolución de sinónimos
│   ├── share.js          # Texto para WhatsApp y escala de porciones
│   └── storage.js        # Helpers de localStorage
├── context/
│   └── AppContext.jsx    # Estado global (ingredientes, favoritos, lista, tema)
├── components/
│   ├── Header.jsx
│   ├── HomeView.jsx      # Carga de ingredientes
│   ├── ResultsView.jsx   # Resultados con filtros
│   ├── RecipeCard.jsx    # Tarjeta reutilizable
│   ├── RecipeModal.jsx   # Detalle de receta
│   ├── CocinaTimer.jsx   # Temporizador de cocina
│   ├── ShoppingListView.jsx
│   └── FavoritesView.jsx
└── App.jsx
```

## ☁️ Despliegue en Vercel

Proyecto 100% estático (sin backend): conectá el repo en
[vercel.com](https://vercel.com), el framework se detecta solo (Vite).
Persistencia local vía `localStorage`.

## 🔧 Cómo agregar recetas

En `src/data/recetas.js`, cada receta es un objeto con `id`, `nombre`,
`categoria` (desayuno | almuerzo | cena | merienda | postre), `tiempoMinutos`,
`porciones`, `dificultad` (facil | media | dificil), `emoji`, `ingredientes`
(array de `{ id, cantidad, unidad }` referenciando ids de `ingredientes.js`)
y `pasos` (array de strings). Los ingredientes nuevos hay que sumarlos también
a `ingredientes.js` para que funcionen el autocompletado y el match.

Para recetas de otros países, sumarlas a `src/data/recetas-internacionales.js`
con el campo `pais` (italia | mexico | japon | espana | reino-unido): se
integran solas al catálogo, al filtro por país y a la sección "Cocinas del
mundo". Las fotos se regeneran con `node scripts/generar-imagenes-reales.mjs`
(TheMealDB para internacionales, Wikipedia para argentinas).
