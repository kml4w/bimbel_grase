'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOutAction } from '@/app/logout/actions'

export default function Header({ user, profile }: { user: any, profile: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const role = profile?.role || null
  const isLoggedIn = !!user

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOutAction()
    // Hard refresh to clear client state
    window.location.href = '/'
  }

  // Sidebar toggle only needed if Admin (we can broadcast a custom event or use context, but for now just toggle a class on body or a specific id)
  const toggleAdminSidebar = () => {
    const sidebar = document.getElementById('admin-sidebar')
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full')
    }
  }

  return (
    <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-8 h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-surface-variant/40">
      <div className="flex items-center gap-3">
        {role === 'admin' && (
          <button 
            onClick={toggleAdminSidebar}
            className="md:hidden text-on-surface hover:text-primary p-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px] icon-fill">school</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl leading-tight text-primary tracking-tight">Bimbel Grase</span>
            {role === 'admin' && (
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Mode Admin Pusat</span>
            )}
            {role === 'tutor' && (
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Mode Tutor</span>
            )}
          </div>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-1 h-full">
        {!isLoggedIn ? (
          <div className="flex items-center gap-1 h-full">
            <Link 
              href="/" 
              className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            >
              Home
            </Link>
            <Link 
              href="/register" 
              className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/register' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            >
              Pendaftaran
            </Link>
          </div>
        ) : role === 'admin' ? (
          <div className="flex items-center gap-1 h-full">
            <Link href="/admin/tutors" className="nav-btn h-full px-4 text-secondary font-bold flex items-center gap-1.5 transition-all">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Dashboard Admin
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-1 h-full">
            <Link 
              href={role === 'parent' ? '/parent' : '/dashboard'} 
              className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/parent' || pathname === '/dashboard' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            >
              Home
            </Link>
            {/* For parents/students */}
            {role !== 'tutor' && (
              <>
                <Link 
                  href={role === 'parent' ? '/parent/payment' : '/payments'}
                  className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/parent/payment' || pathname === '/payments' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                >
                  Pembayaran
                </Link>
                <Link 
                  href={role === 'parent' ? '/parent/children' : '/children'}
                  className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/parent/children' || pathname === '/children' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                >
                  Profil Anak
                </Link>
                <Link 
                  href={role === 'parent' ? '/parent/elearning' : '/elearning'}
                  className={`nav-btn h-full px-4 flex items-center transition-all ${pathname === '/parent/elearning' || pathname === '/elearning' ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                >
                  E-Learning
                </Link>
              </>
            )}
            {/* For Tutors */}
            {role === 'tutor' && (
              <>
                <Link 
                  href="/tutor/modules" 
                  className={`nav-btn h-full px-4 flex items-center transition-all ${pathname.startsWith('/tutor/modules') ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                >
                  Modul & Materi
                </Link>
                <Link 
                  href="/tutor/assignments" 
                  className={`nav-btn h-full px-4 flex items-center transition-all ${pathname.startsWith('/tutor/assignments') ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
                >
                  Tugas Siswa
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm items-center justify-center bg-surface-container-high ring-2 ring-primary/20 hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-primary">person</span>
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-surface-variant py-2 flex flex-col z-50 ambient-shadow">
                  <div className="px-4 py-3 border-b border-surface-variant/50 mb-2 bg-surface-container-lowest">
                    <p className="text-sm font-bold text-on-surface truncate">{profile?.full_name || 'Pengguna'}</p>
                    <p className="text-xs text-on-surface-variant capitalize mt-0.5">{role}</p>
                  </div>
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">person</span> Profil Saya
                  </Link>
                  {role !== 'admin' && (
                    <>
                      <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span> Pengaturan Akun
                      </Link>
                      <Link href="/help" onClick={() => setIsDropdownOpen(false)} className="px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-primary flex items-center gap-3 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">help</span> Pusat Bantuan
                      </Link>
                    </>
                  )}
                  <div className="border-t border-surface-variant/50 mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-error hover:bg-error/10 flex items-center gap-3 transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">logout</span> Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link 
            href="/login" 
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
          >
            <span className="material-symbols-outlined text-[18px]">login</span> Masuk
          </Link>
        )}
      </div>
    </header>
  )
}
