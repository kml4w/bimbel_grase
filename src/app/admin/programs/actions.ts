'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPrograms() {
  const supabase = await createClient()
  
  // Verifikasi admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, data }
}

export async function createProgram(formData: {
  name: string
  target_age: string
  tutor: string
  schedule: string
  fee: number
  description: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { error } = await supabase.from('programs').insert([formData])

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/programs')
  return { success: true }
}

export async function updateProgram(id: string, formData: {
  name: string
  target_age: string
  tutor: string
  schedule: string
  fee: number
  description: string
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { error } = await supabase
    .from('programs')
    .update(formData)
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/programs')
  return { success: true }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  // Cek apakah ada siswa yang menggunakan program ini
  const { count, error: countErr } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('program_id', id)

  if (countErr) {
    return { success: false, message: countErr.message }
  }
  
  if (count && count > 0) {
    return { success: false, message: `Tidak dapat menghapus program ini karena ada ${count} siswa yang terdaftar di dalamnya.` }
  }

  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/programs')
  return { success: true }
}
