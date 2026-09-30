import { Link } from 'react-router-dom'
import { MapPin } from '@phosphor-icons/react'
import { formatCLP } from '../data/campings.js'
import Rating from './Rating.jsx'

export default function CampingCard({ camping, compact = false }) {
  return (
    <Link
      to={`/camping/${camping.id}`}
      className="group overflow-hidden rounded-2xl border border-forest-900/8 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-forest-900/10 dark:border-white/8 dark:bg-night2"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={camping.fotos[0]}
          alt={camping.nombre}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
        {camping.destacado && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-forest-800 backdrop-blur">
            Destacado
          </span>
        )}
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-ink backdrop-blur">
          {formatCLP(camping.precio)} <span className="font-normal text-muted">/ noche</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-ink dark:text-fog">{camping.nombre}</h3>
          <span className="flex shrink-0 items-center gap-1 text-sm text-muted dark:text-fogmuted">
            <Rating value={camping.nota} />
            <span className="font-medium text-ink dark:text-fog">{camping.nota.toFixed(1)}</span>
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted dark:text-fogmuted">
          <MapPin size={14} className="text-forest-500" />
          {camping.zona}
        </p>
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {camping.servicios.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-forest-50 px-2.5 py-1 text-[11px] font-medium text-forest-700 dark:bg-forest-900/40 dark:text-forest-200"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
