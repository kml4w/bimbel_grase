'use client'

import { useState, useRef } from 'react'
import { updateContactSettings } from './settings-actions'
import { useToast } from '@/components/ToastProvider'

export default function ContactSettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState(initialSettings)
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    
    setIsLoading(true)
    const formData = new FormData(formRef.current)
    const newSettings = {
      contact_whatsapp: formData.get('contact_whatsapp') as string,
      contact_email: formData.get('contact_email') as string,
      contact_address: formData.get('contact_address') as string,
      contact_hours: formData.get('contact_hours') as string,
    }
    
    try {
      const res = await updateContactSettings(newSettings)
      if (res.success) {
        setSettings(newSettings)
        showToast(res.message, 'check_circle')
        setIsEditing(false)
      } else {
        showToast(res.message || 'Gagal menyimpan pengaturan', 'error')
      }
    } catch (err) {
      showToast('Terjadi kesalahan saat menyimpan pengaturan', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 ambient-shadow border border-surface-variant/60 mt-6">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h3 className="text-lg font-headline font-bold text-on-surface">Pengaturan Kontak & Layanan</h3>
          <p className="text-sm text-on-surface-variant">Informasi ini akan ditampilkan di halaman Pusat Bantuan orang tua.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form ref={formRef} onSubmit={handleUpdate} className="space-y-4 bg-surface-container-lowest p-4 rounded-xl border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_whatsapp" className="text-xs font-bold text-on-surface-variant mb-1 block">WhatsApp CS / Hotline</label>
              <input 
                type="text" 
                id="contact_whatsapp"
                name="contact_whatsapp" 
                defaultValue={settings.contact_whatsapp || ''} 
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contact_email" className="text-xs font-bold text-on-surface-variant mb-1 block">Email Layanan</label>
              <input 
                type="email" 
                id="contact_email"
                name="contact_email" 
                defaultValue={settings.contact_email || ''} 
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact_address" className="text-xs font-bold text-on-surface-variant mb-1 block">Alamat Pusat</label>
              <input 
                type="text" 
                id="contact_address"
                name="contact_address" 
                defaultValue={settings.contact_address || ''} 
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="contact_hours" className="text-xs font-bold text-on-surface-variant mb-1 block">Jam Operasional</label>
              <input 
                type="text" 
                id="contact_hours"
                name="contact_hours" 
                defaultValue={settings.contact_hours || ''} 
                className="w-full p-3 rounded-xl border border-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-2">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">save</span>
              )}
              Simpan
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">WhatsApp CS / Hotline</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings.contact_whatsapp || '-'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Email Layanan</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings.contact_email || '-'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start md:col-span-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Alamat Pusat</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings.contact_address || '-'}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start md:col-span-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Jam Operasional</p>
              <p className="text-sm font-medium text-on-surface mt-1">{settings.contact_hours || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
