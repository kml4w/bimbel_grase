import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixMissingPayments() {
  console.log('Finding verified students missing payments...')
  const { data: students, error: studentErr } = await supabase
    .from('students')
    .select('id, student_name, payment_status, payment_proof_url, billing_count, programs(fee)')
    .eq('payment_status', 'verified')
    
  if (studentErr) {
    console.error('Error fetching students:', studentErr)
    return
  }

  for (const student of students) {
    // Check if they have a payment record
    const { data: payments } = await supabase
      .from('payments')
      .select('id')
      .eq('student_id', student.id)
      
    if (!payments || payments.length === 0) {
      console.log(`Fixing missing payment for student: ${student.student_name} (ID: ${student.id})`)
      
      const currentBillingCount = student.billing_count || 1;
      const amount = ((student as any).programs?.fee || 0) + (currentBillingCount === 1 ? 150000 : 0)
      
      // Update student billing_count if null
      if (student.billing_count === null) {
        await supabase.from('students').update({ billing_count: 1 }).eq('id', student.id)
      }
      
      // Insert payment
      const { error: insertErr } = await supabase.from('payments').insert({
        student_id: student.id,
        amount: amount,
        billing_month: currentBillingCount,
        payment_proof_url: student.payment_proof_url,
        status: 'verified',
        // use admin uuid if possible, or null
      })
      
      if (insertErr) {
        console.error(`Failed to insert payment for ${student.student_name}:`, insertErr)
      } else {
        console.log(`Success inserting payment for ${student.student_name}`)
      }
    }
  }
  console.log('Done fixing payments.')
}

fixMissingPayments()
