'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ----- ASSIGNMENTS ----- //

export async function getAssignments() {
  const supabase = await createClient()

  // Verifikasi admin/tutor
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('assignments')
    .select('*, programs(id, name)')
    .order('created_at', { ascending: false })

  if (error) return { success: false, message: error.message }
  return { success: true, data }
}

export async function createAssignment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  const program_id = formData.get('program_id') as string
  const title = formData.get('title') as string
  const pdf_file = formData.get('pdf_file') as File | null
  const opened_date = formData.get('opened_date') as string
  const due_date = formData.get('due_date') as string
  const highlight_text = formData.get('highlight_text') as string

  let pdf_file_path = null
  let pdf_title = null

  if (pdf_file && pdf_file.size > 0) {
    const fileExt = pdf_file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assignment-materials')
      .upload(fileName, pdf_file)

    if (uploadError) return { success: false, message: `Upload error: ${uploadError.message}` }
    pdf_file_path = uploadData.path
    pdf_title = pdf_file.name
  }

  const { error } = await supabase.from('assignments').insert({
    program_id,
    title,
    pdf_title,
    pdf_file_path,
    opened_date: opened_date || null,
    due_date: due_date || null,
    highlight_text
  })

  if (error) return { success: false, message: error.message }
  revalidatePath('/admin/assignments')
  return { success: true }
}

export async function deleteAssignment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }

  const { error } = await supabase.from('assignments').delete().eq('id', id)
  if (error) return { success: false, message: error.message }
  revalidatePath('/admin/assignments')
  return { success: true }
}


// ----- QUIZZES ----- //

export async function getQuizzes() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'tutor')) return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('quizzes')
    .select('*, programs(id, name)')
    .order('created_at', { ascending: false })

  if (error) return { success: false, message: error.message }
  return { success: true, data }
}

export async function createQuiz(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }

  const program_id = formData.get('program_id') as string
  const title = formData.get('title') as string
  const duration = formData.get('time_limit_minutes') ? Number(formData.get('time_limit_minutes')) : 0

  const { data, error } = await supabase.from('quizzes').insert({
    program_id,
    title,
    duration,
    questions_count: 0,
    questions: []
  }).select('id').single()

  if (error) return { success: false, message: error.message }
  revalidatePath('/admin/assignments')
  return { success: true, data: { id: data.id } }
}

export async function deleteQuiz(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }

  const { error } = await supabase.from('quizzes').delete().eq('id', id)
  if (error) return { success: false, message: error.message }
  revalidatePath('/admin/assignments')
  return { success: true }
}

// ---- QUESTIONS ----- //
export async function getQuizQuestions(quiz_id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quizzes')
    .select('questions')
    .eq('id', quiz_id)
    .single()

  if (error) return { success: false, message: error.message }
  
  let questionsArray = []
  if (data?.questions) {
    questionsArray = Array.isArray(data.questions) ? data.questions : (typeof data.questions === 'string' ? JSON.parse(data.questions) : [])
  }
  
  return { success: true, data: questionsArray }
}

export async function createQuestion(quiz_id: string, question_text: string, options: string[], correct_option_index: number) {
  const supabase = await createClient()
  
  // Ambil dulu kuis lama
  const { data: quiz, error: quizError } = await supabase.from('quizzes').select('questions, questions_count').eq('id', quiz_id).single()
  if (quizError || !quiz) return { success: false, message: 'Quiz not found' }

  const newQuestion = {
    id: crypto.randomUUID(),
    quiz_id,
    question_text,
    options,
    correct_option_index
  }

  const currentQuestions = Array.isArray(quiz.questions) ? quiz.questions : (typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : [])
  const updatedQuestions = [...currentQuestions, newQuestion]
  const currentCount = typeof quiz.questions_count === 'number' ? quiz.questions_count : 0

  const { error } = await supabase.from('quizzes').update({
    questions: updatedQuestions,
    questions_count: currentCount + 1
  }).eq('id', quiz_id)

  if (error) return { success: false, message: error.message }
  revalidatePath(`/admin/assignments/quiz/${quiz_id}`)
  return { success: true }
}

export async function deleteQuestion(id: string, quiz_id: string) {
  const supabase = await createClient()
  
  const { data: quiz, error: quizError } = await supabase.from('quizzes').select('questions, questions_count').eq('id', quiz_id).single()
  if (quizError || !quiz) return { success: false, message: 'Quiz not found' }

  const currentQuestions = Array.isArray(quiz.questions) ? quiz.questions : (typeof quiz.questions === 'string' ? JSON.parse(quiz.questions) : [])
  const updatedQuestions = currentQuestions.filter((q: any) => q.id !== id)
  const currentCount = typeof quiz.questions_count === 'number' ? quiz.questions_count : 0

  const { error } = await supabase.from('quizzes').update({
    questions: updatedQuestions,
    questions_count: Math.max(0, currentCount - 1)
  }).eq('id', quiz_id)

  if (error) return { success: false, message: error.message }
  revalidatePath(`/admin/assignments/quiz/${quiz_id}`)
  return { success: true }
}
