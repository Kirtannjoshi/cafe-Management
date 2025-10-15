"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MenuItemCard } from "@/components/menu-item-card"
import { AddMenuItemDialog } from "@/components/add-menu-item-dialog"
import { CategoryManager } from "@/components/category-manager"
import { Search, Plus, Filter } from "lucide-react"

// Sample menu data (in real app, this would come from database)
const menuCategories = [
  { id: 1, name: "Coffee", count: 5 },
  { id: 2, name: "Tea", count: 3 },
  { id: 3, name: "Pastries", count: 3 },
  { id: 4, name: "Sandwiches", count: 3 },
  { id: 5, name: "Desserts", count: 2 },
  { id: 6, name: "Cold Drinks", count: 2 },
]

const menuItems = [
  {
    id: 1,
    categoryId: 1,
    name: "Espresso",
    description: "Rich and bold espresso shot",
    price: 2.5,
    cost: 0.5,
    image: "/espresso-coffee-cup.png",
    isAvailable: true,
    preparationTime: 2,
    calories: 5,
  },
  {
    id: 2,
    categoryId: 1,
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 4.25,
    cost: 1.0,
    image: "/cappuccino-coffee-with-foam-art.jpg",
    isAvailable: true,
    preparationTime: 4,
    calories: 120,
  },
  {
    id: 3,
    categoryId: 1,
    name: "Latte",
    description: "Espresso with steamed milk",
    price: 4.75,
    cost: 1.1,
    image: "/latte-coffee-with-milk-foam.jpg",
    isAvailable: true,
    preparationTime: 4,
    calories: 150,
  },
  {
    id: 4,
    categoryId: 3,
    name: "Croissant",
    description: "Buttery, flaky pastry",
    price: 3.75,
    cost: 1.2,
    image: "/golden-buttery-croissant-pastry.jpg",
    isAvailable: false,
    preparationTime: 1,
    calories: 231,
  },
  {
    id: 5,
    categoryId: 4,
    name: "Club Sandwich",
    description: "Triple-decker with turkey, bacon, lettuce",
    price: 8.95,
    cost: 3.5,
    image: "/club-sandwich-with-layers.jpg",
    isAvailable: true,
    preparationTime: 8,
    calories: 590,
  },
]

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === null || item.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Menu Management</h1>
              <p className="text-muted-foreground mt-2">Manage your cafe's menu items, categories, and pricing</p>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          <Tabs defaultValue="items" className="space-y-6">
            <TabsList>
              <TabsTrigger value="items">Menu Items</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    size="sm"
                  >
                    All Items
                  </Button>
                  {menuCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      size="sm"
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-2">
                        {category.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No menu items found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManager categories={menuCategories} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddMenuItemDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  )
}
