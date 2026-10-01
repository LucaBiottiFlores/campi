import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeSlash } from '@phosphor-icons/react'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/auth.js'
import { isSupabaseConfigured } from '../lib/supabase.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function mapAuthError(err) {
  const msg = err?.message || ''
  if (/invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.'
  if (/already registered/i.test(msg)) return 'Ese correo ya está registrado. Inicia sesión.'
  if (/password should be at least/i.test(msg)) return 'La contraseña debe tener al menos 8 caracteres.'
  if (/unable to validate email/i.test(msg) || /invalid email/i.test(msg)) return 'Ingresa un correo válido.'
  if (/rate limit/i.test(msg)) return 'Demasiados intentos. Espera un momento y vuelve a probar.'
  return 'No se pudo completar. Revisa los datos e inténtalo de nuevo.'
}

export default function Auth() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const [mode, setMode] = useState('login')
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState('viajero')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  function validate() {
    if (!EMAIL_RE.test(email)) return 'Ingresa un correo válido.'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    if (mode === 'registro') {
      if (!nombre.trim()) return 'Ingresa tu nombre.'
      if (password !== confirm) return 'Las contraseñas no coinciden.'
    }
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const v = validate()
    if (v) {
      setError(v)
      return
    }
    setBusy(true)
    try {
      if (mode === 'login') {
        await signIn({ email, password })
        navigate('/explorar')
      } else {
        const { needsConfirmation } = await signUp({ email, password, nombre: nombre.trim(), rol })
        if (needsConfirmation) {
          setSent(true)
        } else {
          navigate('/panel')
        }
      }
    } catch (err) {
      setError(mapAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-forest-600 dark:border-white/15 dark:bg-night2 dark:text-fog'

  return (
    <div className="min-h-[100dvh] bg-bone text-ink dark:bg-night dark:text-fog">
      <Header />

      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink dark:text-fogmuted dark:hover:text-fog">
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="mt-6 rounded-3xl border border-forest-900/8 bg-white p-6 shadow-sm sm:p-8 dark:border-white/8 dark:bg-night2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink dark:text-fog">
            {mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}
          </h1>
          <p className="mt-2 text-sm text-muted dark:text-fogmuted">
            {mode === 'login'
              ? 'Accede para reservar, dejar reseñas y más.'
              : 'Regístrate como viajero para reseñar, o como dueño para publicar tu camping.'}
          </p>

          {!isSupabaseConfigured && (
            <div className="mt-5 rounded-xl bg-amber/10 p-4 text-sm text-ink dark:text-fog">
              La conexión con la base de datos aún no está configurada. Una vez conectada, podrás crear tu cuenta aquí.
            </div>
          )}

          {sent ? (
            <div className="mt-6 rounded-xl bg-forest-50 p-4 text-sm text-forest-800 dark:bg-forest-900/30 dark:text-forest-100">
              Te enviamos un correo para confirmar tu cuenta. Revisa tu bandeja de entrada y vuelve para iniciar sesión.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {mode === 'registro' && (
                <div>
                  <label className="text-sm font-medium text-ink dark:text-fog" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-ink dark:text-fog" htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-ink dark:text-fog" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    required
                    minLength={8}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink dark:text-fogmuted dark:hover:text-fog"
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {mode === 'registro' && (
                <div>
                  <label className="text-sm font-medium text-ink dark:text-fog" htmlFor="confirm">
                    Repite la contraseña
                  </label>
                  <input
                    id="confirm"
                    type={showPwd ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="La misma contraseña"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={inputClass}
                  />
                </div>
              )}

              {mode === 'registro' && (
                <div>
                  <span className="text-sm font-medium text-ink dark:text-fog">¿Cómo usarás Campi?</span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {[
                      { value: 'viajero', label: 'Viajero', desc: 'Reservo y reseño' },
                      { value: 'dueño', label: 'Dueño', desc: 'Publico mi camping' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setRol(opt.value)}
                        className={`rounded-xl border p-3 text-left transition ${
                          rol === opt.value
                            ? 'border-forest-600 bg-forest-50 dark:bg-forest-900/30'
                            : 'border-forest-900/15 hover:border-forest-400 dark:border-white/15'
                        }`}
                      >
                        <p className="text-sm font-semibold text-ink dark:text-fog">{opt.label}</p>
                        <p className="mt-0.5 text-xs text-muted dark:text-fogmuted">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy || !isSupabaseConfigured}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-600 py-3 text-sm font-semibold text-white transition hover:bg-forest-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Procesando...
                  </>
                ) : mode === 'login' ? (
                  'Iniciar sesión'
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted dark:text-fogmuted">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('registro')
                    setError('')
                    setSent(false)
                  }}
                  className="font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-300"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setSent(false)
                  }}
                  className="font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-300"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
