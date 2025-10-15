"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { useStore } from "@/lib/store"
import { useCurrency } from "./currency-provider"

export function DashboardStats() {
  // Use the currency context for formatting and get real analytics data
  const { analytics, orders } = useStore()
  const { formatCurrency } = useCurrency()
  
  // Calculate today's revenue from analytics
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayData = analytics.dailyRevenue.find(day => day.date === today) || { revenue: 0, orders: 0 };
  
  // Count pending orders
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  
  const stats = [
    {
      title: "Today's Revenue",
      value: formatCurrency(todayData.revenue, "₹"),
      change: "+" + (todayData.revenue > 0 ? Math.round((todayData.revenue / analytics.totalRevenue) * 100) : 0) + "%",
      trend: "up",
      icon: DollarSign,
      description: "vs yesterday",
    },
  {
    title: "Orders Today",
    value: todayData.orders.toString(),
    change: "+" + (todayData.orders > 0 ? Math.round((todayData.orders / analytics.totalOrders) * 100) : 0) + "%",
    trend: "up",
    icon: ShoppingCart,
    description: pendingOrders + " pending",
  },
  {
    title: "Active Staff",
    value: "8",
    change: "2 on break",
    trend: "neutral",
    icon: Users,
    description: "of 12 scheduled",
  },
  {
    title: "Low Stock Items",
    value: "3",
    change: "Need reorder",
    trend: "down",
    icon: Package,
    description: "requires attention",
  },
  {
    title: "Orders Today",
    value: "89",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    description: "12 pending",
  },
  {
    title: "Active Staff",
    value: "8",
    change: "2 on break",
    trend: "neutral",
    icon: Users,
    description: "of 12 scheduled",
  },
  {
    title: "Low Stock Items",
    value: "3",
    change: "Need reorder",
    trend: "down",
    icon: Package,
    description: "requires attention",
  }
]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="flex items-center gap-2">
              {stat.trend === "up" && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "down" && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "neutral" && <Badge variant="outline">{stat.change}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
