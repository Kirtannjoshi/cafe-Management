"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertTriangle, Package, Calendar, DollarSign, MoreVertical, Plus, Minus, Edit, Truck } from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  description: string
  unit: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  unitCost: number
  supplier: string
  lastRestocked: Date
  expiryDate: Date | null
  status: "good" | "low" | "critical"
}

interface InventoryItemCardProps {
  item: InventoryItem
}

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  const [currentStock, setCurrentStock] = useState(item.currentStock)
  const [adjustmentMode, setAdjustmentMode] = useState(false)
  const [adjustmentValue, setAdjustmentValue] = useState("")

  const stockPercentage = (currentStock / item.maximumStock) * 100
  const isExpiringSoon = item.expiryDate && item.expiryDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000

  const statusColors = {
    good: "bg-green-100 text-green-800 hover:bg-green-100",
    low: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    critical: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const statusIcons = {
    good: Package,
    low: AlertTriangle,
    critical: AlertTriangle,
  }

  const StatusIcon = statusIcons[item.status]

  const handleStockAdjustment = (type: "add" | "remove") => {
    const value = Number.parseFloat(adjustmentValue)
    if (isNaN(value) || value <= 0) return

    const newStock = type === "add" ? currentStock + value : Math.max(0, currentStock - value)
    setCurrentStock(newStock)
    setAdjustmentValue("")
    setAdjustmentMode(false)

    // Here you would typically update the database and create a stock movement record
    console.log(`Stock ${type === "add" ? "added" : "removed"}: ${value} ${item.unit}`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  const daysSinceRestock = Math.floor((Date.now() - item.lastRestocked.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            <Badge variant="secondary" className={statusColors[item.status]}>
              {item.status}
            </Badge>
            {isExpiringSoon && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Expiring Soon
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Truck className="w-4 h-4 mr-2" />
                Reorder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h3 className="font-semibold text-foreground">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stock Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Stock Level</span>
            <span className="text-sm text-muted-foreground">
              {currentStock} / {item.maximumStock} {item.unit}
            </span>
          </div>
          <Progress value={stockPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {item.minimumStock}</span>
            <span>Max: {item.maximumStock}</span>
          </div>
        </div>

        {/* Stock Adjustment */}
        {adjustmentMode ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={adjustmentValue}
                onChange={(e) => setAdjustmentValue(e.target.value)}
                className="flex-1"
              />
              <span className="flex items-center text-sm text-muted-foreground">{item.unit}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleStockAdjustment("add")} className="flex-1">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStockAdjustment("remove")} className="flex-1">
                <Minus className="w-3 h-3 mr-1" />
                Remove
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdjustmentMode(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setAdjustmentMode(true)} className="w-full">
            Adjust Stock
          </Button>
        )}

        {/* Item Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              Unit Cost:
            </div>
            <span className="font-medium text-foreground">${item.unitCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Value:</span>
            <span className="font-medium text-foreground">${(currentStock * item.unitCost).toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Supplier:</span>
            <span className="font-medium text-foreground text-right">{item.supplier}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              Last Restocked:
            </div>
            <span className="text-foreground">{daysSinceRestock}d ago</span>
          </div>

          {item.expiryDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expires:</span>
              <span className={`font-medium ${isExpiringSoon ? "text-orange-600" : "text-foreground"}`}>
                {formatDate(item.expiryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Reorder Suggestion */}
        {item.status === "critical" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Reorder Required</span>
            </div>
            <p className="text-xs text-red-600 mt-1">Stock is below minimum level</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
