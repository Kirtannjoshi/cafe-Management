"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore, Order, OrderItem as StoreOrderItem } from "@/lib/store"
import { PaymentQRCode } from "@/components/payment-qr-code"
import { useCurrency } from "@/components/currency-provider"
import {
  Clock,
  MapPin,
  Phone,
  CreditCard,
  MoreVertical,
  Printer,
  Eye,
  CheckCircle,
  AlertCircle,
  Package,
  QrCode,
} from "lucide-react"

interface OrderCardProps {
  order: Order
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  preparing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  ready: "bg-green-100 text-green-800 hover:bg-green-100",
  completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
}

const statusIcons = {
  pending: AlertCircle,
  preparing: Clock,
  ready: CheckCircle,
  completed: Package,
}

export function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus, updateOrderPaymentStatus, cafeSettings, updateInventoryFromOrder } = useStore()
  // Use the currency context for displaying prices
  const { formatCurrency } = useCurrency()
  const [currentStatus, setCurrentStatus] = useState(order.status)
  const [showQrCode, setShowQrCode] = useState(false)
  const StatusIcon = statusIcons[currentStatus as keyof typeof statusIcons]

  const timeAgo = (date: Date | string) => {
    const now = new Date()
    const orderDate = date instanceof Date ? date : new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours}h ${diffInMinutes % 60}m ago`
  }

  const handleStatusChange = (newStatus: string) => {
    const status = newStatus as Order["status"]
    setCurrentStatus(status)
    updateOrderStatus(order.id, status)
    
    // When an order is completed, update inventory
    if (status === "completed" && order.paymentStatus === "paid") {
      // Update inventory based on this order
      updateInventoryFromOrder(order.id)
    }
  }

  const handlePaymentUpdate = (paymentStatus: Order["paymentStatus"], paymentMethod?: string) => {
    updateOrderPaymentStatus(order.id, paymentStatus, paymentMethod)
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <StatusIcon className="w-4 h-4" />
              <span className="font-semibold text-foreground">#{order.orderNumber}</span>
            </div>
            <Badge variant="secondary" className={statusColors[currentStatus as keyof typeof statusColors]}>
              {currentStatus}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-foreground">{order.customerName}</span>
            {order.customerPhone && (
              <>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-3 h-3" />
                  {order.customerPhone}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(order.createdAt)}
            </div>
            {order.orderType === "dine-in" && order.tableNumber && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Table {order.tableNumber}
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              {order.orderType}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item: StoreOrderItem, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.quantity}x {item.name}
              </span>
              <span className="font-medium text-foreground">{formatCurrency(item.quantity * item.price, "₹")}</span>
            </div>
          ))}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-2 bg-muted rounded text-xs">
            <span className="font-medium text-muted-foreground">Note: </span>
            <span className="text-foreground">{order.notes}</span>
          </div>
        )}

        {/* Total and Payment */}
        <div className="border-t pt-3 space-y-2">
                      <span className="text-foreground">{formatCurrency(order.subtotal, "₹")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax:</span>
            <span className="text-foreground">{formatCurrency(order.taxAmount, "₹")}</span>
          </div>
          <div className="flex items-center justify-between font-medium">
            <span className="text-muted-foreground">Total:</span>
            <span className="text-foreground">{formatCurrency(order.totalAmount, "₹")}</span>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {order.paymentMethod ? order.paymentMethod : "Not paid"}
              </span>
              <Badge
                variant="secondary"
                className={
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            
            {order.paymentStatus !== "paid" && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handlePaymentUpdate("paid", "cash")}
                >
                  Cash
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowQrCode(true)}
                >
                  <QrCode className="w-4 h-4 mr-1" /> UPI
                </Button>
              </div>
            )}
          </div>
          
          {/* QR Code Payment Dialog */}
          <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Pay with UPI</DialogTitle>
              </DialogHeader>
              <PaymentQRCode 
                amount={order.totalAmount} 
                orderId={order.id} 
                onPaymentComplete={() => setShowQrCode(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Update */}
        <div className="pt-2">
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
