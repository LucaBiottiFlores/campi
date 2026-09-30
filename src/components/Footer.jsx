import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import ScrollLink from './ScrollLink.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-forest-900/8 bg-bone dark:border-white/8 dark:bg-night">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted dark:text-fogmuted">
              Campings y glampings verificados en todo Chile. Reserva en línea y acampa tranquilo.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink dark:text-fog">Explorar</p>
            <ul className="mt-4 space-y-3 text-sm text-muted dark:text-fogmuted">
              <li>
                <Link to="/explorar" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Buscar campings
                </Link>
              </li>
              <li>
                <Link to="/explorar" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Glampings
                </Link>
              </li>
              <li>
                <Link to="/explorar" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Zonas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink dark:text-fog">Para dueños</p>
            <ul className="mt-4 space-y-3 text-sm text-muted dark:text-fogmuted">
              <li>
                <ScrollLink to="#dueños" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Publicar mi camping
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="#dueños" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Comisiones
                </ScrollLink>
              </li>
              <li>
                <ScrollLink to="#dueños" className="transition-colors hover:text-ink dark:hover:text-fog">
                  Preguntas frecuentes
                </ScrollLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink dark:text-fog">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-muted dark:text-fogmuted">
              <li>
                <span className="cursor-default">Términos y condiciones</span>
              </li>
              <li>
                <span className="cursor-default">Política de privacidad</span>
              </li>
              <li>
                <span className="cursor-default">Política de cancelación</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-forest-900/8 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between dark:border-white/8 dark:text-fogmuted">
          <p>Campi, 2026. Hecho en Chile.</p>
          <p>Prototipo en desarrollo. Los campings mostrados son datos de ejemplo.</p>
        </div>
      </div>
    </footer>
  )
}
