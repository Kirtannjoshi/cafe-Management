"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, Coffee, ShoppingCart, Package, BarChart3, 
  Users, Settings, LogOut, FileText, HelpCircle
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { orders, user, logout, cafeSettings } = useStore()
  const pathname = usePathname()
  const router = useRouter()

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "preparing").length
  const lowStockItems = 3 // This would normally come from inventory data
  
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Define all navigation items based on RBAC requirements
  const allNavigation = [
    // Dashboard - Limited view for cashier (daily sales only), full for manager/admin
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["admin", "manager", "cashier", "waiter"] },
    
    // Menu Management - Admin and Manager only
    { name: "Menu Management", href: "/menu", icon: Coffee, roles: ["admin", "manager"] },
    
    // Orders - All roles can access (waiters for table management, cashiers for billing)
    {
      name: "Orders",
      href: "/orders",
      icon: ShoppingCart,
      badge: pendingOrders > 0 ? pendingOrders.toString() : undefined,
      roles: ["admin", "manager", "cashier", "waiter"]
    },
    
    // Inventory - Manager and Admin only
    { 
      name: "Inventory", 
      href: "/inventory", 
      icon: Package, 
      badge: lowStockItems > 0 ? lowStockItems.toString() : undefined,
      roles: ["admin", "manager"] 
    },
    
    // Staff Management - Admin and Manager only (with salary access for both)
    { name: "Staff", href: "/staff", icon: Users, roles: ["admin", "manager"] },
    
    // Analytics - Full access for Admin/Manager, limited for Cashier
    { name: "Analytics", href: "/analytics", icon: BarChart3, roles: ["admin", "manager", "cashier"] },
    
    // Settings - Admin only
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
    
    // Billing - Admin, Manager, and Cashier
    { name: "Billing", href: "/billing", icon: FileText, roles: ["admin", "manager", "cashier"] },
    
    // Help - All roles
    { name: "Help", href: "/help", icon: HelpCircle, roles: ["admin", "manager", "cashier", "waiter"] },
  ]
  
  // Filter navigation items based on user role
  const navigation = allNavigation.filter(item => 
    user?.role ? item.roles.includes(user.role) : false
  )

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">CafeManager</h2>
              <p className="text-xs text-muted-foreground">Pro Edition</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LayoutDashboard className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isCurrent = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isCurrent ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCurrent
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent rounded-md p-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/settings`}>Cafe Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
