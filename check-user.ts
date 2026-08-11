import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkData() {
  console.log('Checking profiles for satnti@gmail.com...')
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', 'satnti@gmail.com')
    
  if (profileErr) console.error('Profile error:', profileErr)
  console.log('Profiles:', profile)

  if (profile && profile.length > 0) {
    console.log('\nChecking students for parent_id =', profile[0].id)
    const { data: students, error: studentErr } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', profile[0].id)
      
    if (studentErr) console.error('Student error:', studentErr)
    console.log('Students:', students)
    
    if (students && students.length > 0) {
      console.log('\nChecking payment history for student_id =', students[0].id)
      const { data: payments, error: payErr } = await supabase
        .from('payment_history')
        .select('*')
        .eq('student_id', students[0].id)
      console.log('Payments:', payments)
    }
  } else {
    // If no profile by email, maybe search all students named azzam
    const { data: allStudents } = await supabase.from('students').select('*').ilike('student_name', '%azzam%')
    console.log('All students named azzam:', allStudents)
  }
}

checkData()
