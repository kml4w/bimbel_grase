import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Header from './Header'
import BottomNav from './BottomNav'
import AdminSidebar from './AdminSidebar'
import Footer from './Footer'

export default async function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
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

  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const role = profile?.role || null

  return (
    <>
      <Header user={user} profile={profile} />
      
      <AdminSidebar role={role} />
      
      {/* Main Content Area */}
      {/* Adjust padding based on role and screen size to prevent overlap with fixed Header/Sidebar/BottomNav */}
      <main className={`flex-grow flex flex-col pt-16 ${role === 'admin' ? 'md:pl-64' : ''} ${role && role !== 'admin' ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>

      <Footer role={role} />
      <BottomNav role={role} />
    </>
  )
}
