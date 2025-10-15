'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme
} from 'next-themes'

// Custom ThemeProvider that watches store settings
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Get initial theme from store (for SSR)
  const [mounted, setMounted] = useState(false)
  
  // After mounting, we can access the store
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <NextThemesProvider {...props} storageKey="cafe-bliss-theme">
      {mounted ? <ThemeWatcher>{children}</ThemeWatcher> : children}
    </NextThemesProvider>
  )
}

// Component that watches for theme changes in store
function ThemeWatcher({ children }: { children: React.ReactNode }) {
  const { cafeSettings } = useStore()
  const { setTheme, theme } = useTheme()
  
  // Apply theme from store settings whenever it changes
  useEffect(() => {
    if (cafeSettings?.theme && cafeSettings.theme !== theme) {
      console.log('Setting theme to:', cafeSettings.theme)
      setTheme(cafeSettings.theme)
      
      // Force theme application by directly manipulating the DOM
      // This ensures the theme is applied immediately
      if (cafeSettings.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (cafeSettings.theme === 'light') {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [cafeSettings?.theme, setTheme, theme])
  
  return <>{children}</>
}
