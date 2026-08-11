'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePasswordAction } from '../forgot-password/actions'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const formData = new FormData()
    formData.append('password', password)

    try {
      const result = await updatePasswordAction(null, formData)
      
      if (result.success) {
        setSuccessMsg(result.message)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setErrorMsg(result.errors?.password?.[0] || result.message || 'Terjadi kesalahan.')
      }
    } catch (err: any) {
      setErrorMsg('Gagal menghubungi server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-surface-variant/40 ambient-shadow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-container rounded-2xl mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl text-on-primary-container">key</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Buat Sandi Baru</h2>
          <p className="text-sm text-on-surface-variant mt-1">Masukkan kata sandi baru untuk akun Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-success/10 text-success px-4 py-3 rounded-xl text-sm font-medium border border-success/20 flex gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1">Sandi Baru</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full bg-primary text-on-primary h-12 rounded-xl font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span> Simpan Sandi Baru
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
