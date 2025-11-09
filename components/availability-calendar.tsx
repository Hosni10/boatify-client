"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AvailabilityCalendarProps {
  boatId: string
  onDateSelect?: (startDate: Date, endDate: Date) => void
}

export default function AvailabilityCalendar({ boatId, onDateSelect }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [availability, setAvailability] = useState<any[]>([])
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  useEffect(() => {
    // Fetch availability for the current month
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()

    // TODO: Replace with actual API call
    // const response = await fetch(`/api/availability?boatId=${boatId}&month=${month}&year=${year}`)
    // const data = await response.json()
    // setAvailability(data.data)
  }, [currentDate, boatId])

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

    if (!selectedRange.start) {
      setSelectedRange({ start: clickedDate, end: null })
    } else if (!selectedRange.end) {
      if (clickedDate > selectedRange.start) {
        setSelectedRange({ ...selectedRange, end: clickedDate })
        if (onDateSelect) {
          onDateSelect(selectedRange.start, clickedDate)
        }
      } else {
        setSelectedRange({ start: clickedDate, end: null })
      }
    } else {
      setSelectedRange({ start: clickedDate, end: null })
    }
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Select Dates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button size="sm" variant="outline" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold text-foreground">{monthName}</h3>
            <Button size="sm" variant="outline" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              const isToday = date.toDateString() === new Date().toDateString()
              const isInRange =
                selectedRange.start && selectedRange.end && date >= selectedRange.start && date <= selectedRange.end
              const isStart = selectedRange.start && date.toDateString() === selectedRange.start.toDateString()
              const isEnd = selectedRange.end && date.toDateString() === selectedRange.end.toDateString()

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                    isStart || isEnd
                      ? "bg-primary text-primary-foreground"
                      : isInRange
                        ? "bg-accent/30 text-foreground"
                        : isToday
                          ? "border-2 border-primary text-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Selected Range Display */}
          {selectedRange.start && selectedRange.end && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm">
              <p className="text-foreground font-medium">
                {selectedRange.start.toLocaleDateString()} - {selectedRange.end.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
