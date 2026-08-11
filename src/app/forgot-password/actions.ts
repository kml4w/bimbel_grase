'use server'

import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
})

export const UpdatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password minimal 6 karakter" })
})

export async function requestPasswordResetAction(prevState: any, formData: FormData) {
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
          } catch {}
        },
      },
    }
  )

  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Mohon periksa kembali email yang dimasukkan."
    }
  }

  const { email } = validatedFields.data

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
    })

    if (error) {
      return { success: false, message: error.message }
    }

    return { 
      success: true, 
      message: "Tautan reset password telah dikirim ke email Anda." 
    }
  } catch (error: any) {
    return { success: false, message: "Terjadi kesalahan pada server." }
  }
}

export async function updatePasswordAction(prevState: any, formData: FormData) {
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
          } catch {}
        },
      },
    }
  )

  const validatedFields = UpdatePasswordSchema.safeParse({
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Mohon periksa kembali kata sandi baru Anda."
    }
  }

  const { password } = validatedFields.data

  try {
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { success: false, message: error.message }
    }

    return { 
      success: true, 
      message: "Kata sandi berhasil diperbarui!" 
    }
  } catch (error: any) {
    return { success: false, message: "Terjadi kesalahan pada server." }
  }
}
