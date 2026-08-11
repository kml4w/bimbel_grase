import Link from 'next/link'

export default function PaywallLocked() {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center ambient-shadow flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-rose-600 text-[32px]">lock</span>
      </div>
      <h3 className="text-xl font-headline font-bold text-rose-900 mb-2">Akses E-Learning Terkunci</h3>
      <p className="text-rose-800 text-sm max-w-lg mx-auto mb-6">
        Materi modul, kuis harian, dan fitur upload tugas baru dapat diakses setelah pembayaran tagihan Anda dikonfirmasi LUNAS oleh Admin Bimbel Grase.
      </p>
      <Link 
        href="/parent/payment" 
        className="bg-rose-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-[20px]">payments</span>
        Ke Halaman Pembayaran
      </Link>
    </div>
  )
}
