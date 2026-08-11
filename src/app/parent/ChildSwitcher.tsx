'use client'

import { useRouter } from 'next/navigation'
import { setActiveChild } from './actions'
import { useToast } from '@/components/ToastProvider'
import { useState } from 'react'

interface ChildSwitcherProps {
  childId: string
  childName: string
  programName: string
}

export default function ChildSwitcher({ childId, childName, programName }: ChildSwitcherProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSwitch = async () => {
    setIsLoading(true)
    try {
      await setActiveChild(childId)
      showToast(`Beralih ke profil ${childName}`, 'sync')
      router.refresh()
    } catch (error) {
      showToast('Gagal beralih profil', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button 
      onClick={handleSwitch}
      disabled={isLoading}
      className={`w-full flex items-center gap-3 p-3 bg-surface-container-lowest border rounded-xl hover:bg-surface-container-low transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
        {isLoading ? (
          <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        ) : (
          childName.charAt(0).toUpperCase()
        )}
      </div>
      <div className="text-left flex-grow">
        <div className="text-sm font-bold">{childName}</div>
        <div className="text-xs text-outline">{programName}</div>
      </div>
      <span className="material-symbols-outlined text-outline">
        {isLoading ? 'hourglass_empty' : 'chevron_right'}
      </span>
    </button>
  )
}
