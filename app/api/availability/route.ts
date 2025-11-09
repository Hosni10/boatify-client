import { type NextRequest, NextResponse } from "next/server"
import { getAvailableBoats, getAvailabilityCalendar } from "@/server/availability"

// Mock data
const boats = [
  { id: 1, name: "Sunset Cruiser", price: 450 },
  { id: 2, name: "Speed Demon", price: 280 },
]

const bookings: any[] = []

// GET /api/availability?startDate=2025-01-15&endDate=2025-01-20
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const boatId = searchParams.get("boatId")

    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "startDate and endDate are required",
        },
        { status: 400 },
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (boatId) {
      // Get calendar for specific boat
      const month = start.getMonth()
      const year = start.getFullYear()
      const calendar = getAvailabilityCalendar(boatId, month, year, bookings)

      return NextResponse.json({
        success: true,
        data: calendar,
      })
    } else {
      // Get available boats for date range
      const available = getAvailableBoats(boats, start, end, bookings)

      return NextResponse.json({
        success: true,
        data: available,
        count: available.length,
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check availability",
      },
      { status: 500 },
    )
  }
}
