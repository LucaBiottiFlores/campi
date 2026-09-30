import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarBlank,
  Car,
  Coffee,
  Drop,
  Fire,
  Lightning,
  MapPin,
  PawPrint,
  ShieldCheck,
  Star,
  Users,
} from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Rating from '../components/Rating.jsx'
import { formatCLP, getCamping } from '../data/campings.js'

const serviceIcons = {
  'Agua potable': Drop,
  Baños: Users,
  'Baños con ducha': Users,
  Fogata: Fire,
  Luz: Lightning,
  Estacionamiento: Car,
  Mascotas: PawPrint,
  Desayuno: Coffee,
}

const reviews = [
  {
    name: 'Rodrigo T.',
    text: 'Parcelas grandes y el dueño respondió todas nuestras dudas antes de llegar. Volveremos este verano.',
    nota: 5,
  },
  {
    name: 'Constanza P.',
    text: 'La descripción coincide con lo que encontramos. El baño estaba limpio y la fogata funcionó perfecto.',
    nota: 4,
  },
]

export default function Detalle() {
  const { id } = useParams()
  const camping = getCamping(id)

  if (!camping) {
    return (
      <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
        <Header />
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
          <MapPin size={40} weight="duotone" className="text-forest-300 dark:text-forest-600" />
          <h1 className="mt-4 text-2xl font-semibold">No encontramos ese camping</h1>
          <Link to="/explorar" className="mt-6 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white">
            Volver a explorar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
      <Header />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/explorar"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink dark:text-fogmuted dark:hover:text-fog"
        >
          <ArrowLeft size={16} />
          Volver a la búsqueda
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Columna principal */}
          <div>
            {/* Galería */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-2xl sm:col-span-2">
                <img
                  src={camping.fotos[0]}
                  alt={camping.nombre}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              {camping.fotos.slice(1).map((foto, i) => (
                <div key={i} className="overflow-hidden rounded-2xl">
                  <img src={foto} alt={`${camping.nombre}, foto ${i + 2}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </div>
              ))}
            </div>

            {/* Encabezado */}
            <div className="mt-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-fog">
                    {camping.nombre}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-muted dark:text-fogmuted">
                    <MapPin size={16} className="text-forest-500" />
                    {camping.zona}, {camping.region}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Rating value={camping.nota} />
                  <span className="text-sm font-semibold text-ink dark:text-fog">{camping.nota.toFixed(1)}</span>
                  <span className="text-sm text-muted dark:text-fogmuted">({camping.resenas} reseñas)</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {camping.servicios.map((s) => {
                  const Icon = serviceIcons[s] || Star
                  return (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-sm font-medium text-forest-700 dark:bg-forest-900/40 dark:text-forest-200"
                    >
                      <Icon size={15} weight="fill" />
                      {s}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Descripción */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink dark:text-fog">Sobre este lugar</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted dark:text-fogmuted">{camping.descripcion}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 dark:text-forest-300">
                <Users size={16} />
                Hasta {camping.capacidad} personas
              </p>
            </section>

            {/* Reglas */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink dark:text-fog">Reglas del camping</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {camping.reglas.map((regla) => (
                  <li key={regla} className="flex items-start gap-2 text-sm text-muted dark:text-fogmuted">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0 text-forest-500" />
                    {regla}
                  </li>
                ))}
              </ul>
            </section>

            {/* Reseñas */}
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink dark:text-fog">Reseñas de viajeros</h2>
              <div className="mt-4 grid gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.name}
                    className="rounded-2xl border border-forest-900/8 bg-white p-5 dark:border-white/8 dark:bg-night2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink dark:text-fog">{r.name}</p>
                      <Rating value={r.nota} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Panel de reserva */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-forest-900/8 bg-white p-6 shadow-lg shadow-forest-900/5 dark:border-white/8 dark:bg-night2">
              <div className="flex items-end justify-between">
                <p className="text-2xl font-semibold text-ink dark:text-fog">
                  {formatCLP(camping.precio)}
                  <span className="text-sm font-normal text-muted dark:text-fogmuted"> / noche</span>
                </p>
                <span className="flex items-center gap-1 text-sm text-muted dark:text-fogmuted">
                  <Star size={14} weight="fill" className="text-amber" />
                  {camping.nota.toFixed(1)}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-bone px-3 py-2.5 dark:bg-night">
                  <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted dark:text-fogmuted">
                    <CalendarBlank size={13} /> Llegada
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink dark:text-fog">Elige fecha</p>
                </div>
                <div className="rounded-xl bg-bone px-3 py-2.5 dark:bg-night">
                  <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted dark:text-fogmuted">
                    <Users size={13} /> Personas
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink dark:text-fog">2 personas</p>
                </div>
              </div>

              <Link
                to={`/reservar/${camping.id}`}
                className="mt-5 block rounded-full bg-forest-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-forest-700 active:translate-y-px"
              >
                Reservar
              </Link>

              <p className="mt-4 text-center text-xs text-muted dark:text-fogmuted">
                No se te cobra nada hasta confirmar la reserva.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
