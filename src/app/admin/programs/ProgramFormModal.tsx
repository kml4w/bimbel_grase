'use client'

import { useState, useEffect } from 'react'
import { createProgram, updateProgram } from './actions'

type Program = {
  id: string
  name: string
  target_age: string
  tutor: string
  schedule: string
  fee: number
  description: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  programToEdit: Program | null
  onSuccess: (program: Program, isEdit: boolean) => void
}

export default function ProgramFormModal({ isOpen, onClose, programToEdit, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    target_age: '',
    tutor: '',
    schedule: '',
    fee: 0,
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (programToEdit) {
        setFormData({
          name: programToEdit.name,
          target_age: programToEdit.target_age,
          tutor: programToEdit.tutor,
          schedule: programToEdit.schedule,
          fee: programToEdit.fee,
          description: programToEdit.description
        })
      } else {
        setFormData({
          name: '',
          target_age: '',
          tutor: '',
          schedule: '',
          fee: 0,
          description: ''
        })
      }
      setError('')
    }
  }, [isOpen, programToEdit])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fee' ? (Number(value) || 0) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (programToEdit) {
        const res = await updateProgram(programToEdit.id, formData)
        if (!res.success) throw new Error(res.message)
        onSuccess({ ...programToEdit, ...formData }, true)
      } else {
        const res = await createProgram(formData)
        if (!res.success) throw new Error(res.message)
        // Kita tidak mendapatkan id yang baru dibuat dari server action secara langsung, 
        // tapi onSuccess akan mentrigger reload atau kita bisa tambahkan id fiktif.
        // Sebaiknya action dikembalikan data-nya, tapi demi kesederhanaan, page revalidatePath
        // akan merefresh daftar list saat onClose jika kita hanya meminta user me-refresh,
        // namun saya akan re-fetch data jika memungkinkan. Di sini kita reload saja lewat window 
        // agar data dari server (dengan ID asli) langsung terpampang.
        window.location.reload()
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {programToEdit ? 'Edit Kelas' : 'Tambah Kelas Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form id="programForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Program/Kelas *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Misal: Bimbingan Matematika SD"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Target Usia/Kelas *</label>
                <input
                  type="text"
                  name="target_age"
                  value={formData.target_age}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Misal: SD Kelas 1-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Biaya SPP (Rp) *</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee || ''}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="200000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Tutor</label>
              <input
                type="text"
                name="tutor"
                value={formData.tutor}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Misal: Bp. Budi, S.Pd"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jadwal Kelas</label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Misal: Senin & Kamis (15:00 - 17:00)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Singkat</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                placeholder="Penjelasan singkat mengenai kelas ini..."
              />
            </div>
          </form>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            form="programForm"
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Kelas</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
