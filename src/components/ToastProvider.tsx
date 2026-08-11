'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

type ToastContextType = {
  showToast: (message: string, icon?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; icon: string } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((message: string, icon: string = 'info') => {
    setToast({ message, icon })
    setIsVisible(true)
    
    setTimeout(() => {
      setIsVisible(false)
    }, 3500)
  }, [])

  // Clear toast entirely from DOM after animation completes (approx 300ms)
  useEffect(() => {
    if (!isVisible && toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, toast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notification Banner */}
      <div 
        className={`fixed top-20 right-4 z-[999] max-w-md bg-on-surface text-surface px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}
        style={{ display: toast ? 'flex' : 'none' }}
      >
        <span id="toast-icon" className="material-symbols-outlined text-secondary-container">
          {toast?.icon}
        </span>
        <span id="toast-text" className="text-xs font-bold leading-snug">
          {toast?.message}
        </span>
      </div>
    </ToastContext.Provider>
  )
}
