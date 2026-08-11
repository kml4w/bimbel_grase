'use client'

import { useState } from 'react'
import QuizIntroClient from './QuizIntroClient'
import QuizEngineClient from './QuizEngineClient'
import QuizResultClient from './QuizResultClient'
import { submitQuiz } from '../../../actions'

type QuizState = 'intro' | 'playing' | 'result'

export default function QuizWrapperClient({ quiz, studentId, initialGrade }: { quiz: any, studentId: string, initialGrade: any }) {
  const [state, setState] = useState<QuizState>(initialGrade ? 'result' : 'intro')
  const [grade, setGrade] = useState<any>(initialGrade)
  
  let initialAnswers = {}
  if (initialGrade?.notes) {
    try {
      const parsed = JSON.parse(initialGrade.notes)
      if (parsed.answers) initialAnswers = parsed.answers
    } catch(e) {}
  }
  
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(initialAnswers)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStart = () => {
    setState('playing')
  }

  const handleSubmit = async (answers: Record<string, string>) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    const { success, data, message } = await submitQuiz(studentId, quiz.id, answers)
    
    if (success && data) {
      setGrade({
        score: data.score,
        grade_letter: data.gradeLetter
      })
      if (data.answers) setUserAnswers(data.answers)
      setState('result')
    } else {
      alert(message || 'Gagal mengirim kuis')
    }
    
    setIsSubmitting(false)
  }

  if (state === 'intro') {
    return <QuizIntroClient quiz={quiz} studentId={studentId} onStart={handleStart} />
  }

  if (state === 'playing') {
    return <QuizEngineClient quiz={quiz} studentId={studentId} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  if (state === 'result' && grade) {
    return <QuizResultClient score={grade.score} gradeLetter={grade.grade_letter} studentId={studentId} quiz={quiz} userAnswers={userAnswers} />
  }

  return null
}
