# Campi

Marketplace de campings en Chile. Los viajeros encuentran, comparan y reservan campings verificados en línea; los dueños publican su terreno gratis y cobran el 100% de su noche.

## Estado

Prototipo de producto: landing + demo navegable de las pantallas clave (explorar, detalle y reserva). Los campings mostrados son datos de ejemplo y las fotos son placeholders.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Motion (animaciones)
- Phosphor Icons
- React Router

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # servir el build
npm run lint     # oxlint
```

## Rutas

- `/` - landing
- `/explorar` - búsqueda y resultados (acepta `?zona=`)
- `/camping/:id` - detalle de un camping
- `/reservar/:id` - reserva y pago simulado

## Pendiente antes de lanzar

- Reemplazar las fotos de placeholder por fotografía real de cada camping.
- Conectar autenticación y base de datos (Supabase).
- Integrar pasarela de pago real (Webpay / Flow).
- Validar términos, cancelaciones y tratamiento de IVA con abogado y contador.
