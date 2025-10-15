"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { formatDate, formatDateTime } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FileText, Printer, Search, Download, Calendar, Wallet } from "lucide-react"

export default function BillingPage() {
  const { orders, cafeSettings } = useStore()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<string>("today")

  // Function to format currency based on the café settings
  const formatCurrency = (amount: number) => {
    const { currencySymbol, currencyRateUSD, currencyRateEUR } = cafeSettings
    
    let convertedAmount = amount
    if (currencySymbol === "$") {
      convertedAmount = amount / currencyRateUSD
    } else if (currencySymbol === "€") {
      convertedAmount = amount / currencyRateEUR
    }
    
    return `${currencySymbol}${convertedAmount.toFixed(2)}`
  }

  // Filter orders based on search, status, and date range
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "paid" && order.paymentStatus === "paid") ||
      (filterStatus === "pending" && order.paymentStatus === "pending") ||
      (filterStatus === "refunded" && order.paymentStatus === "refunded")
    
    // Simple date filtering
    let matchesDate = true
    const orderDate = new Date(order.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (dateRange === "today") {
      matchesDate = orderDate.toDateString() === today.toDateString()
    } else if (dateRange === "yesterday") {
      matchesDate = orderDate.toDateString() === yesterday.toDateString()
    } else if (dateRange === "week") {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = orderDate >= weekAgo
    } else if (dateRange === "month") {
      const monthAgo = new Date(today)
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = orderDate >= monthAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Generate receipt for selected order
  const selectedOrderData = selectedOrder ? orders.find(o => o.id === selectedOrder) : null

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Billing & Receipts</h1>
              <p className="text-muted-foreground mt-2">Generate and manage billing records</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print All
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by order number or customer name..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-[180px]">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-[180px]">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Transaction History</CardTitle>
              <CardDescription>View all billing records and generate receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="capitalize">{order.orderType}</TableCell>
                      <TableCell className="capitalize">{order.paymentMethod || "-"}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {order.paymentStatus}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Receipt</DialogTitle>
                            </DialogHeader>
                            {selectedOrderData && (
                              <div className="space-y-4">
                                <div className="text-center space-y-2 py-2">
                                  <h3 className="font-bold text-lg">{cafeSettings.cafeName}</h3>
                                  <p className="text-sm text-muted-foreground">{cafeSettings.address}</p>
                                  <p className="text-sm text-muted-foreground">Phone: {cafeSettings.phone}</p>
                                  {cafeSettings.gstin && <p className="text-xs text-muted-foreground">GSTIN: {cafeSettings.gstin}</p>}
                                </div>
                                
                                <Separator />
                                
                                <div className="flex justify-between text-sm">
                                  <div>
                                    <p className="font-medium">Order #: {selectedOrderData.orderNumber}</p>
                                    <p>Date: {formatDate(selectedOrderData.createdAt)}</p>
                                    <p>Time: {formatDateTime(selectedOrderData.createdAt).split(',')[1]?.trim()}</p>
                                  </div>
                                  <div className="text-right">
                                    <p>Customer: {selectedOrderData.customerName}</p>
                                    <p>Phone: {selectedOrderData.customerPhone}</p>
                                    <p className="capitalize">Type: {selectedOrderData.orderType}</p>
                                    {selectedOrderData.tableNumber && <p>Table: {selectedOrderData.tableNumber}</p>}
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-center">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrderData.items.map((item, i) => (
                                        <TableRow key={i}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell className="text-center">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(selectedOrderData.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Tax ({cafeSettings.taxRate}%):</span>
                                    <span>{formatCurrency(selectedOrderData.taxAmount)}</span>
                                  </div>
                                  {selectedOrderData.discount && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount:</span>
                                      <span>-{formatCurrency(selectedOrderData.discount)}</span>
                                    </div>
                                  )}
                                  <Separator />
                                  <div className="flex justify-between font-bold">
                                    <span>Total:</span>
                                    <span>{formatCurrency(selectedOrderData.totalAmount)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Payment Method:</span>
                                    <span className="capitalize">{selectedOrderData.paymentMethod || 'Not paid'}</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Payment Status:</span>
                                    <span className="capitalize">{selectedOrderData.paymentStatus}</span>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="text-center text-sm space-y-1">
                                  <p>Thank you for visiting {cafeSettings.cafeName}!</p>
                                  {cafeSettings.upiId && <p>UPI: {cafeSettings.upiId}</p>}
                                </div>
                                
                                <div className="flex justify-center gap-2">
                                  <Button>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Receipt
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No transaction records found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      orders
                        .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString() && o.paymentStatus === "paid")
                        .reduce((sum, o) => sum + o.totalAmount, 0)
                    )}
                  </div>
                  <div className="p-2 bg-green-100 rounded-full">
                    <Wallet className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Today's Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      orders
                        .filter(o => o.paymentStatus === "pending")
                        .reduce((sum, o) => sum + o.totalAmount, 0)
                    )}
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}