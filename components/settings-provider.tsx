'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { useStore } from '@/lib/store'

type SettingsContextType = {
  currencySymbol: string
  theme: string
}

const SettingsContext = createContext<SettingsContextType>({
  currencySymbol: '₹',
  theme: 'light',
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { cafeSettings } = useStore()
  
  // Create settings object from store
  const settings = {
    currencySymbol: cafeSettings.currencySymbol,
    theme: cafeSettings.theme,
  }
  
  // Set application to English only
  useEffect(() => {
    // Application is English-only, set HTML lang attribute
    document.documentElement.lang = 'en'
  }, [])
  
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)