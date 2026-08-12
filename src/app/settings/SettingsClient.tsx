'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SettingsClient() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-40 animate-pulse bg-surface-container rounded-3xl"></div>
  }

  const isDarkMode = theme === 'dark'

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Keamanan */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/60">
        <h3 className="text-lg font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">security</span> Keamanan
        </h3>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-surface rounded-2xl border border-outline-variant gap-4">
          <div>
            <p className="font-bold text-on-surface text-sm">Kata Sandi</p>
            <p className="text-xs text-on-surface-variant">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
          </div>
          <Link 
            href="/update-password" 
            className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shrink-0"
          >
            Ubah Kata Sandi
          </Link>
        </div>
      </div>

      {/* Notifikasi */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/60">
        <h3 className="text-lg font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications</span> Preferensi Notifikasi
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant">
            <div>
              <p className="font-bold text-on-surface text-sm">Notifikasi Email</p>
              <p className="text-xs text-on-surface-variant">Terima pembaruan tentang tagihan dan tugas via email.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant opacity-60 pointer-events-none">
            <div>
              <p className="font-bold text-on-surface text-sm">Notifikasi WhatsApp (Segera Hadir)</p>
              <p className="text-xs text-on-surface-variant">Pengingat kelas dan jadwal via WhatsApp.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" disabled />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Tampilan */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 ambient-shadow border border-surface-variant/60">
        <h3 className="text-lg font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">palette</span> Tampilan
        </h3>
        <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant">
          <div>
            <p className="font-bold text-on-surface text-sm">Mode Gelap (Dark Mode)</p>
            <p className="text-xs text-on-surface-variant">Ubah tema tampilan aplikasi.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isDarkMode} 
              onChange={() => setTheme(isDarkMode ? 'light' : 'dark')}
            />
            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

    </div>
  )
}
