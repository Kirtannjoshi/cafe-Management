'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { cafeSettings, updateCafeSettings } = useStore()
  const [mounted, setMounted] = useState(false)
  
  // After mounting, we can access the store
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return null
  }
  
  const toggleTheme = () => {
    const newTheme = cafeSettings.theme === 'dark' ? 'light' : 'dark'
    updateCafeSettings({ theme: newTheme })
  }
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-md"
      style={{
        backgroundColor: cafeSettings.theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderColor: cafeSettings.theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)'
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        key={cafeSettings.theme} // Force re-render on theme change
      >
        {cafeSettings.theme === 'dark' ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Moon className="h-5 w-5 text-blue-600" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 0 }}
          >
            <Sun className="h-5 w-5 text-yellow-500" />
          </motion.div>
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}