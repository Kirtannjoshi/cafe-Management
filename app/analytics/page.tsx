"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SalesAnalytics } from "@/components/sales-analytics"
import { InventoryAnalytics } from "@/components/inventory-analytics"
import { CustomerAnalytics } from "@/components/customer-analytics"
import { StaffAnalytics } from "@/components/staff-analytics"
import { Download, TrendingUp, DollarSign, ShoppingCart, Users } from "lucide-react"
import { useStore } from "@/lib/store"

// Sample KPI data
const kpiData = {
  totalRevenue: 15247.5,
  revenueGrowth: 12.5,
  totalOrders: 342,
  ordersGrowth: 8.2,
  averageOrderValue: 44.58,
  aovGrowth: 3.8,
  customerCount: 156,
  customerGrowth: 15.3,
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")

  const { cafeSettings, user } = useStore()
  
  const formatCurrency = (value: number) => {
    const { currencySymbol, currencyRateUSD, currencyRateEUR } = cafeSettings
    
    let convertedAmount = value
    if (currencySymbol === "$") {
      convertedAmount = value / currencyRateUSD
    } else if (currencySymbol === "€") {
      convertedAmount = value / currencyRateEUR
    }
    
    return `${currencySymbol}${convertedAmount.toFixed(2)}`
  }

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Comprehensive business insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(kpiData.totalRevenue)}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">{formatGrowth(kpiData.revenueGrowth)}</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpiData.totalOrders.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">{formatGrowth(kpiData.ordersGrowth)}</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(kpiData.averageOrderValue)}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">{formatGrowth(kpiData.aovGrowth)}</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{kpiData.customerCount.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-green-600 font-medium">{formatGrowth(kpiData.customerGrowth)}</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs - Role-based access */}
          <Tabs defaultValue="sales" className="space-y-6">
            {user?.role === "cashier" ? (
              // Cashier sees limited analytics - only sales
              <>
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="sales">Daily Sales Overview</TabsTrigger>
                </TabsList>
                <TabsContent value="sales">
                  <SalesAnalytics dateRange={dateRange} />
                </TabsContent>
              </>
            ) : (
              // Admin and Manager see full analytics
              <>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
                  <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
                  <TabsTrigger value="staff">Staff Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                  <SalesAnalytics dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="inventory">
                  <InventoryAnalytics dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="customers">
                  <CustomerAnalytics dateRange={dateRange} />
                </TabsContent>

                <TabsContent value="staff">
                  <StaffAnalytics dateRange={dateRange} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
