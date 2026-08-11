'use client'

import { useState } from 'react'
import { uploadSubmission } from '../../actions'

export default function SubmissionFormClient({ studentId, assignmentId }: { studentId: string, assignmentId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    formData.append('student_id', studentId)
    formData.append('assignment_id', assignmentId)

    const file = formData.get('submission_file') as File
    if (!file || file.size === 0) {
      setErrorMsg('Mohon lampirkan file (PDF/Foto) sebelum mengumpulkan.')
      setIsSubmitting(false)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran maksimal file adalah 5MB.')
      setIsSubmitting(false)
      return
    }

    const { success, message } = await uploadSubmission(formData)
    if (!success) {
      setErrorMsg(message)
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="border-2 border-dashed border-surface-variant rounded-2xl p-6 text-center hover:bg-surface-container-lowest transition-colors relative">
        <input 
          type="file" 
          id="submission_file"
          name="submission_file"
          accept="application/pdf,image/png,image/jpeg"
          required
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="pointer-events-none flex flex-col items-center gap-2 text-on-surface-variant">
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center">
             <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
          </div>
          <p className="font-bold text-on-surface mt-2">Klik atau Seret file ke area ini</p>
          <p className="text-xs">Mendukung format PDF, JPG, PNG (Maksimal 5MB)</p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
              Mengunggah...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">send</span>
              Kumpulkan Tugas
            </>
          )}
        </button>
      </div>
    </form>
  )
}
