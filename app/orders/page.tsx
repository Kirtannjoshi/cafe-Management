"use client"

import { useState, useEffect } from "react"
import { useStore, Table } from "@/lib/store" 
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { OrderCard } from "@/components/order-card"
import { NewOrderDialog } from "@/components/new-order-dialog"
import { OrderHistory } from "@/components/order-history"
import { Search, Plus, Filter, Clock, CheckCircle, AlertCircle, ShoppingCart, Minus, Trash2, CreditCard } from "lucide-react"
import { useCurrency } from "@/components/currency-provider"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string
}

export default function OrdersPage() {
  const { orders, menuItems, addOrder, tables } = useStore()
  const { formatCurrency } = useCurrency()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("active")
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Online order state
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    orderType: "delivery" as "delivery" | "pickup",
  })
  
  // Handle tab change from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['active', 'history', 'online'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    completed: orders.filter((o) => o.status === "completed").length,
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })
  
  // Online ordering functionality
  const categories = ["all", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const filteredMenuItems = menuItems.filter(
    (item) => (selectedCategory === "all" || item.category === selectedCategory) && item.available
  )

  const addToCart = (menuItem: (typeof menuItems)[0]) => {
    const existingItem = cart.find((item) => item.id === menuItem.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id))
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = customerInfo.orderType === "delivery" ? 3.99 : 0
  const taxRate = 0.08
  const taxAmount = subtotal * taxRate
  const total = subtotal + deliveryFee + taxAmount

  const handleSubmitOnlineOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0) {
      alert("Please add items to your cart")
      return
    }

    addOrder({
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      orderType: "online",
      tableNumber: null,
      status: "pending",
      items: cart,
      subtotal,
      taxAmount,
      totalAmount: total,
      paymentStatus: "pending",
      paymentMethod: null,
      notes: customerInfo.notes,
      isOnline: true,
    })

    // Reset form
    setCart([])
    setCustomerInfo({
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      orderType: "delivery",
    })

    alert("Online order placed successfully!")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Order Processing</h1>
              <p className="text-muted-foreground mt-2">Manage customer orders from creation to completion</p>
            </div>
            <Button onClick={() => setShowNewOrderDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="tables">Table Orders</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
              <TabsTrigger value="online">Online Ordering</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {/* Search and Status Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders by number, customer name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    size="sm"
                  >
                    All
                    <Badge variant="secondary" className="ml-2">
                      {statusCounts.all}
                    </Badge>
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    onClick={() => setStatusFilter("pending")}
                    size="sm"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Pending
                    <Badge variant="secondary" className="ml-2">
                      {statusCounts.pending}
                    </Badge>
                  </Button>
                  <Button
                    variant={statusFilter === "preparing" ? "default" : "outline"}
                    onClick={() => setStatusFilter("preparing")}
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Preparing
                    <Badge variant="secondary" className="ml-2">
                      {statusCounts.preparing}
                    </Badge>
                  </Button>
                  <Button
                    variant={statusFilter === "ready" ? "default" : "outline"}
                    onClick={() => setStatusFilter("ready")}
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready
                    <Badge variant="secondary" className="ml-2">
                      {statusCounts.ready}
                    </Badge>
                  </Button>
                </div>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tables" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="text-xl font-semibold">Table Orders</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tables</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => setShowNewOrderDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Table Order
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table: Table) => {
                  const order = table.currentOrderId 
                    ? orders.find(o => o.id === table.currentOrderId) 
                    : null;
                  
                  return (
                    <Card key={table.id} className={`hover:shadow-md transition-shadow ${
                      table.status === "available" ? "border-green-500 border-2" :
                      table.status === "occupied" ? "border-red-500 border-2" :
                      "border-orange-500 border-2"
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Table {table.number}</h3>
                          <Badge className={
                            table.status === "available" ? "bg-green-100 text-green-800" :
                            table.status === "occupied" ? "bg-red-100 text-red-800" :
                            "bg-orange-100 text-orange-800"
                          }>
                            {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 text-sm text-muted-foreground">
                          {table.capacity} seats
                        </div>
                        
                        {order ? (
                          <div className="mt-3 space-y-2">
                            <div className="text-sm flex justify-between">
                              <span>Order #{order.orderNumber}</span>
                              <span className="font-medium">{order.items.length} items</span>
                            </div>
                            <div className="text-sm flex justify-between">
                              <span>{order.customerName}</span>
                              <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <Button 
                              className="w-full mt-2" 
                              variant="outline"
                              onClick={() => router.push(`/orders?orderId=${order.id}`)}
                            >
                              View Order
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <Button 
                              className="w-full" 
                              onClick={() => {
                                setShowNewOrderDialog(true);
                                // Pre-select this table for the new order
                              }}
                            >
                              Assign Order
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <OrderHistory />
            </TabsContent>

            <TabsContent value="online" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Menu Items */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Menu</h2>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMenuItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{item.name}</h3>
                              {/* No description field in the menu item type */}
                              <div className="flex items-center mt-2">
                                <span className="text-foreground font-medium">{formatCurrency(item.price)}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => addToCart(item)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Shopping Cart & Order Form */}
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Your Cart</h3>
                        <Badge variant="secondary">{cart.length} items</Badge>
                      </div>

                      {cart.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Your cart is empty</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between pb-2 border-b">
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{item.name}</p>
                                  <p>{formatCurrency(item.price * item.quantity)}</p>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-auto text-red-500"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Subtotal</span>
                              <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Tax (8%)</span>
                              <span>{formatCurrency(taxAmount)}</span>
                            </div>
                            {deliveryFee > 0 && (
                              <div className="flex items-center justify-between text-sm">
                                <span>Delivery Fee</span>
                                <span>{formatCurrency(deliveryFee)}</span>
                              </div>
                            )}
                            <Separator className="my-2" />
                            <div className="flex items-center justify-between font-bold">
                              <span>Total</span>
                              <span>{formatCurrency(total)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-4">Customer Information</h3>
                      <form onSubmit={handleSubmitOnlineOrder} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Full Name"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Phone Number"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="orderType">Order Type</Label>
                          <Select
                            value={customerInfo.orderType}
                            onValueChange={(value: "delivery" | "pickup") =>
                              setCustomerInfo({ ...customerInfo, orderType: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pickup">Pickup</SelectItem>
                              <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {customerInfo.orderType === "delivery" && (
                          <div>
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea
                              id="address"
                              placeholder="Delivery Address"
                              value={customerInfo.address}
                              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="notes">Special Instructions</Label>
                          <Textarea
                            id="notes"
                            placeholder="Special instructions for your order..."
                            value={customerInfo.notes}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={cart.length === 0 || !customerInfo.name || !customerInfo.phone}
                          className="w-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Place Order
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <NewOrderDialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog} />
    </div>
  )
}
