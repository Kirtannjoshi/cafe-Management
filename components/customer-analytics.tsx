"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Repeat, Star, TrendingUp } from "lucide-react"

interface CustomerAnalyticsProps {
  dateRange: string
}

// Sample customer analytics data
const customerGrowthData = [
  { date: "Week 1", newCustomers: 12, returningCustomers: 8, totalOrders: 45 },
  { date: "Week 2", newCustomers: 15, returningCustomers: 12, totalOrders: 52 },
  { date: "Week 3", newCustomers: 18, returningCustomers: 15, totalOrders: 61 },
  { date: "Week 4", newCustomers: 22, returningCustomers: 18, totalOrders: 68 },
]

const orderFrequencyData = [
  { frequency: "1 order", customers: 45, percentage: 35 },
  { frequency: "2-3 orders", customers: 38, percentage: 30 },
  { frequency: "4-6 orders", customers: 28, percentage: 22 },
  { frequency: "7+ orders", customers: 17, percentage: 13 },
]

const customerSegmentData = [
  { segment: "Regular", value: 40, color: "#059669" },
  { segment: "Occasional", value: 35, color: "#10b981" },
  { segment: "New", value: 25, color: "#34d399" },
]

const peakTimesData = [
  { time: "6-8 AM", customers: 25, avgSpend: 8.5 },
  { time: "8-10 AM", customers: 45, avgSpend: 12.3 },
  { time: "10-12 PM", customers: 35, avgSpend: 15.2 },
  { time: "12-2 PM", customers: 55, avgSpend: 18.75 },
  { time: "2-4 PM", customers: 30, avgSpend: 11.4 },
  { time: "4-6 PM", customers: 20, avgSpend: 9.8 },
]

const topCustomers = [
  { name: "Sarah Johnson", orders: 24, totalSpent: 456.8, avgOrder: 19.03 },
  { name: "Mike Chen", orders: 18, totalSpent: 342.5, avgOrder: 19.03 },
  { name: "Emma Wilson", orders: 16, totalSpent: 298.4, avgOrder: 18.65 },
  { name: "David Brown", orders: 14, totalSpent: 267.2, avgOrder: 19.09 },
  { name: "Lisa Garcia", orders: 12, totalSpent: 234.6, avgOrder: 19.55 },
]

export function CustomerAnalytics({ dateRange }: CustomerAnalyticsProps) {
  const totalCustomers =
    customerGrowthData[customerGrowthData.length - 1].newCustomers +
    customerGrowthData[customerGrowthData.length - 1].returningCustomers
  const retentionRate = (
    (customerGrowthData[customerGrowthData.length - 1].returningCustomers / totalCustomers) *
    100
  ).toFixed(1)
  const avgOrderValue = topCustomers.reduce((sum, customer) => sum + customer.avgOrder, 0) / topCustomers.length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCustomers}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Repeat className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{retentionRate}%</p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">${avgOrderValue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth and Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New vs returning customers over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerGrowthData}>
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
                <Bar dataKey="newCustomers" fill="#10b981" name="New Customers" />
                <Bar dataKey="returningCustomers" fill="#059669" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Customer distribution by engagement level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerSegmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerSegmentData.map((entry, index) => (
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
              {customerSegmentData.map((segment) => (
                <div key={segment.segment} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-foreground">{segment.segment}</span>
                  </div>
                  <span className="font-medium text-foreground">{segment.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Times and Order Frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Peak Times</CardTitle>
            <CardDescription>Busiest hours and average spending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakTimesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="customers" fill="#059669" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Frequency Distribution</CardTitle>
            <CardDescription>How often customers place orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderFrequencyData.map((item) => (
              <div key={item.frequency} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{item.frequency}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.customers} customers</span>
                    <Badge variant="secondary">{item.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Most valuable customers by total spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div
                key={customer.name}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${customer.totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Avg: ${customer.avgOrder.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
