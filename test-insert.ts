import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  const { data, error } = await supabase.from('grades').insert({
    student_id: 'e6b7c53d-24d1-4770-b75d-3571d794de40', // fake id, just to see if it violates RLS or FK
    task_name: 'test',
    score: 100,
    grade_letter: 'A'
  })
  console.log("Error:", error)
}
test()
