"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface SalesAnalyticsProps {
  dateRange: string
}

// Sample data for charts
const revenueData = [
  { date: "Mon", revenue: 1247, orders: 28 },
  { date: "Tue", revenue: 1456, orders: 32 },
  { date: "Wed", revenue: 1123, orders: 25 },
  { date: "Thu", revenue: 1789, orders: 38 },
  { date: "Fri", revenue: 2134, orders: 45 },
  { date: "Sat", revenue: 2456, orders: 52 },
  { date: "Sun", revenue: 1987, orders: 41 },
]

const hourlyData = [
  { hour: "6AM", orders: 5, revenue: 234 },
  { hour: "7AM", orders: 12, revenue: 567 },
  { hour: "8AM", orders: 18, revenue: 823 },
  { hour: "9AM", orders: 15, revenue: 678 },
  { hour: "10AM", orders: 22, revenue: 1034 },
  { hour: "11AM", orders: 28, revenue: 1245 },
  { hour: "12PM", orders: 35, revenue: 1567 },
  { hour: "1PM", orders: 32, revenue: 1423 },
  { hour: "2PM", orders: 25, revenue: 1123 },
  { hour: "3PM", orders: 20, revenue: 934 },
  { hour: "4PM", orders: 18, revenue: 823 },
  { hour: "5PM", orders: 15, revenue: 678 },
]

const topItemsData = [
  { name: "Cappuccino", sales: 156, revenue: 663, color: "#059669" },
  { name: "Latte", sales: 134, revenue: 636.5, color: "#10b981" },
  { name: "Club Sandwich", sales: 89, revenue: 796.55, color: "#34d399" },
  { name: "Americano", sales: 78, revenue: 273, color: "#6ee7b7" },
  { name: "Croissant", sales: 67, revenue: 251.25, color: "#a7f3d0" },
]

const orderTypeData = [
  { name: "Dine-in", value: 45, color: "#059669" },
  { name: "Takeaway", value: 35, color: "#10b981" },
  { name: "Delivery", value: 20, color: "#34d399" },
]

export function SalesAnalytics({ dateRange }: SalesAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
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
                <Area type="monotone" dataKey="revenue" stroke="#059669" fill="#059669" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Number of orders per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
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
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours and Order Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours Analysis</CardTitle>
            <CardDescription>Orders by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ fill: "#059669", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Types Distribution</CardTitle>
            <CardDescription>Breakdown by order type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderTypeData.map((entry, index) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Items</CardTitle>
          <CardDescription>Best performing menu items by sales volume and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topItemsData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${item.revenue.toFixed(2)}</p>
                  <Badge variant="secondary" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                    Revenue
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
