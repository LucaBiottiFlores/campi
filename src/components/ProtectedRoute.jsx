import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth.js'

export default function ProtectedRoute({ children, ownerOnly = false }) {
  const { loading, isAuthenticated, isOwner } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-bone dark:bg-night">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-forest-600 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />

  if (ownerOnly && !isOwner) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-ink dark:text-fog">Necesitas una cuenta de dueño</h1>
        <p className="mt-3 text-muted dark:text-fogmuted">
          El panel de administración es solo para dueños de camping. Crea una cuenta con rol de dueño para acceder.
        </p>
      </div>
    )
  }

  return children
}
