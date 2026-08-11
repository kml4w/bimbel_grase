import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const adminEmail = 'admin@example.com' // I don't know the admin's email, wait, I can use the Service key just to see if the query itself is syntactically correct!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testKPI() {
  console.log('Logging in...')
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'Password123!'
  })
  if (authError) {
    console.error('Login error:', authError.message)
    // Coba dengan user yang lain atau email beda
  } else {
    console.log('Logged in as', authData.user.email)
  }

  console.log('Testing queries...')

  const q1 = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('payment_status', 'verified')
  console.log('Q1:', q1.error)

  const q2 = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending')
  console.log('Q2:', q2.error)

  const q3 = await supabase.from('programs').select('*').limit(1)
  console.log('Q3 data:', q3.data)
  console.log('Q3 error:', JSON.stringify(q3.error, null, 2))
}

testKPI()
