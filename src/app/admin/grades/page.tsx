import GradesClient from './GradesClient'
import { getQuizGrades, getAssignmentSubmissions } from './actions'

export const metadata = {
  title: 'Penilaian & Rekap Nilai | Dasbor Admin',
}

export default async function GradesPage() {
  const { data: quizGrades } = await getQuizGrades()
  const { data: submissions } = await getAssignmentSubmissions()

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Penilaian & Rekap Nilai</h1>
        <p className="text-gray-500 mt-1">Pantau hasil kuis otomatis dan berikan penilaian manual untuk tugas siswa.</p>
      </div>

      <GradesClient 
        quizGrades={quizGrades || []} 
        submissions={submissions || []} 
      />
    </div>
  )
}
