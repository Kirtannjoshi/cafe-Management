import React, { Suspense } from "react"
import dynamic from 'next/dynamic'

const WalletPaymentClient = dynamic(() => import("@/app/payment/wallet/WalletPaymentClient"), { ssr: false })

export default function WalletPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading wallet payment...</div>}>
      <WalletPaymentClient />
    </Suspense>
  )
}