'use client'

import { useState, useEffect } from 'react'
import { updateStudent } from './actions'

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

type Props = {
  isOpen: boolean
  onClose: () => void
  student: Student | null
  programs: Program[]
  onSuccess: (updatedStudent: Student) => void
}

export default function StudentEditModal({ isOpen, onClose, student, programs, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    student_name: '',
    age: 0,
    program_id: '',
    payment_status: 'unpaid',
    billing_count: 1
  })

  useEffect(() => {
    if (isOpen && student) {
      setFormData({
        student_name: student.student_name || '',
        age: student.age || 0,
        program_id: student.programs?.id || '',
        payment_status: student.payment_status || 'unpaid',
        billing_count: student.billing_count || 1
      })
    }
  }, [isOpen, student])

  if (!isOpen || !student) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      billing_count: Number(formData.billing_count)
    }

    const res = await updateStudent(student.id, payload)
    
    setLoading(false)
    if (res.success) {
      const selectedProgram = programs.find(p => p.id === formData.program_id)
      
      onSuccess({
        ...student,
        student_name: formData.student_name,
        age: Number(formData.age),
        payment_status: formData.payment_status,
        billing_count: Number(formData.billing_count),
        programs: selectedProgram ? { id: selectedProgram.id, name: selectedProgram.name } : student.programs
      })
      onClose()
    } else {
      alert(res.message || 'Gagal menyimpan data siswa')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Data Siswa
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form id="studentForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Info Orang Tua (Read Only) */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <p className="text-sm text-gray-500 mb-1">Informasi Orang Tua (Hanya Baca)</p>
            <p className="font-semibold text-gray-800">{student.profiles?.full_name}</p>
            <p className="text-sm text-gray-600">{student.profiles?.email}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nama Lengkap Siswa
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Usia Siswa (Tahun)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Program / Kelas
                </label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                >
                  <option value="" disabled>Pilih Kelas</option>
                  {programs.map(prog => (
                    <option key={prog.id} value={prog.id}>{prog.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status SPP
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-white"
                >
                  <option value="unpaid">Belum Bayar (Unpaid)</option>
                  <option value="pending">Menunggu Verifikasi (Pending)</option>
                  <option value="verified">Lunas (Verified)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Bulan Tagihan Aktif (Billing Count)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="billing_count"
                    value={formData.billing_count}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  />
                  <div className="text-xs text-gray-500 w-32">
                    Cth: 1 = Bulan 1, 2 = Bulan 2, dst.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-50 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            form="studentForm"
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
              'Simpan Perubahan'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
