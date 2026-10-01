import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { List, SignOut, X } from '@phosphor-icons/react'
import Logo from './Logo.jsx'
import ScrollLink from './ScrollLink.jsx'
import { useAuth } from '../context/auth.js'

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-forest-600 dark:text-forest-300' : 'text-muted hover:text-ink dark:text-fogmuted dark:hover:text-fog'
  }`

export default function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, isOwner, profile, user, signOut } = useAuth()

  const displayName = profile?.nombre || user?.email?.split('@')[0] || 'Cuenta'

  return (
    <header className="sticky top-0 z-50 border-b border-forest-900/8 bg-bone/85 backdrop-blur-xl dark:border-white/8 dark:bg-night/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          <NavLink to="/explorar" className={navLink}>
            Explorar
          </NavLink>
          <ScrollLink to="#como-funciona" className="text-sm font-medium text-muted transition-colors hover:text-ink dark:text-fogmuted dark:hover:text-fog">
            Cómo funciona
          </ScrollLink>
          <ScrollLink to="#dueños" className="text-sm font-medium text-muted transition-colors hover:text-ink dark:text-fogmuted dark:hover:text-fog">
            Soy dueño
          </ScrollLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {isOwner && (
                <Link to="/panel" className="text-sm font-medium text-muted transition-colors hover:text-ink dark:text-fogmuted dark:hover:text-fog">
                  Mi panel
                </Link>
              )}
              <span className="max-w-[140px] truncate text-sm font-medium text-ink dark:text-fog">{displayName}</span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2 text-sm font-semibold text-ink transition hover:border-forest-600 dark:border-white/15 dark:text-fog"
              >
                <SignOut size={15} />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="text-sm font-medium text-muted transition-colors hover:text-ink dark:text-fogmuted dark:hover:text-fog">
                Iniciar sesión
              </Link>
              <Link
                to="/explorar"
                className="rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 active:translate-y-px"
              >
                Explorar campings
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg text-ink md:hidden dark:text-fog"
          aria-label="Abrir menú"
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-900/8 bg-bone px-4 py-4 md:hidden dark:border-white/8 dark:bg-night">
          <nav className="flex flex-col gap-4" aria-label="Menú móvil">
            <Link to="/explorar" onClick={() => setOpen(false)} className="text-base font-medium text-ink dark:text-fog">
              Explorar
            </Link>
            <ScrollLink to="#como-funciona" onClick={() => setOpen(false)} className="text-base font-medium text-ink dark:text-fog">
              Cómo funciona
            </ScrollLink>
            <ScrollLink to="#dueños" onClick={() => setOpen(false)} className="text-base font-medium text-ink dark:text-fog">
              Soy dueño
            </ScrollLink>

            {isAuthenticated ? (
              <>
                {isOwner && (
                  <Link to="/panel" onClick={() => setOpen(false)} className="text-base font-medium text-ink dark:text-fog">
                    Mi panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    signOut()
                  }}
                  className="text-left text-base font-medium text-ink dark:text-fog"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setOpen(false)} className="text-base font-medium text-ink dark:text-fog">
                  Iniciar sesión
                </Link>
                <Link
                  to="/explorar"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-forest-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Explorar campings
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
