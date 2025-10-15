"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useCurrency } from "./currency-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, Trash2, Clock, Zap } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: number
  categoryId: number
  name: string
  description: string
  price: number
  cost: number
  image: string
  isAvailable: boolean
  preparationTime: number
  calories: number
}

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [isAvailable, setIsAvailable] = useState(item.isAvailable)
  const profit = item.price - item.cost
  const profitMargin = ((profit / item.price) * 100).toFixed(1)
  const { formatCurrency } = useCurrency()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              Unavailable
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
            <span className="text-lg font-bold text-primary">{formatCurrency(item.price, "₹")}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.preparationTime}min
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {item.calories} cal
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Cost: </span>
              <span className="font-medium">${item.cost}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Profit: </span>
              <span className="font-medium text-green-600">
                ${profit.toFixed(2)} ({profitMargin}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} id={`available-${item.id}`} />
            <label htmlFor={`available-${item.id}`} className="text-sm text-muted-foreground">
              Available
            </label>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
