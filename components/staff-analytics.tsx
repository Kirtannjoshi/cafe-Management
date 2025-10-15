"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, Clock, Star, TrendingUp } from "lucide-react"

interface StaffAnalyticsProps {
  dateRange: string
}

// Sample staff analytics data
const staffPerformanceData = [
  { name: "Jane Manager", ordersProcessed: 156, avgOrderTime: 4.2, customerRating: 4.9, hoursWorked: 40 },
  { name: "John Barista", ordersProcessed: 234, avgOrderTime: 3.8, customerRating: 4.7, hoursWorked: 38 },
  { name: "Sarah Wilson", ordersProcessed: 189, avgOrderTime: 4.5, customerRating: 4.8, hoursWorked: 35 },
  { name: "Mike Chen", ordersProcessed: 167, avgOrderTime: 4.1, customerRating: 4.6, hoursWorked: 32 },
  { name: "Lisa Garcia", ordersProcessed: 145, avgOrderTime: 4.7, customerRating: 4.9, hoursWorked: 30 },
]

const hourlyProductivityData = [
  { hour: "6AM", orders: 12, efficiency: 85 },
  { hour: "7AM", orders: 28, efficiency: 92 },
  { hour: "8AM", orders: 45, efficiency: 88 },
  { hour: "9AM", orders: 38, efficiency: 90 },
  { hour: "10AM", orders: 52, efficiency: 87 },
  { hour: "11AM", orders: 48, efficiency: 91 },
  { hour: "12PM", orders: 65, efficiency: 85 },
  { hour: "1PM", orders: 58, efficiency: 89 },
  { hour: "2PM", orders: 42, efficiency: 93 },
  { hour: "3PM", orders: 35, efficiency: 88 },
  { hour: "4PM", orders: 28, efficiency: 90 },
  { hour: "5PM", orders: 22, efficiency: 87 },
]

const weeklyScheduleData = [
  { day: "Mon", scheduled: 8, actual: 7.5, overtime: 0 },
  { day: "Tue", scheduled: 8, actual: 8.2, overtime: 0.2 },
  { day: "Wed", scheduled: 8, actual: 7.8, overtime: 0 },
  { day: "Thu", scheduled: 8, actual: 8.5, overtime: 0.5 },
  { day: "Fri", scheduled: 8, actual: 9.1, overtime: 1.1 },
  { day: "Sat", scheduled: 8, actual: 8.8, overtime: 0.8 },
  { day: "Sun", scheduled: 6, actual: 6.2, overtime: 0.2 },
]

export function StaffAnalytics({ dateRange }: StaffAnalyticsProps) {
  const totalStaff = staffPerformanceData.length
  const avgRating = (staffPerformanceData.reduce((sum, staff) => sum + staff.customerRating, 0) / totalStaff).toFixed(1)
  const totalOrders = staffPerformanceData.reduce((sum, staff) => sum + staff.ordersProcessed, 0)
  const avgOrderTime = (staffPerformanceData.reduce((sum, staff) => sum + staff.avgOrderTime, 0) / totalStaff).toFixed(
    1,
  )

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalStaff}</p>
                <p className="text-sm text-muted-foreground">Active Staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                <p className="text-sm text-muted-foreground">Orders Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{avgOrderTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Order Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hourly Productivity</CardTitle>
            <CardDescription>Orders processed and efficiency by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourlyProductivityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="#059669" strokeWidth={3} name="Orders" />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule vs Actual</CardTitle>
            <CardDescription>Scheduled hours vs actual hours worked</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyScheduleData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="scheduled" fill="#10b981" name="Scheduled" />
                <Bar dataKey="actual" fill="#059669" name="Actual" />
                <Bar dataKey="overtime" fill="#ef4444" name="Overtime" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Performance Overview</CardTitle>
          <CardDescription>Individual performance metrics for all staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffPerformanceData.map((staff, index) => (
              <div key={staff.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{staff.name}</p>
                    <p className="text-sm text-muted-foreground">{staff.hoursWorked} hours this week</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{staff.ordersProcessed}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-foreground">{staff.avgOrderTime}m</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <p className="text-lg font-semibold text-foreground">{staff.customerRating}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
