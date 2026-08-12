'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminSidebar({ role }: { role: string | null }) {
  const pathname = usePathname()

  if (role !== 'admin') return null

  // Function to close sidebar on mobile after clicking a link
  const closeSidebarMobile = () => {
    const sidebar = document.getElementById('admin-sidebar')
    if (sidebar && window.innerWidth < 768) {
      sidebar.classList.add('-translate-x-full')
    }
  }

  return (
    <>
      {/* Admin Sidebar */}
      <aside 
        id="admin-sidebar" 
        className="fixed left-0 top-16 bottom-0 w-64 bg-surface border-r border-surface-variant/40 shadow-sm z-30 transition-transform duration-300 transform -translate-x-full md:translate-x-0"
      >
        <div className="h-full flex flex-col p-4 overflow-y-auto">
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[28px]">admin_panel_settings</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-headline font-bold text-sm text-on-surface">Admin Pusat</h3>
                <p className="text-[11px] text-outline">Pengelola Bimbel Grase</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1 text-xs md:text-sm font-bold flex-grow">
            <Link 
              href="/admin" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname === '/admin' 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Dasbor Utama</span>
            </Link>



            <Link 
              href="/admin/programs" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname.startsWith('/admin/programs') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">school</span>
              <span>Kelola Kelas</span>
            </Link>

            <Link 
              href="/admin/students" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname.startsWith('/admin/students') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>Kelola Siswa</span>
            </Link>

            <Link 
              href="/admin/assignments" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname.startsWith('/admin/assignments') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
              <span>Materi & Tugas</span>
            </Link>

            <Link 
              href="/admin/grades" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname.startsWith('/admin/grades') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">fact_check</span>
              <span>Rekap Nilai</span>
            </Link>

            <Link 
              href="/admin/finance" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname === '/admin/finance'
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              <span>Verifikasi Keuangan</span>
            </Link>

            <Link 
              href="/admin/finance/history" 
              onClick={closeSidebarMobile}
              className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-start gap-3 text-left transition-all ${
                pathname.startsWith('/admin/finance/history') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">payments</span>
              <span>Laporan Keuangan</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile to close sidebar when clicking outside */}
      <div 
        id="admin-sidebar-overlay" 
        className="fixed inset-0 bg-black/20 z-20 hidden md:hidden"
        onClick={closeSidebarMobile}
      ></div>
    </>
  )
}
