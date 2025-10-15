'use client'

import { useStore } from '@/lib/store'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export function InventoryChanges() {
  const { inventory } = useStore()
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Inventory Status</span>
          <Badge variant="outline" className="ml-2">Real-time</Badge>
        </CardTitle>
        <CardDescription>
          Stock levels are updated automatically when orders are processed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              // Calculate stock status
              const stockLevel = 
                item.quantity <= item.minStockLevel * 0.5 ? "critical" : 
                item.quantity <= item.minStockLevel ? "low" : "normal";
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <motion.div
                      key={`${item.id}-${item.quantity}`}
                      initial={{ opacity: 0.5, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      {item.quantity} {item.unit}
                      <div className="ml-2 bg-gray-200 dark:bg-gray-700 h-2 w-20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            stockLevel === "critical" ? "bg-red-500" :
                            stockLevel === "low" ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, (item.quantity / (item.minStockLevel * 3)) * 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        stockLevel === "critical" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                        stockLevel === "low" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                        "bg-green-100 text-green-800 hover:bg-green-100"
                      }
                    >
                      {stockLevel === "critical" ? "Critical" :
                       stockLevel === "low" ? "Low Stock" : "In Stock"}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}