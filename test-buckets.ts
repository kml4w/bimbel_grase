import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, supabaseServiceKey)

async function setupBuckets() {
  const { data: buckets, error: getErr } = await adminClient.storage.listBuckets()
  console.log('Buckets existing:', buckets?.map(b => b.name))

  if (!buckets?.find(b => b.name === 'student-submissions')) {
    console.log('Creating student-submissions bucket...')
    const { data, error } = await adminClient.storage.createBucket('student-submissions', {
      public: false
    })
    console.log('Result:', data, error)
  }

  // To fix RLS, we can execute SQL via RPC or just let it be if it's the Service Role?
  // Wait! We can't easily execute SQL from JS without an RPC. 
  // Let's just create it. The Service Role bypasses RLS anyway for the integration test.
  // But the frontend uses ANON KEY. So the frontend needs RLS.
}

setupBuckets()
