'use client'

import { useState, useMemo } from 'react'
import { deleteFinanceRecord } from './actions'
import { useToast } from '@/components/ToastProvider'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateStr))
}

function getMonthYear(dateStr: string) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatMonthYear(monthYear: string) {
  if (monthYear === 'ALL') return 'Semua Bulan'
  const [year, month] = monthYear.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)
}

export default function FinanceHistoryClient({ history: initialHistory }: { history: any[] }) {
  const [history, setHistory] = useState(initialHistory)
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL')
  const [processing, setProcessing] = useState<string | null>(null)
  const { showToast } = useToast()

  // Derive unique months from history
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    history.forEach(item => {
      months.add(getMonthYear(item.created_at))
    })
    return ['ALL', ...Array.from(months).sort().reverse()] // Newest first
  }, [history])

  // Filter history based on selection
  const filteredHistory = useMemo(() => {
    if (selectedMonth === 'ALL') return history
    return history.filter(item => getMonthYear(item.created_at) === selectedMonth)
  }, [history, selectedMonth])

  // Calculate total for the selected period
  const totalRevenue = useMemo(() => {
    return filteredHistory.reduce((sum, item) => sum + item.amount, 0)
  }, [filteredHistory])

  const handlePrint = () => {
    window.print()
  }

  const handleDelete = async (paymentId: string) => {
    if (!confirm('Yakin ingin membatalkan/menghapus transaksi ini? Aksi ini akan mengubah laporan keuangan.')) return

    setProcessing(paymentId)
    try {
      const res = await deleteFinanceRecord(paymentId)
      if (res.success) {
        showToast(res.message, 'check_circle')
        setHistory(prev => prev.filter(item => item.id !== paymentId))
      } else {
        showToast(res.message, 'error')
      }
    } catch (err) {
      showToast('Terjadi kesalahan jaringan', 'error')
    } finally {
      setProcessing(null)
    }
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">history</span>
        <p>Belum ada riwayat transaksi pembayaran.</p>
      </div>
    )
  }

  return (
    <div id="print-area" className="space-y-4">
      {/* Controls - Hidden on print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <label htmlFor="monthFilter" className="text-sm font-bold text-on-surface-variant">Filter Bulan:</label>
          <select
            id="monthFilter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 border border-outline-variant rounded-xl text-sm bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthYear(m)}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handlePrint}
          className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Cetak Laporan
        </button>
      </div>

      {/* Print Header - Visible only on print */}
      <div className="hidden print:block mb-8 text-center border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Laporan Keuangan</h1>
        <h2 className="text-xl font-bold text-black mt-1">Bimbel Grase Kamila Bogor</h2>
        <p className="text-black mt-2">Periode: {formatMonthYear(selectedMonth)}</p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs md:text-sm print:text-xs">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-headline font-bold border-b border-surface-variant print:bg-white print:border-b-2 print:border-black print:text-black">
              <th className="py-3 px-4 print:px-2 print:py-2 border-b border-surface-variant print:border-black">ID TRX</th>
              <th className="py-3 px-4 print:px-2 print:py-2 border-b border-surface-variant print:border-black">Tanggal</th>
              <th className="py-3 px-4 print:px-2 print:py-2 border-b border-surface-variant print:border-black">Nama Siswa</th>
              <th className="py-3 px-4 print:px-2 print:py-2 border-b border-surface-variant print:border-black">Program Kelas</th>
              <th className="py-3 px-4 print:px-2 print:py-2 border-b border-surface-variant print:border-black">Nominal</th>
              <th className="py-3 px-4 text-center print:px-2 print:py-2 border-b border-surface-variant print:border-black">Status</th>
              <th className="py-3 px-4 text-center print:hidden border-b border-surface-variant">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant/60 print:divide-black">
            {filteredHistory.map(item => (
              <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors print:hover:bg-transparent">
                <td className="py-3 px-4 print:px-2 print:py-2 font-mono text-[11px] text-outline print:text-black truncate max-w-[100px] print:max-w-none">{item.id.split('-')[0].toUpperCase()}</td>
                <td className="py-3 px-4 print:px-2 print:py-2 text-on-surface-variant print:text-black">{formatDate(item.created_at)}</td>
                <td className="py-3 px-4 print:px-2 print:py-2 font-bold text-on-surface print:text-black">{item.student_name}</td>
                <td className="py-3 px-4 print:px-2 print:py-2 text-on-surface print:text-black">{item.program_name}</td>
                <td className="py-3 px-4 print:px-2 print:py-2 font-bold text-emerald-700 print:text-black">{formatCurrency(item.amount)}</td>
                <td className="py-3 px-4 print:px-2 print:py-2 text-center">
                  <span className="bg-emerald-100 text-emerald-800 print:bg-transparent print:text-black print:border-0 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] print:hidden">check_circle</span>
                    Lunas
                  </span>
                </td>
                <td className="py-3 px-4 text-center print:hidden">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => alert('Fitur cetak resi akan segera hadir!')}
                      className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors inline-flex items-center justify-center"
                      title="Unduh Resi PDF"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={processing === item.id}
                      className="p-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg transition-colors inline-flex items-center justify-center disabled:opacity-50"
                      title="Batalkan Transaksi (Hapus)"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Print Footer Row */}
            <tr className="hidden print:table-row font-bold bg-white text-black border-t-2 border-black">
              <td colSpan={4} className="py-3 px-2 text-right border-t-2 border-black">TOTAL PEMASUKAN:</td>
              <td colSpan={2} className="py-3 px-2 border-t-2 border-black">{formatCurrency(totalRevenue)}</td>
            </tr>
          </tbody>
        </table>

        {/* Screen Footer Row */}
        <div className="mt-4 flex justify-end print:hidden">
           <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant w-full md:w-auto min-w-[250px]">
             <p className="text-xs font-bold text-on-surface-variant mb-1">Total Pemasukan ({formatMonthYear(selectedMonth)})</p>
             <p className="text-xl font-headline font-bold text-emerald-700">{formatCurrency(totalRevenue)}</p>
           </div>
        </div>
      </div>
      
      {/* Inline styles for printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page { margin: 1cm; size: landscape; }
        }
      `}} />
    </div>
  )
}
