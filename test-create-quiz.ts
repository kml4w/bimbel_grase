import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  console.log('Querying programs...')
  const { data: programs, error: errP } = await supabase.from('programs').select('id').limit(1)
  if (errP || !programs || programs.length === 0) {
    console.log('No programs found', errP)
    return
  }
  const program_id = programs[0].id

  console.log('Creating quiz...')
  const { data: quiz, error: errQ } = await supabase.from('quizzes').insert({
    program_id,
    title: 'Test Quiz',
    duration: 30,
    questions_count: 0,
    questions: []
  }).select().single()

  console.log('Quiz creation:', errQ ? errQ : 'Success')
  if (errQ) return

  const quiz_id = quiz.id
  console.log('Quiz ID:', quiz_id)

  console.log('Creating question...')
  const newQuestion = {
    id: "1234-5678",
    quiz_id,
    question_text: "Test question",
    options: ["A", "B", "C", "D"],
    correct_option_index: 0
  }

  const { error: errUpdate } = await supabase.from('quizzes').update({
    questions: [newQuestion],
    questions_count: 1
  }).eq('id', quiz_id)

  console.log('Question creation:', errUpdate ? errUpdate : 'Success')
}

test()
