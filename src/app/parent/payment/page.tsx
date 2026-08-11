import { getParentDashboardData } from '../actions'
import { redirect } from 'next/navigation'
import PaymentUploadForm from './PaymentUploadForm'
import ParentFinanceHistory from './ParentFinanceHistory'
import { getParentFinanceHistory } from '../actions'

export const metadata = {
  title: 'Pembayaran SPP | Bimbel Grase',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export default async function PaymentPage() {
  const data = await getParentDashboardData()

  if (!data.success) {
    redirect('/login?next=/parent/payment')
  }

  const { students } = data
  const hasStudents = students && students.length > 0
  // Default to first student for MVP. In later backlogs (Child Switcher), we will get active child from cookie
  const activeStudent = hasStudents ? students[0] : null

  if (!hasStudents || !activeStudent) {
    return (
      <section className="max-w-[820px] mx-auto px-4 md:px-12 py-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold text-on-surface">Data Siswa Tidak Ditemukan</h1>
        <p className="text-on-surface-variant">Silakan kembali ke dashboard.</p>
      </section>
    )
  }

  const isUnpaid = activeStudent.payment_status === 'unpaid'
  const isPending = activeStudent.payment_status === 'pending'
  
  let statusText = 'Lunas'
  let statusBg = 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]'
  let statusIcon = 'check_circle'
  let statusIconColor = 'text-[#15803d]'

  if (isUnpaid) {
    statusText = 'Menunggu Pembayaran'
    statusBg = 'bg-[#fff0f2] text-[#9f1239] border-[#fbcfe8]'
    statusIcon = 'schedule'
    statusIconColor = 'text-[#e11d48]'
  } else if (isPending) {
    statusText = 'Verifikasi Admin'
    statusBg = 'bg-amber-50 text-amber-800 border-amber-300'
    statusIcon = 'hourglass_empty'
    statusIconColor = 'text-amber-600'
  }

  const { data: historyData } = await getParentFinanceHistory(activeStudent.id)

  return (
    <section className="max-w-[820px] mx-auto px-4 md:px-12 py-8 space-y-6">
      <div className="flex justify-center">
        <div className={`inline-flex items-center gap-2 border px-5 py-2.5 rounded-full text-sm font-bold shadow-sm ${statusBg}`}>
          <span className={`material-symbols-outlined text-[20px] ${statusIconColor}`}>{statusIcon}</span>
          <span>{statusText}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-headline font-bold text-xl text-primary">Detail Tagihan: {activeStudent.student_name}</h2>
          <span className="bg-secondary-container/30 text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full">
            Periode: {activeStudent.billing_period || 'Bulan Ini'}
          </span>
        </div>
        
        <div className="space-y-3 text-sm md:text-base">
          {activeStudent.calculated_bill.registrationFee > 0 && (
            <div className="flex justify-between items-center py-2.5 border-b border-surface-variant/50">
              <span className="text-on-surface-variant">Pendaftaran Online (1x Saja)</span>
              <span className="font-bold text-on-surface">
                {formatCurrency(activeStudent.calculated_bill.registrationFee)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2.5 border-b border-surface-variant/50">
            <span className="text-on-surface-variant">SPP Bulanan (<span className="font-bold">{activeStudent.program?.name}</span>)</span>
            <span className="font-bold text-on-surface">
              {formatCurrency(activeStudent.calculated_bill.programFee)}
            </span>
          </div>
          
          <div className="flex justify-between items-center pt-3">
            <span className="font-headline font-bold text-lg md:text-xl text-on-surface">Total Tagihan</span>
            <span className="font-headline font-bold text-2xl md:text-3xl text-primary">
              {formatCurrency(activeStudent.calculated_bill.total)}
            </span>
          </div>
        </div>
      </div>

      {isUnpaid && (
        <PaymentUploadForm studentId={activeStudent.id} />
      )}

      {activeStudent.payment_status === 'verified' && (
        <div className="bg-[#ecfdf5] rounded-3xl p-6 md:p-8 ambient-shadow border border-[#6ee7b7] space-y-4 text-center mt-6">
          <h3 className="text-xl font-headline font-bold text-emerald-900">Pembayaran SPP LUNAS</h3>
          <p className="text-emerald-800 text-sm">Terima kasih, tagihan untuk periode ini telah diverifikasi.</p>
        </div>
      )}

      {/* FINANCE HISTORY FOR PARENT */}
      <div className="mt-12">
        <ParentFinanceHistory history={historyData || []} />
      </div>
    </section>
  )
}
