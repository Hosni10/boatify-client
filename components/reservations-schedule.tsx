"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Booking } from "@/lib/types"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfDay } from "date-fns"

interface ReservationsScheduleProps {
  bookings: Booking[]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-blue-500/80 hover:bg-blue-600/80"
    case "pending":
      return "bg-yellow-500/80 hover:bg-yellow-600/80"
    case "completed":
      return "bg-green-500/80 hover:bg-green-600/80"
    case "cancelled":
      return "bg-red-500/80 hover:bg-red-600/80"
    default:
      return "bg-gray-500/80 hover:bg-gray-600/80"
  }
}

export default function ReservationsSchedule({ bookings }: ReservationsScheduleProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

  const weekDays = useMemo(() => {
    const endWeek = endOfWeek(currentWeek, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: currentWeek, end: endWeek })
  }, [currentWeek])

  // Group bookings by boat
  const bookingsByBoat = useMemo(() => {
    const grouped: { [key: string]: Booking[] } = {}
    bookings.forEach((booking) => {
      const boatName = (booking as any).boat?.name || booking.boatId || "Unknown Boat"
      if (!grouped[boatName]) {
        grouped[boatName] = []
      }
      grouped[boatName].push(booking)
    })
    return grouped
  }, [bookings])

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleToday = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 0 }))
  }

  // Check if a booking spans across a day
  const getBookingForDay = (booking: Booking, day: Date) => {
    const bookingStart = startOfDay(new Date(booking.startDate))
    const bookingEnd = startOfDay(new Date(booking.endDate))
    const dayStart = startOfDay(day)

    const isStart = isSameDay(bookingStart, dayStart)
    const isEnd = isSameDay(bookingEnd, dayStart)
    const isMiddle = dayStart > bookingStart && dayStart < bookingEnd

    if (isStart || isEnd || isMiddle) {
      return { isStart, isEnd, isMiddle }
    }
    return null
  }

  // Calculate the width and position of a booking bar
  const getBookingPosition = (booking: Booking, dayIndex: number) => {
    const bookingStart = new Date(booking.startDate)
    const bookingEnd = new Date(booking.endDate)
    const dayStart = startOfDay(weekDays[dayIndex])

    const startOfWeekDate = startOfDay(weekDays[0])
    const endOfWeekDate = startOfDay(weekDays[6])

    // Check if booking starts before this week
    const bookingStartsBeforeWeek = bookingStart < startOfWeekDate
    // Check if booking ends after this week
    const bookingEndsAfterWeek = bookingEnd > endOfWeekDate

    const daysInWeek = 7
    let startDay = bookingStartsBeforeWeek ? 0 : Math.max(0, Math.floor((bookingStart.getTime() - startOfWeekDate.getTime()) / (1000 * 60 * 60 * 24)))
    let endDay = bookingEndsAfterWeek ? daysInWeek - 1 : Math.min(daysInWeek - 1, Math.floor((bookingEnd.getTime() - startOfWeekDate.getTime()) / (1000 * 60 * 60 * 24)))

    const span = endDay - startDay + 1
    const left = (startDay / daysInWeek) * 100
    const width = (span / daysInWeek) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weekly Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrevWeek}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Header row with days */}
          <div className="grid grid-cols-8 gap-2 min-w-[800px] mb-4">
            <div className="font-semibold text-sm text-foreground"></div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-muted-foreground">{format(day, "EEE")}</div>
                <div className="text-sm font-semibold text-foreground">{format(day, "d")}</div>
              </div>
            ))}
          </div>

          {/* Schedule rows for each boat */}
          {Object.entries(bookingsByBoat).length > 0 ? (
            Object.entries(bookingsByBoat).map(([boatName, boatBookings]) => (
              <div key={boatName} className="mb-4">
                <div className="text-sm font-semibold text-foreground mb-2">{boatName}</div>
                <div className="relative min-h-[60px] bg-muted/30 rounded-md p-2">
                  {/* Timeline grid */}
                  <div className="absolute inset-0 grid grid-cols-7 gap-px">
                        {weekDays.map((_, index) => (
                          <div key={index} className="border-r border-border/50 last:border-r-0"></div>
                        ))}
                      </div>

                  {/* Booking bars */}
                  {boatBookings.map((booking) => {
                    const bookingStart = new Date(booking.startDate)
                    const bookingEnd = new Date(booking.endDate)
                    const weekStart = startOfDay(weekDays[0])
                    const weekEnd = startOfDay(weekDays[6])

                    // Check if booking overlaps with this week
                    if (bookingEnd < weekStart || bookingStart > weekEnd) {
                      return null
                    }

                    const position = getBookingPosition(booking, 0)

                    return (
                      <div
                        key={booking._id || booking.id}
                        className={`absolute top-2 bottom-2 ${getStatusColor(booking.status)} text-white rounded px-2 py-1 text-xs cursor-pointer flex items-center`}
                        style={{
                          left: position.left,
                          width: position.width,
                          minWidth: "60px",
                        }}
                        title={`${booking.customerName} - ${format(bookingStart, "MMM d")} to ${format(bookingEnd, "MMM d")}`}
                      >
                        <div className="truncate">
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-[10px] opacity-90">
                            {format(bookingStart, "MMM d")} - {format(bookingEnd, "MMM d")}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No bookings for this week
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}





