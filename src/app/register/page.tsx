'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/components/ToastProvider'
import { createBrowserClient } from '@supabase/ssr'
import { registerParentAction } from './actions'

export default function RegisterPage() {
  const [parentName, setParentName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [students, setStudents] = useState([{ student_name: '', age: '', program_id: '' }])
  const [programs, setPrograms] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<any>({})
  
  const router = useRouter()
  const { showToast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    // Fetch programs for the dropdown
    async function fetchPrograms() {
      const { data } = await supabase.from('programs').select('id, name')
      if (data) setPrograms(data)
    }
    fetchPrograms()
  }, [])

  const handleAddStudent = () => {
    setStudents([...students, { student_name: '', age: '', program_id: '' }])
  }

  const handleRemoveStudent = (index: number) => {
    if (students.length > 1) {
      const newStudents = [...students]
      newStudents.splice(index, 1)
      setStudents(newStudents)
    }
  }

  const handleStudentChange = (index: number, field: string, value: string) => {
    const newStudents = [...students]
    newStudents[index] = { ...newStudents[index], [field]: value }
    setStudents(newStudents)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setFieldErrors({})

    try {
      const formData = new FormData()
      formData.append('parentName', parentName)
      formData.append('phone', phone)
      formData.append('email', email)
      formData.append('password', password)
      
      students.forEach((student, i) => {
        formData.append(`students[${i}].student_name`, student.student_name)
        formData.append(`students[${i}].age`, student.age)
        formData.append(`students[${i}].program_id`, student.program_id)
      })

      const result = await registerParentAction(null, formData)

      if (!result.success) {
        if (result.errors) {
          setFieldErrors(result.errors)
        }
        setErrorMsg(result.message)
        showToast('Pendaftaran gagal. Periksa kembali form Anda.', 'error')
        return
      }

      showToast(result.message + ' Silakan masuk untuk melihat tagihan.', 'check_circle')
      
      setTimeout(() => {
        router.push('/login?next=/parent/payment')
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setErrorMsg('Terjadi kesalahan saat pendaftaran. Detail: ' + (err?.message || String(err)))
      showToast('Terjadi kesalahan yang tidak terduga', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-surface-variant/40 ambient-shadow">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-container rounded-2xl mx-auto flex items-center justify-center mb-4 rotate-3">
            <span className="material-symbols-outlined text-4xl text-on-primary-container">person_add</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Pendaftaran Siswa Baru</h2>
          <p className="text-sm text-on-surface-variant mt-1">Isi data orang tua dan anak yang akan didaftarkan</p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-error/10 text-error px-4 py-3 rounded-xl text-sm font-medium border border-error/20 flex gap-2 items-center">
            <span className="material-symbols-outlined text-[20px]">error</span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          
          {/* BAGIAN ORANG TUA */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b pb-2">Data Orang Tua / Wali</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Nama Lengkap Wali</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Nama Lengkap"
                />
                {fieldErrors.parentName && <p className="text-xs text-error mt-1">{fieldErrors.parentName[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="0812..."
                />
                {fieldErrors.phone && <p className="text-xs text-error mt-1">{fieldErrors.phone[0]}</p>}
              </div>
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
                {fieldErrors.email && <p className="text-xs text-error mt-1">{fieldErrors.email[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="Minimal 6 karakter"
                />
                {fieldErrors.password && <p className="text-xs text-error mt-1">{fieldErrors.password[0]}</p>}
              </div>
            </div>
          </div>

          {/* BAGIAN ANAK */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary border-b pb-2 flex justify-between items-center">
              <span>Data Siswa</span>
              <button 
                type="button" 
                onClick={handleAddStudent}
                className="text-sm bg-secondary-container text-on-secondary-container px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-secondary-container/80"
              >
                <span className="material-symbols-outlined text-sm">add</span> Tambah Siswa
              </button>
            </h3>

            {fieldErrors.students && <p className="text-sm text-error mb-2">{fieldErrors.students[0]}</p>}

            {students.map((student, index) => (
              <div key={index} className="p-4 bg-surface-container-lowest border border-outline-variant rounded-2xl relative space-y-4">
                {students.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveStudent(index)}
                    className="absolute top-4 right-4 text-error hover:bg-error/10 p-1 rounded-full flex"
                    title="Hapus Siswa"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
                
                <h4 className="font-bold text-on-surface">Siswa #{index + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-on-surface mb-1">Nama Siswa</label>
                    <input
                      type="text"
                      required
                      value={student.student_name}
                      onChange={(e) => handleStudentChange(index, 'student_name', e.target.value)}
                      className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="Nama Lengkap Anak"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Umur (Tahun)</label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={student.age}
                      onChange={(e) => handleStudentChange(index, 'age', e.target.value)}
                      className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="Contoh: 10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-1">Pilih Program Bimbingan</label>
                    <select
                      required
                      value={student.program_id}
                      onChange={(e) => handleStudentChange(index, 'program_id', e.target.value)}
                      className="w-full h-12 rounded-xl bg-surface-container-low border border-outline-variant px-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
                    >
                      <option value="">-- Pilih Program --</option>
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary h-12 rounded-xl font-bold hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-md mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined">how_to_reg</span> Daftarkan Sekarang
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
