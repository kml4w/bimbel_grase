'use client'

import { useState } from 'react'
import { gradeSubmission } from './actions'

type QuizGrade = {
  id: string
  student_id: string
  task_name: string
  score: number
  grade_letter: string
  notes?: string
  created_at: string
  students: {
    student_name: string
    programs: { name: string }
  }
}

type Submission = {
  id: string
  assignment_id: string
  student_id: string
  submitted_file_path: string
  status: string
  score?: number
  notes?: string
  submitted_at: string
  students: {
    student_name: string
    programs: { name: string }
  }
  assignments: {
    title: string
  }
}

export default function GradesClient({ quizGrades, submissions }: { quizGrades: QuizGrade[], submissions: Submission[] }) {
  const [activeTab, setActiveTab] = useState<'quiz' | 'assignment'>('quiz')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  
  const [scoreInput, setScoreInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [loading, setLoading] = useState(false)

  const openGradeModal = (sub: Submission) => {
    setSelectedSubmission(sub)
    setScoreInput(sub.score ? String(sub.score) : '')
    setNotesInput(sub.notes || '')
  }

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubmission) return

    setLoading(true)
    const numScore = Number(scoreInput)
    const res = await gradeSubmission(selectedSubmission.id, numScore, notesInput)
    setLoading(false)

    if (res.success) {
      setSelectedSubmission(null)
      // Note: Data is refreshed via revalidatePath
    } else {
      alert(res.message)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'quiz' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Nilai Kuis
          {activeTab === 'quiz' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
        <button
          onClick={() => setActiveTab('assignment')}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'assignment' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Penugasan Manual
          {activeTab === 'assignment' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />}
        </button>
      </div>

      {activeTab === 'quiz' && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4">Kelas</th>
                  <th className="px-6 py-4">Nama Kuis</th>
                  <th className="px-6 py-4">Skor</th>
                  <th className="px-6 py-4">Predikat</th>
                  <th className="px-6 py-4">Waktu Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {quizGrades.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Belum ada data nilai kuis yang tersimpan.
                    </td>
                  </tr>
                ) : (
                  quizGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{grade.students?.student_name}</td>
                      <td className="px-6 py-4 text-gray-600">{grade.students?.programs?.name}</td>
                      <td className="px-6 py-4 text-gray-600">{grade.task_name}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{grade.score}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold
                          ${grade.grade_letter === 'A' ? 'bg-green-100 text-green-700' : 
                            grade.grade_letter === 'B' ? 'bg-blue-100 text-blue-700' : 
                            'bg-orange-100 text-orange-700'}`}
                        >
                          {grade.grade_letter}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(grade.created_at).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignment' && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4">Tugas</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Skor</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Belum ada siswa yang mengumpulkan tugas manual.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {sub.students?.student_name}
                        <div className="text-xs text-gray-500 mt-1 font-normal">{sub.students?.programs?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{sub.assignments?.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold
                          ${sub.status === 'graded' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                        >
                          {sub.status === 'graded' ? 'Dinilai' : 'Menunggu Nilai'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {sub.status === 'graded' ? sub.score : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openGradeModal(sub)}
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          {sub.status === 'graded' ? 'Edit Nilai' : 'Beri Nilai'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Beri Nilai Tugas</h2>
                <p className="text-sm text-gray-500 mt-1">Siswa: <span className="font-semibold text-gray-700">{selectedSubmission.students?.student_name}</span></p>
              </div>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                <p className="text-sm font-semibold text-blue-800 mb-2">File Unggahan Siswa:</p>
                <a 
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/student-submissions/${selectedSubmission.submitted_file_path}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Lihat/Unduh File
                </a>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skor (0 - 100) *</label>
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  required 
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="Misal: 85" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan untuk Siswa (Opsional)</label>
                <textarea 
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                  placeholder="Berikan saran atau apresiasi..." 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedSubmission(null)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 flex items-center gap-2">
                  {loading ? 'Menyimpan...' : 'Simpan Nilai'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
