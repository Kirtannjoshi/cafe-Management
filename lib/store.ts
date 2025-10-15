import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  category: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  orderType: "dine-in" | "takeaway" | "delivery" | "online"
  tableNumber: number | null
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  items: OrderItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  paymentStatus: "pending" | "paid" | "refunded"
  paymentMethod: string | null
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
  notes: string
  isOnline?: boolean
  discount?: number
}

export interface Staff {
  id: string
  name: string
  role: string
  email: string
  phone: string
  status: "active" | "inactive" | "on-break"
  shiftStart?: string
  shiftEnd?: string
  hoursWorked: number
  avatar?: string
  salary?: number
  joiningDate?: string
  address?: string
  position?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "cashier" | "waiter"
  avatar?: string
}

export interface CafeSettings {
  cafeName: string
  businessName: string
  address: string
  phone: string
  gstin: string
  upiId: string
  openingTime: string
  closingTime: string
  taxRate: number
  tableCount: number
  enableOnlineOrders: boolean
  allowTableReservation: boolean
  printReceipts: boolean
  autoAssignTables: boolean
  currencySymbol: "₹" | "$" | "€"
  currencyRateUSD: number // 1 USD to INR conversion rate
  currencyRateEUR: number // 1 EUR to INR conversion rate
  theme: "light" | "dark" | "system"
}

export interface DailyRevenue {
  date: string
  revenue: number
  orders: number
}

export interface CategorySales {
  category: string
  sales: number
  percentage: number
}

export interface PopularItem {
  name: string
  quantity: number
  revenue: number
}

export interface Analytics {
  dailyRevenue: DailyRevenue[]
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  categorySales: CategorySales[]
  popularItems: PopularItem[]
  profitMargin: number // Estimated profit percentage
  updatedAt: Date
}

export interface Table {
  id: number
  number: number
  capacity: number
  status: "available" | "occupied" | "reserved"
  currentOrderId?: string
}

// Inventory item interface
export interface InventoryItem {
  id: number
  name: string
  quantity: number
  unit: string
  minStockLevel: number
  price: number
  supplier: string
  category: string
  lastRestocked?: Date
}

interface StoreState {
  // User authentication
  user: User | null
  login: (email: string, password: string, role?: "admin" | "manager" | "cashier" | "waiter") => boolean
  logout: () => void
  updateUserSettings: (settings: Partial<User>) => void

  // Cafe settings
  cafeSettings: CafeSettings
  updateCafeSettings: (settings: Partial<CafeSettings>) => void
  
  // Analytics & Reporting
  analytics: Analytics
  updateAnalytics: () => void
  
  // Inventory management
  inventory: InventoryItem[]
  updateInventoryFromOrder: (orderId: string) => void
  updateInventoryItem: (itemId: number, changes: Partial<InventoryItem>) => void

  // Tables
  tables: Table[]
  updateTableStatus: (tableId: number, status: Table["status"], orderId?: string) => void
  assignTable: (orderId: string, tableId: number) => void

  // Orders
  orders: Order[]
  orderCounter: number
  addOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => string
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order["paymentStatus"], paymentMethod?: string) => void
  updateOrder: (order: Order) => void

  // Staff
  staff: Staff[]
  addStaff: (staffData: Omit<Staff, "id">) => void
  updateStaffStatus: (staffId: string, status: Staff["status"]) => void
  updateStaffShift: (staffId: string, shiftStart: string, shiftEnd: string) => void

  // Menu items
  menuItems: Array<{
    id: number
    name: string
    price: number
    category: string
    available: boolean
    image?: string
  }>
  
  // Menu management functions
  addMenuItem: (item: Omit<StoreState['menuItems'][0], 'id'>) => void
  updateMenuItem: (id: number, updates: Partial<StoreState['menuItems'][0]>) => void
  deleteMenuItem: (id: number) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User authentication
      user: {
        id: "user-001",
        name: "Rajesh Kumar",
        email: "admin@cafebliss.com",
        role: "admin",
        avatar: "/avatar-admin.jpg"
      },
      
      // Analytics data
      analytics: {
        dailyRevenue: [
          { date: "Mon", revenue: 1247, orders: 28 },
          { date: "Tue", revenue: 1456, orders: 32 },
          { date: "Wed", revenue: 1123, orders: 25 },
          { date: "Thu", revenue: 1789, orders: 38 },
          { date: "Fri", revenue: 2134, orders: 45 },
          { date: "Sat", revenue: 2456, orders: 52 },
          { date: "Sun", revenue: 1845, orders: 41 }
        ],
        totalRevenue: 12050,
        totalOrders: 261,
        averageOrderValue: 46.17,
        categorySales: [
          { category: "Hot Beverages", sales: 3254, percentage: 27 },
          { category: "Cold Beverages", sales: 2456, percentage: 20 },
          { category: "Snacks", sales: 2134, percentage: 18 },
          { category: "Main Course", sales: 1845, percentage: 15 },
          { category: "Desserts", sales: 1544, percentage: 13 },
          { category: "Others", sales: 817, percentage: 7 }
        ],
        popularItems: [
          { name: "Masala Chai", quantity: 156, revenue: 9360 },
          { name: "Cold Coffee", quantity: 98, revenue: 15680 },
          { name: "Paneer Butter Masala", quantity: 45, revenue: 14400 },
          { name: "Samosa", quantity: 89, revenue: 8900 },
          { name: "Butter Naan", quantity: 76, revenue: 4560 }
        ],
        profitMargin: 60,
        updatedAt: new Date()
      },
      login: (email, password, role) => {
        // In a real app, this would validate against a server
        if (email && password) {
          // Predefined users for testing RBAC
          let userData = {
            id: "user-001",
            name: "Default User",
            email,
            role: role || "admin" as const,
          };

          // Set specific user data based on email for demo purposes
          if (email === "admin@cafe.com") {
            userData = { id: "admin-001", name: "Admin Kumar", email, role: "admin" };
          } else if (email === "manager@cafe.com") {
            userData = { id: "mgr-001", name: "Manager Sharma", email, role: "manager" };
          } else if (email === "cashier@cafe.com") {
            userData = { id: "cash-001", name: "Cashier Patel", email, role: "cashier" };
          } else if (email === "waiter@cafe.com") {
            userData = { id: "wait-001", name: "Waiter Singh", email, role: "waiter" };
          } else if (role) {
            // Use provided role if email doesn't match predefined users
            userData.role = role;
            userData.name = `${role.charAt(0).toUpperCase() + role.slice(1)} User`;
          }

          set({ user: userData });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      updateUserSettings: (settings) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...settings } });
        }
      },
      
      // Cafe settings
      cafeSettings: {
        cafeName: "Cafe Bliss",
        businessName: "Bliss Foods Pvt. Ltd.",
        address: "123 Coffee Lane, Mumbai, Maharashtra",
        phone: "+91 98765 43210",
        gstin: "27AADCB2230M1Z3", // GSTIN for Maharashtra
        upiId: "cafebliss@ybl",
        openingTime: "08:00",
        closingTime: "22:00",
        taxRate: 5, // GST percentage
        tableCount: 15,
        enableOnlineOrders: true,
        allowTableReservation: true,
        printReceipts: true,
        autoAssignTables: false,
        currencySymbol: "₹",
        currencyRateUSD: 88.79, // 1 USD equals 88.79 INR
        currencyRateEUR: 103.39, // 1 EUR equals 103.39 INR
        theme: "light"
      },
      updateCafeSettings: (settings) => {
        set({ cafeSettings: { ...get().cafeSettings, ...settings } });
        
        // If the currency symbol is being updated, broadcast an event so components can react
        if (settings.currencySymbol) {
          // Use a custom event to notify components
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('currencyChanged', { 
              detail: { currencySymbol: settings.currencySymbol } 
            }));
          }
        }
      },
      
      // Tables
      tables: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        number: i + 1,
        capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
        status: i < 5 ? "occupied" : i < 6 ? "reserved" : "available"
      })),
      updateTableStatus: (tableId, status, orderId) => {
        set({
          tables: get().tables.map(table => 
            table.id === tableId ? { ...table, status, currentOrderId: orderId } : table
          )
        });
      },
      assignTable: (orderId, tableId) => {
        set({
          tables: get().tables.map(table => 
            table.id === tableId ? { ...table, status: "occupied", currentOrderId: orderId } : table
          ),
          orders: get().orders.map(order => 
            order.id === orderId ? { ...order, tableNumber: tableId } : order
          )
        });
      },
      
      // Initial orders data
      orders: [
        {
          id: "ORD-001",
          orderNumber: "001",
          customerName: "Aditya Sharma",
          customerPhone: "+91 98765 43211",
          orderType: "dine-in",
          tableNumber: 5,
          status: "preparing",
          items: [
            { id: 1, name: "Masala Chai", quantity: 2, price: 120, category: "Hot Beverages" },
            { id: 6, name: "Samosa Platter", quantity: 1, price: 180, category: "Snacks" },
          ],
          subtotal: 420,
          taxAmount: 21,
          totalAmount: 441,
          paymentStatus: "paid",
          paymentMethod: "upi",
          createdAt: new Date(Date.now() - 20 * 60 * 1000),
          notes: "Extra masala in chai, mint chutney on the side",
        },
        {
          id: "ORD-002",
          orderNumber: "002",
          customerName: "Priyanka Gupta",
          customerPhone: "+91 87654 32109",
          orderType: "takeaway",
          tableNumber: null,
          status: "ready",
          items: [
            { id: 2, name: "Cold Coffee", quantity: 2, price: 160, category: "Cold Beverages" },
            { id: 8, name: "Paneer Tikka Sandwich", quantity: 1, price: 220, category: "Sandwiches" },
          ],
          subtotal: 540,
          taxAmount: 27,
          totalAmount: 567,
          paymentStatus: "paid",
          paymentMethod: "cash",
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
          notes: "Extra cheese in sandwich",
        },
        {
          id: "ORD-003",
          orderNumber: "003",
          customerName: "Rahul Verma",
          customerPhone: "+91 76543 21098",
          orderType: "dine-in",
          tableNumber: 3,
          status: "pending",
          items: [
            { id: 3, name: "Butter Chicken", quantity: 1, price: 350, category: "Main Course" },
            { id: 4, name: "Garlic Naan", quantity: 2, price: 60, category: "Breads" },
            { id: 5, name: "Mango Lassi", quantity: 2, price: 120, category: "Beverages" },
          ],
          subtotal: 710,
          taxAmount: 35.5,
          totalAmount: 745.5,
          paymentStatus: "pending",
          paymentMethod: null,
          createdAt: new Date(Date.now() - 10 * 60 * 1000),
          notes: "Medium spicy",
        },
        {
          id: "ORD-004",
          orderNumber: "004",
          customerName: "Nisha Patel",
          customerPhone: "+91 65432 10987",
          orderType: "online",
          tableNumber: null,
          status: "preparing",
          items: [
            { id: 6, name: "Chocolate Truffle Pastry", quantity: 2, price: 160, category: "Desserts" },
            { id: 7, name: "Filter Coffee", quantity: 2, price: 120, category: "Hot Beverages" },
          ],
          subtotal: 560,
          taxAmount: 28,
          totalAmount: 588,
          paymentStatus: "paid",
          paymentMethod: "upi",
          createdAt: new Date(Date.now() - 25 * 60 * 1000),
          notes: "Deliver by 5:30 PM",
          isOnline: true,
        },
        {
          id: "ORD-005",
          orderNumber: "005",
          customerName: "Suresh Kumar",
          customerPhone: "+91 95432 10987",
          orderType: "dine-in",
          tableNumber: 8,
          status: "completed",
          items: [
            { id: 8, name: "Masala Dosa", quantity: 1, price: 160, category: "South Indian" },
            { id: 9, name: "Idli Sambar", quantity: 1, price: 120, category: "South Indian" },
            { id: 10, name: "Filter Coffee", quantity: 2, price: 120, category: "Hot Beverages" },
          ],
          subtotal: 520,
          taxAmount: 26,
          totalAmount: 546,
          paymentStatus: "paid",
          paymentMethod: "card",
          createdAt: new Date(Date.now() - 90 * 60 * 1000),
          completedAt: new Date(Date.now() - 45 * 60 * 1000),
          notes: "",
        },
      ],
      orderCounter: 6,

      // Staff data
      staff: [
        {
          id: "STAFF-001",
          name: "Priya Sharma",
          role: "Manager",
          email: "priya@cafebliss.com",
          phone: "+91 98765 43210",
          status: "active",
          shiftStart: "08:00",
          shiftEnd: "16:00",
          hoursWorked: 8,
          avatar: "/avatar-manager.jpg",
          salary: 35000,
          joiningDate: "2022-05-15",
          address: "456 Park Avenue, Mumbai",
          position: "Cafe Manager",
        },
        {
          id: "STAFF-002",
          name: "Raj Kapoor",
          role: "Chef",
          email: "raj@cafebliss.com",
          phone: "+91 87654 32109",
          status: "active",
          shiftStart: "09:00",
          shiftEnd: "17:00",
          hoursWorked: 7.5,
          avatar: "/avatar-chef.jpg",
          salary: 28000,
          joiningDate: "2022-06-10",
          address: "789 Cuisine Lane, Mumbai",
          position: "Head Chef",
        },
        {
          id: "STAFF-003",
          name: "Ananya Desai",
          role: "Server",
          email: "ananya@cafebliss.com",
          phone: "+91 76543 21098",
          status: "on-break",
          shiftStart: "10:00",
          shiftEnd: "18:00",
          hoursWorked: 4,
          avatar: "/avatar-server.jpg",
        },
        {
          id: "STAFF-004",
          name: "Vikram Singh",
          role: "Barista",
          email: "vikram@cafebliss.com",
          phone: "+91 65432 10987",
          status: "active",
          shiftStart: "07:00",
          shiftEnd: "15:00",
          hoursWorked: 7,
          avatar: "/avatar-barista.jpg",
        },
        {
          id: "STAFF-005",
          name: "Neha Gupta",
          role: "Cashier",
          email: "neha@cafebliss.com",
          phone: "+91 54321 09876",
          status: "inactive",
          shiftStart: "12:00",
          shiftEnd: "20:00",
          hoursWorked: 0,
          avatar: "/avatar-cashier.jpg",
        },
      ],

      // Menu items - with Indian pricing and dishes (₹100-700 range)
      menuItems: [
        // Hot Beverages
        { id: 1, name: "Masala Chai", price: 120, category: "Hot Beverages", available: true, image: "/masala-chai.jpg" },
        { id: 2, name: "Filter Coffee", price: 140, category: "Hot Beverages", available: true, image: "/filter-coffee.jpg" },
        { id: 3, name: "Hot Chocolate", price: 180, category: "Hot Beverages", available: true, image: "/hot-chocolate.jpg" },
        { id: 4, name: "Ginger Tea", price: 130, category: "Hot Beverages", available: true, image: "/ginger-tea.jpg" },
        { id: 5, name: "Cardamom Coffee", price: 150, category: "Hot Beverages", available: true, image: "/cardamom-coffee.jpg" },
        
        // Cold Beverages
        { id: 6, name: "Cold Coffee", price: 160, category: "Cold Beverages", available: true, image: "/cold-coffee.jpg" },
        { id: 7, name: "Mango Lassi", price: 140, category: "Cold Beverages", available: true, image: "/mango-lassi.jpg" },
        { id: 8, name: "Fresh Lime Soda", price: 120, category: "Cold Beverages", available: true, image: "/lime-soda.jpg" },
        { id: 9, name: "Watermelon Juice", price: 130, category: "Cold Beverages", available: true, image: "/watermelon-juice.jpg" },
        { id: 10, name: "Strawberry Milkshake", price: 170, category: "Cold Beverages", available: true, image: "/strawberry-milkshake.jpg" },
        
        // Snacks
        { id: 11, name: "Samosa (2 pcs)", price: 100, category: "Snacks", available: true, image: "/samosa.jpg" },
        { id: 12, name: "Vada Pav", price: 120, category: "Snacks", available: true, image: "/vada-pav.jpg" },
        { id: 13, name: "Paneer Tikka", price: 280, category: "Snacks", available: true, image: "/paneer-tikka.jpg" },
        { id: 14, name: "Aloo Tikki Chaat", price: 150, category: "Snacks", available: true, image: "/aloo-tikki.jpg" },
        { id: 15, name: "Vegetable Pakora", price: 160, category: "Snacks", available: true, image: "/veg-pakora.jpg" },
        
        // Sandwiches
        { id: 16, name: "Veg Grilled Sandwich", price: 180, category: "Sandwiches", available: true, image: "/veg-sandwich.jpg" },
        { id: 17, name: "Paneer Tikka Sandwich", price: 220, category: "Sandwiches", available: true, image: "/paneer-sandwich.jpg" },
        { id: 18, name: "Mumbai Sandwich", price: 190, category: "Sandwiches", available: true, image: "/mumbai-sandwich.jpg" },
        { id: 19, name: "Cheese Chilli Toast", price: 200, category: "Sandwiches", available: true, image: "/cheese-toast.jpg" },
        
        // South Indian
        { id: 20, name: "Masala Dosa", price: 220, category: "South Indian", available: true, image: "/masala-dosa.jpg" },
        { id: 21, name: "Idli Sambar", price: 160, category: "South Indian", available: true, image: "/idli-sambar.jpg" },
        { id: 22, name: "Medu Vada", price: 150, category: "South Indian", available: true, image: "/medu-vada.jpg" },
        { id: 23, name: "Uttapam", price: 200, category: "South Indian", available: true, image: "/uttapam.jpg" },
        
        // Main Course
        { id: 24, name: "Paneer Butter Masala", price: 320, category: "Main Course", available: true, image: "/paneer-butter-masala.jpg" },
        { id: 25, name: "Dal Makhani", price: 270, category: "Main Course", available: true, image: "/dal-makhani.jpg" },
        { id: 26, name: "Butter Chicken", price: 350, category: "Main Course", available: true, image: "/butter-chicken.jpg" },
        { id: 27, name: "Veg Biryani", price: 280, category: "Main Course", available: true, image: "/veg-biryani.jpg" },
        { id: 28, name: "Chicken Biryani", price: 320, category: "Main Course", available: true, image: "/chicken-biryani.jpg" },
        
        // Breads
        { id: 29, name: "Butter Naan", price: 60, category: "Breads", available: true, image: "/butter-naan.jpg" },
        { id: 30, name: "Garlic Naan", price: 70, category: "Breads", available: true, image: "/garlic-naan.jpg" },
        { id: 31, name: "Tandoori Roti", price: 50, category: "Breads", available: true, image: "/tandoori-roti.jpg" },
        
        // Desserts
        { id: 32, name: "Gulab Jamun (2 pcs)", price: 120, category: "Desserts", available: true, image: "/gulab-jamun.jpg" },
        { id: 33, name: "Chocolate Truffle Pastry", price: 160, category: "Desserts", available: true, image: "/chocolate-pastry.jpg" },
        { id: 34, name: "Rasgulla (2 pcs)", price: 130, category: "Desserts", available: true, image: "/rasgulla.jpg" },
        { id: 35, name: "Kulfi", price: 150, category: "Desserts", available: true, image: "/kulfi.jpg" },
      ],

      // Actions
      addOrder: (orderData) => {
        const state = get()
        const orderId = `ORD-${String(state.orderCounter + 1).padStart(3, "0")}`;
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          orderNumber: String(state.orderCounter + 1).padStart(3, "0"),
          createdAt: new Date(),
        }

        set({
          orders: [newOrder, ...state.orders],
          orderCounter: state.orderCounter + 1,
        })
        
        return orderId;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  completedAt: status === "completed" ? new Date() : order.completedAt,
                }
              : order,
          ),
        }))
      },

      updateOrderPaymentStatus: (orderId, paymentStatus, paymentMethod) => {
        set((state) => {
          const updatedOrders = state.orders.map((order) =>
            order.id === orderId
              ? { 
                  ...order, 
                  paymentStatus, 
                  paymentMethod: paymentMethod || order.paymentMethod,
                  updatedAt: new Date()
                }
              : order,
          );
          
          // If order is being marked as paid, update analytics
          const order = state.orders.find(o => o.id === orderId);
          if (order && paymentStatus === 'paid') {
            // Call updateAnalytics in the next tick to ensure the order is updated first
            setTimeout(() => {
              get().updateAnalytics();
              // Also update inventory if it's a new payment
              if (order.paymentStatus !== 'paid') {
                get().updateInventoryFromOrder(orderId);
              }
            }, 0);
          }
          
          return { orders: updatedOrders };
        })
      },
      
      // Update analytics based on completed orders
      updateAnalytics: () => {
        const state = get();
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Calculate total revenue from paid orders
        const paidOrders = state.orders.filter(order => order.paymentStatus === 'paid');
        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = paidOrders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Calculate today's revenue
        const todaysOrders = paidOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.setHours(0,0,0,0) === today.setHours(0,0,0,0);
        });
        const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Update daily revenue for today
        const dailyRevenue = [...state.analytics.dailyRevenue];
        const todayIndex = dailyRevenue.findIndex(day => day.date === todayStr);
        
        if (todayIndex >= 0) {
          dailyRevenue[todayIndex] = {
            date: todayStr,
            revenue: todaysRevenue,
            orders: todaysOrders.length
          };
        }
        
        // Calculate category sales
        const categorySalesMap = new Map<string, number>();
        paidOrders.forEach(order => {
          order.items.forEach(item => {
            const currentSales = categorySalesMap.get(item.category) || 0;
            categorySalesMap.set(item.category, currentSales + (item.price * item.quantity));
          });
        });
        
        // Convert to array and calculate percentages
        const categorySales: CategorySales[] = [];
        const totalSales = Array.from(categorySalesMap.values()).reduce((sum, value) => sum + value, 0);
        
        categorySalesMap.forEach((sales, category) => {
          categorySales.push({
            category,
            sales,
            percentage: Math.round((sales / totalSales) * 100) || 0
          });
        });
        
        // Sort by sales descending
        categorySales.sort((a, b) => b.sales - a.sales);
        
        // Calculate popular items
        const itemSalesMap = new Map<string, { quantity: number; revenue: number }>();
        paidOrders.forEach(order => {
          order.items.forEach(item => {
            const current = itemSalesMap.get(item.name) || { quantity: 0, revenue: 0 };
            itemSalesMap.set(item.name, {
              quantity: current.quantity + item.quantity,
              revenue: current.revenue + (item.price * item.quantity)
            });
          });
        });
        
        const popularItems: PopularItem[] = [];
        itemSalesMap.forEach((data, name) => {
          popularItems.push({ name, ...data });
        });
        
        // Sort by quantity sold
        popularItems.sort((a, b) => b.quantity - a.quantity);
        
        // Calculate estimated profit margin (assuming 60% profit margin)
        const profitMargin = 60; // This could be configurable in settings
        
        // Update analytics
        set({
          analytics: {
            dailyRevenue,
            totalRevenue,
            totalOrders,
            averageOrderValue,
            categorySales,
            popularItems: popularItems.slice(0, 10), // Top 10 items
            profitMargin,
            updatedAt: new Date()
          }
        });
      },
      
      updateOrder: (updatedOrder) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          ),
        }))
      },

      addStaff: (staffData) => {
        const newStaff: Staff = {
          ...staffData,
          id: `STAFF-${String(Date.now()).slice(-3)}`,
        }
        set((state) => ({
          staff: [...state.staff, newStaff],
        }))
      },

      updateStaffStatus: (staffId, status) => {
        set((state) => ({
          staff: state.staff.map((member) => (member.id === staffId ? { ...member, status } : member)),
        }))
      },

      updateStaffShift: (staffId, shiftStart, shiftEnd) => {
        set((state) => ({
          staff: state.staff.map((member) => (member.id === staffId ? { ...member, shiftStart, shiftEnd } : member)),
        }))
      },
      
      // Inventory data
      inventory: [
        {
          id: 1,
          name: "Coffee Beans (Arabica)",
          quantity: 25,
          unit: "kg",
          minStockLevel: 5,
          price: 800,
          supplier: "Coffee Estates Ltd.",
          category: "Raw Materials"
        },
        {
          id: 2,
          name: "Milk",
          quantity: 50,
          unit: "liters",
          minStockLevel: 10,
          price: 60,
          supplier: "Local Dairy Farm",
          category: "Dairy"
        },
        {
          id: 3,
          name: "Sugar",
          quantity: 30,
          unit: "kg",
          minStockLevel: 5,
          price: 45,
          supplier: "Sweet Supplies Inc.",
          category: "Dry Goods"
        },
        {
          id: 4,
          name: "Tea Leaves",
          quantity: 15,
          unit: "kg",
          minStockLevel: 3,
          price: 600,
          supplier: "Tea Traders",
          category: "Raw Materials"
        },
        {
          id: 5,
          name: "Chocolate Syrup",
          quantity: 12,
          unit: "bottles",
          minStockLevel: 3,
          price: 180,
          supplier: "Sweet Supplies Inc.",
          category: "Syrups"
        }
      ],
      
      // Update inventory based on order
      updateInventoryFromOrder: (orderId) => {
        const state = get();
        const order = state.orders.find(o => o.id === orderId);
        
        if (!order) return;
        
        // Simple simulation of inventory reduction
        // In a real app, this would map menu items to inventory items with recipes
        set((state) => {
          const updatedInventory = [...state.inventory];
          
          // Reduce coffee beans for coffee items
          if (order.items.some(item => 
            item.name.toLowerCase().includes('coffee') || 
            item.name.toLowerCase().includes('espresso') || 
            item.name.toLowerCase().includes('latte')
          )) {
            const coffeeBeansIndex = updatedInventory.findIndex(i => i.name.includes("Coffee Beans"));
            if (coffeeBeansIndex !== -1) {
              updatedInventory[coffeeBeansIndex] = {
                ...updatedInventory[coffeeBeansIndex],
                quantity: Math.max(0, updatedInventory[coffeeBeansIndex].quantity - 0.5)
              };
            }
          }
          
          // Reduce milk for items that use milk
          if (order.items.some(item => 
            item.name.toLowerCase().includes('milk') || 
            item.name.toLowerCase().includes('latte') || 
            item.name.toLowerCase().includes('cappuccino')
          )) {
            const milkIndex = updatedInventory.findIndex(i => i.name === "Milk");
            if (milkIndex !== -1) {
              updatedInventory[milkIndex] = {
                ...updatedInventory[milkIndex],
                quantity: Math.max(0, updatedInventory[milkIndex].quantity - 0.3 * order.items.length)
              };
            }
          }
          
          // Reduce tea for tea items
          if (order.items.some(item => item.name.toLowerCase().includes('tea'))) {
            const teaIndex = updatedInventory.findIndex(i => i.name === "Tea Leaves");
            if (teaIndex !== -1) {
              updatedInventory[teaIndex] = {
                ...updatedInventory[teaIndex],
                quantity: Math.max(0, updatedInventory[teaIndex].quantity - 0.2)
              };
            }
          }
          
          return { inventory: updatedInventory };
        });
      },
      
      // Update a specific inventory item
      updateInventoryItem: (itemId, changes) => {
        set((state) => ({
          inventory: state.inventory.map(item => 
            item.id === itemId ? { ...item, ...changes } : item
          )
        }));
      },
      
      // Menu management functions for real-time updates
      addMenuItem: (item) => {
        const newId = Math.max(...get().menuItems.map(i => i.id)) + 1;
        set((state) => ({
          menuItems: [...state.menuItems, { ...item, id: newId }]
        }));
      },
      
      updateMenuItem: (id, updates) => {
        set((state) => ({
          menuItems: state.menuItems.map(item => 
            item.id === id ? { ...item, ...updates } : item
          )
        }));
        
        // Update analytics when menu items change
        get().updateAnalytics();
      },
      
      deleteMenuItem: (id) => {
        set((state) => ({
          menuItems: state.menuItems.filter(item => item.id !== id)
        }));
        
        // Update analytics when menu items change
        get().updateAnalytics();
      },
    }),
    {
      name: "cafe-management-store",
    },
  ),
)
