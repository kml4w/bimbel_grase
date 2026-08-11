'use client'

import { useState } from 'react'
import { createQuestion, deleteQuestion } from '../../actions'

type Question = {
  id: string
  quiz_id: string
  question_text: string
  options: string[]
  correct_option_index: number
}

export default function QuizQuestionsClient({ quizId, initialQuestions }: { quizId: string, initialQuestions: Question[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // State for new question
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<string[]>(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi
    if (options.some(opt => opt.trim() === '')) {
      alert('Semua opsi jawaban harus diisi!')
      return
    }
    
    setLoading(true)
    const res = await createQuestion(quizId, questionText, options, correctIndex)
    setLoading(false)
    
    if (res.success) {
      setIsModalOpen(false)
      // Reset form
      setQuestionText('')
      setOptions(['', '', '', ''])
      setCorrectIndex(0)
    } else {
      alert(res.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pertanyaan ini?')) return
    setIsDeleting(id)
    await deleteQuestion(id, quizId)
    setIsDeleting(null)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Daftar Pertanyaan ({initialQuestions.length})</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tambah Pertanyaan
        </button>
      </div>

      <div className="space-y-4">
        {initialQuestions.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Belum ada pertanyaan untuk kuis ini. Silakan tambah pertanyaan pertama Anda.
          </div>
        ) : (
          initialQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(q.id)}
                  disabled={isDeleting === q.id}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{q.question_text}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Array.isArray(q.options) ? q.options : []).map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className={`p-3 rounded-xl border ${oIdx === q.correct_option_index ? 'bg-green-50 border-green-200 text-green-800 font-semibold' : 'bg-gray-50 border-gray-100 text-gray-600'}`}
                      >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        {oIdx === q.correct_option_index && (
                          <span className="material-symbols-outlined text-[16px] text-green-600 float-right">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Tambah Pertanyaan Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pertanyaan *</label>
                <textarea 
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required 
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  placeholder="Ketik pertanyaan di sini..." 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Opsi Jawaban *</label>
                <div className="space-y-3">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex items-center">
                        <input 
                          type="radio"
                          name="correct_option"
                          checked={correctIndex === idx}
                          onChange={() => setCorrectIndex(idx)}
                          className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                        />
                      </div>
                      <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary focus-within:bg-white transition-colors">
                        <span className="font-bold text-gray-400 w-6">{String.fromCharCode(65 + idx)}.</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(idx, e.target.value)}
                          className="flex-1 bg-transparent border-none focus:ring-0 outline-none p-0 text-gray-700"
                          placeholder={`Jawaban ${String.fromCharCode(65 + idx)}`}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-semibold">Tips:</span> Klik tombol radio bundar di sebelah kiri untuk menentukan jawaban yang benar.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 flex items-center gap-2">
                  {loading ? 'Menyimpan...' : 'Simpan Pertanyaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
