"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { CheckCircle2, CircleDashed, Coffee, Utensils } from "lucide-react"
import Link from "next/link"

export default function TablesPage() {
  const { tables, orders, updateTableStatus, cafeSettings } = useStore()
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const [tableOrderDialogOpen, setTableOrderDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "occupied" | "reserved">("all")
  
  const currencySymbol = cafeSettings.currencySymbol || "₹"
  
  // Group tables by section
  const sections = {
    "Indoor": tables.filter(t => t.id <= 9),
    "Outdoor": tables.filter(t => t.id > 9 && t.id <= 12),
    "Private": tables.filter(t => t.id > 12)
  }

  const filteredTables = tables.filter(table => {
    const matchesSearch = searchTerm === "" || 
      table.number.toString().includes(searchTerm) || 
      `table ${table.number}`.includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || table.status === filterStatus
    
    return matchesSearch && matchesStatus
  })
  
  const getTableOrder = (tableId: number) => {
    return orders.find(o => o.tableNumber === tableId && o.status !== "completed")
  }

  const handleTableClick = (tableId: number) => {
    setSelectedTable(tableId)
    const order = getTableOrder(tableId)
    
    if (order) {
      setCurrentOrder(order)
      setTableOrderDialogOpen(true)
    }
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Table Management</h1>
              <p className="text-muted-foreground mt-2">Manage tables and dine-in orders</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href="/orders?tab=active">
                <Button variant="outline" className="gap-2">
                  <Utensils className="h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link href="/orders">
                <Button>
                  Create New Order
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Filters and Legend */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All Tables
              </Button>
              <Button 
                variant={filterStatus === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("available")}
                className="text-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Available
              </Button>
              <Button 
                variant={filterStatus === "occupied" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("occupied")}
                className="text-red-600"
              >
                <Coffee className="h-4 w-4 mr-1" />
                Occupied
              </Button>
              <Button 
                variant={filterStatus === "reserved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("reserved")}
                className="text-blue-600"
              >
                <CircleDashed className="h-4 w-4 mr-1" />
                Reserved
              </Button>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Input
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
          
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="section">Section View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            {/* Grid View */}
            <TabsContent value="grid">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredTables.map((table) => {
                  const order = getTableOrder(table.number)
                  
                  return (
                    <Card 
                      key={table.id}
                      className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-md ${
                        table.status === "available" ? "border-green-500/30" :
                        table.status === "occupied" ? "border-red-500/30" : 
                        table.status === "reserved" ? "border-blue-500/30" : ""
                      }`}
                      onClick={() => handleTableClick(table.number)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>Table {table.number}</span>
                          <Badge variant={
                            table.status === "available" ? "outline" :
                            table.status === "occupied" ? "destructive" : 
                            "secondary"
                          }>
                            {table.status === "available" && "Free"}
                            {table.status === "occupied" && "Occupied"}
                            {table.status === "reserved" && "Reserved"}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 pb-2">
                        <div className="text-sm text-muted-foreground">Capacity: {table.capacity} people</div>
                      </CardContent>
                      {order && (
                        <CardFooter className="p-4 pt-0 block">
                          <div className="text-sm mt-2 font-medium">{order.customerName}</div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-muted-foreground">
                              {order.items.length} items
                            </span>
                            <span className="text-xs font-medium">
                              {currencySymbol} {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
            
            {/* Section View */}
            <TabsContent value="section">
              <div className="space-y-8">
                {Object.entries(sections).map(([sectionName, sectionTables]) => (
                  <div key={sectionName} className="space-y-4">
                    <h2 className="text-xl font-semibold">{sectionName} Section</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {sectionTables
                        .filter(table => {
                          const matchesSearch = searchTerm === "" || 
                            table.number.toString().includes(searchTerm) || 
                            `table ${table.number}`.includes(searchTerm.toLowerCase())
                          
                          const matchesStatus = filterStatus === "all" || table.status === filterStatus
                          
                          return matchesSearch && matchesStatus
                        })
                        .map((table) => {
                          const order = getTableOrder(table.number)
                          
                          return (
                            <Card 
                              key={table.id}
                              className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-md ${
                                table.status === "available" ? "border-green-500/30" :
                                table.status === "occupied" ? "border-red-500/30" : 
                                table.status === "reserved" ? "border-blue-500/30" : ""
                              }`}
                              onClick={() => handleTableClick(table.number)}
                            >
                              <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg flex justify-between items-center">
                                  <span>Table {table.number}</span>
                                  <Badge variant={
                                    table.status === "available" ? "outline" :
                                    table.status === "occupied" ? "destructive" : 
                                    "secondary"
                                  }>
                                    {table.status === "available" && "Free"}
                                    {table.status === "occupied" && "Occupied"}
                                    {table.status === "reserved" && "Reserved"}
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 pb-2">
                                <div className="text-sm text-muted-foreground">Capacity: {table.capacity} people</div>
                              </CardContent>
                              {order && (
                                <CardFooter className="p-4 pt-0 block">
                                  <div className="text-sm mt-2 font-medium">{order.customerName}</div>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      {order.items.length} items
                                    </span>
                                    <span className="text-xs font-medium">
                                      {currencySymbol} {order.totalAmount.toFixed(2)}
                                    </span>
                                  </div>
                                </CardFooter>
                              )}
                            </Card>
                          )
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* List View */}
            <TabsContent value="list">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Table</th>
                      <th className="p-3 text-left font-medium">Capacity</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Customer</th>
                      <th className="p-3 text-left font-medium">Order Total</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table) => {
                      const order = getTableOrder(table.number)
                      
                      return (
                        <tr 
                          key={table.id} 
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleTableClick(table.number)}
                        >
                          <td className="p-3 font-medium">Table {table.number}</td>
                          <td className="p-3">{table.capacity} people</td>
                          <td className="p-3">
                            <Badge variant={
                              table.status === "available" ? "outline" :
                              table.status === "occupied" ? "destructive" : 
                              "secondary"
                            }>
                              {table.status === "available" && "Free"}
                              {table.status === "occupied" && "Occupied"}
                              {table.status === "reserved" && "Reserved"}
                            </Badge>
                          </td>
                          <td className="p-3">{order ? order.customerName : "-"}</td>
                          <td className="p-3">{order ? `${currencySymbol} ${order.totalAmount.toFixed(2)}` : "-"}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Table Order Dialog */}
      <Dialog open={tableOrderDialogOpen} onOpenChange={setTableOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Table {selectedTable} - {currentOrder ? "Current Order" : "No Active Order"}
            </DialogTitle>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm">{currentOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={
                    currentOrder.status === "pending" ? "secondary" :
                    currentOrder.status === "preparing" ? "outline" :
                    currentOrder.status === "ready" ? "default" : "secondary"
                  }>
                    {currentOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Order #</p>
                  <p className="text-sm">{currentOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p className="text-sm">
                    {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  <p className="font-medium">Order Items</p>
                  <div className="space-y-2">
                    {currentOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity} x {item.name}
                        </span>
                        <span>
                          {currencySymbol} {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{currencySymbol} {currentOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (GST)</span>
                      <span>{currencySymbol} {currentOrder.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium mt-2">
                      <span>Total</span>
                      <span>{currencySymbol} {currentOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex flex-col gap-2">
                <Link href={`/orders?orderId=${currentOrder.id}`}>
                  <Button className="w-full" size="sm">
                    View Full Order Details
                  </Button>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled={currentOrder.paymentStatus === "paid"}>
                    {currentOrder.paymentStatus === "paid" ? "Paid" : "Mark as Paid"}
                  </Button>
                  <Button variant="secondary" size="sm" 
                    onClick={() => {
                      if (selectedTable) {
                        updateTableStatus(selectedTable, "available")
                        setTableOrderDialogOpen(false)
                      }
                    }}
                  >
                    Free Table
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {!currentOrder && selectedTable && (
            <div className="space-y-4">
              <p>This table is currently {tables.find(t => t.id === selectedTable)?.status}.</p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setTableOrderDialogOpen(false)}>
                  Cancel
                </Button>
                <Link href={`/orders?table=${selectedTable}`}>
                  <Button>Create New Order</Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}