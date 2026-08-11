'use client'

import { useState } from 'react'
import { createAssignment, deleteAssignment } from './actions'

type Program = { id: string, name: string }
type Assignment = {
  id: string
  title: string
  program_id: string
  programs: Program
  created_at: string
  pdf_title?: string
  opened_date?: string
  due_date?: string
}

export default function AssignmentsTab({ assignments, programs }: { assignments: Assignment[], programs: Program[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createAssignment(formData)
    setLoading(false)
    if (res.success) {
      setIsModalOpen(false)
    } else {
      alert(res.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus materi penugasan ini? (Semua file penugasan dari siswa juga akan hilang).')) return
    setIsDeleting(id)
    await deleteAssignment(id)
    setIsDeleting(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Materi & Tugas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Upload Materi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Belum ada materi atau tugas yang diunggah.
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(assignment.id)}
                  disabled={isDeleting === assignment.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">library_books</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{assignment.title}</h3>
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg mb-4">
                {assignment.programs?.name}
              </span>

              {assignment.pdf_title && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mb-3">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">picture_as_pdf</span>
                  <span className="truncate">{assignment.pdf_title}</span>
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1">
                {assignment.opened_date && (
                  <p>Mulai: {new Date(assignment.opened_date).toLocaleString('id-ID')}</p>
                )}
                {assignment.due_date && (
                  <p>Tenggat: {new Date(assignment.due_date).toLocaleString('id-ID')}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Upload Materi / Tugas Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Penugasan *</label>
                <input type="text" name="title" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="Misal: Modul Belajar Tematik 1" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kelas / Program *</label>
                <select name="program_id" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
                  <option value="" disabled>Pilih Kelas</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">File Modul/Soal (PDF)</label>
                <input type="file" name="pdf_file" accept=".pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Waktu Buka</label>
                  <input type="datetime-local" name="opened_date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Waktu Tutup (Tenggat)</label>
                  <input type="datetime-local" name="due_date" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 flex items-center gap-2">
                  {loading ? 'Mengunggah...' : 'Upload Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
