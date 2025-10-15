import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, Users } from "lucide-react"

const staffSchedule = [
  {
    name: "Jane Manager",
    role: "Manager",
    shift: "8:00 AM - 6:00 PM",
    status: "active",
    initials: "JM",
  },
  {
    name: "John Barista",
    role: "Barista",
    shift: "6:00 AM - 2:00 PM",
    status: "active",
    initials: "JB",
  },
  {
    name: "Sarah Wilson",
    role: "Server",
    shift: "10:00 AM - 6:00 PM",
    status: "break",
    initials: "SW",
  },
  {
    name: "Mike Chen",
    role: "Barista",
    shift: "2:00 PM - 10:00 PM",
    status: "scheduled",
    initials: "MC",
  },
]

const statusColors = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  break: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
}

export function StaffSchedule() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <CardTitle className="text-base">Staff Schedule</CardTitle>
            <CardDescription>Today's team schedule</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffSchedule.map((staff) => (
          <div key={staff.name} className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs bg-muted">{staff.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{staff.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {staff.shift}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className={statusColors[staff.status as keyof typeof statusColors]}>
                {staff.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{staff.role}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
