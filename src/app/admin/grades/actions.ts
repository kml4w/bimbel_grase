'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getQuizGrades() {
  const supabase = await createClient()

  // Verifikasi admin/tutor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  // join with students and programs
  const { data, error } = await supabase
    .from('grades')
    .select(`
      *,
      students!inner (
        student_name,
        programs!inner (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) return { success: false, message: error.message }
  return { success: true, data }
}

export async function getAssignmentSubmissions() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      students!inner (
        student_name,
        programs!inner (
          name
        )
      ),
      assignments!inner (
        title
      )
    `)
    .order('submitted_at', { ascending: false })

  if (error) return { success: false, message: error.message }
  return { success: true, data }
}

export async function gradeSubmission(submissionId: string, score: number, notes: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  const { error } = await supabase
    .from('submissions')
    .update({
      score,
      notes,
      status: 'graded',
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/admin/grades')
  return { success: true }
}
