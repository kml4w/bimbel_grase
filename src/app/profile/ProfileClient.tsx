'use client'

import { useState, useRef, useEffect } from 'react'
import { updateProfileName } from './actions'
import { useToast } from '@/components/ToastProvider'
import { useTheme } from 'next-themes'

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
  }).format(new Date(dateStr))
}

export default function ProfileClient({ user, profile }: { user: any, profile: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    
    setIsLoading(true)
    const formData = new FormData(formRef.current)
    
    try {
      const res = await updateProfileName(formData)
      if (res.success) {
        showToast(res.message, 'check_circle')
        setIsEditing(false)
      } else {
        showToast(res.message, 'error')
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat memperbarui profil', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3 w-full md:w-auto shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-md bg-surface-container relative">
            {/* Placeholder Avatar */}
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container-high">
              <span className="material-symbols-outlined text-[64px]">person</span>
            </div>
          </div>
          <span className="bg-secondary-container/50 text-secondary px-3 py-1 rounded-full text-xs font-bold capitalize border border-secondary-container">
            Peran: {profile?.role || 'Pengguna'}
          </span>
        </div>

        {/* Info Section */}
        <div className="w-full space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-headline font-bold text-on-surface border-b pb-2">Informasi Akun</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1 block">Email</label>
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-outline">mail</span>
                  {user.email}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-on-surface-variant mb-1 block">Terdaftar Sejak</label>
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-outline">calendar_month</span>
                  {formatDate(user.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-headline font-bold text-on-surface">Data Pribadi</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form ref={formRef} onSubmit={handleUpdate} className="space-y-4 bg-surface-container-lowest p-4 rounded-xl border border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="text-xs font-bold text-on-surface-variant mb-1 block">Nama Lengkap</label>
                    <input 
                      type="text" 
                      id="full_name"
                      name="full_name" 
                      defaultValue={profile?.full_name || ''} 
                      className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-xs font-bold text-on-surface-variant mb-1 block">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      defaultValue={user.email || ''} 
                      className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">save</span>
                    )}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant mb-1 block">Nama Lengkap</label>
                  <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium">
                    {profile?.full_name || '-'}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <PasswordChangeSection />
          
          {profile?.role === 'admin' && <ThemeToggleSection />}
        </div>
      </div>
    </div>
  )
}

function ThemeToggleSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDarkMode = theme === 'dark'

  return (
    <div className="space-y-4 pt-4 border-t border-surface-variant/40">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-headline font-bold text-on-surface">Tampilan</h3>
      </div>
      <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
        <div>
          <p className="font-bold text-on-surface text-sm">Mode Gelap (Dark Mode)</p>
          <p className="text-xs text-on-surface-variant">Ubah tema tampilan aplikasi menjadi gelap.</p>
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
  )
}

function PasswordChangeSection() {
  const [isEditingPwd, setIsEditingPwd] = useState(false)
  const [isLoadingPwd, setIsLoadingPwd] = useState(false)
  const { showToast } = useToast()
  const pwdFormRef = useRef<HTMLFormElement>(null)
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwdFormRef.current) return
    
    setIsLoadingPwd(true)
    const formData = new FormData(pwdFormRef.current)
    
    try {
      // Import secara dinamis agar tidak bermasalah jika action belum ada
      const { updatePasswordWithVerification } = await import('./actions')
      const res = await updatePasswordWithVerification(formData)
      if (res.success) {
        showToast(res.message, 'check_circle')
        setIsEditingPwd(false)
        pwdFormRef.current.reset()
      } else {
        showToast(res.message, 'error')
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat mengubah sandi', 'error')
    } finally {
      setIsLoadingPwd(false)
    }
  }

  return (
    <div className="space-y-4 pt-4 border-t border-surface-variant/40">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-headline font-bold text-on-surface">Keamanan Akun</h3>
        {!isEditingPwd && (
          <button 
            onClick={() => setIsEditingPwd(true)}
            className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">lock_reset</span> Ganti Sandi
          </button>
        )}
      </div>

      {isEditingPwd ? (
        <form ref={pwdFormRef} onSubmit={handlePasswordUpdate} className="space-y-4 bg-surface-container-lowest p-4 rounded-xl border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="current_password" className="text-xs font-bold text-on-surface-variant mb-1 block">Sandi Saat Ini</label>
              <input 
                type="password" 
                id="current_password"
                name="current_password" 
                placeholder="Masukkan sandi Anda saat ini"
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="new_password" className="text-xs font-bold text-on-surface-variant mb-1 block">Sandi Baru</label>
              <input 
                type="password" 
                id="new_password"
                name="new_password" 
                placeholder="Minimal 6 karakter"
                minLength={6}
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button 
              type="button"
              onClick={() => setIsEditingPwd(false)}
              className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
              disabled={isLoadingPwd}
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              disabled={isLoadingPwd}
            >
              {isLoadingPwd ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              Perbarui Sandi
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">Kata Sandi</label>
            <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-xl text-sm text-on-surface font-medium flex items-center justify-between">
              <span>••••••••</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Aman</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
