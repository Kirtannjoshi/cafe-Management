"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface AddInventoryItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const suppliers = [
  "Premium Coffee Co.",
  "Local Dairy Farm",
  "Sweet Supplies Inc.",
  "Baking Essentials",
  "Cheese Masters",
  "Fresh Produce Co.",
  "Quality Meats",
]

const units = ["kg", "liters", "pieces", "boxes", "bags", "bottles", "cans"]

export function AddInventoryItemDialog({ open, onOpenChange }: AddInventoryItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unit: "",
    currentStock: "",
    minimumStock: "",
    maximumStock: "",
    unitCost: "",
    supplier: "",
  })
  const [expiryDate, setExpiryDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newItem = {
      ...formData,
      currentStock: Number.parseFloat(formData.currentStock),
      minimumStock: Number.parseFloat(formData.minimumStock),
      maximumStock: Number.parseFloat(formData.maximumStock),
      unitCost: Number.parseFloat(formData.unitCost),
      expiryDate,
      lastRestocked: new Date(),
      status: "good",
    }

    console.log("Adding new inventory item:", newItem)
    onOpenChange(false)

    // Reset form
    setFormData({
      name: "",
      description: "",
      unit: "",
      currentStock: "",
      minimumStock: "",
      maximumStock: "",
      unitCost: "",
      supplier: "",
    })
    setExpiryDate(undefined)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
          <DialogDescription>Add a new item to your inventory management system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Coffee Beans - Arabica"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the item..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current-stock">Current Stock *</Label>
              <Input
                id="current-stock"
                type="number"
                step="0.1"
                value={formData.currentStock}
                onChange={(e) => handleInputChange("currentStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-stock">Min Stock *</Label>
              <Input
                id="min-stock"
                type="number"
                step="0.1"
                value={formData.minimumStock}
                onChange={(e) => handleInputChange("minimumStock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-stock">Max Stock</Label>
              <Input
                id="max-stock"
                type="number"
                step="0.1"
                value={formData.maximumStock}
                onChange={(e) => handleInputChange("maximumStock", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit-cost">Unit Cost ($)</Label>
              <Input
                id="unit-cost"
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => handleInputChange("unitCost", e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Inventory Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
