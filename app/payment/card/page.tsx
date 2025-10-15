import React, { Suspense } from "react"
import dynamic from 'next/dynamic'

const CardPaymentClient = dynamic(() => import("@/app/payment/card/CardPaymentClient"), { ssr: false })

export default function CardPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading card payment...</div>}>
      <CardPaymentClient />
    </Suspense>
  )
}