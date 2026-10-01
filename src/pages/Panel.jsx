import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarBlank,
  Image as ImageIcon,
  MapPin,
  PencilSimple,
  Plus,
  Trash,
  X,
} from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/auth.js'
import {
  createCamping,
  deleteCamping,
  deleteFoto,
  listDisponibilidad,
  listMyCampings,
  setDisponibilidad,
  updateCamping,
  uploadFoto,
} from '../lib/api.js'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { formatCLP } from '../data/campings.js'

const SERVICIOS = ['Agua potable', 'Baños', 'Baños con ducha', 'Fogata', 'Luz', 'Estacionamiento', 'Mascotas', 'Desayuno']

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Ventana fija de 30 días para el calendario de disponibilidad.
const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() + i + 1)
  return d
})

function emptyDraft() {
  return {
    nombre: '',
    zona: '',
    region: '',
    descripcion: '',
    capacidad: 4,
    precio: 15000,
    servicios: [],
    reglas: [],
  }
}

function draftToPayload(draft) {
  return {
    nombre: draft.nombre.trim(),
    zona: draft.zona.trim(),
    region: draft.region.trim(),
    descripcion: draft.descripcion.trim(),
    capacidad: Number(draft.capacidad) || 4,
    precio: Number(draft.precio) || 0,
    servicios: draft.servicios,
    reglas: draft.reglas.filter((r) => r.trim()),
  }
}

export default function Panel() {
  const { user } = useAuth()

  const [campings, setCampings] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  const [draft, setDraft] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [campingId, setCampingId] = useState(null)
  const [fotos, setFotos] = useState([])
  const [blocked, setBlocked] = useState(new Set())
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const loadCampings = useCallback(async () => {
    if (!user || !isSupabaseConfigured) return
    const data = await listMyCampings(user.id)
    setCampings(data)
  }, [user])

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return
    listMyCampings(user.id)
      .then(setCampings)
      .catch(() => setError('No pudimos cargar tus campings.'))
      .finally(() => setLoading(false))
  }, [user])

  async function openEditor(camping) {
    setDraft({
      nombre: camping.nombre,
      zona: camping.zona,
      region: camping.region,
      descripcion: camping.descripcion || '',
      capacidad: camping.capacidad,
      precio: camping.precio,
      servicios: camping.servicios || [],
      reglas: camping.reglas || [],
    })
    setIsNew(false)
    setCampingId(camping.id)
    setFotos(camping.fotos || [])
    setBlocked(new Set())
    setFormError('')

    const disp = await listDisponibilidad(camping.id)
    setBlocked(new Set(disp.filter((d) => !d.disponible).map((d) => d.fecha)))
  }

  function openNew() {
    setDraft(emptyDraft())
    setIsNew(true)
    setCampingId(null)
    setFotos([])
    setBlocked(new Set())
    setFormError('')
  }

  function closeEditor() {
    setDraft(null)
    setCampingId(null)
    setFotos([])
  }

  function toggleServicio(s) {
    setDraft((d) => ({
      ...d,
      servicios: d.servicios.includes(s) ? d.servicios.filter((x) => x !== s) : [...d.servicios, s],
    }))
  }

  async function save() {
    if (!draft.nombre.trim() || !draft.zona.trim() || !draft.region.trim()) {
      setFormError('Completa nombre, zona y región.')
      return
    }
    setBusy(true)
    setFormError('')
    try {
      const payload = draftToPayload(draft)
      if (isNew) {
        const created = await createCamping(user.id, payload)
        setCampingId(created.id)
        setIsNew(false)
        await loadCampings()
      } else {
        await updateCamping(campingId, payload)
        await loadCampings()
      }
    } catch {
      setFormError('No se pudo guardar. Intenta de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  async function removeCamping() {
    if (!campingId || !window.confirm('¿Eliminar este camping y sus fotos? Esta acción no se puede deshacer.')) return
    setBusy(true)
    try {
      await deleteCamping(campingId)
      closeEditor()
      await loadCampings()
    } catch {
      setFormError('No se pudo eliminar.')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpload(e) {
    if (!campingId) return
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setBusy(true)
    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue
        if (file.size > 5 * 1024 * 1024) {
          setFormError('Las fotos deben pesar menos de 5 MB.')
          continue
        }
        const url = await uploadFoto(user.id, campingId, file)
        setFotos((prev) => [...prev, url])
      }
      await loadCampings()
    } catch {
      setFormError('No se pudo subir la foto.')
    } finally {
      setBusy(false)
    }
  }

  async function removeFoto(url) {
    setBusy(true)
    try {
      await deleteFoto(url)
      setFotos((prev) => prev.filter((f) => f !== url))
    } catch {
      setFormError('No se pudo eliminar la foto.')
    } finally {
      setBusy(false)
    }
  }

  async function toggleFecha(fecha) {
    if (!campingId) return
    const disponible = blocked.has(fecha)
    const next = new Set(blocked)
    if (disponible) next.delete(fecha)
    else next.add(fecha)
    setBlocked(next)
    try {
      await setDisponibilidad(campingId, fecha, disponible)
    } catch {
      setFormError('No se pudo actualizar la fecha.')
    }
  }

  const days = CALENDAR_DAYS

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-forest-900/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-forest-600 dark:border-white/15 dark:bg-night2 dark:text-fog'

  return (
    <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Panel del dueño</h1>
            <p className="mt-2 text-muted dark:text-fogmuted">
              Administra tus campings, fotos, disponibilidad y precios.
            </p>
          </div>
          {!draft && (
            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-full bg-forest-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
            >
              <Plus size={16} weight="bold" />
              Nuevo camping
            </button>
          )}
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-6 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm">
            La conexión con la base de datos aún no está configurada. Conéctala para administrar tus campings desde aquí.
          </div>
        )}

        {error && <p className="mt-6 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {/* Lista de campings */}
        {!draft && !loading && campings.length === 0 && (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-forest-900/20 px-6 py-16 text-center dark:border-white/15">
            <ImageIcon size={40} weight="duotone" className="text-forest-300 dark:text-forest-600" />
            <h2 className="mt-4 text-lg font-semibold">Aún no tienes campings</h2>
            <p className="mt-2 max-w-sm text-sm text-muted dark:text-fogmuted">
              Crea tu primer anuncio y empieza a recibir reservas.
            </p>
          </div>
        )}

        {!draft && !loading && campings.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campings.map((c) => (
              <div key={c.id} className="overflow-hidden rounded-2xl border border-forest-900/8 bg-white dark:border-white/8 dark:bg-night2">
                <div className="aspect-[4/3] overflow-hidden">
                  {c.fotos?.[0] ? (
                    <img src={c.fotos[0]} alt={c.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-forest-50 text-forest-300 dark:bg-forest-900/30">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-ink dark:text-fog">{c.nombre}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted dark:text-fogmuted">
                    <MapPin size={14} className="text-forest-500" />
                    {c.zona}, {c.region}
                  </p>
                  <p className="mt-1 text-sm text-muted dark:text-fogmuted">{formatCLP(c.precio)} / noche</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditor(c)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
                    >
                      <PencilSimple size={15} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm('¿Eliminar este camping? Esta acción no se puede deshacer.')) return
                        await deleteCamping(c.id)
                        await loadCampings()
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-400"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        {draft && (
          <div className="mt-8 rounded-3xl border border-forest-900/8 bg-white p-6 sm:p-8 dark:border-white/8 dark:bg-night2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{isNew ? 'Nuevo camping' : 'Editar camping'}</h2>
              <button type="button" onClick={closeEditor} className="text-muted hover:text-ink dark:text-fogmuted dark:hover:text-fog" aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="nombre">Nombre</label>
                <input id="nombre" value={draft.nombre} onChange={(e) => setDraft({ ...draft, nombre: e.target.value })} className={inputClass} placeholder="Camping El Roble" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="precio">Precio por noche (CLP)</label>
                <input id="precio" type="number" min={0} value={draft.precio} onChange={(e) => setDraft({ ...draft, precio: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="zona">Zona</label>
                <input id="zona" value={draft.zona} onChange={(e) => setDraft({ ...draft, zona: e.target.value })} className={inputClass} placeholder="Cajón del Maipo" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="region">Región</label>
                <input id="region" value={draft.region} onChange={(e) => setDraft({ ...draft, region: e.target.value })} className={inputClass} placeholder="Región Metropolitana" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="capacidad">Capacidad (personas)</label>
                <input id="capacidad" type="number" min={1} max={50} value={draft.capacidad} onChange={(e) => setDraft({ ...draft, capacidad: e.target.value })} className={inputClass} />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" rows={3} value={draft.descripcion} onChange={(e) => setDraft({ ...draft, descripcion: e.target.value })} className={`${inputClass} resize-none`} placeholder="Cuéntale al viajero qué encontrará." />
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium">Servicios</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {SERVICIOS.map((s) => {
                  const active = draft.servicios.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleServicio(s)}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        active
                          ? 'bg-forest-600 text-white'
                          : 'bg-bone text-muted ring-1 ring-forest-900/10 hover:text-ink dark:bg-night dark:text-fogmuted dark:ring-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium" htmlFor="reglas">Reglas (una por línea)</label>
              <textarea id="reglas" rows={3} value={draft.reglas.join('\n')} onChange={(e) => setDraft({ ...draft, reglas: e.target.value.split('\n') })} className={`${inputClass} resize-none`} placeholder={'Check-in desde 14:00\nCheck-out hasta 12:00'} />
            </div>

            {/* Fotos */}
            <div className="mt-6 border-t border-forest-900/8 pt-6 dark:border-white/8">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <ImageIcon size={17} className="text-forest-500" /> Fotos
              </h3>
              {campingId ? (
                <>
                  <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {fotos.map((url) => (
                      <div key={url} className="group relative aspect-square overflow-hidden rounded-xl">
                        <img src={url} alt="Foto del camping" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFoto(url)}
                          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                          aria-label="Eliminar foto"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-forest-900/20 text-muted transition hover:border-forest-500 hover:text-forest-600 dark:border-white/15 dark:text-fogmuted">
                      <Plus size={22} />
                      <span className="sr-only">Subir foto</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-muted dark:text-fogmuted">JPG o PNG, máximo 5 MB por foto.</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted dark:text-fogmuted">Guarda primero los datos para poder subir fotos.</p>
              )}
            </div>

            {/* Calendario de disponibilidad */}
            {campingId && (
              <div className="mt-6 border-t border-forest-900/8 pt-6 dark:border-white/8">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarBlank size={17} className="text-forest-500" /> Disponibilidad (próximos 30 días)
                </h3>
                <p className="mt-1 text-xs text-muted dark:text-fogmuted">Toca un día para marcarlo como libre o tomado.</p>
                <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7">
                  {days.map((d) => {
                    const fecha = toISODate(d)
                    const isBlocked = blocked.has(fecha)
                    return (
                      <button
                        key={fecha}
                        type="button"
                        onClick={() => toggleFecha(fecha)}
                        className={`rounded-lg border px-1 py-2 text-center transition ${
                          isBlocked
                            ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300'
                            : 'border-forest-900/10 bg-forest-50 text-forest-800 hover:border-forest-500 dark:border-white/10 dark:bg-forest-900/30 dark:text-forest-100'
                        }`}
                      >
                        <span className="block text-[10px] font-medium uppercase opacity-70">
                          {d.toLocaleDateString('es-CL', { weekday: 'short' }).replace('.', '')}
                        </span>
                        <span className="block text-sm font-semibold">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {formError && <p className="mt-5 text-sm text-red-600 dark:text-red-400">{formError}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={save}
                disabled={busy}
                className="rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:opacity-60"
              >
                {busy ? 'Guardando...' : isNew ? 'Crear camping' : 'Guardar cambios'}
              </button>
              {!isNew && (
                <button
                  type="button"
                  onClick={removeCamping}
                  disabled={busy}
                  className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-400"
                >
                  Eliminar camping
                </button>
              )}
              <Link to="/explorar" className="text-sm font-medium text-muted hover:text-ink dark:text-fogmuted dark:hover:text-fog">
                Cancelar
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  )
}
