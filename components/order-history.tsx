"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Eye } from "lucide-react"
import { formatDate } from "@/lib/date-utils"

// Sample historical orders
const historicalOrders = [
  {
    id: "ORD-098",
    orderNumber: "098",
    customerName: "Alice Brown",
    orderType: "dine-in",
    totalAmount: 15.75,
    status: "completed",
    paymentMethod: "card",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    itemCount: 3,
  },
  {
    id: "ORD-097",
    orderNumber: "097",
    customerName: "Bob Wilson",
    orderType: "takeaway",
    totalAmount: 22.4,
    status: "completed",
    paymentMethod: "cash",
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    itemCount: 4,
  },
  {
    id: "ORD-096",
    orderNumber: "096",
    customerName: "Carol Davis",
    orderType: "delivery",
    totalAmount: 31.2,
    status: "completed",
    paymentMethod: "card",
    completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    itemCount: 5,
  },
  {
    id: "ORD-095",
    orderNumber: "095",
    customerName: "David Miller",
    orderType: "dine-in",
    totalAmount: 8.5,
    status: "refunded",
    paymentMethod: "card",
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    itemCount: 2,
  },
]

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("today")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = historicalOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    // Simple date filtering (in real app, you'd have proper date logic)
    const matchesDate = dateFilter === "all" || dateFilter === "today"

    return matchesSearch && matchesStatus && matchesDate
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Use the imported formatDate function from date-utils

  const totalRevenue = filteredOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{filteredOrders.length}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {filteredOrders.filter((o) => o.status === "completed").length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {filteredOrders.filter((o) => o.status === "refunded").length}
            </div>
            <p className="text-sm text-muted-foreground">Refunded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search order history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Complete record of all processed orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">#{order.orderNumber}</span>
                      <Badge
                        variant="secondary"
                        className={
                          order.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {formatDate(order.completedAt)} at {formatTime(order.completedAt)}
                    </p>
                    <p>
                      {order.itemCount} items • {order.orderType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
