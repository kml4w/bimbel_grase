'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProfileName(formData: FormData) {
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

  const fullName = formData.get('full_name')?.toString()
  const newEmail = formData.get('email')?.toString()

  if (!fullName || fullName.trim() === '') {
    return { success: false, message: 'Nama lengkap tidak boleh kosong' }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, message: 'Gagal memperbarui nama profil: ' + updateError.message }
  }

  let message = 'Profil berhasil diperbarui'
  
  if (newEmail && newEmail.trim() !== '' && newEmail.trim() !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: newEmail.trim()
    })
    
    if (emailError) {
      return { success: false, message: 'Nama berhasil diperbarui, tapi gagal mengubah email: ' + emailError.message }
    }
    
    message = 'Profil berhasil diperbarui. Jika Anda mengubah email, silakan cek kotak masuk email baru Anda untuk konfirmasi.'
  }

  revalidatePath('/profile')
  revalidatePath('/', 'layout') // Revalidate layout to update header name
  return { success: true, message }
}

export async function updatePasswordWithVerification(formData: FormData) {
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

  const currentPassword = formData.get('current_password')?.toString()
  const newPassword = formData.get('new_password')?.toString()

  if (!currentPassword || !newPassword) {
    return { success: false, message: 'Sandi saat ini dan sandi baru wajib diisi' }
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'Sandi baru minimal 6 karakter' }
  }

  // Verifikasi sandi saat ini dengan mencoba re-login
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword
  })

  if (signInError) {
    return { success: false, message: 'Sandi saat ini salah' }
  }

  // Jika sandi saat ini benar, update ke sandi baru
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { success: false, message: 'Gagal mengubah sandi: ' + updateError.message }
  }

  return { success: true, message: 'Kata sandi berhasil diubah!' }
}
