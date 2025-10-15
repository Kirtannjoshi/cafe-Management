import React, { Suspense } from "react"
import dynamic from 'next/dynamic'

// Client component is heavy and uses client-only hooks (useSearchParams/useRouter).
// Load it dynamically to ensure it's rendered on the client inside a Suspense boundary.
const PaymentClient = dynamic(() => import("@/app/payment/PaymentClient"), { ssr: false })

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading payment...</div>}>
      <PaymentClient />
    </Suspense>
  )
}