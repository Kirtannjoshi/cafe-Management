"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, TrendingUp, TrendingDown, RotateCcw, Trash2 } from "lucide-react"

// Sample stock movement data
const stockMovements = [
  {
    id: 1,
    itemName: "Coffee Beans - Arabica",
    movementType: "out",
    quantity: 2.5,
    unit: "kg",
    reason: "Sale - Order #ORD-001",
    staff: "John Barista",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unitCost: 12.5,
  },
  {
    id: 2,
    itemName: "Milk - Whole",
    movementType: "in",
    quantity: 20.0,
    unit: "liters",
    reason: "Purchase - Delivery #DEL-456",
    staff: "Jane Manager",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unitCost: 1.2,
  },
  {
    id: 3,
    itemName: "Cheese - Cheddar",
    movementType: "waste",
    quantity: 0.5,
    unit: "kg",
    reason: "Expired - Past use by date",
    staff: "Sarah Wilson",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    unitCost: 12.5,
  },
  {
    id: 4,
    itemName: "Sugar - White",
    movementType: "adjustment",
    quantity: -1.0,
    unit: "kg",
    reason: "Stock count correction",
    staff: "Jane Manager",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    unitCost: 2.8,
  },
  {
    id: 5,
    itemName: "Flour - All Purpose",
    movementType: "in",
    quantity: 10.0,
    unit: "kg",
    reason: "Purchase - Supplier delivery",
    staff: "Mike Chen",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    unitCost: 1.5,
  },
]

const movementTypeColors = {
  in: "bg-green-100 text-green-800 hover:bg-green-100",
  out: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  adjustment: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  waste: "bg-red-100 text-red-800 hover:bg-red-100",
}

const movementTypeIcons = {
  in: TrendingUp,
  out: TrendingDown,
  adjustment: RotateCcw,
  waste: Trash2,
}

export function StockMovementHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState("week")

  const filteredMovements = stockMovements.filter((movement) => {
    const matchesSearch =
      movement.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.staff.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || movement.movementType === typeFilter

    return matchesSearch && matchesType
  })

  const formatDateTime = (date: Date) => {
    return date.toLocaleString()
  }

  const totalValue = filteredMovements.reduce((sum, movement) => {
    return sum + Math.abs(movement.quantity) * movement.unitCost
  }, 0)

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{filteredMovements.length}</div>
            <p className="text-sm text-muted-foreground">Total Movements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredMovements.filter((m) => m.movementType === "in").length}
            </div>
            <p className="text-sm text-muted-foreground">Stock In</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {filteredMovements.filter((m) => m.movementType === "out").length}
            </div>
            <p className="text-sm text-muted-foreground">Stock Out</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search movements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="in">Stock In</SelectItem>
            <SelectItem value="out">Stock Out</SelectItem>
            <SelectItem value="adjustment">Adjustments</SelectItem>
            <SelectItem value="waste">Waste</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Movements List */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Movement History</CardTitle>
          <CardDescription>Complete record of all inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMovements.map((movement) => {
              const Icon = movementTypeIcons[movement.movementType as keyof typeof movementTypeIcons]
              return (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      <Badge
                        variant="secondary"
                        className={movementTypeColors[movement.movementType as keyof typeof movementTypeColors]}
                      >
                        {movement.movementType}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{movement.itemName}</p>
                      <p className="text-sm text-muted-foreground">{movement.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        by {movement.staff} • {formatDateTime(movement.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {movement.movementType === "adjustment" && movement.quantity < 0 ? "" : "+"}
                      {movement.quantity} {movement.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(Math.abs(movement.quantity) * movement.unitCost).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
