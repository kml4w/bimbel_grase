'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function getAllStudents() {
  const supabase = await createClient()

  // Verifikasi admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { data, error } = await supabase
    .from('students')
    .select('*, profiles(id, full_name), programs(id, name), billing_count')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: error.message }
  }

  // Fetch emails using Admin API
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
  
  const dataWithEmail = data.map(student => {
    const parentUser = usersData?.users.find(u => u.id === student.parent_id)
    return {
      ...student,
      profiles: student.profiles ? {
        ...student.profiles,
        email: parentUser?.email || '-'
      } : null
    }
  })

  return { success: true, data: dataWithEmail }
}

export async function updateStudent(id: string, formData: {
  student_name: string
  age: number
  program_id: string
  payment_status: string
  billing_count?: number
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  // Ambil data siswa saat ini untuk membandingkan perubahan
  const { data: currentStudent } = await supabase
    .from('students')
    .select('payment_status, billing_count, programs(fee)')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('students')
    .update(formData)
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  // Sinkronisasi dengan tabel payments yang lebih cerdas (True Sync)
  if (currentStudent && formData.payment_status === 'verified') {
    const newBillingCount = formData.billing_count ?? currentStudent.billing_count ?? 1;
    
    // Cari transaksi yang sudah ada di Laporan Keuangan untuk siswa ini
    const { data: existingPayments } = await supabase
      .from('payments')
      .select('billing_month')
      .eq('student_id', id)
      .eq('status', 'verified');
      
    const existingMonths = existingPayments?.map(p => p.billing_month) || [];
    const fee = (currentStudent.programs as any)?.fee || 0;
    
    const paymentsToInsert = [];
    
    // Pastikan setiap bulan dari 1 hingga newBillingCount punya record transaksi
    for (let month = 1; month <= newBillingCount; month++) {
      if (!existingMonths.includes(month)) {
        const amount = fee + (month === 1 ? 150000 : 0); // Registrasi jika bulan 1
        paymentsToInsert.push({
          student_id: id,
          amount: amount,
          billing_month: month,
          status: 'verified',
          verified_by: user.id
        });
      }
    }
    
    if (paymentsToInsert.length > 0) {
      await supabase.from('payments').insert(paymentsToInsert);
    }
  }

  revalidatePath('/admin/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin/students')
  return { success: true }
}
