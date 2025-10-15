import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"

const lowStockItems = [
  {
    name: "Coffee Beans - Arabica",
    current: "2.5 kg",
    minimum: "5.0 kg",
    status: "critical",
  },
  {
    name: "Milk - Whole",
    current: "8.0 L",
    minimum: "10.0 L",
    status: "low",
  },
  {
    name: "Cheese - Cheddar",
    current: "0.8 kg",
    minimum: "1.0 kg",
    status: "critical",
  },
]

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <div>
            <CardTitle className="text-base">Inventory Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {lowStockItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.current} / {item.minimum} min
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                item.status === "critical"
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "bg-orange-100 text-orange-800 hover:bg-orange-100"
              }
            >
              {item.status}
            </Badge>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          Manage Inventory
        </Button>
      </CardContent>
    </Card>
  )
}
