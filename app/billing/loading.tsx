"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function LoadingBilling() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
        <h3 className="text-lg font-medium">Loading billing information...</h3>
        <p className="text-muted-foreground">Preparing receipts and transaction data</p>
      </div>
    </div>
  )
}