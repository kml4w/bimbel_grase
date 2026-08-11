import { getAssignments, getQuizzes } from './actions'
import { getPrograms } from '../programs/actions'
import AssignmentsTab from './AssignmentsTab'
import QuizzesTab from './QuizzesTab'
import ClientTabManager from './ClientTabManager'

export const metadata = {
  title: 'Manajemen Materi & Tugas | Dasbor Admin',
}

export default async function AdminAssignmentsPage() {
  const [
    { data: assignments, success: assignmentsSuccess, message: assignmentsMsg },
    { data: quizzes, success: quizzesSuccess, message: quizzesMsg },
    { data: programs, success: programsSuccess }
  ] = await Promise.all([
    getAssignments(),
    getQuizzes(),
    getPrograms()
  ])

  if (!assignmentsSuccess || !quizzesSuccess || !programsSuccess) {
    console.error('Error fetching E-Learning data:', { assignmentsMsg, quizzesMsg })
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Gagal memuat data Materi/Kuis. Pastikan Anda memiliki akses admin atau tutor.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Materi, Tugas, & Kuis</h1>
          <p className="text-gray-500 mt-1">Kelola modul PDF dan buat kuis pilihan ganda untuk setiap kelas.</p>
        </div>
      </div>

      <ClientTabManager>
        <AssignmentsTab assignments={assignments || []} programs={programs || []} />
        <QuizzesTab quizzes={quizzes || []} programs={programs || []} />
      </ClientTabManager>
    </div>
  )
}
