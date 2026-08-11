import { submitQuiz } from './src/app/parent/elearning/actions'

async function run() {
  const res = await submitQuiz('3e5249d9-b27a-4c42-979a-d64c3234d7a1', '653eade5-0cc0-454e-b57c-cc1c0229591b', {
    "q1": "A",
    "q2": "B",
    "q3": "C"
  })
  console.log(res)
}
run()
