import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  console.log('Querying assignments...')
  const { data: assignments, error: errA } = await supabase
    .from('assignments')
    .select('*, programs(id, name)')
    
  console.log('Assignments error:', errA)
  
  console.log('Querying quizzes...')
  const { data: quizzes, error: errQ } = await supabase
    .from('quizzes')
    .select('*, programs(id, name), questions(count)')
    
  console.log('Quizzes error:', errQ)
}

test()
