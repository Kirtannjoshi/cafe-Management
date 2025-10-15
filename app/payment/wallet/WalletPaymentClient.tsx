"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Smartphone, QrCode, IndianRupee } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export default function WalletPaymentClient() {
  const { orders, updateOrderPaymentStatus, cafeSettings } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  
  const order = orders.find(o => o.id === orderId)
  const [wallet, setWallet] = useState("phonepe")
  
  useEffect(() => {
    if (!orderId || !order) {
      router.push("/orders")
      return
    }
    
    // Simulate payment processing - will mark the order as paid after 4 seconds
    const timer = setTimeout(() => {
      if (orderId) {
        updateOrderPaymentStatus(orderId, "paid", wallet)
      }
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [orderId, order, router, updateOrderPaymentStatus, wallet])
  
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
            <h1 className="text-3xl font-bold tracking-tight">Mobile Wallet Payment</h1>
            <p className="text-muted-foreground mt-2">Complete your payment using a mobile wallet</p>
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
                      <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
                        <Smartphone className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-lg font-medium">Choose Payment Method</p>
                      <p className="text-sm text-muted-foreground mb-6">Select your preferred mobile wallet</p>
                      
                      <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto">
                        <Button 
                          variant={wallet === "phonepe" ? "default" : "outline"}
                          className="flex-col h-auto py-3 px-2"
                          onClick={() => setWallet("phonepe")}
                        >
                          <Image 
                            src="/phonepe-logo.png" 
                            alt="PhonePe" 
                            width={40} 
                            height={40} 
                            className="mb-2"
                          />
                          <span className="text-xs">PhonePe</span>
                        </Button>
                        <Button 
                          variant={wallet === "paytm" ? "default" : "outline"}
                          className="flex-col h-auto py-3 px-2"
                          onClick={() => setWallet("paytm")}
                        >
                          <Image 
                            src="/paytm-logo.png" 
                            alt="Paytm" 
                            width={40} 
                            height={40} 
                            className="mb-2"
                          />
                          <span className="text-xs">Paytm</span>
                        </Button>
                        <Button 
                          variant={wallet === "googlepay" ? "default" : "outline"}
                          className="flex-col h-auto py-3 px-2"
                          onClick={() => setWallet("googlepay")}
                        >
                          <Image 
                            src="/gpay-logo.png" 
                            alt="Google Pay" 
                            width={40} 
                            height={40} 
                            className="mb-2"
                          />
                          <span className="text-xs">GPay</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center w-full">
                      <p className="text-sm font-medium mb-4">Scan QR Code using {wallet === "phonepe" ? "PhonePe" : wallet === "paytm" ? "Paytm" : "Google Pay"}</p>
                      
                      <div className="bg-white p-4 rounded-lg border shadow-sm mx-auto w-[220px] h-[220px] relative">
                        {/* QR Code Placeholder */}
                        <div className="w-full h-full relative">
                          <QrCode className="w-full h-full text-black" strokeWidth={1} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IndianRupee className="w-12 h-12 text-primary opacity-50" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm font-medium">
                        Amount: \u20b9 {order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Reference: {order.id}
                      </div>
                      
                      <div className="mt-6 text-sm flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Waiting for payment...
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4 py-8 w-full">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Payment Successful</h2>
                      <p className="text-muted-foreground">Your payment of \u20b9 {order.totalAmount.toFixed(2)} has been received</p>
                      
                      <div className="mt-4 p-3 bg-muted/50 rounded-md max-w-xs mx-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span className="font-mono">{wallet.toUpperCase()}-{Date.now().toString().substring(5, 13)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span className="capitalize">{wallet}</span>
                        </div>
                      </div>
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
            <p>In a real environment, this would connect to actual mobile wallet services.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
