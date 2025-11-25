import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS } from "@/server/db"
import { ObjectId } from "mongodb"

// GET /api/bookings - Fetch all bookings
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const boatId = searchParams.get("boatId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    const query: any = {}
    if (status) query.status = status
    if (boatId) {
      // Try both string and ObjectId format
      try {
        query.boatId = new ObjectId(boatId).toString()
      } catch {
        query.boatId = boatId
      }
    }
    if (startDate || endDate) {
      query.startDate = {}
      if (startDate) query.startDate.$gte = new Date(startDate)
      if (endDate) query.startDate.$lte = new Date(endDate)
    }

    const bookings = await db.collection(COLLECTIONS.BOOKINGS).find(query).sort({ startDate: 1 }).toArray()

    // Populate boat information if needed
    const bookingsWithBoats = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.boatId) {
          try {
            const boat = await db.collection(COLLECTIONS.BOATS).findOne({ _id: new ObjectId(booking.boatId) })
            if (!boat) {
              // Try finding by name if _id lookup fails
              const boatByName = await db.collection(COLLECTIONS.BOATS).findOne({ name: booking.boatId })
              return {
                ...booking,
                boat: boatByName ? { name: boatByName.name, type: boatByName.type } : null,
              }
            }
            return {
              ...booking,
              boat: { name: boat.name, type: boat.type },
            }
          } catch {
            return booking
          }
        }
        return booking
      })
    )

    return NextResponse.json({
      success: true,
      data: bookingsWithBoats,
      count: bookingsWithBoats.length,
    })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch bookings",
      },
      { status: 500 },
    )
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.boatId || !body.startDate || !body.endDate || !body.customerName || !body.customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Backend server URL - defaults to localhost:3001 if not set
    const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to create booking",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create booking",
      },
      { status: 500 },
    )
  }
}
