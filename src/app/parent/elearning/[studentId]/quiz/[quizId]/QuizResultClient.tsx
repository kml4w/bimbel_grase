'use client'

import { useState } from 'react'
import Link from 'next/link'

type ResultProps = {
  score: number
  gradeLetter: string
  studentId: string
  quiz: any
  userAnswers: Record<string, string>
}

export default function QuizResultClient({ score, gradeLetter, studentId, quiz, userAnswers }: ResultProps) {
  const [showReview, setShowReview] = useState(false)
  
  // Determine color and message based on grade
  let colorClass = 'text-emerald-600'
  let bgClass = 'bg-emerald-50 border-emerald-200'
  let message = 'Luar Biasa!'
  let icon = 'star'
  let stars = 3

  if (gradeLetter === 'B') {
    colorClass = 'text-amber-600'
    bgClass = 'bg-amber-50 border-amber-200'
    message = 'Kerja Bagus!'
    icon = 'thumb_up'
    stars = 2
  } else if (gradeLetter === 'C') {
    colorClass = 'text-rose-600'
    bgClass = 'bg-rose-50 border-rose-200'
    message = 'Jangan Menyerah, Terus Belajar!'
    icon = 'sentiment_satisfied'
    stars = 1
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 md:px-12 py-12 text-center space-y-8">
      <div className={`rounded-3xl p-8 md:p-12 border ${bgClass} ambient-shadow relative overflow-hidden`}>
        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <h2 className="text-xl font-bold text-on-surface-variant mb-2 relative z-10">{quiz.title}</h2>
        <p className="text-3xl font-headline font-bold text-on-surface mb-8 relative z-10">{message}</p>
        
        <div className="flex justify-center gap-2 mb-8 relative z-10">
          {[...Array(3)].map((_, i) => (
            <span 
              key={i} 
              className={`material-symbols-outlined text-6xl md:text-8xl drop-shadow-md transition-all duration-700 ${
                i < stars ? 'text-amber-400 scale-110' : 'text-surface-variant/50 grayscale'
              }`}
            >
              grade
            </span>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block min-w-[200px] border border-white/50 shadow-sm relative z-10">
          <p className="text-sm font-bold text-on-surface-variant mb-1">Skor Akhir</p>
          <div className="flex items-end justify-center gap-2">
            <span className={`text-6xl font-headline font-bold ${colorClass}`}>{score}</span>
            <span className="text-xl font-bold text-on-surface-variant mb-1">/ 100</span>
          </div>
          <div className="mt-4 pt-4 border-t border-surface-variant/50 flex justify-center items-center gap-2">
            <span className="text-sm text-on-surface-variant">Predikat:</span>
            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${colorClass} border-current bg-white`}>
              {gradeLetter}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href={`/parent/elearning/${studentId}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-surface-container hover:bg-surface-variant text-on-surface font-bold rounded-full transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Kembali ke Ruang Kelas
        </Link>
        
        <button
          onClick={() => setShowReview(!showReview)}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 text-on-primary font-bold rounded-full transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showReview ? 'visibility_off' : 'visibility'}
          </span>
          {showReview ? 'Sembunyikan Jawaban' : 'Lihat Koreksi Jawaban'}
        </button>
      </div>

      {/* Answer Review Section */}
      {showReview && (
        <div className="text-left mt-12 bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6 border-b border-surface-variant/50 pb-4">
            Koreksi Jawaban
          </h3>
        <div className="space-y-8">
          {quiz.questions?.map((q: any, idx: number) => {
            const userAnswer = userAnswers[q.id]
            const isCorrect = userAnswer === q.key
            const hasAnswered = !!userAnswer

            return (
              <div key={q.id} className="space-y-3">
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {isCorrect ? 'check' : 'close'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">
                      <span className="mr-2">{idx + 1}.</span>
                      {q.text}
                    </p>
                  </div>
                </div>

                <div className="pl-11 space-y-2">
                  {Object.entries(q.options).map(([key, text]) => {
                    const isUserPick = userAnswer === key
                    const isRightKey = q.key === key

                    let style = "border-surface-variant text-on-surface-variant"
                    let icon = null

                    if (isRightKey) {
                      style = "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold shadow-sm"
                      icon = <span className="material-symbols-outlined text-emerald-600 ml-auto">check_circle</span>
                    } else if (isUserPick && !isCorrect) {
                      style = "border-rose-300 bg-rose-50 text-rose-800"
                      icon = <span className="material-symbols-outlined text-rose-500 ml-auto">cancel</span>
                    }

                    return (
                      <div key={key} className={`flex items-center gap-3 p-3 rounded-xl border ${style}`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isRightKey ? 'border-emerald-500 text-emerald-600 bg-white' : 
                          isUserPick ? 'border-rose-400 text-rose-500 bg-white' : 
                          'border-outline text-transparent'
                        }`}>
                          <span className="text-xs font-bold">{key}</span>
                        </div>
                        <span className="flex-1 text-sm">{text as string}</span>
                        {icon}
                      </div>
                    )
                  })}
                  {!hasAnswered && (
                    <p className="text-xs font-bold text-rose-500 italic mt-2">
                      * Anda tidak menjawab pertanyaan ini.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}
    </div>
  )
}
