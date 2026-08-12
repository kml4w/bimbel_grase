import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'
import ContactSettingsClient from './ContactSettingsClient'
import { getContactSettings } from './settings-actions'

export const metadata = {
  title: 'Profil Saya | Bimbel Grase',
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch settings only if admin
  let initialSettings = {}
  if (profile?.role === 'admin') {
    const res = await getContactSettings()
    if (res.success) {
      initialSettings = res.data || {}
    }
  }

  return (
    <section className="max-w-[800px] mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex items-center gap-4 border-b border-surface-variant/60 pb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[28px]">person</span>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Profil Saya</h1>
          <p className="text-on-surface-variant">Kelola informasi pribadi Anda.</p>
        </div>
      </div>

      <ProfileClient user={user} profile={profile} />
      
      {profile?.role === 'admin' && (
        <ContactSettingsClient initialSettings={initialSettings} />
      )}
    </section>
  )
}
