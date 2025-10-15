import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type CafeSettings } from "./store"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert price between different currencies
 * @param amount The price amount to convert
 * @param fromCurrency The currency symbol of the source amount
 * @param toCurrency The currency symbol to convert to
 * @param cafeSettings The cafe settings object containing conversion rates
 * @returns The converted price amount
 */
export function convertCurrency(
  amount: number, 
  fromCurrency: "₹" | "$" | "€", 
  toCurrency: "₹" | "$" | "€", 
  cafeSettings: CafeSettings
): number {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;

  // Convert everything to INR first
  let inrAmount: number;
  if (fromCurrency === "₹") {
    inrAmount = amount;
  } else if (fromCurrency === "$") {
    inrAmount = amount * cafeSettings.currencyRateUSD;
  } else if (fromCurrency === "€") {
    inrAmount = amount * cafeSettings.currencyRateEUR;
  } else {
    return amount; // Fallback
  }

  // Then convert INR to target currency
  if (toCurrency === "₹") {
    return inrAmount;
  } else if (toCurrency === "$") {
    return inrAmount / cafeSettings.currencyRateUSD;
  } else if (toCurrency === "€") {
    return inrAmount / cafeSettings.currencyRateEUR;
  } else {
    return amount; // Fallback
  }
}

/**
 * Format a price with the given currency symbol
 * @param amount The price amount to format
 * @param currencySymbol The currency symbol to use
 * @returns Formatted price string with currency symbol
 */
export function formatPrice(amount: number, currencySymbol: "₹" | "$" | "€"): string {
  // Round to 2 decimal places
  const roundedAmount = Math.round(amount * 100) / 100;
  
  if (currencySymbol === "₹") {
    return `${currencySymbol}${roundedAmount.toFixed(2)}`;
  } else {
    return `${currencySymbol}${roundedAmount.toFixed(2)}`;
  }
}
