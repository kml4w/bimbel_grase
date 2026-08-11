'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createQuiz, deleteQuiz } from './actions'

type Program = { id: string, name: string }
type Quiz = {
  id: string
  title: string
  program_id: string
  programs: Program
  created_at: string
  duration?: number
  questions_count?: number
}

export default function QuizzesTab({ quizzes, programs }: { quizzes: Quiz[], programs: Program[] }) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createQuiz(formData)
    setLoading(false)
    if (res.success && res.data?.id) {
      setIsModalOpen(false)
      router.push(`/admin/assignments/quiz/${res.data.id}`)
    } else {
      alert(res.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus Kuis ini? (Semua pertanyaan dan nilai siswa di dalamnya akan ikut terhapus permanen!).')) return
    setIsDeleting(id)
    await deleteQuiz(id)
    setIsDeleting(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Kuis</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Buat Kuis Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Belum ada kuis yang dibuat.
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group bg-white">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => handleDelete(quiz.id)}
                  disabled={isDeleting === quiz.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <div className="w-10 h-10 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{quiz.title}</h3>
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg mb-4">
                {quiz.programs?.name}
              </span>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">help</span>
                  <span>{quiz.questions_count || 0} Pertanyaan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  <span>{quiz.duration ? `${quiz.duration} mnt` : 'Tanpa Batas'}</span>
                </div>
              </div>

              <Link 
                href={`/admin/assignments/quiz/${quiz.id}`}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-700 font-semibold rounded-xl text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                Kelola Pertanyaan
              </Link>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Buat Kuis Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Kuis *</label>
                <input type="text" name="title" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="Misal: Kuis Tengah Semester" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kelas / Program *</label>
                <select name="program_id" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
                  <option value="" disabled>Pilih Kelas</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Durasi (Menit)</label>
                  <input type="number" name="time_limit_minutes" className="w-full px-4 py-2.5 rounded-xl border border-gray-200" placeholder="Kosongkan jika tanpa batas" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 flex items-center gap-2">
                  {loading ? 'Membuat...' : 'Buat Kuis'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
