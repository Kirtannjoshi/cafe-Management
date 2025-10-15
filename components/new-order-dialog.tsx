"use client"

import type React from "react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react"
import { useCurrency } from "./currency-provider"

interface NewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string
}

export function NewOrderDialog({ open, onOpenChange }: NewOrderDialogProps) {
  const { menuItems, addOrder, tables, assignTable } = useStore()
  const { formatCurrency } = useCurrency()
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerPhone: "",
    orderType: "dine-in" as "dine-in" | "takeaway" | "delivery" | "online",
    tableNumber: null as number | null,
    notes: "",
  })
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const filteredMenuItems = menuItems.filter(
    (item) => (selectedCategory === "all" || item.category === selectedCategory) && item.available,
  )

  const addItemToOrder = (menuItem: (typeof menuItems)[0]) => {
    const existingItem = orderItems.find((item) => item.id === menuItem.id)
    if (existingItem) {
      setOrderItems(
        orderItems.map((item) => (item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setOrderItems([...orderItems, { ...menuItem, quantity: 1 }])
    }
  }

  const updateItemQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.id !== id))
    } else {
      setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const taxRate = 0.08 // 8% tax
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderItems.length === 0) {
      alert("Please add at least one item to the order")
      return
    }

    const orderId = addOrder({
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      orderType: orderData.orderType,
      tableNumber: orderData.tableNumber,
      status: "pending",
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      subtotal,
      taxAmount,
      totalAmount: total,
      paymentStatus: "pending",
      paymentMethod: null,
      notes: orderData.notes,
    })
    
    // If it's a dine-in order and a table is selected, assign the table
    if (orderData.orderType === "dine-in" && orderData.tableNumber) {
      // Find the table with the matching number
      const table = tables.find(t => t.number === orderData.tableNumber);
      if (table) {
        assignTable(orderId, table.id);
      }
    }

    onOpenChange(false)

    // Reset form
    setOrderData({
      customerName: "",
      customerPhone: "",
      orderType: "dine-in" as "dine-in" | "takeaway" | "delivery" | "online",
      tableNumber: null,
      notes: "",
    })
    setOrderItems([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Add items to create a new customer order</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={orderData.customerName}
                onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-phone">Phone Number</Label>
              <Input
                id="customer-phone"
                value={orderData.customerPhone}
                onChange={(e) => setOrderData({ ...orderData, customerPhone: e.target.value })}
                placeholder="+1234567890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-type">Order Type</Label>
              <Select
                value={orderData.orderType}
                onValueChange={(value) => setOrderData({ ...orderData, orderType: value as "dine-in" | "takeaway" | "delivery" | "online" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in">Dine In</SelectItem>
                  <SelectItem value="takeaway">Takeaway</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderData.orderType === "dine-in" && (
              <div className="space-y-2">
                <Label htmlFor="table-number">Table Number</Label>
                <Select
                  value={orderData.tableNumber?.toString() || ""}
                  onValueChange={(value) => setOrderData({ ...orderData, tableNumber: parseInt(value) })}
                >
                  <SelectTrigger id="table-number">
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables
                      .filter(table => table.status === "available")
                      .map(table => (
                        <SelectItem key={table.id} value={table.number.toString()}>
                          Table {table.number} ({table.capacity} seats)
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Menu Items</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Items" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addItemToOrder(item)}
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{formatCurrency(item.price, "₹")}</span>
                      <Button type="button" size="sm" variant="outline">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-foreground">Order Summary</h3>
                <Badge variant="secondary">{orderItems.length} items</Badge>
              </div>

              <Card>
                <CardContent className="p-4 space-y-4">
                  {orderItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No items added yet</p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {orderItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{formatCurrency(item.price, "₹")} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center text-foreground">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="text-foreground">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax (8%):</span>
                          <span className="text-foreground">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-foreground">Total:</span>
                          <span className="text-foreground">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              value={orderData.notes}
              onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
              placeholder="Any special requests or notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={orderItems.length === 0}>
              Create Order (${total.toFixed(2)})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
