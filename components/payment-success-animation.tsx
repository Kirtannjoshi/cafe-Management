'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PaymentSuccessProps {
  show: boolean
  amount: number
  currency: string
  onFinish?: () => void
}

export function PaymentSuccessAnimation({ show, amount, currency, onFinish }: PaymentSuccessProps) {
  useEffect(() => {
    if (show) {
      // Increase the display time for better visibility
      const timer = setTimeout(() => {
        if (onFinish) onFinish()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [show, onFinish])
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[100]"
        >
          {/* Full screen background flash animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              backgroundColor: ["#22c55e", "#22c55e", "#22c55e"]
            }}
            transition={{ duration: 1.5, times: [0, 0.2, 1] }}
            className="absolute inset-0 pointer-events-none"
          />
          
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ 
              scale: 1,
              y: 0,
              transition: { 
                type: 'spring', 
                stiffness: 300, 
                damping: 20 
              }
            }}
            className="bg-card max-w-md w-full mx-4 p-8 rounded-xl border shadow-2xl"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Animated success checkmark with rings */}
              <div className="relative mb-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.3, 1],
                    opacity: [0, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeOut" 
                  }}
                  className="absolute inset-0 bg-green-100 dark:bg-green-900/40 rounded-full"
                  style={{ width: '100px', height: '100px', left: '-25px', top: '-25px' }}
                />
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 1],
                    opacity: [0, 0.5, 0.2]
                  }}
                  transition={{ 
                    duration: 1.2,
                    ease: "easeOut",
                    delay: 0.2
                  }}
                  className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-full"
                  style={{ width: '120px', height: '120px', left: '-35px', top: '-35px' }}
                />
                
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut" 
                  }}
                  className="relative z-10 bg-green-100 dark:bg-green-900/30 rounded-full p-4"
                >
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </motion.div>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2"
              >
                Payment Successful!
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <p className="text-muted-foreground mb-5">
                  Thank you for your payment. Your transaction was successful.
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-8">
                  <Badge variant="outline" className="text-2xl py-2 px-4 font-mono font-semibold">
                    {currency}{amount.toFixed(2)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">paid via UPI</span>
                </div>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, delay: 0.5 }}
                  className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-green-500 rounded-full"
                />
                
                <div className="flex items-center justify-center mt-6">
                  <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
                  <p className="text-sm font-medium text-foreground">
                    Order is being prepared...
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}