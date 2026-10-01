import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarBlank, MagnifyingGlass, MapPin, Users, X } from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CampingCard from '../components/CampingCard.jsx'
import { listCampings } from '../lib/api.js'

export default function Explorar() {
  const [params] = useSearchParams()
  const initialZona = params.get('zona') || ''

  const [campings, setCampings] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [query, setQuery] = useState('')
  const [zona, setZona] = useState(initialZona)
  const [servicios, setServicios] = useState([])
  const [personas, setPersonas] = useState(2)

  useEffect(() => {
    let active = true
    listCampings()
      .then((data) => {
        if (active) setCampings(data)
      })
      .catch(() => {
        if (active) setLoadError('No pudimos cargar los campings. Intenta de nuevo.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const allServices = useMemo(() => Array.from(new Set(campings.flatMap((c) => c.servicios))).sort(), [campings])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return campings.filter((c) => {
      const matchQuery =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.zona.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      const matchZona = !zona || c.zona === zona
      const matchServicios = servicios.every((s) => c.servicios.includes(s))
      return matchQuery && matchZona && matchServicios
    })
  }, [campings, query, zona, servicios])

  function toggleServicio(s) {
    setServicios((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  function clearFilters() {
    setQuery('')
    setZona('')
    setServicios([])
  }

  const hasFilters = query || zona || servicios.length > 0

  return (
    <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
      <Header />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl dark:text-fog">
            Encuentra tu camping
          </h1>
          <p className="mt-3 text-base text-muted dark:text-fogmuted">
            Filtra por destino, fecha y servicios. Todo verificado antes de publicarse.
          </p>
        </div>

        {/* Buscador */}
        <div className="mt-8 grid gap-3 rounded-2xl border border-forest-900/8 bg-white p-3 shadow-sm sm:grid-cols-[1fr_1fr_auto] dark:border-white/8 dark:bg-night2">
          <label className="flex items-center gap-2 rounded-xl bg-bone px-4 py-3 dark:bg-night">
            <MagnifyingGlass size={18} className="shrink-0 text-muted dark:text-fogmuted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Dónde quieres acampar?"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted dark:text-fog dark:placeholder:text-fogmuted"
            />
          </label>

          <label className="flex items-center gap-2 rounded-xl bg-bone px-4 py-3 dark:bg-night">
            <MapPin size={18} className="shrink-0 text-muted dark:text-fogmuted" />
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm text-ink outline-none dark:bg-night dark:text-fog"
            >
              <option value="">Todas las zonas</option>
              {Array.from(new Set(campings.map((c) => c.zona))).map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-xl bg-bone px-4 py-3 dark:bg-night">
            <Users size={18} className="shrink-0 text-muted dark:text-fogmuted" />
            <select
              value={personas}
              onChange={(e) => setPersonas(Number(e.target.value))}
              className="w-full cursor-pointer bg-transparent text-sm text-ink outline-none dark:bg-night dark:text-fog"
              aria-label="Cantidad de personas"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'persona' : 'personas'}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Chips de servicios */}
        <div className="mt-4 flex flex-wrap gap-2">
          {allServices.map((s) => {
            const active = servicios.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleServicio(s)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-forest-600 text-white'
                    : 'bg-white text-muted ring-1 ring-forest-900/10 hover:text-ink dark:bg-night2 dark:text-fogmuted dark:ring-white/10 dark:hover:text-fog'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>

        {/* Resultados */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-muted dark:text-fogmuted">
            {loading
              ? 'Cargando campings...'
              : `${results.length} ${results.length === 1 ? 'camping encontrado' : 'campings encontrados'}`}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 transition hover:text-forest-700 dark:text-forest-300"
            >
              <X size={14} weight="bold" />
              Limpiar filtros
            </button>
          )}
        </div>

        {loadError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-forest-900/5 dark:bg-white/5" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <CampingCard key={c.id} camping={c} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-forest-900/20 px-6 py-20 text-center dark:border-white/15">
            <CalendarBlank size={40} weight="duotone" className="text-forest-300 dark:text-forest-600" />
            <h3 className="mt-4 text-lg font-semibold text-ink dark:text-fog">No encontramos campings</h3>
            <p className="mt-2 max-w-sm text-sm text-muted dark:text-fogmuted">
              Prueba con otra zona o quita algunos filtros de servicios.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
