// ============================================================
// Base de datos de ingredientes (para autocompletado y matching)
// ============================================================

export const CATEGORIAS = [
  { id: 'lacteos', nombre: 'Lácteos', emoji: '🧀' },
  { id: 'frutas', nombre: 'Frutas', emoji: '🍎' },
  { id: 'verduras', nombre: 'Verduras', emoji: '🥕' },
  { id: 'carnes', nombre: 'Carnes', emoji: '🥩' },
  { id: 'fiambres', nombre: 'Fiambres', emoji: '🥓' },
  { id: 'almacen', nombre: 'Almacén', emoji: '🍚' },
  { id: 'condimentos', nombre: 'Condimentos', emoji: '🧂' },
]

export const CATEGORIA_POR_ID = Object.fromEntries(
  CATEGORIAS.map((c) => [c.id, c])
)

export const INGREDIENTES = [
  // ---------- Lácteos ----------
  { id: 'leche', nombre: 'Leche', categoria: 'lacteos', sinonimos: ['leches'] },
  { id: 'manteca', nombre: 'Manteca', categoria: 'lacteos', sinonimos: ['mantequilla'] },
  { id: 'queso', nombre: 'Queso', categoria: 'lacteos', sinonimos: ['quesos', 'queso semiduro', 'queso cremoso', 'queso fresco'] },
  { id: 'mozzarella', nombre: 'Mozzarella', categoria: 'lacteos', sinonimos: ['queso muzzarella', 'muzzarella'] },
  { id: 'parmesano', nombre: 'Queso rallado', categoria: 'lacteos', sinonimos: ['parmesano', 'queso parmesano', 'rallado'] },
  { id: 'queso-crema', nombre: 'Queso crema', categoria: 'lacteos', sinonimos: ['queso untable', 'philadelphia'] },
  { id: 'ricota', nombre: 'Ricota', categoria: 'lacteos', sinonimos: ['requesón'] },
  { id: 'crema', nombre: 'Crema de leche', categoria: 'lacteos', sinonimos: ['crema', 'crema para batir', 'nata'] },
  { id: 'yogur', nombre: 'Yogur', categoria: 'lacteos', sinonimos: ['yogurt', 'yogures'] },
  { id: 'dulce-de-leche', nombre: 'Dulce de leche', categoria: 'lacteos', sinonimos: ['dulce de leche repostero'] },

  // ---------- Frutas ----------
  { id: 'banana', nombre: 'Banana', categoria: 'frutas', sinonimos: ['bananas', 'plátano', 'platano', 'cambur'] },
  { id: 'manzana', nombre: 'Manzana', categoria: 'frutas', sinonimos: ['manzanas'] },
  { id: 'frutilla', nombre: 'Frutilla', categoria: 'frutas', sinonimos: ['frutillas', 'fresa', 'fresas'] },
  { id: 'limon', nombre: 'Limón', categoria: 'frutas', sinonimos: ['limones'] },
  { id: 'naranja', nombre: 'Naranja', categoria: 'frutas', sinonimos: ['naranjas'] },
  { id: 'pera', nombre: 'Pera', categoria: 'frutas', sinonimos: ['peras'] },
  { id: 'durazno', nombre: 'Durazno', categoria: 'frutas', sinonimos: ['duraznos', 'melocotón', 'melocoton'] },
  { id: 'uva', nombre: 'Uva', categoria: 'frutas', sinonimos: ['uvas'] },
  { id: 'sandia', nombre: 'Sandía', categoria: 'frutas', sinonimos: ['sandias', 'melón de agua'] },
  { id: 'melon', nombre: 'Melón', categoria: 'frutas', sinonimos: ['melones'] },

  // ---------- Verduras ----------
  { id: 'tomate', nombre: 'Tomate', categoria: 'verduras', sinonimos: ['tomates', 'tomate redondo', 'tomate perita'] },
  { id: 'cebolla', nombre: 'Cebolla', categoria: 'verduras', sinonimos: ['cebollas', 'cebolla morada', 'cebolla blanca'] },
  { id: 'papa', nombre: 'Papa', categoria: 'verduras', sinonimos: ['papas', 'patata', 'patatas'] },
  { id: 'zanahoria', nombre: 'Zanahoria', categoria: 'verduras', sinonimos: ['zanahorias'] },
  { id: 'lechuga', nombre: 'Lechuga', categoria: 'verduras', sinonimos: ['lechugas'] },
  { id: 'acelga', nombre: 'Acelga', categoria: 'verduras', sinonimos: ['acelgas'] },
  { id: 'espinaca', nombre: 'Espinaca', categoria: 'verduras', sinonimos: ['espinacas'] },
  { id: 'zapallito', nombre: 'Zapallito', categoria: 'verduras', sinonimos: ['zapallitos', 'zucchini', 'calabacín', 'calabacin'] },
  { id: 'calabaza', nombre: 'Calabaza', categoria: 'verduras', sinonimos: ['zapallo', 'zapallos', 'anco'] },
  { id: 'berenjena', nombre: 'Berenjena', categoria: 'verduras', sinonimos: ['berenjenas'] },
  { id: 'morron', nombre: 'Morrón', categoria: 'verduras', sinonimos: ['morrones', 'pimiento', 'pimientos', 'pimiento morrón'] },
  { id: 'ajo', nombre: 'Ajo', categoria: 'verduras', sinonimos: ['ajos', 'diente de ajo'] },
  { id: 'choclo', nombre: 'Choclo', categoria: 'verduras', sinonimos: ['choclos', 'maíz', 'choclo en lata'] },
  { id: 'arvejas', nombre: 'Arvejas', categoria: 'verduras', sinonimos: ['arveja', 'guisantes', 'chícharos', 'arvejas en lata'] },
  { id: 'verdeo', nombre: 'Cebolla de verdeo', categoria: 'verduras', sinonimos: ['cebolleta', 'cebollín'] },
  { id: 'perejil', nombre: 'Perejil', categoria: 'verduras', sinonimos: ['perejil fresco'] },
  { id: 'apio', nombre: 'Apio', categoria: 'verduras', sinonimos: ['apios'] },
  { id: 'puerro', nombre: 'Puerro', categoria: 'verduras', sinonimos: ['puerros', 'poro'] },
  { id: 'remolacha', nombre: 'Remolacha', categoria: 'verduras', sinonimos: ['remolachas', 'betabel', 'betarraga'] },
  { id: 'palta', nombre: 'Palta', categoria: 'verduras', sinonimos: ['paltas', 'aguacate', 'aguacates'] },
  { id: 'pepino', nombre: 'Pepino', categoria: 'verduras', sinonimos: ['pepinos'] },
  { id: 'brocoli', nombre: 'Brócoli', categoria: 'verduras', sinonimos: ['brocolis', 'brécol'] },
  { id: 'coliflor', nombre: 'Coliflor', categoria: 'verduras', sinonimos: ['coliflores'] },
  { id: 'batata', nombre: 'Batata', categoria: 'verduras', sinonimos: ['batatas', 'camote', 'boniato'] },
  { id: 'hongos', nombre: 'Champiñones', categoria: 'verduras', sinonimos: ['champiñon', 'champiñones', 'hongos', 'portobello'] },
  { id: 'albahaca', nombre: 'Albahaca', categoria: 'verduras', sinonimos: ['albahaca fresca'] },

  // ---------- Carnes ----------
  { id: 'carne', nombre: 'Carne (nalga, cuadril)', categoria: 'carnes', sinonimos: ['nalga', 'cuadril', 'carne de res', 'carne de vaca', 'bife', 'bifes'] },
  { id: 'carne-picada', nombre: 'Carne picada', categoria: 'carnes', sinonimos: ['picada', 'carne molida'] },
  { id: 'pollo', nombre: 'Pollo', categoria: 'carnes', sinonimos: ['pechuga de pollo', 'pechuga', 'supremas', 'suprema de pollo', 'pollo entero', 'muslos de pollo', 'pata muslo'] },
  { id: 'pescado', nombre: 'Pescado', categoria: 'carnes', sinonimos: ['merluza', 'filet de merluza', 'filete de pescado', 'filet'] },
  { id: 'atun', nombre: 'Atún (lata)', categoria: 'carnes', sinonimos: ['atún', 'atun en lata', 'atun al natural'] },
  { id: 'vacio', nombre: 'Vacío', categoria: 'carnes', sinonimos: [] },
  { id: 'matambre', nombre: 'Matambre', categoria: 'carnes', sinonimos: [] },
  { id: 'chorizo', nombre: 'Chorizo', categoria: 'carnes', sinonimos: ['chorizos'] },
  { id: 'cerdo', nombre: 'Cerdo', categoria: 'carnes', sinonimos: ['bondiola', 'carré de cerdo', 'costillas de cerdo'] },

  // ---------- Fiambres ----------
  { id: 'jamon', nombre: 'Jamón', categoria: 'fiambres', sinonimos: ['jamon cocido', 'jamon crudo', 'fiambre'] },
  { id: 'salame', nombre: 'Salame', categoria: 'fiambres', sinonimos: ['salamín', 'salamin'] },
  { id: 'mortadela', nombre: 'Mortadela', categoria: 'fiambres', sinonimos: [] },
  { id: 'panceta', nombre: 'Panceta', categoria: 'fiambres', sinonimos: ['bacon', 'tocino'] },

  // ---------- Almacén ----------
  { id: 'huevo', nombre: 'Huevo', categoria: 'almacen', sinonimos: ['huevos'] },
  { id: 'arroz', nombre: 'Arroz', categoria: 'almacen', sinonimos: ['arroz blanco', 'arroz integral'] },
  { id: 'fideos', nombre: 'Fideos', categoria: 'almacen', sinonimos: ['fideo', 'tallarines', 'spaghetti', 'espagueti', 'guisero', 'tirabuzones', 'coditos'] },
  { id: 'harina', nombre: 'Harina', categoria: 'almacen', sinonimos: ['harina de trigo', 'harina 0000'] },
  { id: 'azucar', nombre: 'Azúcar', categoria: 'almacen', sinonimos: ['azúcar blanca', 'azúcar común'] },
  { id: 'pure-tomate', nombre: 'Puré de tomate', categoria: 'almacen', sinonimos: ['salsa de tomate', 'tomate triturado', 'tomate en lata', 'tomate concentrado'] },
  { id: 'lentejas', nombre: 'Lentejas', categoria: 'almacen', sinonimos: ['lenteja'] },
  { id: 'garbanzos', nombre: 'Garbanzos', categoria: 'almacen', sinonimos: ['garbanzo'] },
  { id: 'porotos', nombre: 'Porotos', categoria: 'almacen', sinonimos: ['poroto', 'frijoles', 'alubias'] },
  { id: 'pan', nombre: 'Pan', categoria: 'almacen', sinonimos: ['pan frances', 'pan francés', 'pan de miga', 'pan lactal', 'panes', 'pan de hamburguesa', 'pan para hamburguesa'] },
  { id: 'pan-rallado', nombre: 'Pan rallado', categoria: 'almacen', sinonimos: ['breadcrumbs', 'rebozador'] },
  { id: 'avena', nombre: 'Avena', categoria: 'almacen', sinonimos: ['avena arrollada'] },
  { id: 'maicena', nombre: 'Maicena', categoria: 'almacen', sinonimos: ['fécula de maíz', 'maizena'] },
  { id: 'levadura', nombre: 'Levadura', categoria: 'almacen', sinonimos: ['levadura fresca', 'levadura seca'] },
  { id: 'polvo-hornear', nombre: 'Polvo de hornear', categoria: 'almacen', sinonimos: ['polvo leudante', 'levadura química'] },
  { id: 'cafe', nombre: 'Café', categoria: 'almacen', sinonimos: ['café molido', 'café instantáneo'] },
  { id: 'te', nombre: 'Té', categoria: 'almacen', sinonimos: ['té negro', 'saquitos de te'] },
  { id: 'yerba', nombre: 'Yerba mate', categoria: 'almacen', sinonimos: ['yerba'] },
  { id: 'dulce-batata', nombre: 'Dulce de batata', categoria: 'almacen', sinonimos: ['dulce de membrillo'] },
  { id: 'mermelada', nombre: 'Mermelada', categoria: 'almacen', sinonimos: ['mermelada de frutilla', 'mermelada de durazno'] },
  { id: 'chocolate', nombre: 'Chocolate', categoria: 'almacen', sinonimos: ['chocolate amargo', 'chocolate con leche', 'cacao', 'tableta de chocolate'] },
  { id: 'caldo', nombre: 'Caldo', categoria: 'almacen', sinonimos: ['caldo de verdura', 'caldo de pollo', 'caldo concentrado', 'cubo de caldo'] },
  { id: 'aceitunas', nombre: 'Aceitunas', categoria: 'almacen', sinonimos: ['aceitunas verdes', 'aceitunas negras'] },
  { id: 'tapas-empanada', nombre: 'Tapas de empanada', categoria: 'almacen', sinonimos: ['tapas para empanada'] },
  { id: 'masa-tarta', nombre: 'Masa de tarta', categoria: 'almacen', sinonimos: ['masa para tarta', 'tapas de tarta'] },
  { id: 'polenta', nombre: 'Polenta', categoria: 'almacen', sinonimos: ['harina de maíz para polenta'] },
  { id: 'esencia-vainilla', nombre: 'Esencia de vainilla', categoria: 'almacen', sinonimos: ['vainilla', 'esencia de vainillín'] },
  { id: 'mayonesa', nombre: 'Mayonesa', categoria: 'almacen', sinonimos: [] },
  { id: 'mostaza', nombre: 'Mostaza', categoria: 'almacen', sinonimos: [] },

  // ---------- Condimentos ----------
  { id: 'sal', nombre: 'Sal', categoria: 'condimentos', sinonimos: ['sal fina', 'sal entrefina'] },
  { id: 'pimienta', nombre: 'Pimienta', categoria: 'condimentos', sinonimos: ['pimienta negra'] },
  { id: 'aceite', nombre: 'Aceite', categoria: 'condimentos', sinonimos: ['aceite de girasol', 'aceite de oliva'] },
  { id: 'agua', nombre: 'Agua', categoria: 'condimentos', sinonimos: [] },
  { id: 'oregano', nombre: 'Orégano', categoria: 'condimentos', sinonimos: ['orégano seco'] },
  { id: 'pimenton', nombre: 'Pimentón', categoria: 'condimentos', sinonimos: ['pimentón dulce', 'paprika', 'ají de color'] },
  { id: 'aji-molido', nombre: 'Ají molido', categoria: 'condimentos', sinonimos: ['ají picante', 'chile en polvo'] },
  { id: 'comino', nombre: 'Comino', categoria: 'condimentos', sinonimos: ['comino molido'] },
  { id: 'laurel', nombre: 'Laurel', categoria: 'condimentos', sinonimos: ['hoja de laurel'] },
  { id: 'provenzal', nombre: 'Provenzal', categoria: 'condimentos', sinonimos: ['mix de hierbas', 'hierbas provenzales'] },
  { id: 'vinagre', nombre: 'Vinagre', categoria: 'condimentos', sinonimos: ['vinagre de vino', 'vinagre de alcohol'] },
  { id: 'canela', nombre: 'Canela', categoria: 'condimentos', sinonimos: ['canela en polvo'] },
  { id: 'salsa-soja', nombre: 'Salsa de soja', categoria: 'condimentos', sinonimos: ['soja', 'soya', 'sillao'] },
  { id: 'cilantro', nombre: 'Cilantro', categoria: 'verduras', sinonimos: ['cilantro fresco', 'culantro', 'coriandro'] },
  { id: 'jengibre', nombre: 'Jengibre', categoria: 'condimentos', sinonimos: ['jengibre fresco', 'raíz de jengibre'] },
  { id: 'lima', nombre: 'Lima', categoria: 'frutas', sinonimos: ['limas', 'limón verde'] },
  { id: 'nuez-moscada', nombre: 'Nuez moscada', categoria: 'condimentos', sinonimos: [] },
  { id: 'azafran', nombre: 'Azafrán', categoria: 'condimentos', sinonimos: ['hebras de azafrán', 'colorante alimentario'] },
  { id: 'tortillas-maiz', nombre: 'Tortillas de maíz', categoria: 'almacen', sinonimos: ['tortilla de maiz', 'tacos', 'tortillas para tacos'] },
  { id: 'quinoa', nombre: 'Quinoa', categoria: 'almacen', sinonimos: ['quínoa', 'quinua'] },
  { id: 'porotos-negros', nombre: 'Porotos negros', categoria: 'almacen', sinonimos: ['frijoles negros', 'alubias negras', 'black beans'] },
  { id: 'jalapeno', nombre: 'Ají jalapeño', categoria: 'verduras', sinonimos: ['jalapeño', 'jalapenos', 'chile jalapeño'] },
  { id: 'pimenton-ahumado', nombre: 'Pimentón ahumado', categoria: 'condimentos', sinonimos: ['paprika ahumada', 'pimentón de la vera'] },
  { id: 'vinagre-arroz', nombre: 'Vinagre de arroz', categoria: 'condimentos', sinonimos: ['vinagre de arroz sazonado', 'rice vinegar'] },
  { id: 'mirin', nombre: 'Mirin', categoria: 'condimentos', sinonimos: ['vino de arroz dulce'] },
  { id: 'sake', nombre: 'Sake', categoria: 'condimentos', sinonimos: ['vino de arroz'] },
  { id: 'nori', nombre: 'Alga nori', categoria: 'almacen', sinonimos: ['nori', 'alga nori para sushi', 'hojas de nori'] },
  { id: 'wasabi', nombre: 'Wasabi', categoria: 'condimentos', sinonimos: [] },
  { id: 'arroz-sushi', nombre: 'Arroz para sushi', categoria: 'almacen', sinonimos: ['arroz glutinoso', 'arroz japonés'] },
  { id: 'fideos-udon', nombre: 'Fideos udon', categoria: 'almacen', sinonimos: ['udon', 'fideos udon japoneses'] },
  { id: 'salchichas', nombre: 'Salchichas', categoria: 'fiambres', sinonimos: ['salchicha', 'vienesas'] },
  { id: 'camarones', nombre: 'Camarones', categoria: 'carnes', sinonimos: ['langostinos', 'gambas', 'shrimp', 'prawns'] },
  { id: 'calamares', nombre: 'Calamares', categoria: 'carnes', sinonimos: ['calamar', 'anillos de calamar', 'squid'] },
  { id: 'mejillones', nombre: 'Mejillones', categoria: 'carnes', sinonimos: ['mussels'] },
  { id: 'pasta-lasagna', nombre: 'Tapas de lasaña', categoria: 'almacen', sinonimos: ['lasagna', 'lasaña', 'láminas de lasaña'] },
  { id: 'pasta-penne', nombre: 'Penne', categoria: 'almacen', sinonimos: ['penne rigate', 'pasta penne'] },
  { id: 'queso-cheddar', nombre: 'Queso cheddar', categoria: 'lacteos', sinonimos: ['cheddar', 'queso amarillo'] },
  { id: 'hongos-shiitake', nombre: 'Hongos shiitake', categoria: 'verduras', sinonimos: ['shiitake', 'setas shiitake'] },
  { id: 'aceite-sesamo', nombre: 'Aceite de sésamo', categoria: 'condimentos', sinonimos: ['aceite de sésamo tostado', 'aceite de ajonjolí'] },
  { id: 'semillas-sesamo', nombre: 'Semillas de sésamo', categoria: 'condimentos', sinonimos: ['sésamo', 'ajonjolí'] },
  { id: 'repollo', nombre: 'Repollo', categoria: 'verduras', sinonimos: ['col', 'repollo blanco', 'coles'] },
  { id: 'azucar-moreno', nombre: 'Azúcar moreno', categoria: 'almacen', sinonimos: ['azúcar rubia', 'azúcar mascabo', 'panela'] },
  { id: 'miel', nombre: 'Miel', categoria: 'almacen', sinonimos: [] },
  { id: 'vino-tinto', nombre: 'Vino tinto', categoria: 'almacen', sinonimos: ['vino'] },
  { id: 'hojaldre', nombre: 'Masa de hojaldre', categoria: 'almacen', sinonimos: ['masa hojaldre', 'pasta de hojaldre', 'puff pastry'] },
  { id: 'tomates-cherry', nombre: 'Tomates cherry', categoria: 'verduras', sinonimos: ['cherry', 'tomate cherry', 'tomates cereza'] },
  { id: 'prosciutto', nombre: 'Jamón crudo', categoria: 'fiambres', sinonimos: ['jamón serrano', 'parma', 'prosciutto'] },
  { id: 'carne-lomo', nombre: 'Lomo de res', categoria: 'carnes', sinonimos: ['lomo', 'filete de res', 'tenderloin'] },
  { id: 'crema-agria', nombre: 'Crema agria', categoria: 'lacteos', sinonimos: ['sour cream', 'nata agria'] },
  { id: 'salmón', nombre: 'Salmón', categoria: 'carnes', sinonimos: ['salmon', 'filete de salmón'] },
  { id: 'alcaparras', nombre: 'Alcaparras', categoria: 'almacen', sinonimos: [] },
  { id: 'anchoas', nombre: 'Anchoas', categoria: 'almacen', sinonimos: ['anchoa', 'filetes de anchoa'] },
  { id: 'vino-blanco', nombre: 'Vino blanco', categoria: 'almacen', sinonimos: ['vino blanco seco'] },
  { id: 'arroz-arborio', nombre: 'Arroz arborio', categoria: 'almacen', sinonimos: ['arroz para risotto', 'arroz risotto'] },
  { id: 'espárragos', nombre: 'Espárragos', categoria: 'verduras', sinonimos: ['esparragos', 'espárrago'] },
  { id: 'mascarpone', nombre: 'Mascarpone', categoria: 'lacteos', sinonimos: [] },
  { id: 'kale', nombre: 'Kale', categoria: 'verduras', sinonimos: ['col rizada', 'col verde'] },
  { id: 'porotos-blancos', nombre: 'Porotos blancos', categoria: 'almacen', sinonimos: ['porotos cannellini', 'alubias blancas', 'frijoles blancos'] },
  { id: 'romero', nombre: 'Romero', categoria: 'condimentos', sinonimos: ['romero fresco'] },
  { id: 'tomillo', nombre: 'Tomillo', categoria: 'condimentos', sinonimos: [] },
  { id: 'pimientos-padron', nombre: 'Pimientos de Padrón', categoria: 'verduras', sinonimos: ['padrón', 'pimientos del padrón'] },
  { id: 'almendras', nombre: 'Almendras', categoria: 'almacen', sinonimos: ['almendra'] },
  { id: 'curry', nombre: 'Curry', categoria: 'condimentos', sinonimos: ['curry en polvo', 'polvo de curry'] },
  { id: 'garam-masala', nombre: 'Garam masala', categoria: 'condimentos', sinonimos: [] },
  { id: 'fideos-ramen', nombre: 'Fideos ramen', categoria: 'almacen', sinonimos: ['ramen', 'fideos instantáneos'] },
  { id: 'merengues', nombre: 'Merengues', categoria: 'almacen', sinonimos: ['merengue', 'merenguitos'] },
  { id: 'menta', nombre: 'Menta', categoria: 'verduras', sinonimos: ['menta fresca', 'hierbabuena'] },
  { id: 'uvas-pasas', nombre: 'Uvas pasas', categoria: 'frutas', sinonimos: ['pasas', 'pasas de uva', 'sultanas'] },
  { id: 'manzana-verde', nombre: 'Manzana verde', categoria: 'frutas', sinonimos: ['manzanas verdes', 'granny smith'] },
  { id: 'moras', nombre: 'Moras', categoria: 'frutas', sinonimos: ['moras negras', 'blackberries'] },
  { id: 'helado', nombre: 'Helado', categoria: 'almacen', sinonimos: ['helado de crema', 'crema helada'] },
  { id: 'salsa-worcestershire', nombre: 'Salsa inglesa', categoria: 'condimentos', sinonimos: ['worcestershire', 'salsa worcestershire'] },
  { id: 'caldo-carne', nombre: 'Caldo de carne', categoria: 'almacen', sinonimos: ['caldo de res', 'consomé de carne'] },
]

// Mapa rápido id -> ingrediente
export const INGREDIENTE_POR_ID = Object.fromEntries(
  INGREDIENTES.map((i) => [i.id, i])
)

// Ingredientes básicos: se asumen siempre disponibles en casa.
// No cuentan como faltantes al calcular el match.
export const BASICOS = new Set([
  'sal',
  'pimienta',
  'aceite',
  'agua',
  'azucar',
  'oregano',
  'pimenton',
  'aji-molido',
  'comino',
  'laurel',
  'canela',
])

// Ingredientes más comunes para los botones de acceso rápido del inicio
export const INGREDIENTES_RAPIDOS = [
  'huevo',
  'leche',
  'manteca',
  'queso',
  'jamon',
  'tomate',
  'cebolla',
  'papa',
  'zanahoria',
  'morron',
  'pollo',
  'carne',
  'carne-picada',
  'atun',
  'arroz',
  'fideos',
  'harina',
  'pure-tomate',
  'pan',
  'crema',
]

// Utilidades para nombres
export function nombreDeIngrediente(id) {
  const ing = INGREDIENTE_POR_ID[id]
  return ing ? ing.nombre : id
}

export function emojiDeIngrediente(id) {
  const ing = INGREDIENTE_POR_ID[id]
  if (!ing) return '🥫'
  return CATEGORIA_POR_ID[ing.categoria]?.emoji ?? '🥫'
}
