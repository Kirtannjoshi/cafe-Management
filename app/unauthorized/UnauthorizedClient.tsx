"use client"

import { useStore } from "@/lib/store"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function UnauthorizedClient() {
  const { user } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const requiredRole = searchParams.get("requiredRole")
  
  useEffect(() => {
    // If user is logged in, redirect to dashboard after 3 seconds
    if (user) {
      const timer = setTimeout(() => {
        router.push("/")
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [user, router])
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-red-500">401</h1>
          <h2 className="text-2xl font-bold mt-4">Unauthorized Access</h2>
          <p className="text-muted-foreground mt-2">
            {requiredRole 
              ? `You need ${requiredRole} privileges to access this page.`
              : "You don't have permission to access this page."}
          </p>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-md">
          <p>
            {user 
              ? `You are currently logged in as ${user.name} with ${user.role} privileges.`
              : "You are not currently logged in."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {user 
              ? "You will be redirected to the dashboard in a few seconds."
              : "Please log in to continue."}
          </p>
        </div>
        
        <div className="space-x-4">
          <button
            onClick={() => router.push("/")}
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </button>
          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="text-primary hover:underline"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
