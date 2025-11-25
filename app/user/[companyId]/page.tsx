"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Anchor, Search, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BoatCard from "@/components/boat-card"
import BookingModal from "@/components/booking-modal"
import { useToast } from "@/hooks/use-toast"
import type { Boat } from "@/lib/types"

export default function UserBoatsPage() {
  const params = useParams()
  const companyId = params.companyId as string
  const [boats, setBoats] = useState<Boat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCapacity, setFilterCapacity] = useState(0)
  const [filterType, setFilterType] = useState("")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (companyId) {
      fetchBoats()
    }
  }, [companyId])

  const fetchBoats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/boats")
      const data = await response.json()

      if (data.success) {
        // Filter boats by companyId and only show available boats
        const companyBoats = data.data.filter(
          (boat: Boat) => boat.companyId === companyId && boat.status === "available"
        )
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

  const filteredBoats = boats.filter((boat) => {
    const matchesSearch =
      boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCapacity = filterCapacity === 0 || boat.capacity >= filterCapacity
    const matchesType = filterType === "" || boat.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesCapacity && matchesType
  })

  const handleBookBoat = (boat: Boat) => {
    setSelectedBoat(boat)
    setShowBookingModal(true)
  }

  const handleBookingConfirm = async (bookingData: {
    startDate: string
    endDate: string
    guests: number
    fullName: string
    email: string
    phone: string
  }) => {
    if (!selectedBoat) return

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boatId: selectedBoat._id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: bookingData.guests,
          customerName: bookingData.fullName,
          customerEmail: bookingData.email,
          customerPhone: bookingData.phone,
          customerId: "", // Can be added if user is logged in
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Booking confirmed!",
          description: "Your booking has been successfully created. Check your email for details.",
        })
        setShowBookingModal(false)
        setSelectedBoat(null)
        // Optionally refresh boats to update availability
        fetchBoats()
      } else {
        toast({
          variant: "destructive",
          title: "Booking failed",
          description: data.error || "Failed to create booking. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while creating your booking. Please try again.",
      })
    }
  }

  // Get unique boat types for filter
  const boatTypes = Array.from(new Set(boats.map((boat) => boat.type)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Boatify</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => (window.location.href = "/")}>
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Available Boats</h1>
          <p className="text-lg text-muted-foreground">
            Browse our fleet and book your next adventure on the water
          </p>
        </div>

        {/* Search & Filter Section */}
        <Card className="mb-8 border-border">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </label>
                <Input
                  placeholder="Search by name, location, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Boat Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="">All types</option>
                  {boatTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Capacity</label>
                <select
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value={0}>Any capacity</option>
                  <option value={2}>2+ people</option>
                  <option value={4}>4+ people</option>
                  <option value={6}>6+ people</option>
                  <option value={8}>8+ people</option>
                  <option value={10}>10+ people</option>
                  <option value={15}>15+ people</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sort By</label>
                <select
                  onChange={(e) => {
                    const sortBy = e.target.value
                    const sorted = [...filteredBoats]
                    if (sortBy === "price-low") {
                      sorted.sort((a, b) => a.price - b.price)
                    } else if (sortBy === "price-high") {
                      sorted.sort((a, b) => b.price - a.price)
                    } else if (sortBy === "rating") {
                      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    }
                    setBoats(sorted)
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredBoats.length}</span>{" "}
            {filteredBoats.length === 1 ? "boat" : "boats"} available
          </p>
        </div>

        {/* Boats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading boats...</p>
            </div>
          ) : filteredBoats.length > 0 ? (
            filteredBoats.map((boat) => (
              <BoatCard
                key={boat._id || boat.name}
                boat={{
                  id: boat._id || boat.name,
                  name: boat.name,
                  type: boat.type,
                  capacity: boat.capacity,
                  price: boat.price,
                  image: boat.image || "/placeholder.jpg",
                  location: boat.location,
                  rating: boat.rating || 0,
                  reviews: boat.reviews || 0,
                  available: boat.status === "available",
                  features: boat.features || [],
                }}
                onBook={() => handleBookBoat(boat)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Anchor className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No boats available</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterCapacity > 0 || filterType
                  ? "Try adjusting your search filters"
                  : "No boats are currently available for this company"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedBoat && (
        <BookingModal
          boat={selectedBoat}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedBoat(null)
          }}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  )
}



