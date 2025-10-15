import React, { Suspense } from "react"
import dynamic from 'next/dynamic'

const UpiPaymentClient = dynamic(() => import("@/app/payment/upi/UpiPaymentClient"), { ssr: false })

export default function UpiPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading UPI payment...</div>}>
      <UpiPaymentClient />
    </Suspense>
  )
}