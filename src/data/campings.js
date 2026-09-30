// Datos de ejemplo (mock) para el prototipo. Fotos con seeds de picsum a modo de
// placeholder: reemplazar por fotografía real de cada camping antes de lanzar.

const img = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const campings = [
  {
    id: 'el-roble',
    nombre: 'Camping El Roble',
    zona: 'Cajón del Maipo',
    region: 'Región Metropolitana',
    precio: 18000,
    nota: 4.8,
    resenas: 214,
    capacidad: 6,
    servicios: ['Agua potable', 'Baños', 'Fogata', 'Estacionamiento', 'Mascotas'],
    descripcion:
      'Parcelas amplias a la sombra de robles centenarios, junto al río. Ideal para familias que buscan desconectarse a una hora de Santiago.',
    reglas: ['Check-in desde 14:00', 'Check-out hasta 12:00', 'Mascotas con correa', 'Silencio después de las 00:00'],
    fotos: [img('campi-el-roble-1', 1600, 1000), img('campi-el-roble-2', 1200, 900), img('campi-el-roble-3', 1200, 900)],
    destacado: true,
  },
  {
    id: 'lago-espejo',
    nombre: 'Camping Lago Espejo',
    zona: 'Puerto Varas',
    region: 'Región de Los Lagos',
    precio: 26500,
    nota: 4.9,
    resenas: 138,
    capacidad: 4,
    servicios: ['Agua potable', 'Baños con ducha', 'Luz', 'Fogata', 'Mascotas'],
    descripcion:
      'Sitios con vista directa al lago y acceso a playa. Cercano a senderos y con baños con agua caliente para volver a acampar sin sacrificar comodidad.',
    reglas: ['Check-in desde 15:00', 'Check-out hasta 11:00', 'No fogatas con viento fuerte', 'Mascotas bienvenidas'],
    fotos: [img('campi-lago-espejo-1', 1600, 1000), img('campi-lago-espejo-2', 1200, 900), img('campi-lago-espejo-3', 1200, 900)],
    destacado: true,
  },
  {
    id: 'valle-seco',
    nombre: 'Camping Valle Seco',
    zona: 'Valle del Elqui',
    region: 'Región de Coquimbo',
    precio: 15000,
    nota: 4.6,
    resenas: 97,
    capacidad: 5,
    servicios: ['Agua potable', 'Baños', 'Estacionamiento'],
    descripcion:
      'Terreno abierto para mirar las estrellas sin contaminación lumínica. Cielos despejados la mayor parte del año y viñedos a pocos kilómetros.',
    reglas: ['Check-in desde 13:00', 'Check-out hasta 12:00', 'Prohibido encender fuego', 'Respetar el silencio nocturno'],
    fotos: [img('campi-valle-seco-1', 1600, 1000), img('campi-valle-seco-2', 1200, 900), img('campi-valle-seco-3', 1200, 900)],
    destacado: false,
  },
  {
    id: 'los-boldos',
    nombre: 'Camping Los Boldos',
    zona: 'Pucón',
    region: 'Región de La Araucanía',
    precio: 32000,
    nota: 4.7,
    resenas: 176,
    capacidad: 8,
    servicios: ['Agua potable', 'Baños con ducha', 'Luz', 'Fogata', 'Estacionamiento', 'Mascotas'],
    descripcion:
      'Parcelas privadas entre bosque nativo, a minutos del lago Villarrica. Acceso a senderos y zonas de fogata habilitadas por parcela.',
    reglas: ['Check-in desde 15:00', 'Check-out hasta 11:00', 'Fogatas solo en zonas habilitadas', 'Máximo 8 personas por parcela'],
    fotos: [img('campi-los-boldos-1', 1600, 1000), img('campi-los-boldos-2', 1200, 900), img('campi-los-boldos-3', 1200, 900)],
    destacado: true,
  },
  {
    id: 'bahia-blanca',
    nombre: 'Camping Bahía Blanca',
    zona: 'Ancud',
    region: 'Región de Los Lagos',
    precio: 21000,
    nota: 4.5,
    resenas: 62,
    capacidad: 6,
    servicios: ['Agua potable', 'Baños', 'Mascotas'],
    descripcion:
      'Frente al mar interior de Chiloé, con sitios protegidos del viento. Base perfecta para recorrer pingüineras y mercados locales.',
    reglas: ['Check-in desde 14:00', 'Check-out hasta 12:00', 'Cuidar el borde costero', 'Mascotas con correa'],
    fotos: [img('campi-bahia-blanca-1', 1600, 1000), img('campi-bahia-blanca-2', 1200, 900), img('campi-bahia-blanca-3', 1200, 900)],
    destacado: false,
  },
  {
    id: 'piedra-lunar',
    nombre: 'Camping Piedra Lunar',
    zona: 'San Pedro de Atacama',
    region: 'Región de Antofagasta',
    precio: 45000,
    nota: 4.9,
    resenas: 89,
    capacidad: 2,
    servicios: ['Baños con ducha', 'Luz', 'Desayuno'],
    descripcion:
      'Glamping en el desierto con domos equipados. Amaneceres sobre los volcanes y noches de estrellas sin moverte de la cama.',
    reglas: ['Check-in desde 16:00', 'Check-out hasta 12:00', 'No fumar dentro del domo', 'Máximo 2 personas'],
    fotos: [img('campi-piedra-lunar-1', 1600, 1000), img('campi-piedra-lunar-2', 1200, 900), img('campi-piedra-lunar-3', 1200, 900)],
    destacado: false,
  },
]

export const zonas = [
  { nombre: 'Cajón del Maipo', seed: 'campi-zona-maipo', cantidad: 14 },
  { nombre: 'Lago Llanquihue', seed: 'campi-zona-llanquihue', cantidad: 22 },
  { nombre: 'Valle del Elqui', seed: 'campi-zona-elqui', cantidad: 9 },
  { nombre: 'Pucón y Araucanía', seed: 'campi-zona-pucon', cantidad: 18 },
  { nombre: 'Chiloé', seed: 'campi-zona-chiloe', cantidad: 11 },
  { nombre: 'Atacama', seed: 'campi-zona-atacama', cantidad: 7 },
]

export function formatCLP(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getCamping(id) {
  return campings.find((c) => c.id === id)
}
