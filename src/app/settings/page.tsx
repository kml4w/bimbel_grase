import SettingsClient from './SettingsClient'

export const metadata = {
  title: 'Pengaturan Akun | Bimbel Grase',
}

export default function SettingsPage() {
  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center gap-4 border-b border-surface-variant/60 pb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[28px]">settings</span>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Pengaturan Akun</h1>
          <p className="text-on-surface-variant">Kelola preferensi dan keamanan akun Anda.</p>
        </div>
      </div>

      <SettingsClient />
    </section>
  )
}
