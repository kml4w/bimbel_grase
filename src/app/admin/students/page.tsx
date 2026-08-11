import { getPrograms } from '../programs/actions'
import { getAllStudents } from './actions'
import StudentsClient from './StudentsClient'

export const metadata = {
  title: 'Kelola Siswa | Admin Bimbel Grase',
}

export default async function AdminStudentsPage() {
  const [
    { data: students, success: studentsSuccess, message: studentsMsg }, 
    { data: programs, success: programsSuccess, message: programsMsg }
  ] = await Promise.all([
    getAllStudents(),
    getPrograms()
  ])

  if (!studentsSuccess || !programsSuccess) {
    console.error('Admin Students Error:', { studentsMsg, programsMsg })
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Gagal memuat data siswa atau program. Pastikan Anda memiliki akses admin.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Siswa</h1>
        <p className="text-gray-500 mt-1">
          Kelola seluruh daftar siswa aktif, ubah kelas, status pembayaran, atau nonaktifkan siswa.
        </p>
      </div>

      <StudentsClient 
        initialStudents={students || []} 
        programs={programs || []} 
      />
    </div>
  )
}
