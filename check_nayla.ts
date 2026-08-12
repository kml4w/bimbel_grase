import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data: nayla } = await supabase.from('students').select('*, programs(fee)').eq('student_name', 'nayla').single()
  console.log('Nayla Student:', nayla)
  
  const { data: payments } = await supabase.from('payments').select('*').eq('student_id', nayla.id)
  console.log('Nayla Payments:', payments)
}

check()
