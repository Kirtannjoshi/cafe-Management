"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Eye } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  preparing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ready: "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
}

export function RecentOrders() {
  const { orders } = useStore()
  const recentOrders = orders.slice(0, 5)

  const timeAgo = (date: Date | string) => {
    const now = new Date()
    const dateObj = typeof date === "string" ? new Date(date) : date
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60))
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours}h ${diffInMinutes % 60}m ago`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest customer orders and their current status</CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="outline" size="sm">
              View All Orders
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">#{order.orderNumber}</span>
                  <Badge variant="secondary" className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {order.orderType === "dine-in" && order.tableNumber
                      ? `Table ${order.tableNumber}`
                      : order.orderType}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {timeAgo(order.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">${order.totalAmount.toFixed(2)}</span>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
