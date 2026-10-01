import { useEffect, useState } from 'react'
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
  Trash,
  Users,
} from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import Rating from '../components/Rating.jsx'
import { useAuth } from '../context/auth.js'
import { addResena, deleteResena, getCamping, listResenas } from '../lib/api.js'
import { formatCLP } from '../data/campings.js'

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

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Tu calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} estrellas`}
          onClick={() => onChange(n)}
          className="transition hover:scale-110"
        >
          <Star
            size={26}
            weight={n <= value ? 'fill' : 'regular'}
            className={n <= value ? 'text-amber' : 'text-forest-200 dark:text-white/20'}
          />
        </button>
      ))}
    </div>
  )
}

export default function Detalle() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()

  const [camping, setCamping] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [reviewBusy, setReviewBusy] = useState(false)
  const [reviewError, setReviewError] = useState('')

  async function refresh() {
    try {
      const [c, r] = await Promise.all([getCamping(id), listResenas(id)])
      if (!c) {
        setNotFound(true)
      } else {
        setCamping(c)
        setReviews(r)
      }
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [c, r] = await Promise.all([getCamping(id), listResenas(id)])
        if (!active) return
        if (!c) {
          setNotFound(true)
        } else {
          setCamping(c)
          setReviews(r)
        }
      } catch {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null

  async function submitReview(e) {
    e.preventDefault()
    setReviewError('')
    if (!comentario.trim()) {
      setReviewError('Escribe un comentario antes de publicar.')
      return
    }
    setReviewBusy(true)
    try {
      await addResena(id, nota, comentario.trim())
      setComentario('')
      setNota(5)
      await refresh()
    } catch (err) {
      setReviewError(err?.message === 'no-autenticado' ? 'Inicia sesión para dejar una reseña.' : 'No se pudo publicar la reseña.')
    } finally {
      setReviewBusy(false)
    }
  }

  async function removeReview() {
    if (!myReview) return
    setReviewBusy(true)
    try {
      await deleteResena(myReview.id)
      await refresh()
    } catch {
      setReviewError('No se pudo eliminar la reseña.')
    } finally {
      setReviewBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="h-64 animate-pulse rounded-2xl bg-forest-900/5 dark:bg-white/5" />
        </div>
      </div>
    )
  }

  if (notFound || !camping) {
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
                <img src={camping.fotos[0]} alt={camping.nombre} className="aspect-[16/10] w-full object-cover" />
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
                  <Rating value={camping.nota || 0} />
                  <span className="text-sm font-semibold text-ink dark:text-fog">{(camping.nota || 0).toFixed(1)}</span>
                  <span className="text-sm text-muted dark:text-fogmuted">({camping.resenas || 0} reseñas)</span>
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

              {isAuthenticated ? (
                myReview ? (
                  <div className="mt-4 rounded-2xl border border-forest-900/8 bg-white p-5 dark:border-white/8 dark:bg-night2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink dark:text-fog">Tu reseña</p>
                      <button
                        type="button"
                        onClick={removeReview}
                        disabled={reviewBusy}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash size={15} />
                        Eliminar
                      </button>
                    </div>
                    <Rating value={myReview.nota} className="mt-2" />
                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">{myReview.comentario}</p>
                  </div>
                ) : (
                  <form onSubmit={submitReview} className="mt-4 rounded-2xl border border-forest-900/8 bg-white p-5 dark:border-white/8 dark:bg-night2">
                    <p className="text-sm font-semibold text-ink dark:text-fog">¿Cómo estuvo tu experiencia?</p>
                    <div className="mt-3">
                      <StarPicker value={nota} onChange={setNota} />
                    </div>
                    <textarea
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      rows={3}
                      placeholder="Cuéntanos qué te pareció el lugar, los servicios y la atención."
                      className="mt-3 w-full resize-none rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-forest-600 dark:border-white/15 dark:bg-night dark:text-fog dark:placeholder:text-fogmuted"
                    />
                    {reviewError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{reviewError}</p>}
                    <button
                      type="submit"
                      disabled={reviewBusy}
                      className="mt-3 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:opacity-60"
                    >
                      {reviewBusy ? 'Publicando...' : 'Publicar reseña'}
                    </button>
                  </form>
                )
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-forest-900/20 p-5 text-sm text-muted dark:border-white/15 dark:text-fogmuted">
                  <Link to="/auth" className="font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-300">
                    Inicia sesión
                  </Link>{' '}
                  para dejar tu reseña con estrellas y comentario.
                </div>
              )}

              <div className="mt-4 grid gap-4">
                {reviews.length === 0 && (
                  <p className="text-sm text-muted dark:text-fogmuted">Todavía no hay reseñas. Sé el primero en opinar.</p>
                )}
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-forest-900/8 bg-white p-5 dark:border-white/8 dark:bg-night2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink dark:text-fog">{r.nombre}</p>
                      <Rating value={r.nota} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted dark:text-fogmuted">{r.comentario}</p>
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
                  {(camping.nota || 0).toFixed(1)}
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
