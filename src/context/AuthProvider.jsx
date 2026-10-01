import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase.js'
import { AuthContext } from './auth.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadProfile = useCallback(async (userId) => {
    if (!supabase) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (!data) {
      // La fila la crea un trigger al registrarse; espera un instante por si hay carrera.
      await new Promise((r) => setTimeout(r, 400))
      const retry = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      return retry.data
    }
    return data
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const sessionUser = data?.session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) {
        const p = await loadProfile(sessionUser.id)
        if (active) setProfile(p)
      }
      if (active) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)
      if (sessionUser) {
        const p = await loadProfile(sessionUser.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const signUp = useCallback(async ({ email, password, nombre, rol }) => {
    if (!supabase) throw new Error('demo')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, rol },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}${import.meta.env.BASE_URL}` : undefined,
      },
    })
    if (error) throw error
    // Si hay sesión, el email ya está confirmado; si no, toca confirmar.
    return { needsConfirmation: !data.session }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!supabase) throw new Error('demo')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      isOwner: profile?.rol === 'dueño',
      signUp,
      signIn,
      signOut,
    }),
    [user, profile, loading, signUp, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
