import { getParentDashboardData } from './actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ChildSwitcher from './ChildSwitcher'
import AddChildModal from './AddChildModal'
import EditChildPhotoModal from './EditChildPhotoModal'
import PaywallLocked from '@/components/PaywallLocked'

export const metadata = {
  title: 'Dashboard Orang Tua | Bimbel Grase',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

export default async function ParentDashboardPage() {
  const data = await getParentDashboardData()

  if (!data.success) {
    redirect('/login')
  }

  const { parentName, students, programs } = data
  const hasStudents = students && students.length > 0
  const activeStudent = hasStudents ? students[0] : null // By default, show the first student

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-6 space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-headline font-bold text-on-surface">
            Halo, <span className="text-primary">{parentName}</span>!
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant">
            Selamat datang kembali di portal orang tua.
            {hasStudents && (
              <> Berikut perkembangan terbaru Ananda <strong className="text-primary">{activeStudent?.student_name}</strong>.</>
            )}
          </p>
        </div>

        {hasStudents && activeStudent?.payment_status === 'unpaid' && (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl border flex items-center gap-2 bg-amber-50 text-amber-800 border-amber-300 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
              <span className="text-sm font-bold">Menunggu Pembayaran</span>
            </div>
          </div>
        )}
      </div>

      {!hasStudents ? (
        <div className="bg-white rounded-2xl p-10 text-center ambient-shadow border border-surface-variant">
          <div className="w-16 h-16 rounded-full bg-surface-variant/30 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-outline text-[32px]">group_off</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Belum Ada Data Anak</h2>
          <p className="text-on-surface-variant mb-6 max-w-md mx-auto">
            Anda belum mendaftarkan anak atau data sedang diproses. Silakan hubungi admin jika terdapat kendala.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* MAIN STUDENT INFO */}
          <div className="md:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 ambient-shadow border border-surface-variant flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
              {/* Avatar Section */}
              <div className="flex flex-col items-center shrink-0 gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-md bg-surface-container relative cursor-pointer group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-full h-full object-cover"
                    src={activeStudent?.avatar_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"}
                    alt="Foto Profil Anak"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  </div>
                </div>
                <div className="mt-2 w-full">
                  <EditChildPhotoModal 
                    childId={activeStudent.id}
                    childName={activeStudent.student_name}
                    programName={activeStudent.program?.name || 'Tidak ada program'}
                    currentAvatarUrl={activeStudent.avatar_url}
                  />
                </div>
              </div>

              {/* Student Details */}
              <div className="flex-grow text-center md:text-left space-y-2">
                <h2 className="text-2xl font-headline font-bold text-on-surface">{activeStudent?.student_name}</h2>
                <div className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  <span>Program: {activeStudent?.program?.name || 'Tidak ada program'}</span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Usia: {activeStudent?.age} Tahun • Sesi Tatap Muka & Online
                </p>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/parent/payment" className="bg-white rounded-2xl p-5 ambient-shadow border border-surface-variant/80 hover:border-primary transition-all cursor-pointer group block">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined icon-fill">receipt_long</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Status Tagihan SPP</span>
                <p className={`text-lg font-headline font-bold ${activeStudent?.payment_status === 'unpaid' ? 'text-rose-600' : 'text-primary'}`}>
                  {activeStudent?.payment_status === 'unpaid' ? 'Belum Bayar' : 
                   activeStudent?.payment_status === 'pending' ? 'Diproses Admin' : 'Lunas'}
                </p>
                <span className="text-[11px] text-outline mt-1 block group-hover:text-primary transition-colors">
                  Total {formatCurrency(activeStudent?.calculated_bill.total)} →
                </span>
              </Link>

              <div className="bg-white rounded-2xl p-5 ambient-shadow border border-surface-variant/80 hover:border-primary transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined icon-fill">event</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Jadwal Sesi Terdekat</span>
                <p className="text-lg font-headline font-bold text-on-surface">
                  {activeStudent?.program?.schedule || 'Belum diatur'}
                </p>
                <span className="text-[11px] text-outline mt-1 block group-hover:text-primary transition-colors">Lihat Jadwal Lengkap →</span>
              </div>

              <div className="bg-white rounded-2xl p-5 ambient-shadow border border-surface-variant/80 hover:border-primary transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined icon-fill">military_tech</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant">Nilai Kuis Terakhir</span>
                <p className="text-lg font-headline font-bold text-primary">A (95/100)</p>
                <span className="text-[11px] text-outline mt-1 block group-hover:text-primary transition-colors">Cek E-Learning →</span>
              </div>
            </div>

            {/* PAYWALL GUARD / E-LEARNING SECTION */}
            {activeStudent?.payment_status === 'verified' ? (
              <div className="bg-white rounded-3xl p-8 ambient-shadow border border-surface-variant/40">
                <div className="border-b border-surface-variant pb-4 mb-6">
                    <h2 className="text-2xl font-headline font-bold text-primary mb-1">Guided E-Learning LMS</h2>
                    <p className="text-on-surface-variant text-sm font-bold">Kelas {activeStudent?.program?.name}</p>
                    <p className="text-on-surface-variant text-xs mt-1">Modul PDF, Kuis Harian, dan Lembar Penyerahan Tugas Sekolah.</p>
                </div>
                <div className="space-y-4 text-center py-6">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">laptop_chromebook</span>
                  <p className="text-on-surface-variant max-w-md mx-auto mb-6">Materi pembelajaran, kuis, dan tugas harian untuk program ini sudah tersedia. Silakan masuk ke Ruang Kelas virtual.</p>
                  <Link 
                    href={`/parent/elearning/${activeStudent.id}`}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                  >
                    Masuk ke Ruang Kelas
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ) : (
              <PaywallLocked />
            )}
          </div>

          {/* QUICK LINKS & SWITCH CHILD (If Multiple) */}
          <div className="md:col-span-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-headline font-bold text-on-surface">Akses Cepat Portal</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href={`/parent/elearning/${activeStudent.id}`} className="bg-white rounded-2xl p-4 ambient-shadow border border-surface-variant hover:border-primary flex items-center gap-4 group transition-all w-full">
                  <div className="w-11 h-11 rounded-2xl bg-secondary-container/30 text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">laptop_chromebook</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-on-surface group-hover:text-primary block">E-Learning</span>
                    <span className="text-[11px] text-outline">Akses Kelas & Modul Belajar</span>
                  </div>
                </Link>

                <Link href="/parent/payment" className="bg-white rounded-2xl p-4 ambient-shadow border border-surface-variant hover:border-primary flex items-center gap-4 group transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-on-surface group-hover:text-primary block">Pembayaran SPP Bulanan</span>
                    <span className="text-[11px] text-outline">Rincian & bukti tagihan</span>
                  </div>
                </Link>
              </div>
            </div>
            
            {students && students.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold text-on-surface border-t pt-4">Data Anak Lainnya</h3>
                <div className="space-y-2">
                  {students.slice(1).map((child, idx) => (
                    <ChildSwitcher 
                      key={child.id}
                      childId={child.id}
                      childName={child.student_name}
                      programName={child.program?.name || 'Tidak ada program'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tombol Tambah Anak */}
            {programs && <AddChildModal programs={programs} />}
          </div>
        </div>
      )}
    </section>
  )
}
