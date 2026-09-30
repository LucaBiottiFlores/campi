import { Star } from '@phosphor-icons/react'

export default function Rating({ value, className = '' }) {
  const rounded = Math.round(value)
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          weight={i < rounded ? 'fill' : 'regular'}
          className={i < rounded ? 'text-amber' : 'text-forest-200 dark:text-white/20'}
        />
      ))}
    </span>
  )
}
