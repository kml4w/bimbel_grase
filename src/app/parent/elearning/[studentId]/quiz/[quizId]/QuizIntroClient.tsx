'use client'

import Link from 'next/link'

export default function QuizIntroClient({ 
  quiz, 
  studentId, 
  onStart 
}: { 
  quiz: any
  studentId: string
  onStart: () => void 
}) {
  return (
    <div className="max-w-[800px] mx-auto px-4 md:px-12 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/parent/elearning/${studentId}`} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">Kuis Interaktif</h1>
          <p className="text-on-surface-variant">Latih pemahaman dari materi yang sudah diberikan.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 ambient-shadow border border-surface-variant/60 text-center space-y-6">
        <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-inner">
          <span className="material-symbols-outlined text-[40px]">psychology_alt</span>
        </div>
        
        <div>
          <h2 className="text-2xl font-headline font-bold text-primary mb-2">{quiz.title}</h2>
          <p className="text-on-surface-variant max-w-lg mx-auto">
            Pastikan koneksi internet stabil. Setelah tombol "Mulai Kuis" ditekan, waktu akan terus berjalan meskipun Anda keluar dari halaman ini.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-y border-surface-variant/50 py-6 my-6">
          <div className="space-y-1">
            <p className="text-sm text-on-surface-variant font-bold">Jumlah Soal</p>
            <p className="text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">format_list_numbered</span>
              {quiz.questions_count}
            </p>
          </div>
          <div className="w-px bg-surface-variant/50 hidden md:block"></div>
          <div className="space-y-1">
            <p className="text-sm text-on-surface-variant font-bold">Durasi Pengerjaan</p>
            <p className="text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">timer</span>
              {quiz.duration} <span className="text-sm font-normal">Menit</span>
            </p>
          </div>
          <div className="w-px bg-surface-variant/50 hidden md:block"></div>
          <div className="space-y-1">
            <p className="text-sm text-on-surface-variant font-bold">Passing Grade</p>
            <p className="text-2xl font-headline font-bold text-on-surface flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary">grade</span>
              B <span className="text-sm font-normal">(70)</span>
            </p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full md:w-auto px-10 py-3.5 bg-primary text-white rounded-full font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          Mulai Kuis
          <span className="material-symbols-outlined">play_arrow</span>
        </button>
      </div>
    </div>
  )
}
