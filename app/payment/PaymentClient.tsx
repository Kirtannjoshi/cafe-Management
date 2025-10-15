"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Calendar, CalendarDays, Check, CreditCard, FileText, IndianRupee, MonitorSmartphone, Printer, QrCode, RefreshCcw, Save, UserRound } from "lucide-react"
import Link from "next/link"

export default function PaymentClient() {
  const { orders, updateOrder, cafeSettings } = useStore()
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  
  const order = orders.find(o => o.id === orderId)
  
  if (!order) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Order Not Found</CardTitle>
                <CardDescription>The order you're looking for doesn't exist</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href="/orders">
                  <Button>Return to Orders</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    )
  }
  
  const handlePayment = () => {
    setIsProcessing(true)
    
    if (paymentMethod === "upi") {
      router.push(`/payment/upi?orderId=${orderId}`)
      return
    }
    
    // For cash or card payments, process immediately
    setTimeout(() => {
      const updatedOrder = {
        ...order,
        paymentStatus: "paid" as const,
        paymentMethod: paymentMethod,
        updatedAt: new Date()
      }
      
      updateOrder(updatedOrder)
      setIsProcessing(false)
    }, 1500)
  }
  
  const currencySymbol = cafeSettings.currencySymbol || "\u20b9"
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Payment</h1>
              <p className="text-muted-foreground mt-2">Process payment for order #{order.orderNumber}</p>
            </div>
            
            <div className="flex gap-2">
              <Link href={`/orders?orderId=${orderId}`}>
                <Button variant="outline">Back to Order</Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                  <CardDescription>Choose how the customer would like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="cash" onValueChange={setPaymentMethod}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="cash">Cash</TabsTrigger>
                      <TabsTrigger value="card">Card</TabsTrigger>
                      <TabsTrigger value="upi">UPI</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="cash">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                          <div className="text-center">
                            <IndianRupee className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <h3 className="font-medium">Cash Payment</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-1">
                              Accept cash payment from the customer and provide change if needed
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Amount Tendered</label>
                            <div className="relative mt-1">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                              </span>
                              <Input className="pl-6" defaultValue={order.totalAmount.toFixed(2)} />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Change Due</label>
                            <div className="relative mt-1">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {currencySymbol}
                              </span>
                              <Input className="pl-6" value="0.00" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="card">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                          <div className="text-center">
                            <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <h3 className="font-medium">Card Payment</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-1">
                              Process payment through credit or debit card
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Card Type</label>
                            <Select defaultValue="credit">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select Card Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="debit">Debit Card</SelectItem>
                                <SelectItem value="amex">American Express</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Transaction ID</label>
                              <Input className="mt-1" defaultValue={`TR${Math.floor(Math.random() * 10000000)}`} readOnly />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Terminal ID</label>
                              <Input className="mt-1" defaultValue="POS-TERM-001" readOnly />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="upi">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center p-6 border border-dashed rounded-md">
                          <div className="text-center">
                            <QrCode className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <h3 className="font-medium">UPI Payment</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mt-1">
                              Process payment through UPI apps like Google Pay, PhonePe, Paytm, etc.
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-2">
                          <p className="text-sm">Click the button below to generate QR code for UPI payment</p>
                          <Button variant="outline" className="gap-2 mx-auto">
                            <MonitorSmartphone className="h-4 w-4" />
                            Open UPI Interface
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            This will redirect you to the UPI payment page
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" asChild>
                    <Link href={`/orders?orderId=${orderId}`}>
                      Cancel
                    </Link>
                  </Button>
                  <Button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    {isProcessing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : null}
                    {isProcessing ? "Processing..." : "Process Payment"}
                    {!isProcessing && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex gap-2 items-center">
                      <Printer className="h-4 w-4" />
                      Print Receipt
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" className="w-full" size="sm">
                      Print
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex gap-2 items-center">
                      <FileText className="h-4 w-4" />
                      Email Receipt
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" className="w-full" size="sm">
                      Email
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm flex gap-2 items-center">
                      <Calendar className="h-4 w-4" />
                      Save for Later
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="secondary" className="w-full" size="sm">
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Order Summary</span>
                    <Badge variant={
                      order.paymentStatus === "paid" ? "default" : 
                      "secondary"
                    }>
                      {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Order #{order.orderNumber} \u2022 {order.orderType}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  {/* Order Items */}
                  <div>
                    <p className="font-medium mb-2">Items</p>
                    <div className="space-y-2 max-h-[240px] overflow-auto">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity} x {item.name}</span>
                          <span>{currencySymbol} {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Order Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{currencySymbol} {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (18% GST)</span>
                      <span>{currencySymbol} {order.taxAmount.toFixed(2)}</span>
                    </div>
                    {(order.discount || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <span className="text-green-600">-{currencySymbol} {(order.discount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>{currencySymbol} {order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Order Actions */}
                  {order.paymentStatus !== "paid" ? (
                    <div className="pt-4">
                      <Button className="w-full gap-2" onClick={handlePayment}>
                        <Check className="h-4 w-4" />
                        Quick Checkout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">Payment Complete</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Processed via {order.paymentMethod || "cash"} on {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
