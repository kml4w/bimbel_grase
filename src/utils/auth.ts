import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUserRole() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore in server components
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role || 'student'
}

export function getRedirectPathByRole(role: string | null) {
  if (role === 'admin') return '/admin/tutors'
  if (role === 'tutor') return '/tutor/modules'
  if (role) return '/dashboard' // 'student' or 'parent'
  return '/login'
}

export async function redirectUserByRole() {
  const role = await getUserRole()
  const path = getRedirectPathByRole(role)
  redirect(path)
}
