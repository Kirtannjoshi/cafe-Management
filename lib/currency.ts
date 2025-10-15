import { useStore } from "@/lib/store"

export function useCurrency() {
  const { cafeSettings } = useStore()
  
  // Function to format currency based on the café settings
  const formatCurrency = (amount: number) => {
    const { currencySymbol, currencyRateUSD, currencyRateEUR } = cafeSettings
    
    let convertedAmount = amount
    if (currencySymbol === "$") {
      convertedAmount = amount / currencyRateUSD
    } else if (currencySymbol === "€") {
      convertedAmount = amount / currencyRateEUR
    }
    
    return `${currencySymbol}${convertedAmount.toFixed(2)}`
  }

  // Function to convert an amount from one currency to another
  const convertAmount = (amount: number, fromCurrency: "₹" | "$" | "€", toCurrency: "₹" | "$" | "€") => {
    const { currencyRateUSD, currencyRateEUR } = cafeSettings
    
    // First convert to INR (base currency)
    let amountInINR = amount
    if (fromCurrency === "$") {
      amountInINR = amount * currencyRateUSD
    } else if (fromCurrency === "€") {
      amountInINR = amount * currencyRateEUR
    }
    
    // Then convert from INR to target currency
    if (toCurrency === "₹") {
      return amountInINR
    } else if (toCurrency === "$") {
      return amountInINR / currencyRateUSD
    } else if (toCurrency === "€") {
      return amountInINR / currencyRateEUR
    }
    
    return amountInINR
  }
  
  return {
    formatCurrency,
    convertAmount,
    currencySymbol: cafeSettings.currencySymbol,
  }
}