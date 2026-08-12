'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Inisialisasi client Supabase dengan Server Actions
async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )
}

export async function getAdminKPIs() {
  const supabase = await getSupabase()

  // Pastikan user adalah admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return { success: false, message: 'Forbidden: Admin only' }
  }

  // 1. Total Siswa Aktif
  const { count: totalStudents, error: err1 } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'verified')
    
  // 2. Total Siswa Menunggu Verifikasi
  const { count: pendingStudents, error: err2 } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'pending')

  // 3. Total Kelas / Program
  const { count: totalPrograms, error: err3 } = await supabase
    .from('programs')
    .select('*', { count: 'exact', head: true })

  // 4. Total Materi & Tugas
  const { count: totalAssignments, error: err4 } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })

  // 5. Total Pendapatan (dari pendaftaran / SPP yang verified)
  // Misal dari tabel payments
  const { data: verifiedPayments, error: err5 } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'verified')
    
  let totalRevenue = 0
  if (verifiedPayments) {
    totalRevenue = verifiedPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  }

  // 6. Data Siswa per Kelas (hanya yang aktif/verified)
  const { data: studentsData } = await supabase
    .from('students')
    .select('id, student_name, age, program_id, billing_count, profiles(full_name, parent_phone)')
    .eq('payment_status', 'verified')
    
  const { data: programsData } = await supabase
    .from('programs')
    .select('id, name')
    
  const classStats = programsData?.map(program => {
    const studentsInClass = studentsData?.filter(s => s.program_id === program.id) || [];
    return {
      id: program.id,
      name: program.name,
      count: studentsInClass.length,
      students: studentsInClass.map(s => ({
        id: s.id,
        student_name: s.student_name,
        age: s.age,
        billing_count: s.billing_count,
        parent_name: (s.profiles as any)?.full_name || '-',
        parent_phone: (s.profiles as any)?.parent_phone || '-'
      }))
    }
  }).sort((a, b) => b.count - a.count) || [];

  if (err1 || err2 || err3 || err4 || err5) {
    console.error('Admin Dashboard KPI Errors:', { err1, err2, err3, err4, err5 })
    return { success: false, message: `Gagal mengambil beberapa data KPI. Detail: ${[err1, err2, err3, err4, err5].map(e => e?.message).filter(Boolean).join(', ')}` }
  }

  return {
    success: true,
    data: {
      totalStudents: totalStudents || 0,
      pendingStudents: pendingStudents || 0,
      totalPrograms: totalPrograms || 0,
      totalAssignments: totalAssignments || 0,
      totalRevenue,
      classStats
    }
  }
}

export async function getEnrollmentStats() {
  const supabase = await getSupabase()

  // Pastikan user adalah admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return { success: false, message: 'Forbidden: Admin only' }
  }

  // Get all students
  const { data: students, error } = await supabase
    .from('students')
    .select('created_at')
    
  if (error) {
    return { success: false, message: 'Gagal mengambil data pendaftaran' }
  }

  // Group by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  // Initialize last 6 months with 0
  const currentDate = new Date()
  const stats: { name: string, month: number, year: number, Siswa: number }[] = []
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    stats.push({
      name: months[d.getMonth()],
      month: d.getMonth(),
      year: d.getFullYear(),
      Siswa: 0
    })
  }

  // Populate data
  students?.forEach(student => {
    const d = new Date(student.created_at)
    const month = d.getMonth()
    const year = d.getFullYear()
    
    const statIndex = stats.findIndex(s => s.month === month && s.year === year)
    if (statIndex !== -1) {
      stats[statIndex].Siswa += 1
    }
  })

  return { success: true, data: stats }
}
