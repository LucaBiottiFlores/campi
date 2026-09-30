import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  CreditCard,
  MapPin,
  ShieldCheck,
  Users,
} from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { formatCLP, getCamping } from '../data/campings.js'

const SERVICE_FEE = 0.12

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function nightsBetween(a, b) {
  const ms = new Date(b).getTime() - new Date(a).getTime()
  return Math.max(1, Math.round(ms / 86400000))
}

export default function Reserva() {
  const { id } = useParams()
  const camping = getCamping(id)

  const [llegada, setLlegada] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return toISODate(d)
  })
  const [salida, setSalida] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    return toISODate(d)
  })
  const [personas, setPersonas] = useState(2)
  const [busy, setBusy] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const noches = useMemo(() => (llegada && salida ? nightsBetween(llegada, salida) : 2), [llegada, salida])
  const subtotal = camping ? camping.precio * noches : 0
  const fee = Math.round(subtotal * SERVICE_FEE)
  const total = subtotal + fee

  function pagar() {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setConfirmed(true)
    }, 1300)
  }

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
        {confirmed ? (
          <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
            <CheckCircle size={64} weight="duotone" className="text-forest-600 dark:text-forest-300" />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink dark:text-fog">¡Reserva confirmada!</h1>
            <p className="mt-3 max-w-md text-muted dark:text-fogmuted">
              Te enviamos la confirmación, la ubicación y las reglas a tu correo. Solo te queda armar la carpa.
            </p>

            <div className="mt-8 w-full rounded-2xl border border-forest-900/8 bg-white p-6 text-left dark:border-white/8 dark:bg-night2">
              <p className="font-semibold text-ink dark:text-fog">{camping.nombre}</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted dark:text-fogmuted">
                <MapPin size={14} className="text-forest-500" />
                {camping.zona}, {camping.region}
              </p>
              <dl className="mt-5 space-y-3 border-t border-forest-900/8 pt-5 text-sm dark:border-white/8">
                <div className="flex justify-between">
                  <dt className="text-muted dark:text-fogmuted">Fechas</dt>
                  <dd className="font-medium text-ink dark:text-fog">
                    {noches} {noches === 1 ? 'noche' : 'noches'} · {personas} personas
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted dark:text-fogmuted">Total pagado</dt>
                  <dd className="font-semibold text-ink dark:text-fog">{formatCLP(total)}</dd>
                </div>
              </dl>
            </div>

            <Link
              to="/explorar"
              className="mt-8 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-forest-700"
            >
              Explorar más campings
            </Link>
          </div>
        ) : (
          <>
            <Link
              to={`/camping/${camping.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-ink dark:text-fogmuted dark:hover:text-fog"
            >
              <ArrowLeft size={16} />
              Volver al camping
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Formulario */}
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-fog">
                  Completa tu reserva
                </h1>
                <p className="mt-2 text-muted dark:text-fogmuted">{camping.nombre}, {camping.zona}</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-fog">
                      <CalendarBlank size={15} className="text-forest-500" /> Llegada
                    </span>
                    <input
                      type="date"
                      value={llegada}
                      onChange={(e) => setLlegada(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest-600 dark:border-white/15 dark:bg-night2 dark:text-fog"
                    />
                  </label>
                  <label className="block">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-fog">
                      <CalendarBlank size={15} className="text-forest-500" /> Salida
                    </span>
                    <input
                      type="date"
                      value={salida}
                      onChange={(e) => setSalida(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest-600 dark:border-white/15 dark:bg-night2 dark:text-fog"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-ink dark:text-fog">
                    <Users size={15} className="text-forest-500" /> Personas
                  </span>
                  <select
                    value={personas}
                    onChange={(e) => setPersonas(Number(e.target.value))}
                    className="mt-2 w-full cursor-pointer rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest-600 dark:border-white/15 dark:bg-night2 dark:text-fog"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Pago */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-ink dark:text-fog">Pago</h2>
                  <button
                    type="button"
                    onClick={pagar}
                    disabled={busy}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-forest-900/15 bg-white px-5 py-4 text-sm font-semibold text-ink transition hover:border-forest-600 disabled:opacity-70 dark:border-white/15 dark:bg-night2 dark:text-fog"
                  >
                    {busy ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-forest-600 border-t-transparent" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} className="text-forest-600 dark:text-forest-300" />
                        Pagar con Webpay
                      </>
                    )}
                  </button>
                  <p className="mt-3 flex items-start gap-1.5 text-xs text-muted dark:text-fogmuted">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-forest-500" />
                    Pago simulado para este prototipo. No se realiza ningún cobro real.
                  </p>
                </div>
              </div>

              {/* Resumen */}
              <aside>
                <div className="rounded-2xl border border-forest-900/8 bg-white p-6 dark:border-white/8 dark:bg-night2">
                  <div className="flex items-center gap-3">
                    <img
                      src={camping.fotos[0]}
                      alt={camping.nombre}
                      className="h-16 w-20 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-ink dark:text-fog">{camping.nombre}</p>
                      <p className="text-sm text-muted dark:text-fogmuted">{camping.zona}</p>
                    </div>
                  </div>

                  <dl className="mt-5 space-y-3 border-t border-forest-900/8 pt-5 text-sm dark:border-white/8">
                    <div className="flex justify-between">
                      <dt className="text-muted dark:text-fogmuted">
                        {formatCLP(camping.precio)} × {noches} {noches === 1 ? 'noche' : 'noches'}
                      </dt>
                      <dd className="font-medium text-ink dark:text-fog">{formatCLP(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted dark:text-fogmuted">Cargo de servicio (12%)</dt>
                      <dd className="font-medium text-ink dark:text-fog">{formatCLP(fee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-forest-900/8 pt-3 text-base dark:border-white/8">
                      <dt className="font-semibold text-ink dark:text-fog">Total</dt>
                      <dd className="font-semibold text-ink dark:text-fog">{formatCLP(total)}</dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-xs leading-relaxed text-muted dark:text-fogmuted">
                    El dueño recibe el 100% de la noche. La comisión de servicio la paga el viajero.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
