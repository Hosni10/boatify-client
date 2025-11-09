"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/lib/types"
import { format, isSameDay, isWithinInterval, startOfDay, endOfDay } from "date-fns"

interface ReservationsCalendarProps {
  bookings: Booking[]
  onDateClick?: (date: Date) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-500"
    case "pending":
      return "bg-yellow-500"
    case "completed":
      return "bg-green-500"
    case "cancelled":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function ReservationsCalendar({ bookings, onDateClick }: ReservationsCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)
      return isWithinInterval(date, { start: startOfDay(start), end: endOfDay(end) })
    })
  }

  // Custom day renderer to show booking indicators
  const modifiers = useMemo(() => {
    return {
      hasBookings: (date: Date) => getBookingsForDate(date).length > 0,
      startDate: (date: Date) =>
        bookings.some((booking) => isSameDay(new Date(booking.startDate), date)),
      endDate: (date: Date) => bookings.some((booking) => isSameDay(new Date(booking.endDate), date)),
    }
  }, [bookings])

  const modifiersClassNames = {
    hasBookings: "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
    startDate: "border-2 border-primary",
    endDate: "border-2 border-primary",
  }

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Reservations Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              if (date && onDateClick) {
                onDateClick(date)
              }
            }}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-md border"
          />

          {/* Selected Date Bookings */}
          {selectedDate && selectedBookings.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold text-foreground">
                Bookings on {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              <div className="space-y-2">
                {selectedBookings.map((booking) => (
                  <div
                    key={booking._id || booking.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {(booking as any).boat?.name || "Boat"}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(booking.status)} text-white border-0 text-xs`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(booking.startDate), "MMM d")} -{" "}
                        {format(new Date(booking.endDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedBookings.length === 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              No bookings on {format(selectedDate, "MMMM d, yyyy")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

