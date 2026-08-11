'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadChildAvatar } from './actions'
import { useToast } from '@/components/ToastProvider'

interface EditChildPhotoModalProps {
  childId: string
  childName: string
  programName: string
  currentAvatarUrl: string | null
}

export default function EditChildPhotoModal({ 
  childId, 
  childName, 
  programName,
  currentAvatarUrl
}: EditChildPhotoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const router = useRouter()
  const { showToast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showToast('Ukuran file maksimal 2MB', 'error')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      showToast('Pilih foto terlebih dahulu', 'error')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('studentId', childId)
      
      const res = await uploadChildAvatar(formData)
      
      if (res.success) {
        showToast(res.message, 'check_circle')
        setIsOpen(false)
        router.refresh()
      } else {
        showToast(res.message, 'error')
      }
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan saat mengunggah foto', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setPreviewUrl(currentAvatarUrl)
    setIsOpen(true)
  }

  return (
    <>
      <button 
        onClick={handleOpen}
        className="text-xs text-primary font-bold hover:underline flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full border border-primary/20 transition-all shadow-sm w-full"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span> Edit Foto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 ambient-shadow relative">
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-primary">Edit Foto Profil Anak</h3>
              <p className="text-xs text-on-surface-variant">Pilih foto terbaru untuk memperbarui profil Ananda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs mt-4">
              <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-variant flex items-center justify-between">
                <div>
                  <span className="text-outline text-[11px] block font-bold">Nama Anak:</span>
                  <strong className="font-headline font-bold text-on-surface text-sm">{childName}</strong>
                </div>
                <span className="bg-primary/10 text-primary font-bold px-2.5 py-1 rounded-full text-[11px]">
                  {programName}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-3 bg-surface-bright p-5 rounded-2xl border-2 border-dashed border-primary/30">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-md bg-surface-container group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewUrl || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"} 
                    className="w-full h-full object-cover" 
                    alt="Preview Foto" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity pointer-events-none">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                </div>
                
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/jpg" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required
                  className="mx-auto block w-fit text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-container hover:file:text-on-primary-container transition-colors cursor-pointer"
                />
                <p className="text-[10px] text-outline text-center">Format yang didukung: JPG, PNG. Ukuran maksimal: 2 MB</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  disabled={loading}
                  className="flex-1 h-10 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-variant transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 h-10 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : 'Simpan Foto Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
