"use client"

import { Edit2, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Boat {
  id: number
  name: string
  type: string
  capacity: number
  price: number
  location: string
  status: "available" | "rented" | "maintenance"
  bookings: number
  revenue: number
}

interface AdminBoatTableProps {
  boats: Boat[]
  onDelete: (id: number) => void
}

export default function AdminBoatTable({ boats, onDelete }: AdminBoatTableProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      available: "bg-green-100 text-green-800",
      rented: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
    }
    return styles[status as keyof typeof styles] || styles.available
  }

  const getStatusIcon = (status: string) => {
    if (status === "available") return <CheckCircle className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Boat Name</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Capacity</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Location</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Bookings</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {boats.map((boat) => (
            <tr key={boat.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{boat.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{boat.type}</td>
              <td className="py-3 px-4 text-muted-foreground">{boat.capacity} people</td>
              <td className="py-3 px-4 text-muted-foreground">{boat.location}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(boat.status)}`}
                >
                  {getStatusIcon(boat.status)}
                  {boat.status.charAt(0).toUpperCase() + boat.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground">{boat.bookings}</td>
              <td className="py-3 px-4 font-semibold text-foreground">${boat.revenue.toLocaleString()}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(boat.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
