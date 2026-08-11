'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getPendingPayments() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  // Verify Admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized', data: [] }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden', data: [] }

  // Fetch pending payments
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      student_name,
      payment_status,
      payment_proof_url,
      billing_count,
      profiles!parent_id(full_name, parent_phone),
      programs(name, fee)
    `)
    .eq('payment_status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    return { success: false, message: error.message, data: [] }
  }

  // Get Signed URLs for images (valid for 1 hour)
  const pendingData = await Promise.all((data as any[]).map(async (student) => {
    let signedUrl = null
    if (student.payment_proof_url) {
      const { data: urlData } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(student.payment_proof_url, 3600)
      if (urlData) {
        signedUrl = urlData.signedUrl
      }
    }
    return {
      ...student,
      parent_name: student.profiles?.full_name || 'Tanpa Nama',
      parent_phone: student.profiles?.parent_phone || '-',
      program_name: student.programs?.name || '-',
      amount: (student.programs?.fee || 0) + (student.billing_count === 1 ? 150000 : 0),
      signedUrl
    }
  }))

  return { success: true, data: pendingData }
}

export async function adminVerifyPayment(studentId: string, action: 'approve' | 'reject') {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' }

  // Fetch student details to record in payment history
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('billing_count, payment_proof_url, programs(fee)')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return { success: false, message: 'Data siswa tidak ditemukan' }
  }

  const newStatus = action === 'approve' ? 'verified' : 'unpaid'
  const currentBillingCount = student.billing_count || 1;
  
  const updateData: any = { 
    payment_status: newStatus,
    billing_count: currentBillingCount
  }
  if (action === 'reject') {
    updateData.payment_proof_url = null
  }

  // Update student status
  const { error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', studentId)

  if (error) {
    return { success: false, message: 'Gagal memproses status siswa' }
  }

  // If approved, record the transaction in the payments table
  if (action === 'approve') {
    const isFirstPayment = currentBillingCount === 1;
    const amount = ((student as any).programs?.fee || 0) + (isFirstPayment ? 150000 : 0)
    
    // We use the service role key to insert to bypass RLS issues just in case, but Admin role is fine
    // Since this is server action, the client is initialized with ANON_KEY but cookies authenticate as Admin
    await supabase.from('payments').insert({
      student_id: studentId,
      amount: amount,
      billing_month: currentBillingCount,
      payment_proof_url: student.payment_proof_url,
      status: 'verified',
      verified_by: user.id
    })
  }

  return { success: true, message: action === 'approve' ? 'Pembayaran disetujui!' : 'Pembayaran ditolak.' }
}

export async function getFinanceHistory() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized', data: [] }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden', data: [] }

  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      amount,
      billing_month,
      status,
      created_at,
      students(student_name, programs(name))
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: error.message, data: [] }
  }

  const historyData = (data as any[]).map((payment) => ({
    id: payment.id,
    amount: payment.amount,
    billing_month: payment.billing_month,
    status: payment.status,
    created_at: payment.created_at,
    student_name: payment.students?.student_name || 'Tanpa Nama',
    program_name: payment.students?.programs?.name || '-'
  }))

  return { success: true, data: historyData }
}

export async function getVerifiedStudents() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Unauthorized', data: [] }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden', data: [] }

  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      student_name,
      payment_status,
      billing_count,
      profiles!parent_id(full_name),
      programs(name, fee)
    `)
    .eq('payment_status', 'verified')
    .order('student_name', { ascending: true })

  if (error) {
    return { success: false, message: error.message, data: [] }
  }

  const studentsData = (data as any[]).map(student => ({
    ...student,
    parent_name: student.profiles?.full_name || 'Tanpa Nama',
    program_name: student.programs?.name || '-',
    amount: student.programs?.fee || 0
  }))

  return { success: true, data: studentsData }
}

export async function generateNextMonthBill(studentId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'Harap masuk terlebih dahulu' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { success: false, message: 'Forbidden' }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('billing_count')
    .eq('id', studentId)
    .single()

  if (studentError || !student) {
    return { success: false, message: 'Data siswa tidak valid' }
  }

  const { error } = await supabase
    .from('students')
    .update({
      payment_status: 'unpaid',
      billing_count: student.billing_count + 1,
      payment_proof_url: null
    })
    .eq('id', studentId)

  if (error) {
    return { success: false, message: 'Gagal membuat tagihan baru' }
  }

  return { success: true, message: 'Tagihan bulan berikutnya berhasil dibuat!' }
}
