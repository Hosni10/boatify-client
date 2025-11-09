"use client"

import { useState } from "react"
import { Plus, Anchor, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminBoatTable from "@/components/admin-boat-table"
import AddBoatModal from "@/components/add-boat-modal"

// Mock data
const mockBoats = [
  {
    id: 1,
    name: "Sunset Cruiser",
    type: "Luxury Yacht",
    capacity: 12,
    price: 450,
    location: "Marina Bay",
    status: "available",
    bookings: 24,
    revenue: 10800,
  },
  {
    id: 2,
    name: "Speed Demon",
    type: "Speed Boat",
    capacity: 6,
    price: 280,
    location: "Harbor Point",
    status: "available",
    bookings: 18,
    revenue: 5040,
  },
  {
    id: 3,
    name: "Family Getaway",
    type: "Cabin Cruiser",
    capacity: 8,
    price: 350,
    location: "Coastal Dock",
    status: "rented",
    bookings: 31,
    revenue: 10850,
  },
  {
    id: 4,
    name: "Adventure Explorer",
    type: "Fishing Boat",
    capacity: 10,
    price: 320,
    location: "Marina Bay",
    status: "available",
    bookings: 15,
    revenue: 4800,
  },
]

const mockStats = [
  {
    label: "Total Boats",
    value: "10",
    icon: Anchor,
    color: "text-primary",
  },
  {
    label: "Active Rentals",
    value: "3",
    icon: Calendar,
    color: "text-accent",
  },
  {
    label: "Monthly Revenue",
    value: "$31,490",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    label: "Utilization Rate",
    value: "78%",
    icon: TrendingUp,
    color: "text-blue-500",
  },
]

export default function AdminPage() {
  const [boats, setBoats] = useState(mockBoats)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBoats = boats.filter(
    (boat) =>
      boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteBoat = (id: number) => {
    if (confirm("Are you sure you want to delete this boat?")) {
      setBoats(boats.filter((boat) => boat.id !== id))
    }
  }

  const handleAddBoat = (newBoat: any) => {
    setBoats([...boats, { ...newBoat, id: Math.max(...boats.map((b) => b.id), 0) + 1 }])
    setShowAddModal(false)
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
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/reservations")}>
              Reservations
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/admin/rentals")}>
              Rentals
            </Button>
            <Button variant="ghost">Settings</Button>
            <Button variant="ghost">Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockStats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={idx} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Boats Management Section */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl">Fleet Management</CardTitle>
              <CardDescription>Manage your boat inventory and availability</CardDescription>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Boat
            </Button>
          </CardHeader>

          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search by boat name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border"
              />
            </div>

            {/* Table */}
            <AdminBoatTable boats={filteredBoats} onDelete={handleDeleteBoat} />
          </CardContent>
        </Card>
      </main>

      {/* Add Boat Modal */}
      {showAddModal && <AddBoatModal onClose={() => setShowAddModal(false)} onAdd={handleAddBoat} />}
    </div>
  )
}
