'use client'

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

export default function FinanceHistoryClient({ history }: { history: any[] }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">history</span>
        <p>Belum ada riwayat transaksi pembayaran.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-surface-container-low text-on-surface-variant font-headline font-bold border-b border-surface-variant">
            <th className="py-3 px-4">ID TRX</th>
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Nama Siswa</th>
            <th className="py-3 px-4">Program Kelas</th>
            <th className="py-3 px-4">Nominal</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4 text-center">Resi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/60">
          {history.map(item => (
            <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
              <td className="py-3 px-4 font-mono text-[11px] text-outline truncate max-w-[100px]">{item.id.split('-')[0].toUpperCase()}</td>
              <td className="py-3 px-4 text-on-surface-variant">{formatDate(item.created_at)}</td>
              <td className="py-3 px-4 font-bold text-on-surface">{item.student_name}</td>
              <td className="py-3 px-4 text-on-surface">{item.program_name}</td>
              <td className="py-3 px-4 font-bold text-emerald-700">{formatCurrency(item.amount)}</td>
              <td className="py-3 px-4 text-center">
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Lunas
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => alert('Fitur cetak resi akan segera hadir!')}
                  className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors inline-flex items-center justify-center"
                  title="Unduh Resi PDF"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
