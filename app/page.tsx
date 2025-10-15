"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentOrders } from "@/components/recent-orders"
import { InventoryAlerts } from "@/components/inventory-alerts"
import { StaffSchedule } from "@/components/staff-schedule"
import { useStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { formatDate } from "@/lib/date-utils"

export default function DashboardPage() {
  const { user } = useStore()
  const [currentDate, setCurrentDate] = useState<string>("")

  // Set date on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentDate(formatDate(new Date()))
  }, [])
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening at your cafe today.</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                Today: {currentDate || "Loading..."}
              </Badge>
              <Button>New Order</Button>
            </div>
          </div>

          {/* Key Metrics */}
          <DashboardStats />

          {/* Main Content Grid - Role-based layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentOrders />
            </div>

            {/* Right Sidebar Content - Role-based visibility */}
            <div className="space-y-6">
              {/* Inventory Alerts - Only for Admin and Manager */}
              {(user?.role === "admin" || user?.role === "manager") && <InventoryAlerts />}
              
              {/* Staff Schedule - Only for Admin and Manager */}
              {(user?.role === "admin" || user?.role === "manager") && <StaffSchedule />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
