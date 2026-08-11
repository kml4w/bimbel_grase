'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav({ role }: { role: string | null }) {
  const pathname = usePathname()

  // Guest users or admin don't need the bottom navigation
  // Mobile bottom nav is primarily for parents and students (and possibly tutors)
  if (!role || role === 'admin') return null

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-surface-variant/40 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40 md:hidden flex justify-around items-center h-16 pb-safe">
      
      {role === 'tutor' ? (
        <>
          <Link href="/tutor/modules" className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith('/tutor/modules') ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname.startsWith('/tutor/modules') ? 'icon-fill' : ''}`}>library_books</span>
            <span className="text-[10px] font-bold mt-1">Modul</span>
          </Link>
          <Link href="/tutor/assignments" className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith('/tutor/assignments') ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname.startsWith('/tutor/assignments') ? 'icon-fill' : ''}`}>assignment</span>
            <span className="text-[10px] font-bold mt-1">Tugas</span>
          </Link>
        </>
      ) : (
        <>
          <Link href="/dashboard" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname === '/dashboard' ? 'icon-fill' : ''}`}>home</span>
            <span className="text-[10px] font-bold mt-1">Home</span>
          </Link>
          <Link href="/payments" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/payments' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname === '/payments' ? 'icon-fill' : ''}`}>receipt_long</span>
            <span className="text-[10px] font-bold mt-1">Tagihan</span>
          </Link>
          <Link href="/children" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/children' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname === '/children' ? 'icon-fill' : ''}`}>face</span>
            <span className="text-[10px] font-bold mt-1">Anak</span>
          </Link>
          <Link href="/elearning" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/elearning' ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className={`material-symbols-outlined text-[24px] ${pathname === '/elearning' ? 'icon-fill' : ''}`}>auto_stories</span>
            <span className="text-[10px] font-bold mt-1">Belajar</span>
          </Link>
        </>
      )}
    </nav>
  )
}
