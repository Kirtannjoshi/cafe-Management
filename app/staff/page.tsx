"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { formatDate } from "@/lib/date-utils"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Plus, Clock, Phone, Mail, UserCheck, UserX, Coffee, CreditCard, Calendar } from "lucide-react"

export default function StaffPage() {
  const { staff, updateStaffStatus, updateStaffShift, addStaff, cafeSettings } = useStore()
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // Function to format currency based on the café settings
  const formatCurrency = (amount: number) => {
    const { currencySymbol, currencyRateUSD, currencyRateEUR } = cafeSettings
    
    let convertedAmount = amount
    if (currencySymbol === "$") {
      convertedAmount = amount / currencyRateUSD
    } else if (currencySymbol === "€") {
      convertedAmount = amount / currencyRateEUR
    }
    
    return `${currencySymbol}${convertedAmount.toFixed(2)}`
  }
  
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "active" as const,
    shiftStart: "",
    shiftEnd: "",
    hoursWorked: 0,
    salary: 0,
    joiningDate: "",
    address: "",
    position: ""
  })

  const statusColors = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    inactive: "bg-red-100 text-red-800 hover:bg-red-100",
    "on-break": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  }

  const statusIcons = {
    active: UserCheck,
    inactive: UserX,
    "on-break": Coffee,
  }

  const handleStatusChange = (staffId: string, newStatus: string) => {
    updateStaffStatus(staffId, newStatus as any)
  }

  const handleShiftUpdate = (staffId: string, shiftStart: string, shiftEnd: string) => {
    updateStaffShift(staffId, shiftStart, shiftEnd)
  }

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    addStaff(newStaff)
    setShowAddDialog(false)
    setNewStaff({
      name: "",
      role: "",
      email: "",
      phone: "",
      status: "active" as const,
      shiftStart: "",
      shiftEnd: "",
      hoursWorked: 0,
      salary: 0,
      joiningDate: "",
      address: "",
      position: ""
    })
  }

  const activeStaff = staff.filter((s) => s.status === "active").length
  const onBreakStaff = staff.filter((s) => s.status === "on-break").length
  const inactiveStaff = staff.filter((s) => s.status === "inactive").length

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Management</h1>
              <p className="text-muted-foreground mt-2">Manage staff schedules and status</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddStaff} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newStaff.role}
                        onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Barista">Barista</SelectItem>
                          <SelectItem value="Server">Server</SelectItem>
                          <SelectItem value="Kitchen Staff">Kitchen Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shift-start">Shift Start</Label>
                      <Input
                        id="shift-start"
                        type="time"
                        value={newStaff.shiftStart}
                        onChange={(e) => setNewStaff({ ...newStaff, shiftStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift-end">Shift End</Label>
                      <Input
                        id="shift-end"
                        type="time"
                        value={newStaff.shiftEnd}
                        onChange={(e) => setNewStaff({ ...newStaff, shiftEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Monthly Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder="Enter monthly salary"
                        value={newStaff.salary || ''}
                        onChange={(e) => setNewStaff({ ...newStaff, salary: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joining-date">Joining Date</Label>
                      <Input
                        id="joining-date"
                        type="date"
                        value={newStaff.joiningDate}
                        onChange={(e) => setNewStaff({ ...newStaff, joiningDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Staff address"
                      value={newStaff.address}
                      onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title</Label>
                    <Input
                      id="position"
                      placeholder="Position or job title"
                      value={newStaff.position}
                      onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Add Staff Member
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activeStaff}</p>
                    <p className="text-sm text-muted-foreground">Active Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Coffee className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{onBreakStaff}</p>
                    <p className="text-sm text-muted-foreground">On Break</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <UserX className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{inactiveStaff}</p>
                    <p className="text-sm text-muted-foreground">Inactive</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{staff.length}</p>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => {
              const StatusIcon = statusIcons[member.status]
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="secondary" className={statusColors[member.status]}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {member.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{member.phone}</span>
                      </div>
                      {member.shiftStart && member.shiftEnd && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {member.shiftStart} - {member.shiftEnd}
                          </span>
                        </div>
                      )}
                      
                      {/* Show salary information only to admin or manager users */}
                      {(useStore.getState().user?.role === "admin" || useStore.getState().user?.role === "manager") && member.salary && (
                        <div className="flex items-center gap-2 text-sm mt-2">
                          <CreditCard className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            Salary: {formatCurrency(member.salary)}/month
                          </span>
                        </div>
                      )}
                      
                      {member.joiningDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground">
                            Joined: {formatDate(member.joiningDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Status</Label>
                      <Select value={member.status} onValueChange={(value) => handleStatusChange(member.id, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="on-break">On Break</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Shift Start</Label>
                        <Input
                          type="time"
                          value={member.shiftStart || ""}
                          onChange={(e) => handleShiftUpdate(member.id, e.target.value, member.shiftEnd || "")}
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Shift End</Label>
                        <Input
                          type="time"
                          value={member.shiftEnd || ""}
                          onChange={(e) => handleShiftUpdate(member.id, member.shiftStart || "", e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
