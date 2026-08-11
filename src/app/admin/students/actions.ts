'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function getAllStudents() {
  const supabase = await createClient()

  // Verifikasi admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('students')
    .select('*, profiles(id, full_name), programs(id, name)')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: error.message }
  }

  // Fetch emails using Admin API
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
  
  const dataWithEmail = data.map(student => {
    const parentUser = usersData?.users.find(u => u.id === student.parent_id)
    return {
      ...student,
      profiles: student.profiles ? {
        ...student.profiles,
        email: parentUser?.email || '-'
      } : null
    }
  })

  return { success: true, data: dataWithEmail }
}

export async function updateStudent(id: string, formData: {
  student_name: string
  age: number
  program_id: string
  payment_status: string
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { error } = await supabase
    .from('students')
    .update(formData)
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/students')
  return { success: true }
}
