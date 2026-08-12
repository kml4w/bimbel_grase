'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getContactSettings() {
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

  const { data, error } = await supabase.from('settings').select('*')
  
  if (error || !data) {
    return { success: false, data: {} }
  }

  const settings: Record<string, string> = {}
  data.forEach(item => {
    settings[item.key] = item.value
  })

  return { success: true, data: settings }
}

export async function updateContactSettings(formData: {
  contact_whatsapp: string
  contact_email: string
  contact_address: string
  contact_hours: string
}) {
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
  if (!user) return { success: false, message: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' }

  const updates = [
    { key: 'contact_whatsapp', value: formData.contact_whatsapp },
    { key: 'contact_email', value: formData.contact_email },
    { key: 'contact_address', value: formData.contact_address },
    { key: 'contact_hours', value: formData.contact_hours }
  ]

  for (const item of updates) {
    await supabase.from('settings').upsert(item)
  }

  return { success: true, message: 'Pengaturan Kontak berhasil disimpan' }
}
