"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, TrendingDown, Package, DollarSign } from "lucide-react"

interface InventoryAnalyticsProps {
  dateRange: string
}

// Sample inventory analytics data
const stockLevelsData = [
  { item: "Coffee Beans", current: 2.5, minimum: 5, maximum: 25, status: "critical" },
  { item: "Milk", current: 8, minimum: 10, maximum: 50, status: "low" },
  { item: "Sugar", current: 15, minimum: 3, maximum: 20, status: "good" },
  { item: "Flour", current: 20, minimum: 5, maximum: 30, status: "good" },
  { item: "Cheese", current: 0.8, minimum: 1, maximum: 5, status: "critical" },
]

const turnoverData = [
  { item: "Coffee Beans", turnover: 8.5, days: 3.2 },
  { item: "Milk", turnover: 12.3, days: 2.1 },
  { item: "Sugar", turnover: 4.2, days: 7.8 },
  { item: "Flour", turnover: 3.8, days: 9.2 },
  { item: "Cheese", turnover: 6.7, days: 4.5 },
]

const wasteData = [
  { category: "Dairy", amount: 12.5, cost: 45.6, color: "#ef4444" },
  { category: "Produce", amount: 8.3, cost: 32.4, color: "#f97316" },
  { category: "Bakery", amount: 5.7, cost: 18.9, color: "#eab308" },
  { category: "Meat", amount: 3.2, cost: 28.5, color: "#84cc16" },
]

const stockMovementData = [
  { date: "Mon", stockIn: 45, stockOut: 38, waste: 2 },
  { date: "Tue", stockIn: 32, stockOut: 42, waste: 1 },
  { date: "Wed", stockIn: 28, stockOut: 35, waste: 3 },
  { date: "Thu", stockIn: 52, stockOut: 48, waste: 2 },
  { date: "Fri", stockIn: 38, stockOut: 55, waste: 4 },
  { date: "Sat", stockIn: 25, stockOut: 62, waste: 3 },
  { date: "Sun", stockIn: 18, stockOut: 45, waste: 2 },
]

export function InventoryAnalytics({ dateRange }: InventoryAnalyticsProps) {
  const totalWasteCost = wasteData.reduce((sum, item) => sum + item.cost, 0)
  const criticalItems = stockLevelsData.filter((item) => item.status === "critical").length
  const lowStockItems = stockLevelsData.filter((item) => item.status === "low").length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{criticalItems}</p>
                <p className="text-sm text-muted-foreground">Critical Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{lowStockItems}</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stockLevelsData.length}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">${totalWasteCost.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Waste Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Levels and Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Stock Levels</CardTitle>
            <CardDescription>Inventory status by item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stockLevelsData.map((item) => {
              const percentage = (item.current / item.maximum) * 100
              const statusColor =
                item.status === "critical"
                  ? "text-red-600"
                  : item.status === "low"
                    ? "text-orange-600"
                    : "text-green-600"

              return (
                <div key={item.item} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{item.item}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {item.current} / {item.maximum}
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          item.status === "critical"
                            ? "bg-red-100 text-red-800"
                            : item.status === "low"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Trends</CardTitle>
            <CardDescription>Daily stock in/out patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockMovementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="stockIn" fill="#10b981" name="Stock In" />
                <Bar dataKey="stockOut" fill="#059669" name="Stock Out" />
                <Bar dataKey="waste" fill="#ef4444" name="Waste" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Turnover Analysis and Waste Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Turnover</CardTitle>
            <CardDescription>How quickly items are consumed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoverData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-muted-foreground" />
                <YAxis dataKey="item" type="category" className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="turnover" fill="#059669" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Analysis</CardTitle>
            <CardDescription>Waste breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="cost"
                >
                  {wasteData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {wasteData.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.category}</span>
                  </div>
                  <span className="font-medium text-foreground">${item.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
