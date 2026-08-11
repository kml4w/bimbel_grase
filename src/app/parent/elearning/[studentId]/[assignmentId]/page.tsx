import { getAssignmentDetail } from '../../actions'
import SubmissionFormClient from './SubmissionFormClient'
import Link from 'next/link'

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(dateStr))
}

export const metadata = {
  title: 'Detail Tugas - E-Learning | Bimbel Grase',
}

export default async function AssignmentDetailPage({ params }: { params: Promise<{ studentId: string, assignmentId: string }> }) {
  const { studentId, assignmentId } = await params
  const { data, success, message } = await getAssignmentDetail(studentId, assignmentId)

  if (!success || !data) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-12">
        <div className="bg-rose-50 text-rose-800 p-6 rounded-2xl border border-rose-200 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl">error</span>
          <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
          <p>{message}</p>
          <Link href={`/parent/elearning/${studentId}`} className="inline-block px-6 py-2 bg-rose-600 text-white rounded-full font-bold">
            Kembali ke Daftar Tugas
          </Link>
        </div>
      </div>
    )
  }

  const { assignment, submission } = data
  const isSubmitted = !!submission
  let isPastDue = false
  if (assignment.due_date && !isSubmitted) {
    isPastDue = new Date(assignment.due_date).getTime() < Date.now()
  }

  return (
    <section className="max-w-[1000px] mx-auto px-4 md:px-12 py-6 space-y-6 mb-12">
      <Link href={`/parent/elearning/${studentId}`} className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Kembali ke Daftar Materi
      </Link>

      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/40 space-y-8">
        
        {/* Header Bagian Tugas */}
        <div className="border-b border-surface-variant/60 pb-6">
          {assignment.highlight_text && (
            <span className="inline-block mb-3 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-wider">
              {assignment.highlight_text}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">{assignment.title}</h1>
          
          <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
              <div>
                <p className="text-[11px] text-outline">Dipublikasikan</p>
                <p className="font-bold text-on-surface">{formatDate(assignment.opened_date || assignment.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-rose-500">alarm</span>
              <div>
                <p className="text-[11px] text-outline">Tenggat Waktu</p>
                <p className={`font-bold ${isPastDue ? 'text-rose-600' : 'text-on-surface'}`}>
                  {formatDate(assignment.due_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instruksi Belajar */}
        <div className="space-y-4">
          <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">menu_book</span>
            Instruksi Belajar
          </h3>
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-variant/40 text-on-surface whitespace-pre-wrap leading-relaxed text-sm">
            {assignment.instructions?.text || "Tidak ada instruksi khusus."}
          </div>
        </div>

        {/* Modul PDF Download */}
        {assignment.pdfSignedUrl && (
          <div className="space-y-4">
             <h3 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-500">picture_as_pdf</span>
              Modul / Lembar Soal Pendukung
            </h3>
            <a 
              href={assignment.pdfSignedUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-rose-50 border border-rose-200 p-4 rounded-2xl hover:bg-rose-100 transition-colors group w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined">download</span>
              </div>
              <div className="text-left">
                <p className="font-bold text-rose-900 group-hover:text-rose-700 transition-colors line-clamp-1">{assignment.pdf_title || 'Unduh Modul PDF'}</p>
                <p className="text-[11px] text-rose-600/70">Klik untuk mengunduh / melihat soal</p>
              </div>
            </a>
          </div>
        )}

      </div>

      {/* Bagian Pengumpulan / Submission */}
      <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/40">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-primary/10 text-primary'}`}>
            <span className="material-symbols-outlined text-[24px]">
              {isSubmitted ? 'assignment_turned_in' : 'upload_file'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-on-surface">Status Pengumpulan</h2>
            <p className="text-sm text-on-surface-variant">
              {isSubmitted ? 'Tugas ini sudah dikerjakan.' : 'Unggah lembar jawaban / foto tugas anak di sini.'}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-grow text-center md:text-left space-y-1">
                <p className="font-bold text-emerald-900">Berhasil Dikumpulkan</p>
                <p className="text-xs text-emerald-700">Waktu submit: {formatDate(submission.submitted_at)}</p>
                {submission.score !== null && (
                  <p className="mt-2 inline-block px-3 py-1 bg-white text-emerald-800 rounded-lg text-sm font-bold border border-emerald-100">
                    Nilai: {submission.score} / 100
                  </p>
                )}
              </div>
              
              {submission.submissionSignedUrl && (
                <a 
                  href={submission.submissionSignedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-sm border border-emerald-200 hover:bg-emerald-100 transition-colors text-sm inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Lihat File Jawaban
                </a>
              )}
            </div>
          </div>
        ) : (
          <SubmissionFormClient studentId={studentId} assignmentId={assignmentId} />
        )}
      </div>

    </section>
  )
}
