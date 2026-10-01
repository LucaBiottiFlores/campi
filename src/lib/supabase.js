import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// Si no hay variables de entorno configuradas, la app corre en "modo demo"
// con datos mock y las funciones de cuenta quedan deshabilitadas.
export const isSupabaseConfigured = Boolean(url && anon && url.startsWith('https://'))

export const supabase = isSupabaseConfigured ? createClient(url, anon) : null
