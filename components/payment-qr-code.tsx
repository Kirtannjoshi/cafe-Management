'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useCurrency } from './currency-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Copy, CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { PaymentSuccessAnimation } from './payment-success-animation'

interface PaymentQRCodeProps {
  amount: number
  orderId: string
  onPaymentComplete?: () => void
}

export function PaymentQRCode({ amount, orderId, onPaymentComplete }: PaymentQRCodeProps) {
  const { cafeSettings, updateOrderPaymentStatus, updateInventoryFromOrder } = useStore()
  // Use currency context for formatting and conversion
  const { formatCurrency, currencySymbol, convertAmount } = useCurrency()
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  
  // UPI payment details
  const upiId = cafeSettings.upiId || 'cafebliss@ybl'
  const paymentReference = `ORD-${orderId}`
  const payeeName = cafeSettings.cafeName || 'Cafe Bliss'
  
  // Generate QR Code URL
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        // Create UPI URL
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(paymentReference)}`
        
        // Use Google Charts API to generate QR code
        // In a production app, you might want to use a dedicated QR code library
        const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(upiUrl)}&choe=UTF-8`
        setQrCodeUrl(googleChartsUrl)
      } catch (error) {
        console.error("Failed to generate QR code:", error)
      }
    }
    
    generateQrCode()
  }, [amount, paymentReference, upiId, payeeName])
  
  // Handle copy UPI ID
  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // Simulate payment completion with animation and inventory update
  const handlePaymentComplete = () => {
    setIsProcessing(true)
    setPaymentStatus('processing')
    
    // Simulate payment verification delay (2 seconds)
    setTimeout(() => {
      // Update payment status
      updateOrderPaymentStatus(orderId, "paid", "upi")
      
      // Update inventory based on this order
      updateInventoryFromOrder(orderId)
      
      // Update UI state
      setPaymentStatus('completed')
      setIsProcessing(false)
      
      // Show success animation
      setShowSuccessAnimation(true)
      
      // Don't close dialog immediately - the animation will handle it
    }, 2000)
  }
  
  // Download QR code
  const downloadQrCode = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `payment-qr-${paymentReference}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <>
      {/* Full-screen success animation */}
      <PaymentSuccessAnimation 
        show={showSuccessAnimation} 
        amount={amount}
        currency={currencySymbol}
        onFinish={() => {
          if (onPaymentComplete) {
            onPaymentComplete()
          }
        }}
      />
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            {paymentStatus === 'completed' ? 'Payment Successful!' : 'Scan to Pay'}
          </CardTitle>
          <CardDescription>
            Amount: {formatCurrency(amount, "₹")}
          </CardDescription>
        </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Payment Status Display */}
        {paymentStatus === 'completed' ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 0, duration: 0.5 }}
              className="rounded-full bg-green-100 p-4 mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-600" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">Payment Received</h3>
            <p className="text-center text-muted-foreground">
              Your payment of {formatCurrency(amount, "₹")} has been processed successfully.
            </p>
            <motion.div
              className="mt-4 w-full bg-gray-100 h-1 rounded-full overflow-hidden"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        ) : paymentStatus === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium">Verifying Payment</h3>
            <p className="text-center text-muted-foreground mt-2">
              Please wait while we confirm your payment...
            </p>
          </div>
        ) : (
          <>
            {/* QR Code Image */}
            {qrCodeUrl ? (
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border rounded-lg p-4 bg-white"
              >
                <img 
                  src={qrCodeUrl} 
                  alt="UPI Payment QR Code" 
                  className="w-64 h-64"
                  onError={(e) => {
                    console.error("Failed to load QR code image");
                    // Set a backup QR code or fallback image
                    e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(paymentReference)}&size=300x300`;
                  }}
                />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 w-64 border rounded-lg p-4 bg-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-sm text-center text-muted-foreground">Generating QR code...</p>
              </div>
            )}
            
            {/* UPI ID */}
            <div className="flex items-center justify-between w-full border rounded-lg p-3">
              <span className="text-sm font-medium">UPI ID: {upiId}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyUpiId} 
                title="Copy UPI ID"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="w-full flex justify-between gap-4">
              <Button variant="outline" className="flex-1" onClick={downloadQrCode}>
                <Download className="mr-2 h-4 w-4" /> Save QR
              </Button>
              <Button className="flex-1" onClick={handlePaymentComplete} disabled={isProcessing}>
                {isProcessing ? 
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 
                  <ArrowRight className="h-4 w-4 mr-2" />
                }
                Payment Completed
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code with any UPI app to pay. Reference: {paymentReference}
            </p>
          </>
        )}
      </CardContent>
    </Card>
    </>
  )
}