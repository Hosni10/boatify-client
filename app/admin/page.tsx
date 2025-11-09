"use client"

import { useState, useEffect } from "react"
import { Plus, Anchor, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminBoatTable from "@/components/admin-boat-table"
import AddBoatModal from "@/components/add-boat-modal"
import EditBoatModal from "@/components/edit-boat-modal"
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
import { useToast } from "@/hooks/use-toast"

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
  const [boats, setBoats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedBoat, setSelectedBoat] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [boatToDelete, setBoatToDelete] = useState<string | null>(null)
  const { handleLogout } = useLogout()
  const { toast } = useToast()

  useEffect(() => {
    fetchBoats()
  }, [])

  const fetchBoats = async () => {
    try {
      setIsLoading(true)
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to view boats",
        })
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/boats")
      const data = await response.json()

      if (data.success) {
        // Filter boats by companyId if needed
        const companyBoats = data.data.filter((boat: any) => boat.companyId === user.companyId)
        setBoats(companyBoats)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to fetch boats",
        })
      }
    } catch (error) {
      console.error("Error fetching boats:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch boats",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBoats = boats.filter(
    (boat) =>
      boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteBoat = (id: string | number) => {
    setBoatToDelete(String(id))
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (boatToDelete === null) return

    try {
      const response = await fetch(`/api/boats/${boatToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Boat deleted successfully",
        })
        setBoats(boats.filter((boat) => String(boat._id || boat.id) !== boatToDelete))
        setBoatToDelete(null)
        setDeleteDialogOpen(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to delete boat",
        })
      }
    } catch (error) {
      console.error("Error deleting boat:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete boat",
      })
    }
  }

  const handleAddBoat = async (newBoat: any) => {
    try {
      const userData = localStorage.getItem("user")
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to add boats",
        })
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/boats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBoat,
          companyId: user.companyId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Boat added successfully",
        })
        setBoats([...boats, data.data])
        setShowAddModal(false)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error || "Failed to add boat",
        })
      }
    } catch (error) {
      console.error("Error adding boat:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add boat",
      })
    }
  }

  const handleEditBoat = (boat: any) => {
    setSelectedBoat(boat)
    setShowEditModal(true)
  }

  const handleUpdateBoat = (updatedBoat: any) => {
    setBoats(boats.map((boat) => (String(boat._id || boat.id) === String(updatedBoat._id || updatedBoat.id) ? updatedBoat : boat)))
    setShowEditModal(false)
    setSelectedBoat(null)
    fetchBoats() // Refresh to get latest data
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
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading boats...</p>
              </div>
            ) : (
              <AdminBoatTable boats={filteredBoats} onDelete={handleDeleteBoat} onEdit={handleEditBoat} />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Boat Modal */}
      {showAddModal && <AddBoatModal onClose={() => setShowAddModal(false)} onAdd={handleAddBoat} />}

      {/* Edit Boat Modal */}
      {showEditModal && selectedBoat && (
        <EditBoatModal boat={selectedBoat} onClose={() => { setShowEditModal(false); setSelectedBoat(null) }} onUpdate={handleUpdateBoat} />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this boat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBoatToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
