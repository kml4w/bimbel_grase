'use client'

import { useState } from 'react'
import StudentEditModal from './StudentEditModal'
import { deleteStudent } from './actions'

type Program = {
  id: string
  name: string
  fee: number
}

type Student = {
  id: string
  student_name: string
  age: number
  payment_status: string
  billing_count?: number
  programs?: {
    id: string
    name: string
  }
  profiles?: {
    id: string
    full_name: string
    email: string
  }
}

export default function StudentsClient({ 
  initialStudents, 
  programs 
}: { 
  initialStudents: Student[],
  programs: Program[]
}) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filteredStudents = students.filter(student => 
    student.student_name.toLowerCase().includes(search.toLowerCase()) ||
    (student.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (student.profiles?.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (student.programs?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}? Tindakan ini permanen dan akan menghilangkan akses belajar anak ini.`)) return
    
    setIsDeleting(id)
    const res = await deleteStudent(id)
    setIsDeleting(null)

    if (res.success) {
      setStudents(prev => prev.filter(s => s.id !== id))
    } else {
      alert(res.message || 'Gagal menghapus siswa')
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Cari nama siswa, orang tua, atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="text-sm text-gray-500">
          Total: <span className="font-semibold text-gray-800">{filteredStudents.length}</span> Siswa
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orang Tua</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Program / Kelas</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usia</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status SPP</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada data siswa yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{student.student_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700">{student.profiles?.full_name || '-'}</div>
                      <div className="text-xs text-gray-500">{student.profiles?.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                        {student.programs?.name || 'Belum Pilih'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {student.age || '-'} Tahun
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg capitalize ${
                          student.payment_status === 'verified' ? 'bg-green-100 text-green-700' :
                          student.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.payment_status}
                        </span>
                        <span className="inline-flex px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold rounded-md">
                          Bulan ke-{student.billing_count || 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center"
                          title="Edit Siswa"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.student_name)}
                          disabled={isDeleting === student.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center disabled:opacity-50"
                          title="Hapus Siswa"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
        programs={programs}
        onSuccess={(updatedStudent) => {
          setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s))
        }}
      />
    </div>
  )
}
