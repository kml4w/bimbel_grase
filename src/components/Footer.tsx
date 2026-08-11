import Link from 'next/link'

export default function Footer({ role }: { role: string | null }) {
  // We can hide the massive footer on admin and tutor dashboards to keep the UI clean like a web app
  if (role === 'admin' || role === 'tutor') {
    return null
  }

  return (
    <footer className="bg-surface-container-high border-t border-surface-variant/60 text-on-surface-variant text-xs md:text-sm mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px] icon-fill">school</span>
            </div>
            <span className="font-headline font-bold text-lg text-primary tracking-tight">Bimbel Grase</span>
          </Link>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Lembaga Bimbingan Belajar interaktif & terpercaya. Membantu tumbuh kembang prestasi akademik dan fondasi pembelajaran siswa Indonesia.
          </p>
          <div className="flex items-center gap-2 pt-1 text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="text-xs font-bold">Terakreditasi & Terdaftar Resmi</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-headline font-bold text-on-surface text-sm md:text-base border-b border-surface-variant pb-1.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">contact_support</span> Contact Person & Layanan
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">call</span>
              <div>
                <span className="font-bold text-on-surface block">WhatsApp CS / Hotline:</span>
                <a href="https://wa.me/6281234567890" target="_blank" className="text-primary font-bold hover:underline">+62 812-3456-7890 (Bunda Admin)</a>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">mail</span>
              <div>
                <span className="font-bold text-on-surface block">Email Layanan:</span>
                <span>info@bimbelgrase.sch.id</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">location_on</span>
              <div>
                <span className="font-bold text-on-surface block">Alamat Pusat:</span>
                <span>Jl. Pendidikan No. 45, Komplek Grase Learning Center, Jakarta</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5">schedule</span>
              <div>
                <span className="font-bold text-on-surface block">Jam Operasional:</span>
                <span>Senin - Sabtu (08:00 - 17:00 WIB)</span>
              </div>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-headline font-bold text-on-surface text-sm md:text-base border-b border-surface-variant pb-1.5">Program Belajar</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/register" className="hover:text-primary transition-colors text-left block">• Super Calistung (Toddler 4-5 Thn)</Link></li>
            <li><Link href="/register" className="hover:text-primary transition-colors text-left block">• Pendampingan SD (Mata Pelajaran)</Link></li>
            <li><Link href="/register" className="hover:text-primary transition-colors text-left block">• Persiapan Ujian & Olimpiade</Link></li>
            <li><Link href="/register" className="hover:text-primary transition-colors text-left block">• Kelas Privat Online & Offline</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-headline font-bold text-on-surface text-sm md:text-base border-b border-surface-variant pb-1.5">Akses Cepat Portal</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link href="/" className="hover:text-primary transition-colors block">• Halaman Utama</Link></li>
            <li><Link href="/login" className="hover:text-primary transition-colors block">• Masuk Portal Orang Tua</Link></li>
            <li><Link href="/children" className="hover:text-primary transition-colors block">• Profil & Edit Foto Profil Anak</Link></li>
            <li><Link href="/payments" className="hover:text-primary transition-colors block">• Pembayaran SPP Bulanan</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-surface-container-highest border-t border-surface-variant/60 py-3 text-center text-[11px] text-outline pb-20 md:pb-3">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Bimbel Grase. Seluruh Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <button className="hover:underline">Kebijakan Privasi</button>
            <span>•</span>
            <button className="hover:underline">Syarat & Ketentuan</button>
          </div>
        </div>
      </div>
    </footer>
  )
}
