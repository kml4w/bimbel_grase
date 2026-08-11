'use client'

import { useState, useRef } from 'react'
import { submitPaymentProof } from '../actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastProvider'

interface PaymentUploadFormProps {
  studentId: string
}

export default function PaymentUploadForm({ studentId }: PaymentUploadFormProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      showToast('Harap pilih file bukti transfer', 'error')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran file maksimal 2MB', 'error')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('studentId', studentId)
      formData.append('file', file)

      const res = await submitPaymentProof(formData)
      if (res.success) {
        showToast(res.message, 'check_circle')
        router.refresh()
      } else {
        showToast(res.message, 'error')
      }
    } catch (error: any) {
      console.error(error)
      showToast('Terjadi kesalahan saat mengirim bukti', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 space-y-6 mt-6">
      <h3 className="font-headline font-bold text-lg text-on-surface border-b pb-2">Unggah Bukti Transfer</h3>
      
      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-2">
        <p className="text-sm text-on-surface-variant font-bold">Transfer ke Rekening Resmi Bimbel Grase:</p>
        <ul className="text-sm font-bold text-on-surface">
          <li>Bank BCA: 123456789 (a.n. Yayasan Bimbel Grase)</li>
          <li>Bank Mandiri: 987654321 (a.n. Yayasan Bimbel Grase)</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-sm text-on-surface mb-2">Upload File (JPG/PNG/PDF)</label>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            ref={fileInputRef}
            required
            disabled={loading}
            className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary/20 transition-colors cursor-pointer"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-all disabled:opacity-70"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          ) : 'Kirim Bukti Pembayaran'}
        </button>
      </form>
    </div>
  )
}
