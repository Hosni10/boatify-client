"use client"

import { useState, useEffect } from "react"
import { Anchor, Calendar as CalendarIcon, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReservationsCalendar from "@/components/reservations-calendar"
import ReservationsSchedule from "@/components/reservations-schedule"
import type { Booking } from "@/lib/types"

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState<"calendar" | "schedule">("calendar")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/bookings")
      const data = await response.json()

      if (data.success) {
        // Transform dates from strings to Date objects
        const transformedBookings = data.data.map((booking: any) => ({
          ...booking,
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          createdAt: booking.createdAt ? new Date(booking.createdAt) : new Date(),
          updatedAt: booking.updatedAt ? new Date(booking.updatedAt) : new Date(),
        }))
        setBookings(transformedBookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reservations</h1>
          <p className="text-muted-foreground">View and manage all boat reservations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reservations</p>
                  <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                </div>
                <CalendarIcon className="w-12 h-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "schedule")} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Schedule View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-6">
            {isLoading ? (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading reservations...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ReservationsCalendar bookings={bookings} />
            )}
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            {isLoading ? (
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading schedule...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ReservationsSchedule bookings={bookings} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}





