'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { useToast } from '@/components/ToastProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next')
  const { showToast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMsg(error.message)
        showToast('Gagal masuk. Periksa kembali kredensial Anda.', 'error')
        return
      }

      showToast('Login berhasil! Mengalihkan...', 'check_circle')
      
      // Supabase Edge Middleware will automatically redirect based on role
      // when we navigate to the root route, or we can force hard reload for session refresh
      setTimeout(() => {
        window.location.href = nextPath || '/'
      }, 500)
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan saat login.')
      showToast('Terjadi kesalahan yang tidak terduga', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-surface-variant/40 ambient-shadow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-container rounded-2xl mx-auto flex items-center justify-center mb-4 rotate-3">
            <span className="material-symbols-outlined text-4xl text-on-primary-container">lock_person</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Masuk ke Akun</h2>
          <p className="text-sm text-on-surface-variant mt-1">Gunakan email orang tua atau kredensial staf</p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold text-on-surface">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                Lupa Sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary h-12 rounded-xl font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined">login</span> Masuk
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
