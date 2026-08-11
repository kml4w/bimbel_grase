'use client'

import Link from 'next/link'
import { useState } from 'react'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(dateStr))
}

export default function ElearningListClient({ studentId, assignments, quizzes = [] }: { studentId: string, assignments: any[], quizzes?: any[] }) {
  const [activeTab, setActiveTab] = useState<'assignments' | 'quizzes'>('assignments')

  const renderAssignments = () => {
    if (assignments.length === 0) {
      return (
        <div className="text-center py-16 text-on-surface-variant space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px] text-outline">menu_book</span>
          </div>
          <p className="font-bold text-lg text-on-surface">Belum ada materi atau tugas.</p>
          <p className="text-sm">Tutor belum memberikan penugasan untuk program ini.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map(item => {
        const isSubmitted = item.submissionStatus === 'submitted' || item.submissionStatus === 'graded'
        
        // Simple past-due check
        let isPastDue = false
        if (item.due_date && !isSubmitted) {
          isPastDue = new Date(item.due_date).getTime() < Date.now()
        }

        return (
          <Link 
            key={item.id}
            href={`/parent/elearning/${studentId}/${item.id}`} 
            className="block group"
          >
            <div className={`h-full bg-surface-container-lowest border rounded-2xl p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col ${
              isPastDue ? 'border-rose-300 bg-rose-50/30' : 'border-surface-variant hover:border-primary/50'
            }`}>
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {isSubmitted ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Selesai
                  </span>
                ) : isPastDue ? (
                  <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Terlambat
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">pending</span>
                    Tugas Aktif
                  </span>
                )}
              </div>

              {item.highlight_text && (
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2 block">
                  {item.highlight_text}
                </span>
              )}
              
              <h3 className="font-headline font-bold text-on-surface text-lg mb-2 pr-20 group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              <div className="flex-grow"></div>
              
              <div className="mt-6 pt-4 border-t border-surface-variant/60 flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[11px] text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    Batas Akhir:
                  </p>
                  <p className={`text-xs font-bold ${isPastDue ? 'text-rose-600' : 'text-on-surface'}`}>
                    {formatDate(item.due_date)}
                  </p>
                </div>
                
                {item.pdf_title && (
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0" title="Ada PDF Modul">
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  </div>
                )}
              </div>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  const renderQuizzes = () => {
    if (quizzes.length === 0) {
      return (
        <div className="text-center py-16 text-on-surface-variant space-y-3">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px] text-outline">quiz</span>
          </div>
          <p className="font-bold text-lg text-on-surface">Belum ada kuis.</p>
          <p className="text-sm">Tutor belum memberikan kuis interaktif untuk program ini.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(quiz => {
          return (
            <Link 
              key={quiz.id}
              href={`/parent/elearning/${studentId}/quiz/${quiz.id}`} 
              className="block group"
            >
              <div className={`h-full bg-surface-container-lowest border rounded-2xl p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col ${
                quiz.isFinished ? 'border-primary/50 bg-primary/5' : 'border-surface-variant hover:border-primary/50'
              }`}>
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {quiz.isFinished ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">pending</span>
                      Belum Dikerjakan
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 block">
                  KUIS INTERAKTIF
                </span>
                
                <h3 className="font-headline font-bold text-on-surface text-lg mb-2 pr-20 group-hover:text-primary transition-colors line-clamp-2">
                  {quiz.title}
                </h3>
                
                <div className="flex-grow"></div>
                
                <div className="mt-6 pt-4 border-t border-surface-variant/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {quiz.duration} mnt
                    </p>
                    <p className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
                      {quiz.questions_count} Soal
                    </p>
                  </div>
                  {quiz.isFinished && (
                    <p className="text-sm font-headline font-bold text-emerald-700">Skor: {quiz.score}</p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-surface-variant/60">
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'assignments' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          Materi & Tugas
        </button>
        <button 
          onClick={() => setActiveTab('quizzes')}
          className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'quizzes' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
        >
          Kuis Interaktif
          {/* Notification badge for unfinished quizzes */}
          {quizzes.filter(q => !q.isFinished).length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {quizzes.filter(q => !q.isFinished).length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'assignments' ? renderAssignments() : renderQuizzes()}
    </div>
  )
}
