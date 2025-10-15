import React, { Suspense } from "react"
import dynamic from 'next/dynamic'

const UnauthorizedClient = dynamic(() => import("@/app/unauthorized/UnauthorizedClient"), { ssr: false })

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Checking permissions...</div>}>
      <UnauthorizedClient />
    </Suspense>
  )
}