import { getAdminKPIs, getEnrollmentStats } from './actions'
import Link from 'next/link'
import EnrollmentChart from '@/components/EnrollmentChart'
import ClassStatsClient from './ClassStatsClient'

export const metadata = {
  title: 'Dasbor Utama - Admin | Bimbel Grase',
}

export default async function AdminDashboardPage() {
  const [kpiRes, enrollmentRes] = await Promise.all([
    getAdminKPIs(),
    getEnrollmentStats()
  ])
  const { data, success, message } = kpiRes

  // Format currency
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number)
  }

  if (!success || !data) {
    return (
      <div className="p-8">
        <div className="bg-rose-50 text-rose-800 p-6 rounded-2xl border border-rose-200 flex flex-col items-center">
          <span className="material-symbols-outlined text-4xl mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">Gagal Memuat Dasbor</h2>
          <p>{message}</p>
        </div>
      </div>
    )
  }

  const { totalStudents, pendingStudents, totalPrograms, totalAssignments, totalRevenue } = data

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
          Dasbor Admin
        </h1>
        <p className="text-on-surface-variant">Ringkasan aktivitas dan metrik performa Bimbel Grase.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Pendapatan */}
        <div className="bg-primary text-on-primary rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-primary-container font-medium text-sm mb-1">Total Pendapatan</p>
              <h3 className="font-headline font-bold text-2xl md:text-3xl">{formatRupiah(totalRevenue)}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="relative z-10 text-xs text-primary-container flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Dari transaksi tervalidasi
          </div>
        </div>

        {/* Card 2: Siswa Aktif */}
        <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-sm mb-1">Siswa Aktif</p>
              <h3 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{totalStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-on-tertiary-container">school</span>
            </div>
          </div>
          <Link href="/admin/students" className="text-xs text-tertiary font-bold flex items-center gap-1 hover:underline w-fit">
            Lihat daftar siswa <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        {/* Card 3: Menunggu Verifikasi */}
        <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-sm mb-1">Menunggu Verifikasi</p>
              <h3 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{pendingStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-on-error-container">pending_actions</span>
            </div>
          </div>
          <Link href="/admin/finance" className="text-xs text-error font-bold flex items-center gap-1 hover:underline w-fit">
            Cek pendaftaran baru <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

        {/* Card 4: Kelas / Program */}
        <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-on-surface-variant font-medium text-sm mb-1">Total Kelas</p>
              <h3 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">{totalPrograms}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-on-secondary-container">class</span>
            </div>
          </div>
          <Link href="/admin/classes" className="text-xs text-secondary font-bold flex items-center gap-1 hover:underline w-fit">
            Kelola program <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>

      </div>

      {/* Siswa Aktif per Kelas */}
      <div>
        <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">group</span>
          Siswa Aktif per Kelas
        </h3>
        <ClassStatsClient classStats={data.classStats || []} />
      </div>

      {/* Quick Actions & Recent Activity (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-3xl p-6 h-full min-h-[300px]">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">monitoring</span>
              Grafik Pendaftaran (6 Bulan Terakhir)
            </h3>
            <div className="w-full h-[300px]">
              {enrollmentRes.success && enrollmentRes.data ? (
                <EnrollmentChart data={enrollmentRes.data} />
              ) : (
                <div className="flex items-center justify-center h-full bg-surface-container/30 rounded-2xl border border-dashed border-outline-variant text-error">
                  <p className="text-sm">Gagal memuat grafik</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-surface-variant/40 rounded-3xl p-6">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">bolt</span>
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Link href="/admin/finance" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group border border-transparent hover:border-surface-variant/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">Validasi Pembayaran</p>
                  <p className="text-xs text-on-surface-variant">Cek {pendingStudents} antrean baru</p>
                </div>
              </Link>
              
              <Link href="/admin/assignments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group border border-transparent hover:border-surface-variant/50">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <span className="material-symbols-outlined text-secondary">menu_book</span>
                </div>
                <div>
                  <p className="font-bold text-sm text-on-surface">Materi & Tugas</p>
                  <p className="text-xs text-on-surface-variant">Terdapat {totalAssignments} modul/tugas</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
