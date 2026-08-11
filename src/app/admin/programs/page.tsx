import { getPrograms } from './actions'
import ProgramsClient from './ProgramsClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminProgramsPage() {
  const result = await getPrograms()

  if (!result.success && result.message === 'Unauthorized') {
    redirect('/login')
  }
  
  if (!result.success && result.message === 'Forbidden') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 font-semibold">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    )
  }

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Manajemen Kelas & Program</h1>
        <p className="text-gray-500 mt-1">Kelola data program bimbel, usia target, biaya, dan jadwal kelas.</p>
      </div>
      
      <ProgramsClient initialPrograms={result.data || []} />
    </main>
  )
}
