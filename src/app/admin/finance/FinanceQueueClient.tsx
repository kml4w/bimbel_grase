'use client'

import { useState } from 'react'
import { adminVerifyPayment } from './actions'
import { useToast } from '@/components/ToastProvider'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export default function FinanceQueueClient({ initialPayments }: { initialPayments: any[] }) {
  const [payments, setPayments] = useState(initialPayments)
  const [processing, setProcessing] = useState<string | null>(null)
  const { showToast } = useToast()

  const handleAction = async (studentId: string, action: 'approve' | 'reject') => {
    if (!confirm(`Yakin ingin ${action === 'approve' ? 'MENYETUJUI' : 'MENOLAK'} pembayaran ini?`)) return

    setProcessing(studentId)
    try {
      const res = await adminVerifyPayment(studentId, action)
      if (res.success) {
        showToast(res.message, 'check_circle')
        setPayments(prev => prev.filter(p => p.id !== studentId))
      } else {
        showToast(res.message, 'error')
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b border-surface-variant/60 text-on-surface-variant">
            <th className="py-3 px-4 font-bold">Nama Siswa</th>
            <th className="py-3 px-4 font-bold">Orang Tua</th>
            <th className="py-3 px-4 font-bold">Program</th>
            <th className="py-3 px-4 font-bold">Nominal</th>
            <th className="py-3 px-4 font-bold">Bukti Resi</th>
            <th className="py-3 px-4 text-center font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/40">
          {payments.map(payment => (
            <tr key={payment.id} className="hover:bg-surface-container-low transition-colors">
              <td className="py-4 px-4">
                <div className="font-bold text-on-surface">{payment.student_name}</div>
                <div className="text-[11px] text-on-surface-variant bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md inline-block mt-1">Pending</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-on-surface">{payment.parent_name}</div>
                <div className="text-xs text-on-surface-variant">{payment.parent_phone}</div>
              </td>
              <td className="py-4 px-4 text-on-surface">{payment.program_name}</td>
              <td className="py-4 px-4 font-bold text-on-surface">{formatCurrency(payment.amount)}</td>
              <td className="py-4 px-4">
                {payment.signedUrl ? (
                  <a 
                    href={payment.signedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-bold text-xs bg-primary-container px-3 py-1.5 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Lihat Bukti
                  </a>
                ) : (
                  <span className="text-xs text-outline italic">Tidak ada file</span>
                )}
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleAction(payment.id, 'approve')}
                    disabled={processing === payment.id}
                    className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors disabled:opacity-50"
                    title="Setujui Pembayaran"
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                  </button>
                  <button
                    onClick={() => handleAction(payment.id, 'reject')}
                    disabled={processing === payment.id}
                    className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg transition-colors disabled:opacity-50"
                    title="Tolak Pembayaran (Minta Unggah Ulang)"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
