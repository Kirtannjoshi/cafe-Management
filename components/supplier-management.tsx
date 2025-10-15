"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Phone, Mail, MapPin, Package } from "lucide-react"

// Sample supplier data
const suppliers = [
  {
    id: 1,
    name: "Premium Coffee Co.",
    contact: "John Smith",
    email: "orders@premiumcoffee.com",
    phone: "+1-555-0123",
    address: "123 Coffee Street, Bean City, BC 12345",
    itemsSupplied: ["Coffee Beans - Arabica", "Coffee Beans - Robusta"],
    lastOrder: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalOrders: 24,
    status: "active",
  },
  {
    id: 2,
    name: "Local Dairy Farm",
    contact: "Mary Johnson",
    email: "sales@localdairy.com",
    phone: "+1-555-0456",
    address: "456 Farm Road, Dairy Valley, DV 67890",
    itemsSupplied: ["Milk - Whole", "Milk - Skim", "Cream", "Butter"],
    lastOrder: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalOrders: 52,
    status: "active",
  },
  {
    id: 3,
    name: "Sweet Supplies Inc.",
    contact: "Robert Brown",
    email: "info@sweetsupplies.com",
    phone: "+1-555-0789",
    address: "789 Sugar Lane, Sweet Town, ST 13579",
    itemsSupplied: ["Sugar - White", "Sugar - Brown", "Honey", "Syrup"],
    lastOrder: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    totalOrders: 18,
    status: "active",
  },
  {
    id: 4,
    name: "Baking Essentials",
    contact: "Lisa Wilson",
    email: "orders@bakingessentials.com",
    phone: "+1-555-0321",
    address: "321 Flour Street, Baker City, BC 24680",
    itemsSupplied: ["Flour - All Purpose", "Flour - Bread", "Yeast", "Baking Powder"],
    lastOrder: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    totalOrders: 12,
    status: "inactive",
  },
]

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.itemsSupplied.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || supplier.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatDate = (date: Date) => {
    return date.toLocaleDateString()
  }

  const daysSinceLastOrder = (date: Date) => {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{suppliers.length}</div>
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {suppliers.filter((s) => s.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {suppliers.reduce((sum, s) => sum + s.itemsSupplied.length, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Items Supplied</p>
          </CardContent>
        </Card>
      </div>

      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Suppliers</h2>
          <p className="text-muted-foreground">Manage your supplier relationships and contacts</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
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
            All Suppliers
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            onClick={() => setStatusFilter("active")}
            size="sm"
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            onClick={() => setStatusFilter("inactive")}
            size="sm"
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier.contact}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      supplier.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {supplier.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Supplier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="w-4 h-4 mr-2" />
                        Place Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{supplier.address}</span>
                </div>
              </div>

              {/* Items Supplied */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Items Supplied:</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.itemsSupplied.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Order Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="font-semibold text-foreground">{supplier.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Order</p>
                  <p className="font-semibold text-foreground">{daysSinceLastOrder(supplier.lastOrder)}d ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
