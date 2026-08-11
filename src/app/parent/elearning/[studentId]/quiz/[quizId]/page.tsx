import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import QuizWrapperClient from './QuizWrapperClient'

export const metadata = {
  title: 'Kuis Interaktif | Bimbel Grase',
}

export default async function QuizPage({ params }: { params: Promise<{ studentId: string, quizId: string }> }) {
  const { studentId, quizId } = await params
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify Student
  const { data: student } = await supabase
    .from('students')
    .select('program_id, payment_status')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (!student || student.payment_status !== 'verified') {
    redirect(`/parent/elearning/${studentId}`)
  }

  // Fetch Quiz
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .eq('program_id', student.program_id)
    .single()

  if (quizError || !quiz) {
    redirect(`/parent/elearning/${studentId}`)
  }

  // Check if finished (has grade)
  const { data: grade } = await supabase
    .from('grades')
    .select('*')
    .eq('student_id', studentId)
    .eq('task_name', `Kuis: ${quiz.title}`)
    .single()

  return (
    <QuizWrapperClient 
      quiz={quiz} 
      studentId={studentId} 
      initialGrade={grade || null} 
    />
  )
}
