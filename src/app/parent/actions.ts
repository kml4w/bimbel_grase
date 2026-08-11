'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function getParentDashboardData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component
          }
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { success: false, message: 'Unauthorized' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: students, error } = await supabase
    .from('students')
    .select(`
      *,
      programs:program_id (*)
    `)
    .eq('parent_id', user.id)
    .order('created_at', { ascending: true })

  const { data: programsList } = await supabase
    .from('programs')
    .select('id, name')
    .order('name')

  if (error || !students) {
    return { success: false, message: 'Failed to fetch students' }
  }

  // BACKLOG 38: Logic hitung tagihan awal otomatis per anak
  // Total = Biaya Registrasi (bulan pertama saja) + Fee Program
  const studentsWithBills = students.map(student => {
    let registrationFee = 0
    // Get fee from relation. Programs fee is an array if multiple relations?
    // In our schema, student.program_id is a foreign key, so `programs` is an object.
    // However, depending on Supabase relations, it might be an array if the FK is reversed,
    // but here it's definitely an object.
    const programData: any = student.programs || {}
    let programFee = Number(programData.fee) || 0

    // Only apply registration fee on the first billing cycle
    if (student.billing_count === 1) {
      registrationFee = 250000 // Biaya Registrasi Rp 250.000
    }

    const totalBill = registrationFee + programFee

    return {
      ...student,
      program: programData,
      calculated_bill: {
        registrationFee,
        programFee,
        total: totalBill
      }
    }
  })

  // SORTING LOGIC: Handle active child cookie
  const activeChildId = cookieStore.get('active_child_id')?.value
  
  if (activeChildId) {
    const activeIndex = studentsWithBills.findIndex(s => s.id === activeChildId)
    if (activeIndex > 0) {
      // Move active student to the beginning of the array
      const activeStudent = studentsWithBills.splice(activeIndex, 1)[0]
      studentsWithBills.unshift(activeStudent)
    }
  }

  return {
    success: true,
    parentName: profile?.full_name || 'Orang Tua',
    students: studentsWithBills,
    programs: programsList || []
  }
}

export async function setActiveChild(studentId: string) {
  const cookieStore = await cookies()
  cookieStore.set('active_child_id', studentId, { path: '/' })
  return { success: true }
}

export async function addNewChildAction(formData: FormData) {
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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Harap masuk (login) terlebih dahulu' }
  }

  const studentName = formData.get('student_name')?.toString() || ''
  const age = formData.get('age')?.toString() || ''
  const programId = formData.get('program_id')?.toString() || ''

  if (!studentName || !age || !programId) {
    return { success: false, message: 'Data formulir tidak lengkap' }
  }

  const { error: insertError } = await supabase
    .from('students')
    .insert({
      parent_id: user.id,
      student_name: studentName,
      age: parseInt(age, 10),
      program_id: programId,
      billing_count: 1, // First bill applies registration fee
      payment_status: 'unpaid'
    })

  if (insertError) {
    return { success: false, message: 'Gagal menambahkan data anak: ' + insertError.message }
  }

  return { success: true, message: 'Profil anak berhasil ditambahkan!' }
}

export async function uploadChildAvatar(formData: FormData) {
  try {
    const studentId = formData.get('studentId') as string
    if (!studentId) {
      return { success: false, message: 'ID Anak tidak valid' }
    }
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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, message: 'Harap masuk (login) terlebih dahulu' }
  }

  // Verify the student belongs to the parent
  const { data: studentCheck } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()
    
  if (!studentCheck) {
    return { success: false, message: 'Data anak tidak ditemukan atau Anda tidak memiliki akses' }
  }

  const file = formData.get('file') as File
  if (!file || typeof file === 'string' || !file.name || file.size === 0) {
    return { success: false, message: 'File foto tidak valid atau kosong' }
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${studentId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  // Convert File to ArrayBuffer to avoid Next.js polyfill issues with Supabase
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, buffer, { 
      upsert: true,
      contentType: file.type || 'image/jpeg'
    })

  if (uploadError) {
    return { success: false, message: 'Gagal mengunggah foto: ' + uploadError.message }
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
    
  const avatarUrl = publicUrlData.publicUrl

  // Update student record
  const { error: updateError } = await supabase
    .from('students')
    .update({ avatar_url: avatarUrl })
    .eq('id', studentId)

    if (updateError) {
      return { success: false, message: 'Gagal memperbarui foto di database' }
    }

    return { success: true, message: 'Foto profil berhasil diperbarui', avatarUrl }
  } catch (err: any) {
    return { success: false, message: 'Terjadi kesalahan internal: ' + err.message }
  }
}

export async function submitPaymentProof(formData: FormData) {
  try {
    const studentId = formData.get('studentId') as string
    if (!studentId) {
      return { success: false, message: 'ID Anak tidak valid' }
    }
    
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, message: 'Harap masuk (login) terlebih dahulu' }
    }

    // Verify the student belongs to the parent
    const { data: studentCheck } = await supabase
      .from('students')
      .select('id')
      .eq('id', studentId)
      .eq('parent_id', user.id)
      .single()
      
    if (!studentCheck) {
      return { success: false, message: 'Data anak tidak ditemukan atau Anda tidak memiliki akses' }
    }

    const file = formData.get('file') as File
    if (!file || typeof file === 'string' || !file.name || file.size === 0) {
      return { success: false, message: 'File bukti pembayaran tidak valid atau kosong' }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${studentId}-${Date.now()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to payment-proofs bucket
    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, buffer, { 
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      return { success: false, message: 'Gagal mengunggah bukti pembayaran: ' + uploadError.message }
    }
    
    // We don't necessarily need the public URL if it's private, but we can store the path
    // Let's store the filePath so admin can generate signed URLs or download it.
    
    // Update student record
    const { error: updateError } = await supabase
      .from('students')
      .update({ 
        payment_proof_url: filePath,
        payment_status: 'pending' 
      })
      .eq('id', studentId)

    if (updateError) {
      return { success: false, message: 'Gagal memperbarui status pembayaran' }
    }

    return { success: true, message: 'Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.' }
  } catch (err: any) {
    return { success: false, message: 'Terjadi kesalahan internal: ' + err.message }
  }
}



export async function getParentFinanceHistory(studentId: string) {
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

  // Verify the student belongs to the parent
  const { data: studentCheck } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()
    
  if (!studentCheck) {
    return { success: false, message: 'Data anak tidak valid atau akses ditolak' }
  }

  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, message: 'Gagal mengambil data riwayat pembayaran' }
  }

  return { success: true, data: payments }
}
