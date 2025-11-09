"use client"

import { useState } from "react"
import { Anchor, CheckCircle, Clock, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import RentalTable from "@/components/rental-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useLogout } from "@/hooks/use-logout"

// Mock data
const mockRentals = [
  {
    id: 1,
    boatName: "Sunset Cruiser",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    startDate: "2025-01-15",
    endDate: "2025-01-18",
    guests: 6,
    totalPrice: 1350,
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: 2,
    boatName: "Speed Demon",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    guests: 4,
    totalPrice: 560,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: 3,
    boatName: "Family Getaway",
    customerName: "Mike Johnson",
    customerEmail: "mike@example.com",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    guests: 8,
    totalPrice: 700,
    status: "completed",
    paymentStatus: "paid",
  },
]

export default function RentalsPage() {
  const [rentals, setRentals] = useState(mockRentals)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [rentalToCancel, setRentalToCancel] = useState<number | null>(null)
  const { handleLogout } = useLogout()

  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch =
      rental.boatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || rental.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCompleteRental = (id: number) => {
    setRentals(rentals.map((r) => (r.id === id ? { ...r, status: "completed" } : r)))
  }

  const handleCancelRental = (id: number) => {
    setRentalToCancel(id)
    setCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    if (rentalToCancel !== null) {
      setRentals(rentals.filter((r) => r.id !== rentalToCancel))
      setRentalToCancel(null)
      setCancelDialogOpen(false)
    }
  }

  const stats = {
    activeRentals: rentals.filter((r) => r.status === "active").length,
    pendingRentals: rentals.filter((r) => r.status === "pending").length,
    completedRentals: rentals.filter((r) => r.status === "completed").length,
    totalRevenue: rentals.filter((r) => r.paymentStatus === "paid").reduce((sum, r) => sum + r.totalPrice, 0),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BoatFlow Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/admin")}>
              Boats
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/reservations")}>
              Reservations
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/profile")}>
              Profile
            </Button>
            <Button variant="ghost">Settings</Button>
            <Button variant="ghost" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Rentals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.activeRentals}</p>
                </div>
                <Clock className="w-12 h-12 text-accent opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Rentals</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pendingRentals}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-yellow-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.completedRentals}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">${stats.totalRevenue}</p>
                </div>
                <Download className="w-12 h-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rentals Management Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Active Rentals</CardTitle>
            <CardDescription>Manage ongoing and upcoming boat rentals</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Input
                placeholder="Search by boat name or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Table */}
            <RentalTable rentals={filteredRentals} onComplete={handleCompleteRental} onCancel={handleCancelRental} />
          </CardContent>
        </Card>
      </main>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this rental? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRentalToCancel(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Rental
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
