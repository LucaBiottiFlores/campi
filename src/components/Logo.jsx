import { Link } from 'react-router-dom'
import { Mountains } from '@phosphor-icons/react'

export default function Logo({ onDark = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Campi, ir al inicio">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-600">
        <Mountains size={22} weight="fill" className="text-white" />
      </span>
      <span className={`text-xl font-semibold tracking-tight ${onDark ? 'text-white' : 'text-ink dark:text-fog'}`}>
        Campi
      </span>
    </Link>
  )
}
