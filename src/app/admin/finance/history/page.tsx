import { getFinanceHistory } from '../actions'
import FinanceHistoryClient from '../FinanceHistoryClient'

export const metadata = {
  title: 'Laporan Keuangan - Admin | Bimbel Grase',
}

export default async function AdminFinanceHistoryPage() {
  const { data: financeHistory, success, message } = await getFinanceHistory()

  if (!success) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200">
          <p className="font-bold">Akses Ditolak atau Error:</p>
          <p className="text-sm">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end border-b border-surface-variant pb-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Laporan Keuangan</h2>
          <p className="text-on-surface-variant">Riwayat transaksi pembayaran yang telah LUNAS.</p>
        </div>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          {financeHistory?.length || 0} Transaksi
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
        <FinanceHistoryClient history={financeHistory || []} />
      </div>
    </div>
  )
}
