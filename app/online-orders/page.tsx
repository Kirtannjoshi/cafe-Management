"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OnlineOrdersRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to the orders page with online tab selected
    router.push("/orders?tab=online")
  }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-lg">Redirecting to orders page...</p>
    </div>
  )
}
