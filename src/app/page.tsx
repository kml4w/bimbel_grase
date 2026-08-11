import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="flex-grow pt-4">
      <section className="px-4 md:px-12 py-8 md:py-16 flex flex-col md:flex-row items-center gap-10 max-w-[1200px] mx-auto">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-secondary-container text-[18px]">star</span>
            <span className="text-xs font-bold text-on-surface-variant">Guided Discovery Learning</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
            Belajar Ceria, <br className="hidden md:block" />
            <span className="text-primary relative inline-block">
              Prestasi Nyata
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary-container opacity-80" preserveAspectRatio="none" viewBox="0 0 100 10"><path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4"></path></svg>
            </span><br />
            di Bimbel Grase
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant max-w-lg leading-relaxed">
            Bergabunglah bersama kami dalam petualangan belajar yang interaktif dan terstruktur. 
            Dirancang khusus untuk membangun fondasi pendidikan dan kreativitas anak Anda.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/register" className="bg-primary text-on-primary rounded-2xl h-14 px-8 inline-flex items-center justify-center font-bold text-base shadow-lg hover:-translate-y-1 transition-all">
              Daftar Sekarang <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-gradient-to-br from-primary/10 via-white to-surface-container-low p-6 md:p-8 rounded-3xl border border-primary/20 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-surface-variant/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-[28px]">verified</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-on-surface">Portal Terintegrasi</h3>
                  <p className="text-xs text-on-surface-variant">Satu Akun Orang Tua & Tagihan Bulanan Otomatis</p>
                </div>
              </div>
              <span className="bg-secondary-container/30 text-secondary text-xs font-bold px-3 py-1 rounded-full border border-secondary-container/50 hidden sm:inline-block">Aktif & Terpercaya</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm space-y-1">
                <span className="material-symbols-outlined text-primary text-[28px]">auto_stories</span>
                <h4 className="font-headline font-bold text-sm text-on-surface">E-Learning Interactive</h4>
                <p className="text-[11px] text-on-surface-variant leading-tight">Modul PDF, kuis harian interaktif & laporan progres.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm space-y-1">
                <span className="material-symbols-outlined text-secondary text-[28px]">published_with_changes</span>
                <h4 className="font-headline font-bold text-sm text-on-surface">Fitur Tukar Anak</h4>
                <p className="text-[11px] text-on-surface-variant leading-tight">Kelola dan ganti profil anak dengan 1 klik mudah.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-surface-variant shadow-sm flex items-center justify-between">
              <div>
                <span className="text-on-surface-variant text-xs">Biaya Pendaftaran Awal (1x)</span>
                <p className="font-headline font-bold text-lg text-primary">Rp 250.000</p>
              </div>
              <Link href="/login" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                Atau Masuk <span className="material-symbols-outlined text-[14px]">login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low border-t border-surface-variant">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Program Belajar</span>
            <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Program Pilihan Utama</h2>
            <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto">
              Kurikulum interaktif yang disesuaikan dengan tahapan usia dan potensi siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs?.map((c) => (
              <div key={c.id} className="bg-white rounded-3xl p-6 ambient-shadow hover:scale-105 transition-all cursor-pointer border border-surface-variant flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full">
                    {c.target_age || c.name}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-on-surface">{c.name}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{c.description}</p>
                </div>
                <div className="pt-3 border-t border-surface-variant flex items-center justify-between">
                  <span className="font-headline font-bold text-base text-primary">
                    Rp {c.fee.toLocaleString('id-ID')}/bln
                  </span>
                  <Link href="/register" className="text-xs font-bold text-secondary flex items-center gap-1">
                    Daftar <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
