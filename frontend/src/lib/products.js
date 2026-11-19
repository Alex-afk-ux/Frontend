// Utilidades compartidas por el catálogo y la página de detalle del producto

// Un emoji y un tono (hue) por categoría; así cada producto tiene su propio color
export const CATEGORY_STYLE = {
  chubasqueros: { emoji: '🧥', hue: 48 },
  'botas de agua': { emoji: '🥾', hue: 25 },
  paraguas: { emoji: '☂️', hue: 285 },
  sombreros: { emoji: '👒', hue: 160 },
  'gafas de buceo': { emoji: '🤿', hue: 190 },
}
const DEFAULT_STYLE = { emoji: '🛍️', hue: 215 }

export const SWATCH = {
  amarillo: '#facc15', transparente: '#bae6fd', naranja: '#fb923c', verde: '#4ade80',
  negro: '#1f2937', rosa: '#f9a8d4', beige: '#e7d5b3', natural: '#d6b878',
  azul: '#38bdf8', rojo: '#f87171',
}

// Imagen de cada producto por nombre (por si la base de datos no trae el campo "image")
const IMAGE_BY_NAME = {
  'chubasquero clásico amarillo': 'chubasquero-clasico-amarillo',
  'chubasquero transparente plegable': 'chubasquero-transparente',
  'botas de agua para peces': 'botas-de-agua-para-peces',
  'botas con suela antideslizante': 'botas-suela-antideslizante',
  'paraguas automático': 'paraguas-automatico',
  'mini paraguas de colores': 'mini-paraguas-colores',
  'sombrero de pescador impermeable': 'sombrero-pescador',
  'sombrero de paja de verano': 'sombrero-paja',
  'gafas de buceo clásicas': 'gafas-buceo-clasicas',
  'gafas de buceo panorámicas': 'gafas-buceo-panoramicas',
}

export const imageOf = (p) => {
  if (p.image) return p.image
  const file = IMAGE_BY_NAME[p.name?.toLowerCase()]
  return file ? `/products/${file}.svg` : null
}

export const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export const styleOf = (product) => CATEGORY_STYLE[product.category?.name?.toLowerCase()] || DEFAULT_STYLE

export function stockInfo(stock) {
  if (stock <= 0) return { text: 'Agotado', className: 'stock-out' }
  if (stock <= 10) return { text: `Últimas ${stock} unidades`, className: 'stock-low' }
  return { text: 'En stock', className: 'stock-ok' }
}
