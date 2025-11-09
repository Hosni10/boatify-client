"use client"

import { CheckCircle, Clock, AlertCircle, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Rental {
  id: number
  boatName: string
  customerName: string
  customerEmail: string
  startDate: string
  endDate: string
  guests: number
  totalPrice: number
  status: "pending" | "active" | "completed"
  paymentStatus: "pending" | "paid"
}

interface RentalTableProps {
  rentals: Rental[]
  onComplete: (id: number) => void
  onCancel: (id: number) => void
}

export default function RentalTable({ rentals, onComplete, onCancel }: RentalTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4 text-accent" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      active: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getPaymentBadge = (status: string) => {
    return status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Boat</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Dates</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Guests</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Price</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Payment</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium text-foreground">{rental.boatName}</td>
              <td className="py-3 px-4">
                <div>
                  <p className="text-foreground font-medium">{rental.customerName}</p>
                  <p className="text-sm text-muted-foreground">{rental.customerEmail}</p>
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-sm">
                {rental.startDate} to {rental.endDate}
              </td>
              <td className="py-3 px-4 text-muted-foreground">{rental.guests}</td>
              <td className="py-3 px-4 font-semibold text-foreground">${rental.totalPrice}</td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(rental.status)}`}
                >
                  {getStatusIcon(rental.status)}
                  {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadge(rental.paymentStatus)}`}
                >
                  {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  {rental.status !== "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:bg-green-100"
                      onClick={() => onComplete(rental.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => onCancel(rental.id)}
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
