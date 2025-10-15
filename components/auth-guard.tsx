"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip redirect for login page to avoid infinite loops
    if (!user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, router, pathname])

  if (!user && pathname !== "/login") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg">Checking authentication...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}