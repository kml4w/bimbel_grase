import { getQuizQuestions } from '../../actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import QuizQuestionsClient from './QuizQuestionsClient'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Kelola Pertanyaan Kuis | Dasbor Admin',
}

export default async function QuizQuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  // Get Quiz Metadata
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*, programs(id, name)')
    .eq('id', id)
    .single()

  if (quizError || !quiz) {
    redirect('/admin/assignments')
  }

  // Get Questions
  const { data: questions, success } = await getQuizQuestions(id)

  if (!success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Gagal memuat pertanyaan kuis.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/admin/assignments" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Daftar Kuis
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kelola Pertanyaan Kuis</h1>
          <p className="text-gray-500 mt-1">
            Kuis: <span className="font-semibold">{quiz.title}</span> ({quiz.programs?.name})
          </p>
        </div>
      </div>

      <QuizQuestionsClient quizId={quiz.id} initialQuestions={questions || []} />
    </div>
  )
}
