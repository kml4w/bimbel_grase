'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addNewChildAction } from './actions'
import { useToast } from '@/components/ToastProvider'

interface Program {
  id: string
  name: string
}

interface AddChildModalProps {
  programs: Program[]
}

export default function AddChildModal({ programs }: AddChildModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await addNewChildAction(formData)

      if (res.success) {
        showToast(res.message, 'check_circle')
        setIsOpen(false)
        router.refresh()
      } else {
        showToast(res.message, 'error')
      }
    } catch (error) {
      showToast('Gagal menambahkan data anak.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-3 mt-4 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 font-bold transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">person_add</span>
        Tambah Anak Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 ambient-shadow relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <h3 className="text-xl font-headline font-bold text-primary">Tambah Profil Anak Baru</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-sm mt-4">
              <div>
                <label className="block font-bold mb-1 text-on-surface">Nama Lengkap Anak *</label>
                <input 
                  type="text" 
                  name="student_name"
                  required 
                  placeholder="Contoh: Aisyah" 
                  className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant px-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-on-surface">Usia Anak *</label>
                <input 
                  type="number" 
                  name="age"
                  required 
                  min="5"
                  placeholder="Contoh: 6" 
                  className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant px-3 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block font-bold mb-1 text-on-surface">Pilih Program / Kelas *</label>
                <select 
                  name="program_id"
                  required 
                  className="w-full h-11 rounded-xl bg-surface-container-low border border-outline-variant px-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="">-- Pilih Program --</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  disabled={loading}
                  className="flex-1 h-11 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-11 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  ) : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
