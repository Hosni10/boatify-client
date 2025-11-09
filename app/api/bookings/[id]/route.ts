import { type NextRequest, NextResponse } from "next/server"

// Mock database
const bookings: any[] = []

// GET /api/bookings/[id] - Fetch a specific booking
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Replace with MongoDB query
    // const booking = await db.collection('bookings').findOne({ id })

    const booking = bookings.find((b) => b.id === id)

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch booking",
      },
      { status: 500 },
    )
  }
}

// PUT /api/bookings/[id] - Update a booking (e.g., cancel, complete)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // TODO: Replace with MongoDB update
    // const result = await db.collection('bookings').updateOne({ id }, { $set: body })

    const bookingIndex = bookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 },
      )
    }

    bookings[bookingIndex] = { ...bookings[bookingIndex], ...body }

    return NextResponse.json({
      success: true,
      data: bookings[bookingIndex],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update booking",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Replace with MongoDB delete or soft delete
    // const result = await db.collection('bookings').updateOne({ id }, { $set: { status: 'cancelled' } })

    const bookingIndex = bookings.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking not found",
        },
        { status: 404 },
      )
    }

    bookings[bookingIndex].status = "cancelled"

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel booking",
      },
      { status: 500 },
    )
  }
}
