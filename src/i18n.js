// ============================================================
// Traducciones de la interfaz (ES/EN).
// Las recetas, ingredientes, pasos y textos que se comparten
// por WhatsApp quedan en español (son contenido, no interfaz).
// ============================================================

export const TRADUCCIONES = {
  es: {
    // ---- Header ----
    'nav.inicio': 'Inicio',
    'nav.resultados': 'Recetas',
    'nav.lista': 'Lista de compras',
    'nav.favoritos': 'Favoritos',
    'header.tagline': 'con lo que tenés en casa',
    'header.irInicio': 'Ir al inicio',
    'header.modoClaro': 'Modo claro',
    'header.modoOscuro': 'Modo oscuro',
    'header.cambiarModo': 'Cambiar a modo oscuro',
    'header.cambiarModoClaro': 'Cambiar a modo claro',
    'header.cambiarIdioma': 'Cambiar idioma',
    'header.navAria': 'Navegación principal',

    // ---- Dificultad ----
    'dificultad.facil': 'Fácil',
    'dificultad.media': 'Media',
    'dificultad.dificil': 'Difícil',

    // ---- Tipos de comida ----
    'tipo.desayuno': 'Desayuno',
    'tipo.almuerzo': 'Almuerzo',
    'tipo.cena': 'Cena',
    'tipo.merienda': 'Merienda',
    'tipo.postre': 'Postre',

    // ---- Categorías de ingredientes ----
    'categoria.lacteos': 'Lácteos',
    'categoria.frutas': 'Frutas',
    'categoria.verduras': 'Verduras',
    'categoria.carnes': 'Carnes',
    'categoria.fiambres': 'Fiambres',
    'categoria.almacen': 'Almacén',
    'categoria.condimentos': 'Condimentos',

    // ---- Home ----
    'home.sugerenciasAria': 'Sugerencias de ingredientes',
    'home.agregarPropio': 'Agregar ingrediente propio',
    'home.ingrediente': 'Ingrediente',
    'home.ingredientesAria': 'Ingredientes agregados',
    'home.quitarAria': 'Quitar {nombre}',
    'home.rapidosAria': 'Agregar ingredientes rápido',
    'home.rapidosTitulo': 'Agregá ingredientes rápidos ✨',
    'home.masComunes': '⭐ Más comunes',
    'home.heroBadge': '🇦🇷 Cocina argentina y casera · {n} recetas',
    'home.queCocino': '¿Qué cocino',
    'home.hoy': 'hoy?',
    'home.heroP1':
      'Contanos qué tenés en la heladera y te decimos qué podés cocinar con eso.',
    'home.heroP2a': 'Paso a paso y un',
    'home.chefVirtual': 'chef virtual',
    'home.heroP2b': 'que te guía en vivo. 👨‍🍳',
    'home.queTenes': '¿Qué tenés? 🧺',
    'home.placeholder': 'Ej.: tomate, cebolla, huevos…',
    'home.agregar': '+ Agregar',
    'home.buscar': '🔍 Buscar recetas',
    'home.recetaLista': '{n} receta lista para hacer',
    'home.recetasListas': '{n} recetas listas para hacer',
    'home.vaciar': 'Vaciar lista',
    'home.mejores': '✨ Mejores opciones para tu heladera',
    'home.conIngredientes':
      'Con {n} ingrediente cargado: primero lo que podés hacer ya mismo.',
    'home.conIngredientesPlural':
      'Con {n} ingredientes cargados: primero lo que podés hacer ya mismo.',
    'home.verTodas': 'Ver todas →',
    'home.destacadas': '🍽️ Recetas destacadas',
    'home.destacadasSub':
      'Ideas para inspirarte: tocá una y probá el guía paso a paso.',

    // ---- Card ----
    'card.tenesTodo': '✅ ¡Tenés todo!',
    'card.verReceta': 'Ver receta: {nombre}',
    'card.porc': '{n} porc.',
    'card.teFaltan': '⚠️ Te faltan: {nombres}',
    'card.mas': '(+{n} más)',
    'card.lista': '🍳 Lista para cocinar',
    'card.agregarFav': 'Agregar {nombre} a favoritos',
    'card.quitarFav': 'Quitar {nombre} de favoritos',

    // ---- Modal ----
    'modal.menosPorciones': 'Menos porciones',
    'modal.masPorciones': 'Más porciones',
    'modal.porc': 'porc.',
    'modal.recetaAria': 'Receta: {nombre}',
    'modal.cerrarDetalle': 'Cerrar detalle de receta',
    'modal.cerrar': 'Cerrar',
    'modal.quitarFav': 'Quitar de favoritos',
    'modal.agregarFav': 'Agregar a favoritos',
    'modal.porcion': '👥 {n} porción',
    'modal.porciones': '👥 {n} porciones',
    'modal.tenesTodos': '✅ ¡Tenés todos los ingredientes!',
    'modal.teFaltan1': '⚠️ Te falta 1 ingrediente',
    'modal.teFaltan': '⚠️ Te faltan {n} ingredientes',
    'modal.guiame': 'Guíame paso a paso',
    'modal.guiameSub':
      'Te acompaño a cocinar y reemplazo lo que te falte',
    'modal.ajustar': '👨‍👩‍👧‍👦 Ajustar porciones',
    'modal.ajustarSub': 'Las cantidades se recalculan solas.',
    'modal.agregarFaltantes':
      '🛒 Agregar los {n} faltantes a la lista de compras',
    'modal.ingredientes': 'Ingredientes',
    'modal.paraPersona': '(para {n} persona)',
    'modal.paraPersonas': '(para {n} personas)',
    'modal.de': 'de',
    'modal.siempreEnCasa': 'siempre en casa',
    'modal.pasos': 'Pasos 👨‍🍳',
    'modal.compartir': '💬 Compartir por WhatsApp',

    // ---- Resultados ----
    'filtros.ariaTipo': 'Filtrar por tipo de comida',
    'filtros.ariaTiempo': 'Filtrar por tiempo',
    'filtros.ariaDificultad': 'Filtrar por dificultad',
    'filtros.tipo': 'Tipo',
    'filtros.tiempo': 'Tiempo',
    'filtros.dificultad': 'Dificultad',
    'filtros.todos': 'Todos',
    'filtros.todas': 'Todas',
    'filtros.soloFavs': 'Solo favoritos ❤️',
    'filtros.nResultados': '{n} receta con estos filtros',
    'filtros.nResultadosPlural': '{n} recetas con estos filtros',
    'resultados.vacioTitulo': 'Primero agregá ingredientes',
    'resultados.vacioSub':
      'Contanos qué tenés en la heladera y buscamos recetas para vos.',
    'resultados.irInicio': '🏠 Ir al inicio',
    'resultados.sinMatch':
      'No encontramos recetas con esos ingredientes',
    'resultados.sinMatchSub':
      'Probá agregar ingredientes básicos como papas, arroz, fideos, huevos o alguna verdura.',
    'resultados.agregarMas': '➕ Agregar más ingredientes',
    'resultados.titulo': 'Resultados para tu heladera',
    'resultados.sub':
      '{n} ingrediente cargado · primero lo que podés hacer ya mismo',
    'resultados.subPlural':
      '{n} ingredientes cargados · primero lo que podés hacer ya mismo',
    'resultados.tusIng': 'Tus ingredientes',
    'resultados.seccionCompleta': '✅ Podés hacer ahora',
    'resultados.seccionCompletaSub':
      'Recetas completas con lo que ya tenés.',
    'resultados.seccionUno': '😮‍💨 Te falta solo 1 ingrediente',
    'resultados.seccionUnoSub':
      'Casi listo, una comprita chica y a cocinar.',
    'resultados.seccionDos': '🛒 Te faltan 2 ingredientes',
    'resultados.seccionDosSub': 'Vale la pena el viaje al almacén.',
    'resultados.explorar': '🧭 Explorá más recetas',
    'resultados.explorarN': '({n} con más faltantes)',

    // ---- Favoritos ----
    'favs.vacio': 'Todavía no tenés favoritos',
    'favs.vacioSub':
      'Tocá el corazón 🤍 en cualquier receta para guardarla acá.',
    'favs.titulo': 'Tus recetas favoritas',
    'favs.n1': '{n} receta guardada',
    'favs.n': '{n} recetas guardadas',

    // ---- Lista de compras ----
    'lista.vacio': 'Tu lista de compras está vacía',
    'lista.vacioSubA':
      'Buscá recetas, y cuando a una le falten ingredientes, tocá',
    'lista.agregarALista': '"Agregar a la lista de compras"',
    'lista.verRecetas': '🔍 Ver recetas',
    'lista.titulo': '🛒 Lista de compras',
    'lista.pendiente': '{n} pendiente',
    'lista.pendientes': '{n} pendientes',
    'lista.comprado': '{n} comprado',
    'lista.comprados': '{n} comprados',
    'lista.quitarComprados': 'Quitar comprados',
    'lista.vaciar': 'Vaciar todo',
    'lista.eliminarAria': 'Eliminar {nombre} de la lista',
    'lista.yaTenes': 'Ya tenés ✓',

    // ---- Bot guía ----
    'bot.chefGuia': 'Chef Guía',
    'bot.escribiendo': 'escribiendo…',
    'bot.pasoDe': 'Paso {a} de {b}',
    'bot.enLinea': 'en línea · ayudándote a cocinar',
    'bot.cerrarAria': 'Cerrar el guía de cocina',
    'bot.conversacionAria': 'Conversación con el guía de cocina',
    'bot.placeholder': 'Escribí… ej: "no tengo tomate"',
    'bot.inputAria': 'Escribí tu mensaje al guía',
    'bot.enviarAria': 'Enviar mensaje',
    'bot.pasoLabel': 'Paso {a} de {b}',
    'bot.saludo': '¡Hola! 👨‍🍳 Soy tu guía para hacer *{receta}*.',
    'bot.tenesIng':
      'Tenés {a} de {b} ingredientes, faltan {c}.',
    'bot.listos': '¡Estás listo para cocinar! ¿Arrancamos? 🚀',
    'bot.podemosAvanzar':
      'Igual podemos avanzar: te voy contando cada paso y te aviso cómo reemplazar lo que falte. 🔁',
    'bot.chipEmpezar': '🚀 Empezar a cocinar',
    'bot.chipIngredientes': '📋 Ingredientes',
    'bot.chipFalta': '⚠️ Qué me falta',
    'bot.chipSustituciones': '🔁 Sustituciones',
    'bot.chipSiguiente': '▶️ Siguiente paso',
    'bot.chipAnterior': '◀️ Paso anterior',
    'bot.chipTermine': '✅ Terminé',
    'bot.chipDeNuevo': '🔄 Empezar de nuevo',
    'bot.ingredientesTitulo':
      '📋 *Ingredientes* (para {n} {pers}):',
    'bot.persona': 'persona',
    'bot.personas': 'personas',
    'bot.todosLosIng':
      '¡Tenés TODOS los ingredientes! 🎉 Nada que comprar, nada que reemplazar. ¡A cocinar! 👨‍🍳',
    'bot.faltan': '⚠️ Te faltan estos {n}:',
    'bot.tipFaltante':
      'Tip: podés improvisar con lo que tengas a mano, casi siempre funciona. 😉',
    'bot.noFaltaSust':
      '¡No te falta nada! 😄 No necesitás sustituciones. Igual, si algún día cambiás un ingrediente, decime y te doy ideas.',
    'bot.quedaRico': 'Vas a ver que el resultado queda igual de rico. 🙌',
    'bot.noEncontre':
      'No encontré un reemplazo directo entre lo que tenés ahora, pero acá van ideas:',
    'bot.experimentar':
      'La cocina es experimentación: si te falta algo, probá con el ingrediente más parecido que tengas. Seguro sale rico igual. 😉',
    'bot.sePuedeCon': '{ing}: se puede con {opciones}',
    'bot.tiempo': '⏱️ Esta receta lleva *{n} minutos* en total.',
    'bot.tiempo2':
      'Son {a} pasos, más o menos {b} minutos por paso. ¡Sin apuro, la cocina espera! 🍳',
    'bot.porcionesResp':
      '👥 Esta receta es para *{a} porciones* y la estás viendo en *{b}*.',
    'bot.porcionesResp2':
      'Todas las cantidades ya están recalculadas. Si querés cambiar el número, usá el ajustador arriba en la receta.',
    'bot.dificultad': '{emoji} Dificultad: *{nombre}*.',
    'bot.tipFacil': '¡Tranqui, no hay pierde! Ideal para arrancar. 😌',
    'bot.tipMedia':
      'Es media: requiere un poquito de atención pero cualquiera la puede hacer. 💪',
    'bot.tipDificil':
      'Es de las elaboradas: tomátelo con calma, prepará todo antes de arrancar. 🧑‍🍳',
    'bot.vamos': '¡Vamos! 🚀',
    'bot.antesDeArrancar1': 'Antes de arrancar: te falta 1 ingrediente.',
    'bot.antesDeArrancar':
      'Antes de arrancar: te faltan {n} ingredientes.',
    'bot.podesReemplazar': 'Podés reemplazarlos o hacerlo sin drama.',
    'bot.cuandoListo': 'Cuando estés listo, tocá "▶️ Siguiente paso".',
    'bot.felicitaciones':
      '¡Felicitaciones, terminaste todos los pasos! 🎉',
    'bot.disfruta':
      'Dejá reposar un minuto, serví y disfrutá tu {receta}. ¡Buen provecho! 🍽️',
    'bot.primerPaso': 'Estás en el primer paso, no hay más atrás. 😊',
    'bot.noArrancamos':
      'Todavía no arrancamos con los pasos. Decime "Empezar a cocinar" cuando quieras. 🚀',
    'bot.repito': 'Claro, te lo repito:',
    'bot.buenisimo':
      '¡Buenísimo! 💪 Espero que haya salido riquísimo.',
    'bot.tipSobro':
      'Tip: si te sobró, se guarda perfecto en la heladera. ¡Nos vemos en la próxima receta! 👋',
    'bot.ayuda': 'Puedo ayudarte con:',
    'bot.ayuda1': '🚀 "Empezar a cocinar" → te guío paso a paso',
    'bot.ayuda2': '📋 "Ingredientes" → te los listo con cantidades',
    'bot.ayuda3': '⚠️ "Qué me falta" → faltantes y consejos',
    'bot.ayuda4': '🔁 "Sustituciones" → reemplazos con lo que tenés',
    'bot.ayuda5': '⏱️ "Cuánto tarda" / 👥 "Porciones" / 🙂 "Dificultad"',
    'bot.ayuda6': 'Decime "no tengo X" y te propongo un reemplazo',
    'bot.noProblema':
      '¡No hay problema con {ing}! Podés usar *{reemplazo}* que ya tenés en casa. 🙌',
    'bot.paraReemplazar':
      'Para reemplazar {ing} podrías usar {opciones}. Si tenés alguno, avisame y seguimos. 😉',
    'bot.tranqui':
      'Tranqui, se puede hacer sin {ing} o con lo más parecido que tengas. La cocina es así: improvisar. 😄',
    'bot.holaDeNuevo':
      '¡Hola de nuevo! 👋 ¿Arrancamos con *{receta}* o querés que te cuente algo de la receta?',
    'bot.sobreIng':
      'Sobre {ing}: si no lo tenés, podés usar {opciones}. 😉',
    'bot.buenaPregunta':
      '¡Buena pregunta! Sobre {ing}: lo más fácil es reemplazarlo por el ingrediente más parecido que tengas en casa. ✨',
    'bot.noEntendi':
      'No entendí del todo, perdón 🙈. Podés tocarme una de estas opciones o escribirme algo como "no tengo tomate":',

    // ---- Footer ----
    'footer.tagline': '🍳 ¿Qué Cocino? — cociná con lo que tenés',
    'footer.recetas':
      '{n} recetas · Hecho con cariño, muchas papas 🥔 y un chef virtual 🤖',

    // ---- Imagen ----
    'imagen.alt': 'Foto de {nombre}',
  },

  en: {
    // ---- Header ----
    'nav.inicio': 'Home',
    'nav.resultados': 'Recipes',
    'nav.lista': 'Shopping list',
    'nav.favoritos': 'Favorites',
    'header.tagline': 'with what you have at home',
    'header.irInicio': 'Go home',
    'header.modoClaro': 'Light mode',
    'header.modoOscuro': 'Dark mode',
    'header.cambiarModo': 'Switch to dark mode',
    'header.cambiarModoClaro': 'Switch to light mode',
    'header.cambiarIdioma': 'Change language',
    'header.navAria': 'Main navigation',

    // ---- Difficulty ----
    'dificultad.facil': 'Easy',
    'dificultad.media': 'Medium',
    'dificultad.dificil': 'Hard',

    // ---- Meal types ----
    'tipo.desayuno': 'Breakfast',
    'tipo.almuerzo': 'Lunch',
    'tipo.cena': 'Dinner',
    'tipo.merienda': 'Snack',
    'tipo.postre': 'Dessert',

    // ---- Ingredient categories ----
    'categoria.lacteos': 'Dairy',
    'categoria.frutas': 'Fruits',
    'categoria.verduras': 'Vegetables',
    'categoria.carnes': 'Meats',
    'categoria.fiambres': 'Cold cuts',
    'categoria.almacen': 'Pantry',
    'categoria.condimentos': 'Condiments',

    // ---- Home ----
    'home.sugerenciasAria': 'Ingredient suggestions',
    'home.agregarPropio': 'Add your own ingredient',
    'home.ingrediente': 'Ingredient',
    'home.ingredientesAria': 'Added ingredients',
    'home.quitarAria': 'Remove {nombre}',
    'home.rapidosAria': 'Quick-add ingredients',
    'home.rapidosTitulo': 'Quick-add ingredients ✨',
    'home.masComunes': '⭐ Most common',
    'home.heroBadge': '🇦🇷 Argentine home cooking · {n} recipes',
    'home.queCocino': 'What should I cook',
    'home.hoy': 'today?',
    'home.heroP1':
      "Tell us what's in your fridge and we'll tell you what you can cook with it.",
    'home.heroP2a': 'Step by step with a',
    'home.chefVirtual': 'virtual chef',
    'home.heroP2b': 'guiding you live. 👨‍🍳',
    'home.queTenes': 'What do you have? 🧺',
    'home.placeholder': 'E.g. tomato, onion, eggs…',
    'home.agregar': '+ Add',
    'home.buscar': '🔍 Find recipes',
    'home.recetaLista': '{n} recipe ready to make',
    'home.recetasListas': '{n} recipes ready to make',
    'home.vaciar': 'Clear list',
    'home.mejores': '✨ Best options for your fridge',
    'home.conIngredientes':
      'With {n} ingredient loaded: first what you can make right now.',
    'home.conIngredientesPlural':
      'With {n} ingredients loaded: first what you can make right now.',
    'home.verTodas': 'See all →',
    'home.destacadas': '🍽️ Featured recipes',
    'home.destacadasSub':
      'Ideas to inspire you: tap one and try the step-by-step guide.',

    // ---- Card ----
    'card.tenesTodo': '✅ You have everything!',
    'card.verReceta': 'View recipe: {nombre}',
    'card.porc': '{n} serv.',
    'card.teFaltan': "⚠️ You're missing: {nombres}",
    'card.mas': '(+{n} more)',
    'card.lista': '🍳 Ready to cook',
    'card.agregarFav': 'Add {nombre} to favorites',
    'card.quitarFav': 'Remove {nombre} from favorites',

    // ---- Modal ----
    'modal.menosPorciones': 'Fewer servings',
    'modal.masPorciones': 'More servings',
    'modal.porc': 'serv.',
    'modal.recetaAria': 'Recipe: {nombre}',
    'modal.cerrarDetalle': 'Close recipe details',
    'modal.cerrar': 'Close',
    'modal.quitarFav': 'Remove from favorites',
    'modal.agregarFav': 'Add to favorites',
    'modal.porcion': '👥 {n} serving',
    'modal.porciones': '👥 {n} servings',
    'modal.tenesTodos': '✅ You have all the ingredients!',
    'modal.teFaltan1': "⚠️ You're missing 1 ingredient",
    'modal.teFaltan': "⚠️ You're missing {n} ingredients",
    'modal.guiame': 'Guide me step by step',
    'modal.guiameSub':
      "I'll cook with you and replace what you're missing",
    'modal.ajustar': '👨‍👩‍👧‍👦 Adjust servings',
    'modal.ajustarSub': 'Quantities recalculate automatically.',
    'modal.agregarFaltantes':
      '🛒 Add the {n} missing items to the shopping list',
    'modal.ingredientes': 'Ingredients',
    'modal.paraPersona': '(for {n} person)',
    'modal.paraPersonas': '(for {n} people)',
    'modal.de': 'of',
    'modal.siempreEnCasa': 'always at home',
    'modal.pasos': 'Steps 👨‍🍳',
    'modal.compartir': '💬 Share on WhatsApp',

    // ---- Results ----
    'filtros.ariaTipo': 'Filter by meal type',
    'filtros.ariaTiempo': 'Filter by time',
    'filtros.ariaDificultad': 'Filter by difficulty',
    'filtros.tipo': 'Type',
    'filtros.tiempo': 'Time',
    'filtros.dificultad': 'Difficulty',
    'filtros.todos': 'All',
    'filtros.todas': 'All',
    'filtros.soloFavs': 'Favorites only ❤️',
    'filtros.nResultados': '{n} recipe with these filters',
    'filtros.nResultadosPlural': '{n} recipes with these filters',
    'resultados.vacioTitulo': 'Add ingredients first',
    'resultados.vacioSub':
      "Tell us what's in your fridge and we'll find recipes for you.",
    'resultados.irInicio': '🏠 Go home',
    'resultados.sinMatch':
      "We couldn't find recipes with those ingredients",
    'resultados.sinMatchSub':
      'Try adding basic ingredients like potatoes, rice, pasta, eggs or a vegetable.',
    'resultados.agregarMas': '➕ Add more ingredients',
    'resultados.titulo': 'Results for your fridge',
    'resultados.sub':
      '{n} ingredient loaded · first what you can make right now',
    'resultados.subPlural':
      '{n} ingredients loaded · first what you can make right now',
    'resultados.tusIng': 'Your ingredients',
    'resultados.seccionCompleta': '✅ You can make now',
    'resultados.seccionCompletaSub':
      'Complete recipes with what you already have.',
    'resultados.seccionUno': "😮‍💨 You're missing just 1 ingredient",
    'resultados.seccionUnoSub':
      "Almost there, a quick shop and you're cooking.",
    'resultados.seccionDos': "🛒 You're missing 2 ingredients",
    'resultados.seccionDosSub': 'Worth the trip to the store.',
    'resultados.explorar': '🧭 Explore more recipes',
    'resultados.explorarN': '({n} with more missing)',

    // ---- Favorites ----
    'favs.vacio': "You don't have favorites yet",
    'favs.vacioSub':
      'Tap the heart 🤍 on any recipe to save it here.',
    'favs.titulo': 'Your favorite recipes',
    'favs.n1': '{n} saved recipe',
    'favs.n': '{n} saved recipes',

    // ---- Shopping list ----
    'lista.vacio': 'Your shopping list is empty',
    'lista.vacioSubA':
      'Find recipes, and when one is missing ingredients, tap',
    'lista.agregarALista': '"Add to shopping list"',
    'lista.verRecetas': '🔍 See recipes',
    'lista.titulo': '🛒 Shopping list',
    'lista.pendiente': '{n} pending',
    'lista.pendientes': '{n} pending',
    'lista.comprado': '{n} bought',
    'lista.comprados': '{n} bought',
    'lista.quitarComprados': 'Remove bought',
    'lista.vaciar': 'Clear all',
    'lista.eliminarAria': 'Remove {nombre} from the list',
    'lista.yaTenes': 'Already have ✓',

    // ---- Guide bot ----
    'bot.chefGuia': 'Chef Guide',
    'bot.escribiendo': 'typing…',
    'bot.pasoDe': 'Step {a} of {b}',
    'bot.enLinea': 'online · helping you cook',
    'bot.cerrarAria': 'Close the cooking guide',
    'bot.conversacionAria': 'Conversation with the cooking guide',
    'bot.placeholder': 'Type… e.g. "I don\'t have tomato"',
    'bot.inputAria': 'Type your message to the guide',
    'bot.enviarAria': 'Send message',
    'bot.pasoLabel': 'Step {a} of {b}',
    'bot.saludo': "Hi! 👨‍🍳 I'm your guide to make *{receta}*.",
    'bot.tenesIng': 'You have {a} of {b} ingredients, {c} missing.',
    'bot.listos': "You're all set to cook! Shall we start? 🚀",
    'bot.podemosAvanzar':
      "We can still go ahead: I'll walk you through each step and tell you how to replace what's missing. 🔁",
    'bot.chipEmpezar': '🚀 Start cooking',
    'bot.chipIngredientes': '📋 Ingredients',
    'bot.chipFalta': '⚠️ What am I missing',
    'bot.chipSustituciones': '🔁 Substitutions',
    'bot.chipSiguiente': '▶️ Next step',
    'bot.chipAnterior': '◀️ Previous step',
    'bot.chipTermine': "✅ I'm done",
    'bot.chipDeNuevo': '🔄 Start over',
    'bot.ingredientesTitulo': '📋 *Ingredients* (for {n} {pers}):',
    'bot.persona': 'person',
    'bot.personas': 'people',
    'bot.todosLosIng':
      "You have ALL the ingredients! 🎉 Nothing to buy, nothing to replace. Let's cook! 👨‍🍳",
    'bot.faltan': "⚠️ You're missing these {n}:",
    'bot.tipFaltante':
      'Tip: you can improvise with whatever you have on hand, it almost always works. 😉',
    'bot.noFaltaSust':
      "You're not missing anything! 😄 You don't need substitutions. Still, if you ever swap an ingredient, tell me and I'll give you ideas.",
    'bot.quedaRico': "You'll see the result tastes just as good. 🙌",
    'bot.noEncontre':
      "I couldn't find a direct replacement among what you have, but here are some ideas:",
    'bot.experimentar':
      "Cooking is experimentation: if you're missing something, try the closest ingredient you have. It'll turn out great anyway. 😉",
    'bot.sePuedeCon': '{ing}: you can use {opciones}',
    'bot.tiempo': '⏱️ This recipe takes *{n} minutes* in total.',
    'bot.tiempo2':
      'It has {a} steps, about {b} minutes per step. No rush, the kitchen will wait! 🍳',
    'bot.porcionesResp':
      '👥 This recipe makes *{a} servings* and you are viewing *{b}*.',
    'bot.porcionesResp2':
      'All quantities are already recalculated. To change the number, use the adjuster above in the recipe.',
    'bot.dificultad': '{emoji} Difficulty: *{nombre}*.',
    'bot.tipFacil': 'Easy peasy! Great to start with. 😌',
    'bot.tipMedia':
      "It's medium: needs a bit of attention but anyone can do it. 💪",
    'bot.tipDificil':
      "It's elaborate: take it slow, prep everything before you start. 🧑‍🍳",
    'bot.vamos': "Let's go! 🚀",
    'bot.antesDeArrancar1': "Before we start: you're missing 1 ingredient.",
    'bot.antesDeArrancar':
      "Before we start: you're missing {n} ingredients.",
    'bot.podesReemplazar':
      'You can replace them or do it without them.',
    'bot.cuandoListo': 'When you are ready, tap "▶️ Next step".',
    'bot.felicitaciones':
      'Congratulations, you finished all the steps! 🎉',
    'bot.disfruta':
      'Let it rest a minute, serve and enjoy your {receta}. Bon appétit! 🍽️',
    'bot.primerPaso':
      "You're on the first step, there's no going back. 😊",
    'bot.noArrancamos':
      'We have not started the steps yet. Say "Start cooking" when you are ready. 🚀',
    'bot.repito': 'Sure, let me repeat it:',
    'bot.buenisimo': 'Awesome! 💪 Hope it turned out delicious.',
    'bot.tipSobro':
      "Tip: if there are leftovers, it keeps perfectly in the fridge. See you on the next recipe! 👋",
    'bot.ayuda': 'I can help you with:',
    'bot.ayuda1': "🚀 \"Start cooking\" → I'll guide you step by step",
    'bot.ayuda2': '📋 "Ingredients" → I will list them with quantities',
    'bot.ayuda3': '⚠️ "What am I missing" → missing items and tips',
    'bot.ayuda4': '🔁 "Substitutions" → replacements with what you have',
    'bot.ayuda5': '⏱️ "How long" / 👥 "Servings" / 🙂 "Difficulty"',
    'bot.ayuda6': 'Tell me "I don\'t have X" and I will suggest a replacement',
    'bot.noProblema':
      'No problem with {ing}! You can use *{reemplazo}* that you already have at home. 🙌',
    'bot.paraReemplazar':
      'To replace {ing} you could use {opciones}. If you have any, let me know and we will continue. 😉',
    'bot.tranqui':
      "Don't worry, you can make it without {ing} or with the closest thing you have. That's cooking: improvise. 😄",
    'bot.holaDeNuevo':
      'Hi again! 👋 Shall we start with *{receta}* or would you like me to tell you something about the recipe?',
    'bot.sobreIng':
      'About {ing}: if you do not have it, you can use {opciones}. 😉',
    'bot.buenaPregunta':
      'Good question! About {ing}: the easiest is to replace it with the closest ingredient you have at home. ✨',
    'bot.noEntendi':
      'I did not quite understand, sorry 🙈. You can tap one of these options or type something like "I don\'t have tomato":',

    // ---- Footer ----
    'footer.tagline': '🍳 ¿Qué Cocino? — cook with what you have',
    'footer.recetas':
      '{n} recipes · Made with love, lots of potatoes 🥔 and a virtual chef 🤖',

    // ---- Image ----
    'imagen.alt': 'Photo of {nombre}',
  },
}

/**
 * Traduce una clave al idioma indicado.
 * @param {string} idioma  'es' | 'en'
 * @param {string} clave   clave del diccionario
 * @param {object} [params]  valores para {placeholders}
 * @param {string} [fallback]  texto si la clave no existe
 */
export function traducir(idioma, clave, params, fallback) {
  const texto =
    TRADUCCIONES[idioma]?.[clave] ??
    TRADUCCIONES.es[clave] ??
    fallback ??
    clave
  if (!params) return texto
  // Usamos función como reemplazo para que los valores con '$' no se
  // interpreten como patrones especiales de String.replaceAll.
  return Object.entries(params).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, () => String(v)),
    texto
  )
}
