'use server'

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { calculateQuizGrade } from '@/utils/grading'

export async function getStudentAssignments(studentId: string) {
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

  // Check if student belongs to parent
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('program_id, payment_status, student_name')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (studentError || !student) {
    console.error('getStudentAssignments Error:', { studentId, userId: user.id, studentError })
    return { success: false, message: `Data siswa tidak ditemukan atau bukan milik Anda. ID: ${studentId}` }
  }

  if (student.payment_status !== 'verified') {
    return { success: false, message: 'Akses terkunci. Pembayaran belum lunas.' }
  }

  // Get assignments for this program
  const { data: assignments, error: assignmentsError } = await supabase
    .from('assignments')
    .select(`
      *,
      submissions (
        id, submitted_at, status, score, notes, submitted_file_path
      )
    `)
    .eq('program_id', student.program_id)
    .eq('submissions.student_id', studentId)
    .order('created_at', { ascending: false })

  if (assignmentsError) {
    return { success: false, message: assignmentsError.message }
  }

  // Map submissions to assignments
  const assignmentsWithStatus = assignments.map(a => {
    const submission = a.submissions && a.submissions.length > 0 ? a.submissions[0] : null
    return {
      ...a,
      submissionStatus: submission ? submission.status : 'belum_dikerjakan',
      score: submission?.score || null
    }
  })

  return { success: true, data: { studentName: student.student_name, assignments: assignmentsWithStatus } }
}

export async function getAssignmentDetail(studentId: string, assignmentId: string) {
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

  // Verify student
  const { data: student } = await supabase
    .from('students')
    .select('program_id, payment_status')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (!student || student.payment_status !== 'verified') {
    return { success: false, message: 'Akses ditolak' }
  }

  // Get Assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignmentId)
    .eq('program_id', student.program_id)
    .single()

  if (assignmentError || !assignment) {
    return { success: false, message: 'Tugas tidak ditemukan' }
  }

  // Get Signed URL for PDF if exists
  let pdfSignedUrl = null
  if (assignment.pdf_file_path) {
    const { data: urlData } = await supabase.storage
      .from('assignment-materials')
      .createSignedUrl(assignment.pdf_file_path, 3600) // 1 hour
    
    if (urlData) {
      pdfSignedUrl = urlData.signedUrl
    }
  }

  // Get Submission
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single()

  let submissionSignedUrl = null
  if (submission && submission.submitted_file_path) {
    const { data: urlData } = await supabase.storage
      .from('student-submissions')
      .createSignedUrl(submission.submitted_file_path, 3600)
    
    if (urlData) {
      submissionSignedUrl = urlData.signedUrl
    }
  }

  return { 
    success: true, 
    data: { 
      assignment: { ...assignment, pdfSignedUrl }, 
      submission: submission ? { ...submission, submissionSignedUrl } : null 
    } 
  }
}

export async function uploadSubmission(formData: FormData) {
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

  const studentId = formData.get('student_id') as string
  const assignmentId = formData.get('assignment_id') as string
  const file = formData.get('submission_file') as File

  if (!studentId || !assignmentId || !file || file.size === 0) {
    return { success: false, message: 'Data tidak lengkap atau file kosong' }
  }

  // Verify ownership
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (!student) return { success: false, message: 'Data siswa tidak sah' }

  // Check if already submitted
  const { data: existingSub } = await supabase
    .from('submissions')
    .select('id, submitted_file_path')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single()

  // Upload file
  const fileExt = file.name.split('.').pop()
  const fileName = `${studentId}-${assignmentId}-${Date.now()}.${fileExt}`
  const filePath = `submissions/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('student-submissions')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (uploadError) {
    console.error('Upload error details:', uploadError);
    return { success: false, message: 'Gagal mengunggah file ke server storage: ' + uploadError.message + ' (' + (uploadError as any)?.statusCode + ')' }
  }

  // Insert or Update DB
  if (existingSub) {
    // Optional: remove old file
    if (existingSub.submitted_file_path) {
      await supabase.storage.from('student-submissions').remove([existingSub.submitted_file_path])
    }
    const { error: updateError } = await supabase
      .from('submissions')
      .update({
        submitted_file_path: filePath,
        submitted_at: new Date().toISOString()
      })
      .eq('id', existingSub.id)

    if (updateError) {
      console.error('Update DB error details:', updateError);
      return { success: false, message: 'Gagal menyimpan ke database (update): ' + updateError.message }
    }
  } else {
    const { error: insertError } = await supabase
      .from('submissions')
      .insert({
        assignment_id: assignmentId,
        student_id: studentId,
        submitted_file_path: filePath,
        status: 'submitted'
      })

    if (insertError) {
      console.error('Insert DB error details:', insertError);
      return { success: false, message: 'Gagal menyimpan ke database (insert): ' + insertError.message }
    }
  }

  revalidatePath(`/parent/elearning/${studentId}/${assignmentId}`)
  revalidatePath(`/parent/elearning/${studentId}`)
  
  return { success: true, message: 'Tugas berhasil dikumpulkan!' }
}

export async function getStudentQuizzes(studentId: string) {
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

  const { data: student } = await supabase
    .from('students')
    .select('program_id, payment_status')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (!student || student.payment_status !== 'verified') {
    return { success: false, message: 'Akses ditolak' }
  }

  // Ambil daftar kuis
  const { data: quizzes, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('program_id', student.program_id)
    .order('created_at', { ascending: false })

  if (error) return { success: false, message: error.message }

  // Cek apakah sudah dikerjakan di tabel grades
  const { data: grades } = await supabase
    .from('grades')
    .select('task_name, score, grade_letter')
    .eq('student_id', studentId)

  const quizzesWithStatus = quizzes.map(q => {
    // Karena kita tidak punya foreign key ke quiz, kita cocokan by title/task_name
    const grade = grades?.find(g => g.task_name === `Kuis: ${q.title}`)
    return {
      ...q,
      isFinished: !!grade,
      score: grade ? grade.score : null,
      gradeLetter: grade ? grade.grade_letter : null
    }
  })

  return { success: true, data: quizzesWithStatus }
}

export async function submitQuiz(studentId: string, quizId: string, answers: Record<string, string>) {
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

  // Verifikasi student
  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('id', studentId)
    .eq('parent_id', user.id)
    .single()

  if (!student) return { success: false, message: 'Unauthorized student' }

  // Ambil kuis dan kunci jawaban
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('title, questions, questions_count')
    .eq('id', quizId)
    .single()

  if (quizError || !quiz) return { success: false, message: 'Kuis tidak ditemukan' }

  // Hitung skor menggunakan helper
  const { correctCount, total, score, gradeLetter } = calculateQuizGrade(answers, quiz.questions, quiz.questions_count)

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { success: false, message: 'Server error: Kunci Admin tidak ditemukan. Mohon matikan terminal (Ctrl+C) dan jalankan ulang "npm run dev".' }
  }
  
  // Gunakan Admin Client murni dari supabase-js agar tidak tercampur cookie user
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const notesString = JSON.stringify({
    summary: `Skor Otomatis Kuis. Benar ${correctCount} dari ${quiz.questions_count} soal.`,
    answers: answers
  })

  // Simpan ke grades dengan admin client
  const { error: insertError } = await supabaseAdmin
    .from('grades')
    .insert({
      student_id: studentId,
      task_name: `Kuis: ${quiz.title}`,
      score: score,
      grade_letter: gradeLetter,
      notes: notesString
    })

  if (insertError) {
    return { success: false, message: 'Gagal menyimpan nilai: ' + insertError.message }
  }

  revalidatePath(`/parent/elearning/${studentId}`)
  
  return { 
    success: true, 
    data: { score, gradeLetter, correctCount, total: quiz.questions_count, answers } 
  }
}
