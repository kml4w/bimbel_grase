import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Checks if the student has access to the E-Learning materials based on their payment status.
 * @param studentId The ID of the student to check.
 * @returns boolean indicating whether access is granted (true if verified, false otherwise).
 */
export async function checkPaywallAccess(studentId: string): Promise<boolean> {
  if (!studentId) return false

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

  const { data: student } = await supabase
    .from('students')
    .select('payment_status')
    .eq('id', studentId)
    .single()

  if (!student) return false

  return student.payment_status === 'verified'
}
