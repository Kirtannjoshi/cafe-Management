"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save, Users, Store, CreditCard, Bell, Printer, Shield, LogOut } from "lucide-react"

export default function SettingsPage() {
  const { user, updateUserSettings, updateCafeSettings } = useStore()
  const [saved, setSaved] = useState(false)

  // Make sure user is logged in and has the right permissions
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>You need to log in to access settings.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/">Return to Dashboard</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Settings data - load from store
  const { cafeSettings: storeSettings } = useStore()
  const [cafeSettings, setCafeSettings] = useState({
    cafeName: storeSettings.cafeName || "Cafe Bliss",
    businessName: storeSettings.businessName || "Bliss Foods Pvt. Ltd.",
    address: storeSettings.address || "123 Coffee Lane, Mumbai, Maharashtra",
    phone: storeSettings.phone || "+91 98765 43210",
    gstin: storeSettings.gstin || "27AADCB2230M1Z3", // GSTIN for Maharashtra
    upiId: storeSettings.upiId || "cafebliss@ybl",
    openingTime: storeSettings.openingTime || "08:00",
    closingTime: storeSettings.closingTime || "22:00",
    taxRate: storeSettings.taxRate || 5, // GST percentage
    tableCount: storeSettings.tableCount || 15,
    enableOnlineOrders: storeSettings.enableOnlineOrders,
    allowTableReservation: storeSettings.allowTableReservation,
    printReceipts: storeSettings.printReceipts,
    autoAssignTables: storeSettings.autoAssignTables,
    currencySymbol: storeSettings.currencySymbol as "₹" | "$" | "€",
    currencyRateUSD: storeSettings.currencyRateUSD || 88.79, // 1 USD equals 88.79 INR
    currencyRateEUR: storeSettings.currencyRateEUR || 103.39, // 1 EUR equals 103.39 INR

    theme: storeSettings.theme as "light" | "dark" | "system",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    lowStock: true,
    tableReservations: true,
    dailyReports: true,
    staffAlerts: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptUpi: true,
    acceptCards: true,
    defaultPaymentMethod: "upi",
    autoGenerateBill: true,
    roundOffBill: true,
    showTaxDetails: true,
  })

  const handleSaveSettings = () => {
    // Update settings in the store
    updateCafeSettings(cafeSettings)
    
    // Apply theme change immediately
    if (typeof window !== "undefined" && document.documentElement) {
      // Force theme application for immediate visual feedback
      if (cafeSettings.theme === "dark") {
        document.documentElement.classList.add("dark")
        document.documentElement.style.colorScheme = "dark"
      } else if (cafeSettings.theme === "light") {
        document.documentElement.classList.remove("dark")
        document.documentElement.style.colorScheme = "light"
      } else if (cafeSettings.theme === "system") {
        // Check system preference
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        if (isDarkMode) {
          document.documentElement.classList.add("dark")
          document.documentElement.style.colorScheme = "dark"
        } else {
          document.documentElement.classList.remove("dark")
          document.documentElement.style.colorScheme = "light"
        }
      }
      
      // Add animated flash effect to show theme change
      const overlay = document.createElement("div")
      overlay.style.position = "fixed"
      overlay.style.inset = "0"
      overlay.style.backgroundColor = cafeSettings.theme === "dark" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
      overlay.style.zIndex = "9999"
      overlay.style.pointerEvents = "none"
      overlay.style.transition = "opacity 0.5s ease"
      overlay.style.opacity = "1"
      
      document.body.appendChild(overlay)
      
      setTimeout(() => {
        overlay.style.opacity = "0"
        setTimeout(() => {
          document.body.removeChild(overlay)
        }, 500)
      }, 100)
    }
    
    // Show saved confirmation
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your cafe settings and preferences
              </p>
            </div>
            <Button onClick={handleSaveSettings} disabled={saved}>
              {saved ? "Saved" : "Save Changes"}
              {!saved && <Save className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          <Tabs defaultValue="general">
            <TabsList className="mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {user.role === "admin" && <TabsTrigger value="users">Users</TabsTrigger>}
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Store className="w-5 h-5 mr-2" />
                    Cafe Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your cafe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cafe-name">Cafe Name</Label>
                      <Input
                        id="cafe-name"
                        value={cafeSettings.cafeName}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, cafeName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={cafeSettings.phone}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={cafeSettings.address}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstin">GSTIN</Label>
                      <Input
                        id="gstin"
                        value={cafeSettings.gstin}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, gstin: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upi">UPI ID</Label>
                      <Input
                        id="upi"
                        value={cafeSettings.upiId}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, upiId: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="opening-time">Opening Time</Label>
                      <Input
                        id="opening-time"
                        type="time"
                        value={cafeSettings.openingTime}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, openingTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-time">Closing Time</Label>
                      <Input
                        id="closing-time"
                        type="time"
                        value={cafeSettings.closingTime}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, closingTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-rate">GST Rate (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        min="0"
                        max="28"
                        value={cafeSettings.taxRate}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, taxRate: parseFloat(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="table-count">Number of Tables</Label>
                      <Input
                        id="table-count"
                        type="number"
                        min="1"
                        value={cafeSettings.tableCount}
                        onChange={(e) =>
                          setCafeSettings({ ...cafeSettings, tableCount: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="online-orders">Enable Online Orders</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow customers to place orders online
                        </p>
                      </div>
                      <Switch
                        id="online-orders"
                        checked={cafeSettings.enableOnlineOrders}
                        onCheckedChange={(checked) =>
                          setCafeSettings({ ...cafeSettings, enableOnlineOrders: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="table-reservation">Allow Table Reservations</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable table reservations for customers
                        </p>
                      </div>
                      <Switch
                        id="table-reservation"
                        checked={cafeSettings.allowTableReservation}
                        onCheckedChange={(checked) =>
                          setCafeSettings({ ...cafeSettings, allowTableReservation: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="print-receipts">Print Receipts</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically print receipts for orders
                        </p>
                      </div>
                      <Switch
                        id="print-receipts"
                        checked={cafeSettings.printReceipts}
                        onCheckedChange={(checked) =>
                          setCafeSettings({ ...cafeSettings, printReceipts: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-assign">Auto-Assign Tables</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically assign tables to new dine-in orders
                        </p>
                      </div>
                      <Switch
                        id="auto-assign"
                        checked={cafeSettings.autoAssignTables}
                        onCheckedChange={(checked) =>
                          setCafeSettings({ ...cafeSettings, autoAssignTables: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how your system looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Currency Symbol</Label>
                    <RadioGroup
                      defaultValue="₹"
                      value={cafeSettings.currencySymbol}
                      onValueChange={(value) =>
                        setCafeSettings({ ...cafeSettings, currencySymbol: value as "₹" | "$" | "€" })
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="₹" id="r1" />
                        <Label htmlFor="r1">₹ (INR)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$" id="r2" />
                        <Label htmlFor="r2">$ (USD)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="€" id="r3" />
                        <Label htmlFor="r3">€ (EUR)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="font-medium">Currency Conversion Rates</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set the conversion rates for automatic price conversion when changing currencies
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="usd-rate">USD to INR Rate</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">$1 =</span>
                          <Input
                            id="usd-rate"
                            type="number"
                            step="0.01"
                            min="0"
                            value={cafeSettings.currencyRateUSD}
                            onChange={(e) =>
                              setCafeSettings({ ...cafeSettings, currencyRateUSD: parseFloat(e.target.value) })
                            }
                          />
                          <span className="text-sm text-muted-foreground">₹</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eur-rate">EUR to INR Rate</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">€1 =</span>
                          <Input
                            id="eur-rate"
                            type="number"
                            step="0.01"
                            min="0"
                            value={cafeSettings.currencyRateEUR}
                            onChange={(e) =>
                              setCafeSettings({ ...cafeSettings, currencyRateEUR: parseFloat(e.target.value) })
                            }
                          />
                          <span className="text-sm text-muted-foreground">₹</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={cafeSettings.theme}
                      onValueChange={(value) =>
                        setCafeSettings({ ...cafeSettings, theme: value as "light" | "dark" | "system" })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>
                    Configure accepted payment methods and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="accept-cash">Accept Cash</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept cash payments from customers
                        </p>
                      </div>
                      <Switch
                        id="accept-cash"
                        checked={paymentSettings.acceptCash}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, acceptCash: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="accept-upi">Accept UPI</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept UPI payments (PhonePe, Google Pay, Paytm, etc.)
                        </p>
                      </div>
                      <Switch
                        id="accept-upi"
                        checked={paymentSettings.acceptUpi}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, acceptUpi: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="accept-cards">Accept Card Payments</Label>
                        <p className="text-sm text-muted-foreground">
                          Accept credit and debit cards
                        </p>
                      </div>
                      <Switch
                        id="accept-cards"
                        checked={paymentSettings.acceptCards}
                        onCheckedChange={(checked) =>
                          setPaymentSettings({ ...paymentSettings, acceptCards: checked })
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="default-payment">Default Payment Method</Label>
                    <Select
                      value={paymentSettings.defaultPaymentMethod}
                      onValueChange={(value) =>
                        setPaymentSettings({ ...paymentSettings, defaultPaymentMethod: value })
                      }
                    >
                      <SelectTrigger id="default-payment">
                        <SelectValue placeholder="Select default payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-bill">Auto Generate Bill</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically generate bill when order is completed
                      </p>
                    </div>
                    <Switch
                      id="auto-bill"
                      checked={paymentSettings.autoGenerateBill}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({ ...paymentSettings, autoGenerateBill: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="round-off">Round Off Bill Amount</Label>
                      <p className="text-sm text-muted-foreground">
                        Round off bill total to nearest rupee
                      </p>
                    </div>
                    <Switch
                      id="round-off"
                      checked={paymentSettings.roundOffBill}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({ ...paymentSettings, roundOffBill: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="tax-details">Show Tax Details</Label>
                      <p className="text-sm text-muted-foreground">
                        Show detailed GST breakdown on bill
                      </p>
                    </div>
                    <Switch
                      id="tax-details"
                      checked={paymentSettings.showTaxDetails}
                      onCheckedChange={(checked) =>
                        setPaymentSettings({ ...paymentSettings, showTaxDetails: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure when and how you receive alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="new-orders-notification">New Orders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new orders are placed
                      </p>
                    </div>
                    <Switch
                      id="new-orders-notification"
                      checked={notificationSettings.newOrders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newOrders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="low-stock-notification">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when inventory items are running low
                      </p>
                    </div>
                    <Switch
                      id="low-stock-notification"
                      checked={notificationSettings.lowStock}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, lowStock: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reservation-notification">Table Reservations</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when tables are reserved
                      </p>
                    </div>
                    <Switch
                      id="reservation-notification"
                      checked={notificationSettings.tableReservations}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, tableReservations: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reports-notification">Daily Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive daily sales and performance reports
                      </p>
                    </div>
                    <Switch
                      id="reports-notification"
                      checked={notificationSettings.dailyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="staff-notification">Staff Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about staff schedule changes and issues
                      </p>
                    </div>
                    <Switch
                      id="staff-notification"
                      checked={notificationSettings.staffAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, staffAlerts: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management (Admin only) */}
            {user.role === "admin" && (
              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      User Management
                    </CardTitle>
                    <CardDescription>
                      Manage staff accounts and access permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline">
                        Add New User
                      </Button>

                      <div className="relative overflow-x-auto rounded-md border">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-muted">
                            <tr>
                              <th scope="col" className="px-6 py-3">Name</th>
                              <th scope="col" className="px-6 py-3">Role</th>
                              <th scope="col" className="px-6 py-3">Email</th>
                              <th scope="col" className="px-6 py-3">Status</th>
                              <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-card border-b">
                              <td className="px-6 py-4 font-medium">Rajesh Kumar</td>
                              <td className="px-6 py-4">Admin</td>
                              <td className="px-6 py-4">rajesh@cafebliss.com</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                            <tr className="bg-card border-b">
                              <td className="px-6 py-4 font-medium">Priya Sharma</td>
                              <td className="px-6 py-4">Manager</td>
                              <td className="px-6 py-4">priya@cafebliss.com</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                            <tr className="bg-card">
                              <td className="px-6 py-4 font-medium">Amit Patel</td>
                              <td className="px-6 py-4">Cashier</td>
                              <td className="px-6 py-4">amit@cafebliss.com</td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Button variant="ghost" size="sm">Edit</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  )
}