import { getPendingPayments, getVerifiedStudents } from './actions'
import FinanceQueueClient from './FinanceQueueClient'
import VerifiedStudentsClient from './VerifiedStudentsClient'

export const metadata = {
  title: 'Verifikasi Keuangan - Admin | Bimbel Grase',
}

export default async function AdminFinancePage() {
  const { data: pendingPayments, success, message } = await getPendingPayments()
  const { data: verifiedStudents } = await getVerifiedStudents()

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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary">Verifikasi Keuangan</h2>
          <p className="text-on-surface-variant">Tinjau dan setujui bukti pembayaran dari orang tua.</p>
        </div>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">fact_check</span>
          {pendingPayments.length} Antrean
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 ambient-shadow border border-surface-variant/40">
        {pendingPayments.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">inbox</span>
            <p>Tidak ada antrean pembayaran saat ini.</p>
          </div>
        ) : (
          <FinanceQueueClient initialPayments={pendingPayments} />
        )}
      </div>
      <div className="bg-white rounded-3xl p-6 ambient-shadow border border-surface-variant/40 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-headline font-bold text-primary">Siswa Lunas</h3>
            <p className="text-on-surface-variant text-sm">Buat tagihan untuk siklus pembayaran bulan berikutnya.</p>
          </div>
          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            {verifiedStudents?.length || 0} Siswa
          </div>
        </div>
        <VerifiedStudentsClient students={verifiedStudents || []} />
      </div>
    </div>
  )
}
