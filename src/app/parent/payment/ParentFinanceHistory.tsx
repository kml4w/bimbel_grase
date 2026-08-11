'use client'

import { useState } from 'react'

type Payment = {
  id: string
  student_id: string
  amount: number
  payment_method: string
  payment_proof_url: string
  payment_status: string
  billing_period: string
  created_at: string
}

export default function ParentFinanceHistory({ history }: { history: Payment[] }) {
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null)

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 text-center">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">history</span>
        <p className="text-on-surface-variant">Belum ada riwayat pembayaran.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 space-y-4">
        <h2 className="font-headline font-bold text-xl text-primary">Riwayat Pembayaran</h2>
        
        <div className="space-y-3">
          {history.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-surface-variant/40 gap-3">
              <div>
                <p className="font-bold text-on-surface">Periode {payment.billing_period}</p>
                <p className="text-xs text-on-surface-variant">{formatDate(payment.created_at)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-emerald-700">{formatCurrency(payment.amount)}</span>
                <button 
                  onClick={() => setSelectedReceipt(payment)}
                  className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-full text-sm font-bold text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  Lihat Resi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative">
            <div className="p-6 text-center border-b border-surface-variant/40 bg-surface">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">Resi Pembayaran</h3>
              <p className="text-sm text-on-surface-variant">Bimbel Grase</p>
            </div>
            
            <div className="p-6 space-y-4 bg-[#f8f9fa] border-b border-dashed border-outline-variant">
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Periode</span>
                <span className="text-sm font-bold">{selectedReceipt.billing_period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Metode</span>
                <span className="text-sm font-bold">{selectedReceipt.payment_method.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-on-surface-variant">Tanggal</span>
                <span className="text-sm font-bold">{formatDate(selectedReceipt.created_at)}</span>
              </div>
            </div>

            <div className="p-6 bg-[#f8f9fa] flex justify-between items-center">
              <span className="font-bold text-on-surface">Total Lunas</span>
              <span className="font-bold text-2xl text-primary">{formatCurrency(selectedReceipt.amount)}</span>
            </div>

            <div className="p-4 flex gap-3 justify-center bg-white">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="px-6 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors w-full"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
