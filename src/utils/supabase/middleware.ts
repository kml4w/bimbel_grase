import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith('/admin')
  const isTutorRoute = pathname.startsWith('/tutor')
  const isParentRoute = pathname.startsWith('/parent')
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // If trying to access protected routes without being logged in
  if (!user && (isAdminRoute || isTutorRoute || isParentRoute || isDashboardRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If logged in, handle role checks and redirects
  if (user) {
    // Only fetch role if it's a route that needs role evaluation to save DB queries
    if (isAdminRoute || isTutorRoute || isParentRoute || isAuthRoute || pathname === '/') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      const role = profile?.role || 'student'

      // Backlog 26: Route Protection
      if (isAdminRoute && role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = role === 'tutor' ? '/tutor/modules' : role === 'parent' ? '/parent' : '/dashboard'
        return NextResponse.redirect(url)
      }

      if (isTutorRoute && role !== 'tutor') {
        const url = request.nextUrl.clone()
        url.pathname = role === 'admin' ? '/admin/tutors' : role === 'parent' ? '/parent' : '/dashboard'
        return NextResponse.redirect(url)
      }

      if (isParentRoute && role !== 'parent') {
        const url = request.nextUrl.clone()
        url.pathname = role === 'admin' ? '/admin/tutors' : role === 'tutor' ? '/tutor/modules' : '/dashboard'
        return NextResponse.redirect(url)
      }

      // Backlog 27: Role-Based Redirection
      // If hitting login/register or root path while already logged in
      if (isAuthRoute || pathname === '/') {
        const url = request.nextUrl.clone()
        if (role === 'admin') url.pathname = '/admin/tutors'
        else if (role === 'tutor') url.pathname = '/tutor/modules'
        else if (role === 'parent') url.pathname = '/parent'
        else url.pathname = '/dashboard'
        
        // Prevent redirect loop if already on the correct path
        if (url.pathname !== pathname) {
          return NextResponse.redirect(url)
        }
      }
    }
  }

  return supabaseResponse
}
