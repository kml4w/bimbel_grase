import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testStudents() {
  console.log('Querying students...')
  const { data, error } = await supabase
    .from('students')
    .select('*, profiles(id, full_name), programs(id, name)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Query Error:', error)
  } else {
    console.log('Success, data length:', data?.length)
    if (data?.length) {
      console.log('First student:', JSON.stringify(data[0], null, 2))
    }
  }
}

testStudents()
