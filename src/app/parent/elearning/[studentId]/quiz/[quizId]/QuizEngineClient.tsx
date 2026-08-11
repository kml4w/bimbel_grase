'use client'

import { useState, useEffect, useRef } from 'react'

type QuizProps = {
  quiz: any
  studentId: string
  onSubmit: (answers: Record<string, string>) => void
  isSubmitting: boolean
}

export default function QuizEngineClient({ quiz, studentId, onSubmit, isSubmitting }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [currentIndex, setCurrentIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const questions = quiz.questions || []
  const currentQuestion = questions[currentIndex]

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          // Auto submit when time is up
          onSubmit(answers)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [answers, onSubmit])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionKey
    }))
  }

  const isLastQuestion = currentIndex === questions.length - 1

  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-12 py-6 space-y-6">
      {/* Header / Timer */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 ambient-shadow border border-surface-variant/40 sticky top-4 z-10">
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Sisa Waktu</p>
          <div className={`text-2xl font-headline font-bold flex items-center gap-2 ${timeLeft <= 60 ? 'text-rose-600 animate-pulse' : 'text-primary'}`}>
            <span className="material-symbols-outlined">timer</span>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Soal</p>
          <p className="text-xl font-headline font-bold text-on-surface">
            {currentIndex + 1} <span className="text-on-surface-variant text-sm">/ {questions.length}</span>
          </p>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60">
        <h3 className="text-lg md:text-xl font-bold text-on-surface leading-relaxed mb-6">
          {currentQuestion?.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion && Object.entries(currentQuestion.options).map(([key, text]) => {
            const isSelected = answers[currentQuestion.id] === key
            return (
              <button
                key={key}
                onClick={() => handleSelectOption(currentQuestion.id, key)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-surface-variant hover:border-primary/40 hover:bg-surface-container-lowest'
                }`}
              >
                <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-outline text-transparent'
                }`}>
                  <span className="text-xs font-bold">{key}</span>
                </div>
                <span className={`flex-1 ${isSelected ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                  {text as string}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant bg-surface-container hover:bg-surface-variant transition-colors disabled:opacity-30 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Sebelumnya
        </button>

        {!isLastQuestion ? (
          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            className="px-6 py-2.5 rounded-full font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
          >
            Selanjutnya
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        ) : (
          <button
            onClick={() => onSubmit(answers)}
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {isSubmitting ? 'Memproses...' : 'Kumpulkan Kuis'}
            {!isSubmitting && <span className="material-symbols-outlined text-[18px]">send</span>}
          </button>
        )}
      </div>
      
      {/* Question Navigator Dots */}
      <div className="pt-8 border-t border-surface-variant/40">
        <p className="text-center text-xs font-bold text-on-surface-variant mb-4">Peta Soal</p>
        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((q: any, idx: number) => {
            const isAnswered = !!answers[q.id]
            const isCurrent = currentIndex === idx
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-2 flex items-center justify-center ${
                  isCurrent ? 'border-primary ring-2 ring-primary/20' : 
                  isAnswered ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-lowest border-surface-variant text-on-surface-variant hover:border-primary/50'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
