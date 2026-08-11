'use client'

import { useState } from 'react'
import ProgramFormModal from './ProgramFormModal'
import { deleteProgram } from './actions'

type Program = {
  id: string
  name: string
  target_age: string
  tutor: string
  schedule: string
  fee: number
  description: string
}

export default function ProgramsClient({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setSelectedProgram(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (prog: Program) => {
    setSelectedProgram(prog)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini? Tindakan ini tidak dapat dibatalkan.')) return
    
    setIsDeleting(id)
    const res = await deleteProgram(id)
    setIsDeleting(null)

    if (res.success) {
      setPrograms(prev => prev.filter(p => p.id !== id))
    } else {
      alert(res.message || 'Gagal menghapus program')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">info</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Belum ada kelas</h3>
            <p className="text-gray-500 mt-1">Mulai dengan menambahkan kelas atau program bimbingan belajar baru.</p>
          </div>
        ) : (
          programs.map((prog) => (
            <div key={prog.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{prog.name}</h3>
                  <span className="inline-block mt-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg">
                    Usia: {prog.target_age}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleOpenEdit(prog)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center"
                    title="Edit Program"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prog.id)}
                    disabled={isDeleting === prog.id}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                    title="Hapus Program"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 flex-grow">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined mt-0.5 text-gray-400 shrink-0 text-[18px]">schedule</span>
                  <span>{prog.schedule}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined mt-0.5 text-gray-400 shrink-0 text-[18px]">person</span>
                  <span>Tutor: {prog.tutor}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="material-symbols-outlined mt-0.5 text-gray-400 shrink-0 text-[18px]">payments</span>
                  <span className="font-semibold text-gray-800">Rp {prog.fee.toLocaleString('id-ID')} <span className="font-normal text-gray-500">/ bulan</span></span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50">
                <p className="text-sm text-gray-500 line-clamp-2" title={prog.description}>
                  {prog.description || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <ProgramFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        programToEdit={selectedProgram}
        onSuccess={(newProgram, isEdit) => {
          if (isEdit) {
            setPrograms(prev => prev.map(p => p.id === newProgram.id ? newProgram : p))
          } else {
            setPrograms(prev => [newProgram, ...prev])
          }
        }}
      />
    </div>
  )
}
