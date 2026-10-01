import { supabase } from './supabase.js'
import { campings as mockCampings } from '../data/campings.js'

const mockReviews = [
  { id: 'm1', user_id: 'demo-1', nombre: 'Rodrigo T.', nota: 5, comentario: 'Parcelas grandes y el dueño respondió todas nuestras dudas. Volveremos.' },
  { id: 'm2', user_id: 'demo-2', nombre: 'Constanza P.', nota: 4, comentario: 'La descripción coincide con lo que encontramos. Baño limpio y fogata perfecta.' },
]

function normalize(c) {
  const fotos = Array.isArray(c.fotos)
    ? c.fotos.map((f) => (typeof f === 'string' ? f : f.url))
    : []
  return { ...c, fotos }
}

export async function listCampings() {
  if (!supabase) return mockCampings.map((c) => ({ ...c }))
  const { data, error } = await supabase.from('campings_detalle').select('*').order('creado_en', { ascending: false })
  if (error) throw error
  return (data || []).map(normalize)
}

export async function getCamping(id) {
  if (!supabase) return mockCampings.find((c) => c.id === id) || null
  const { data, error } = await supabase.from('campings_detalle').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? normalize(data) : null
}

export async function listResenas(campingId) {
  if (!supabase) return mockReviews.map((r) => ({ ...r }))
  const { data, error } = await supabase
    .from('resenas')
    .select('id, user_id, nota, comentario, creado_en, profiles(nombre)')
    .eq('camping_id', campingId)
    .order('creado_en', { ascending: false })
  if (error) throw error
  return (data || []).map((r) => ({
    id: r.id,
    user_id: r.user_id,
    nota: r.nota,
    comentario: r.comentario,
    creado_en: r.creado_en,
    nombre: r.profiles?.nombre || 'Usuario',
  }))
}

export async function addResena(campingId, nota, comentario) {
  if (!supabase) throw new Error('demo')
  const { data: session } = await supabase.auth.getSession()
  const userId = session?.session?.user?.id
  if (!userId) throw new Error('no-autenticado')
  const { data, error } = await supabase
    .from('resenas')
    .insert({ camping_id: campingId, user_id: userId, nota, comentario })
    .select('id, user_id, nota, comentario, creado_en')
    .single()
  if (error) throw error
  return data
}

export async function updateResena(id, nota, comentario) {
  if (!supabase) throw new Error('demo')
  const { error } = await supabase.from('resenas').update({ nota, comentario }).eq('id', id)
  if (error) throw error
}

export async function deleteResena(id) {
  if (!supabase) throw new Error('demo')
  const { error } = await supabase.from('resenas').delete().eq('id', id)
  if (error) throw error
}

export async function listMyCampings(ownerId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('campings_detalle')
    .select('*')
    .eq('owner_id', ownerId)
    .order('creado_en', { ascending: false })
  if (error) throw error
  return (data || []).map(normalize)
}

export async function createCamping(ownerId, payload) {
  if (!supabase) throw new Error('demo')
  const { data, error } = await supabase.from('campings').insert({ owner_id: ownerId, ...payload }).select().single()
  if (error) throw error
  return data
}

export async function updateCamping(id, payload) {
  if (!supabase) throw new Error('demo')
  const { data, error } = await supabase
    .from('campings')
    .update({ ...payload, actualizado_en: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCamping(id) {
  if (!supabase) throw new Error('demo')
  const { error } = await supabase.from('campings').delete().eq('id', id)
  if (error) throw error
}

export async function uploadFoto(ownerId, campingId, file) {
  if (!supabase) throw new Error('demo')
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const path = `${ownerId}/${campingId}/${name}`
  const { error } = await supabase.storage.from('camping-fotos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from('camping-fotos').getPublicUrl(path)
  const { error: insErr } = await supabase.from('camping_fotos').insert({
    camping_id: campingId,
    url: data.publicUrl,
  })
  if (insErr) throw insErr
  return data.publicUrl
}

export async function deleteFoto(url) {
  if (!supabase) return
  // Intenta borrar el registro y el objeto de storage (idempotente si falla el path).
  await supabase.from('camping_fotos').delete().eq('url', url)
  const path = url.split('/camping-fotos/')[1]
  if (path) await supabase.storage.from('camping-fotos').remove([path])
}

export async function listDisponibilidad(campingId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('disponibilidad')
    .select('fecha, disponible')
    .eq('camping_id', campingId)
  if (error) throw error
  return data || []
}

export async function setDisponibilidad(campingId, fecha, disponible) {
  if (!supabase) throw new Error('demo')
  const { error } = await supabase.from('disponibilidad').upsert(
    { camping_id: campingId, fecha, disponible },
    { onConflict: 'camping_id,fecha' },
  )
  if (error) throw error
}
