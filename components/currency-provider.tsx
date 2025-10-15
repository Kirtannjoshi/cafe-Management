'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { convertCurrency, formatPrice } from '@/lib/utils'

// Define the context type
interface CurrencyContextType {
  currencySymbol: "₹" | "$" | "€"
  formatCurrency: (amount: number, originalCurrency?: "₹" | "$" | "€") => string
  convertAmount: (amount: number, fromCurrency: "₹" | "$" | "€", toCurrency?: "₹" | "$" | "€") => number
}

// Create the context with a default value
const CurrencyContext = createContext<CurrencyContextType>({ 
  currencySymbol: '₹',
  formatCurrency: () => '',
  convertAmount: () => 0,
})

// Hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Get current settings from store
  const { cafeSettings } = useStore()
  const [currencySymbol, setCurrencySymbol] = useState<"₹" | "$" | "€">(cafeSettings.currencySymbol || '₹')
  
  // Format currency with automatic conversion if needed
  const formatCurrency = (amount: number, originalCurrency: "₹" | "$" | "€" = '₹') => {
    // Convert amount to the current currency if it's different
    const convertedAmount = convertAmount(amount, originalCurrency)
    return formatPrice(convertedAmount, currencySymbol)
  }

  // Convert amount between currencies
  const convertAmount = (amount: number, fromCurrency: "₹" | "$" | "€", toCurrency?: "₹" | "$" | "€") => {
    return convertCurrency(amount, fromCurrency, toCurrency || currencySymbol, cafeSettings)
  }
  
  // Listen for currency changes
  useEffect(() => {
    // Update from store initially
    setCurrencySymbol(cafeSettings.currencySymbol || '₹')
    
    // Listen for currency changes via custom event
    const handleCurrencyChange = (e: CustomEvent) => {
      if (e.detail && e.detail.currencySymbol) {
        setCurrencySymbol(e.detail.currencySymbol as "₹" | "$" | "€")
      }
    }
    
    // Add event listener
    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener)
    
    // Clean up
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener)
    }
  }, [cafeSettings.currencySymbol])
  
  return (
    <CurrencyContext.Provider value={{ 
      currencySymbol,
      formatCurrency,
      convertAmount
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}