import { getContactSettings } from '../profile/settings-actions'

export const metadata = {
  title: 'Pusat Bantuan | Bimbel Grase',
}

export default async function HelpCenterPage() {
  const { data: settings } = await getContactSettings()

  const faqs = [
    {
      q: 'Bagaimana cara mendaftarkan anak kedua?',
      a: 'Anda dapat mendaftarkan anak kedua melalui Dasbor Orang Tua. Klik tombol "Tambah Anak Baru" di bagian kanan bawah layar, lalu isi formulir pendaftarannya.'
    },
    {
      q: 'Di mana saya bisa melihat riwayat pembayaran?',
      a: 'Buka menu "Pembayaran" melalui navigasi atas, kemudian pilih anak yang ingin Anda lihat riwayat pembayarannya. Anda akan menemukan riwayat lunas maupun tagihan berjalan di halaman tersebut.'
    },
    {
      q: 'Bagaimana cara anak saya mengakses e-learning?',
      a: 'Anak Anda bisa mengakses e-learning melalui Dasbor Orang Tua dengan mengklik tombol "Cek E-Learning", atau melalui menu "E-Learning" di navigasi atas. Pastikan status pembayaran bulan ini sudah lunas agar akses kelas terbuka.'
    },
    {
      q: 'Apa yang harus dilakukan jika saya lupa kata sandi?',
      a: 'Anda dapat menggunakan fitur "Lupa Sandi" di halaman login untuk mengatur ulang kata sandi melalui email Anda yang terdaftar.'
    }
  ]

  // Bersihkan WA number agar bisa dipakai untuk link wa.me
  const waNumber = settings?.contact_whatsapp?.replace(/[^0-9+]/g, '').replace(/^0/, '62') || '6281234567890'

  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="flex items-center gap-4 border-b border-surface-variant/60 pb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[28px]">help</span>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Pusat Bantuan</h1>
          <p className="text-on-surface-variant">Temukan jawaban untuk pertanyaan umum dan hubungi dukungan.</p>
        </div>
      </div>

      {/* Hubungi Kami / Contact Person & Layanan */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-surface-variant/60 ambient-shadow space-y-6">
        <div className="flex items-center justify-between border-b pb-4 mb-2">
          <h2 className="text-xl font-headline font-bold text-on-surface">Contact Person & Layanan</h2>
          <a 
            href={`https://wa.me/${waNumber}`} 
            target="_blank" 
            rel="noreferrer"
            className="bg-primary text-on-primary px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">forum</span> Chat Admin
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">WhatsApp CS / Hotline</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings?.contact_whatsapp || '+62 812-3456-7890 (Bunda Admin)'}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Email Layanan</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings?.contact_email || 'info@bimbelgrase.sch.id'}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start md:col-span-2">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Alamat Pusat</p>
              <p className="text-sm font-medium text-on-surface mt-1 leading-relaxed">{settings?.contact_address || 'Jl. Pendidikan No. 45, Komplek Grase Learning Center, Jakarta'}</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start md:col-span-2">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Jam Operasional</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings?.contact_hours || 'Senin - Sabtu (08:00 - 17:00 WIB)'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Pertanyaan yang Sering Diajukan (FAQ)</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-5 border border-surface-variant/60 ambient-shadow">
              <h4 className="font-bold text-on-surface flex items-start gap-2 mb-2 text-md">
                <span className="material-symbols-outlined text-primary shrink-0 mt-0.5 text-[20px]">help_outline</span>
                {faq.q}
              </h4>
              <p className="text-on-surface-variant text-sm pl-7 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
