'use server'

import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { RegisterSchema } from './schema'

export async function registerParentAction(prevState: any, formData: FormData) {
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
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  )

  // Parse raw form data including dynamic students arrays
  const rawData: any = {
    parentName: formData.get('parentName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
    students: []
  }

  // Extract students from formData (e.g. students[0].student_name)
  let i = 0;
  while (formData.has(`students[${i}].student_name`)) {
    rawData.students.push({
      student_name: formData.get(`students[${i}].student_name`),
      age: formData.get(`students[${i}].age`),
      program_id: formData.get(`students[${i}].program_id`)
    })
    i++;
  }

  const validatedFields = RegisterSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Mohon periksa kembali data yang dimasukkan."
    }
  }

  const { parentName, phone, email, password, students } = validatedFields.data

  try {
    // Use Admin Client to bypass "email rate limit exceeded" during development/testing
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
            } catch {}
          },
        }
      }
    )

    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email so they can login immediately
      user_metadata: {
        full_name: parentName,
        parent_name: parentName,
        parent_phone: phone,
        role: 'parent',
        students: students
      }
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { 
      success: true, 
      message: "Pendaftaran berhasil! Akun Anda telah dibuat." 
    }

  } catch (error: any) {
    return { success: false, message: "Terjadi kesalahan pada server." }
  }
}
