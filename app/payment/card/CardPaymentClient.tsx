"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, IndianRupee, ArrowRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function CardPaymentClient() {
  const { orders, updateOrderPaymentStatus, cafeSettings } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  
  const order = orders.find(o => o.id === orderId)
  
  useEffect(() => {
    if (!orderId || !order) {
      router.push("/orders")
      return
    }
    
    // Simulate payment processing - will mark the order as paid after 3 seconds
    const timer = setTimeout(() => {
      if (orderId) {
        updateOrderPaymentStatus(orderId, "paid", "card")
      }
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [orderId, order, router, updateOrderPaymentStatus])
  
  if (!order) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-lg mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Loading Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-[200px] w-full mx-auto" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-lg mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Card Payment</h1>
            <p className="text-muted-foreground mt-2">Complete your payment securely</p>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex justify-between">
                <span>Order #{order.orderNumber}</span>
                <span>\u20b9 {order.totalAmount.toFixed(2)}</span>
              </CardTitle>
              <p>{order.customerName}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {order.paymentStatus === "pending" ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                        <CreditCard className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-medium">Enter Card Details</p>
                      <p className="text-sm text-muted-foreground">All transactions are secure and encrypted</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          maxLength={19} 
                          className="font-mono"
                          defaultValue="4111 1111 1111 1111" // Demo card number
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input 
                            id="expiryDate" 
                            placeholder="MM/YY" 
                            maxLength={5}
                            defaultValue="12/25" // Demo expiry
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            maxLength={3}
                            type="password"
                            defaultValue="123" // Demo CVV
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input 
                          id="nameOnCard" 
                          placeholder="JOHN SMITH"
                          defaultValue={order.customerName.toUpperCase()} // Pre-fill from order
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Order Amount</span>
                        <span>\u20b9 {order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>\u20b9 {order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 space-y-4">
                      <p className="text-xs text-muted-foreground text-center">
                        This is a simulated payment - No actual charges will be made
                      </p>
                      
                      <Button className="w-full" size="lg">
                        Pay Now
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Payment Successful</h2>
                      <p className="text-muted-foreground">Your payment of \u20b9 {order.totalAmount.toFixed(2)} has been processed</p>
                      <p className="text-sm text-muted-foreground mt-1">Transaction ID: CARD{Date.now().toString().substring(5, 13)}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="gap-2"
                        onClick={() => router.push("/orders?orderId=" + orderId)}
                      >
                        View Order Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CreditCard className="h-4 w-4" />
              <p>Secured by Cafe Bliss Payment Gateway</p>
            </div>
            <p>This is a simulated payment gateway for demonstration purposes.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
