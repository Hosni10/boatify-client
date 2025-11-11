"use client"

import { useState } from "react"
import { Calendar, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BoatCard from "@/components/boat-card"
import BookingModal from "@/components/booking-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data - will be replaced with API calls
const mockBoats = [
  {
    id: 1,
    name: "Sunset Cruiser",
    type: "Luxury Yacht",
    capacity: 12,
    price: 450,
    image: "/luxury-yacht-boat.jpg",
    location: "Marina Bay",
    rating: 4.8,
    reviews: 24,
    available: true,
    features: ["Air Conditioning", "Full Kitchen", "Entertainment System"],
  },
  {
    id: 2,
    name: "Speed Demon",
    type: "Speed Boat",
    capacity: 6,
    price: 280,
    image: "/speed-boat-fast.jpg",
    location: "Harbor Point",
    rating: 4.9,
    reviews: 18,
    available: true,
    features: ["High Speed", "GPS Navigation", "Safety Equipment"],
  },
  {
    id: 3,
    name: "Family Getaway",
    type: "Cabin Cruiser",
    capacity: 8,
    price: 350,
    image: "/cabin-cruiser-family-boat.jpg",
    location: "Coastal Dock",
    rating: 4.7,
    reviews: 31,
    available: false,
    features: ["Sleeping Quarters", "Full Kitchen", "Bathroom"],
  },
  {
    id: 4,
    name: "Adventure Explorer",
    type: "Fishing Boat",
    capacity: 10,
    price: 320,
    image: "/fishing-boat-adventure.jpg",
    location: "Marina Bay",
    rating: 4.6,
    reviews: 15,
    available: true,
    features: ["Fishing Equipment", "Cooler System", "Radar"],
  },
  {
    id: 5,
    name: "Romantic Escape",
    type: "Sailboat",
    capacity: 4,
    price: 200,
    image: "/sailboat-romantic.jpg",
    location: "Harbor Point",
    rating: 4.9,
    reviews: 22,
    available: true,
    features: ["Classic Sailing", "Scenic Views", "Intimate Setting"],
  },
  {
    id: 6,
    name: "Party Barge",
    type: "Party Boat",
    capacity: 20,
    price: 550,
    image: "/party-boat-celebration.jpg",
    location: "Coastal Dock",
    rating: 4.8,
    reviews: 28,
    available: true,
    features: ["Sound System", "Dance Floor", "Bar Service"],
  },
]

export default function DashboardPage() {
  const [selectedBoat, setSelectedBoat] = useState<(typeof mockBoats)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCapacity, setFilterCapacity] = useState(0)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { toast } = useToast()

  const filteredBoats = mockBoats.filter((boat) => {
    const matchesSearch =
      boat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boat.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCapacity = filterCapacity === 0 || boat.capacity >= filterCapacity
    return matchesSearch && matchesCapacity && boat.available
  })

  const handleBookBoat = (boat: (typeof mockBoats)[0]) => {
    setSelectedBoat(boat)
    setShowBookingModal(true)
  }

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
            <Button variant="ghost">My Bookings</Button>
            <Button variant="ghost">Account</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Find Your Perfect Boat</h1>
          <p className="text-lg text-muted-foreground">Browse our fleet and book your next adventure</p>
        </div>

        {/* Search & Filter Section */}
        <Card className="mb-8 border-border">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search by name or location</label>
                <Input
                  placeholder="e.g., Sunset Cruiser, Marina Bay"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum capacity</label>
                <select
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                >
                  <option value={0}>Any capacity</option>
                  <option value={4}>4+ people</option>
                  <option value={6}>6+ people</option>
                  <option value={8}>8+ people</option>
                  <option value={10}>10+ people</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dates</label>
                <Button variant="outline" className="w-full justify-start text-muted-foreground bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Select dates
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoats.length > 0 ? (
            filteredBoats.map((boat) => <BoatCard key={boat.id} boat={boat} onBook={() => handleBookBoat(boat)} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <Anchor className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No boats available</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedBoat && (
        <BookingModal
          boat={selectedBoat}
          onClose={() => setShowBookingModal(false)}
          onConfirm={() => {
            setShowBookingModal(false)
            toast({
              title: "Booking confirmed!",
              description: "Check your email for details.",
            })
          }}
        />
      )}
    </div>
  )
}
