'use client'

import { useState } from 'react'
import { generateNextMonthBill } from './actions'
import { useRouter } from 'next/navigation'

export default function VerifiedStudentsClient({ students }: { students: any[] }) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerateBill = async (studentId: string, studentName: string) => {
    if (!confirm(`Buat tagihan baru untuk ${studentName}? Statusnya akan kembali menjadi "Belum Bayar" (Terkunci).`)) {
      return
    }

    setIsProcessing(studentId)
    const { success, message } = await generateNextMonthBill(studentId)
    setIsProcessing(null)

    if (success) {
      alert(message)
      router.refresh()
    } else {
      alert(message)
    }
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-on-surface-variant text-sm">
        <p>Tidak ada siswa dengan status Lunas saat ini.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant font-headline font-bold border-b border-surface-variant">
            <th className="py-3 px-4">Nama Siswa</th>
            <th className="py-3 px-4">Program Kelas</th>
            <th className="py-3 px-4">Orang Tua</th>
            <th className="py-3 px-4">Siklus Ke-</th>
            <th className="py-3 px-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/60">
          {students.map(item => (
            <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
              <td className="py-3 px-4 font-bold text-on-surface">{item.student_name}</td>
              <td className="py-3 px-4 text-on-surface">{item.program_name}</td>
              <td className="py-3 px-4 text-on-surface-variant">{item.parent_name}</td>
              <td className="py-3 px-4 text-on-surface-variant">{item.billing_count}</td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => handleGenerateBill(item.id, item.student_name)}
                  disabled={isProcessing === item.id}
                  className="px-4 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-full transition-colors inline-flex items-center gap-1 font-bold disabled:opacity-50 text-[11px]"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isProcessing === item.id ? 'sync' : 'receipt_long'}
                  </span>
                  Tagih Bulan Depan
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
