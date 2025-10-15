"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryItemCard } from "@/components/inventory-item-card"
import { AddInventoryItemDialog } from "@/components/add-inventory-item-dialog"
import { StockMovementHistory } from "@/components/stock-movement-history"
import { SupplierManagement } from "@/components/supplier-management"
import { InventoryChanges } from "@/components/inventory-changes"
import { Search, Plus, AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react"

// Define the InventoryItem type to match the component props
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

// Sample inventory data
const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Coffee Beans - Arabica",
    description: "Premium Arabica coffee beans",
    unit: "kg",
    currentStock: 2.5,
    minimumStock: 5.0,
    maximumStock: 25.0,
    unitCost: 12.5,
    supplier: "Premium Coffee Co.",
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "critical",
  },
  {
    id: 2,
    name: "Milk - Whole",
    description: "Fresh whole milk",
    unit: "liters",
    currentStock: 8.0,
    minimumStock: 10.0,
    maximumStock: 50.0,
    unitCost: 1.2,
    supplier: "Local Dairy Farm",
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "low",
  },
  {
    id: 3,
    name: "Sugar - White",
    description: "Granulated white sugar",
    unit: "kg",
    currentStock: 15.0,
    minimumStock: 3.0,
    maximumStock: 20.0,
    unitCost: 2.8,
    supplier: "Sweet Supplies Inc.",
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    expiryDate: null,
    status: "good",
  },
  {
    id: 4,
    name: "Flour - All Purpose",
    description: "All-purpose baking flour",
    unit: "kg",
    currentStock: 20.0,
    minimumStock: 5.0,
    maximumStock: 30.0,
    unitCost: 1.5,
    supplier: "Baking Essentials",
    lastRestocked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    status: "good",
  },
  {
    id: 5,
    name: "Cheese - Cheddar",
    description: "Sharp cheddar cheese",
    unit: "kg",
    currentStock: 0.8,
    minimumStock: 1.0,
    maximumStock: 5.0,
    unitCost: 12.5,
    supplier: "Cheese Masters",
    lastRestocked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "critical",
  },
]

const stockStats = {
  totalItems: inventoryItems.length,
  lowStock: inventoryItems.filter((item) => item.status === "low" || item.status === "critical").length,
  criticalStock: inventoryItems.filter((item) => item.status === "critical").length,
  totalValue: inventoryItems.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0),
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "good" | "low" | "critical">("all")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-2">Track stock levels, manage suppliers, and monitor inventory</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stockStats.totalItems}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stockStats.lowStock}</p>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stockStats.criticalStock}</p>
                  <p className="text-sm text-muted-foreground">Critical Stock</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">${stockStats.totalValue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="items" className="space-y-6">
            <TabsList>
              <TabsTrigger value="items">Inventory Items</TabsTrigger>
              <TabsTrigger value="realtime">Real-time Stock</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search inventory items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    onClick={() => setStatusFilter("all")}
                    size="sm"
                  >
                    All Items
                  </Button>
                  <Button
                    variant={statusFilter === "critical" ? "default" : "outline"}
                    onClick={() => setStatusFilter("critical")}
                    size="sm"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Critical
                    <Badge variant="secondary" className="ml-2">
                      {stockStats.criticalStock}
                    </Badge>
                  </Button>
                  <Button
                    variant={statusFilter === "low" ? "default" : "outline"}
                    onClick={() => setStatusFilter("low")}
                    size="sm"
                  >
                    <TrendingDown className="w-4 h-4 mr-1" />
                    Low Stock
                  </Button>
                  <Button
                    variant={statusFilter === "good" ? "default" : "outline"}
                    onClick={() => setStatusFilter("good")}
                    size="sm"
                  >
                    Good Stock
                  </Button>
                </div>
              </div>

              {/* Inventory Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <InventoryItemCard key={item.id} item={item} />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No inventory items found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="realtime">
              <InventoryChanges />
            </TabsContent>
            
            <TabsContent value="movements">
              <StockMovementHistory />
            </TabsContent>

            <TabsContent value="suppliers">
              <SupplierManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddInventoryItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
