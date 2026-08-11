import { getStudentAssignments, getStudentQuizzes } from '../actions'
import ElearningListClient from './ElearningListClient'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Ruang Kelas E-Learning | Bimbel Grase',
}

export default async function StudentElearningPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params
  const { data, success, message } = await getStudentAssignments(studentId)
  const quizzesData = await getStudentQuizzes(studentId)

  if (!success) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-12">
        <div className="bg-rose-50 text-rose-800 p-6 rounded-2xl border border-rose-200 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl">lock</span>
          <h2 className="text-xl font-bold">Akses Terkunci</h2>
          <p>{message}</p>
          <Link href="/parent" className="inline-block px-6 py-2 bg-rose-600 text-white rounded-full font-bold">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/parent" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Ruang Kelas E-Learning</h1>
          <p className="text-on-surface-variant">Materi dan tugas untuk <span className="font-bold text-primary">{data?.studentName}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
        <ElearningListClient 
          studentId={studentId} 
          assignments={data?.assignments || []} 
          quizzes={quizzesData?.data || []}
        />
      </div>
    </section>
  )
}
