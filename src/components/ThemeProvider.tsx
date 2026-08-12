'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeProvider({ children, ...props }: any) {
  const [mounted, setMounted] = useState(false)

  // Wait until mounted to render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  const Provider = NextThemesProvider as any
  return <Provider {...props}>{children}</Provider>
}
