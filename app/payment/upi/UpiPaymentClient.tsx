"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, CreditCard, IndianRupee, QrCode, Smartphone, Timer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function UpiPaymentClient() {
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
    
    // Simulate payment processing - will mark the order as paid after 5 seconds
    const timer = setTimeout(() => {
      if (orderId) {
        updateOrderPaymentStatus(orderId, "paid", "upi")
      }
    }, 5000)
    
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
                <Skeleton className="h-[200px] w-[200px] mx-auto" />
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
            <h1 className="text-3xl font-bold tracking-tight">UPI Payment</h1>
            <p className="text-muted-foreground mt-2">Complete your payment using UPI</p>
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
              <div className="flex flex-col items-center justify-center space-y-6">
                {order.paymentStatus === "pending" ? (
                  <>
                    <div className="text-center">
                      <p className="text-lg font-medium">Scan QR Code to Pay</p>
                      <p className="text-sm text-muted-foreground mb-4">Using any UPI app</p>
                      
                      <div className="bg-white p-4 rounded-lg border shadow-sm mx-auto w-[220px] h-[220px] relative">
                        {/* QR Code Placeholder */}
                        <div className="w-full h-full relative">
                          <QrCode className="w-full h-full text-black" strokeWidth={1} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IndianRupee className="w-12 h-12 text-primary opacity-50" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full space-y-4">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">UPI ID</span>
                          <span className="font-medium">{cafeSettings.businessName.toLowerCase().replace(/\s+/g, '')}@ybl</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reference ID</span>
                          <span className="font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                      
                      <div className="rounded-md border flex items-center p-3">
                        <Timer className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-sm">Payment processing - Please wait...</span>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <p className="text-sm text-center text-muted-foreground">Or pay using other methods</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="justify-start" onClick={() => router.push("/payment/card?orderId=" + orderId)}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Card
                          </Button>
                          <Button variant="outline" className="justify-start" onClick={() => router.push("/payment/wallet?orderId=" + orderId)}>
                            <Smartphone className="h-4 w-4 mr-2" />
                            Wallets
                          </Button>
                        </div>
                      </div>
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
                      <p className="text-muted-foreground">Your payment of \u20b9 {order.totalAmount.toFixed(2)} has been received</p>
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
            <p>This is a simulated payment gateway for demonstration purposes.</p>
            <p>In a real environment, this would connect to actual UPI services.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
