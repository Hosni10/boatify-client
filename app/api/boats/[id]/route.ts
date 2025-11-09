import { type NextRequest, NextResponse } from "next/server"

// Mock database
const boats = [
  {
    id: 1,
    name: "Sunset Cruiser",
    type: "Luxury Yacht",
    capacity: 12,
    price: 450,
    location: "Marina Bay",
    status: "available",
  },
]

// GET /api/boats/[id] - Fetch a specific boat
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Replace with MongoDB query
    // const boat = await db.collection('boats').findOne({ id })

    const boat = boats.find((b) => b.id === id)

    if (!boat) {
      return NextResponse.json(
        {
          success: false,
          error: "Boat not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: boat,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch boat",
      },
      { status: 500 },
    )
  }
}

// PUT /api/boats/[id] - Update a boat
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()

    // TODO: Replace with MongoDB update
    // const result = await db.collection('boats').updateOne({ id }, { $set: body })

    const boatIndex = boats.findIndex((b) => b.id === id)

    if (boatIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Boat not found",
        },
        { status: 404 },
      )
    }

    boats[boatIndex] = { ...boats[boatIndex], ...body }

    return NextResponse.json({
      success: true,
      data: boats[boatIndex],
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update boat",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/boats/[id] - Delete a boat
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // TODO: Replace with MongoDB delete
    // const result = await db.collection('boats').deleteOne({ id })

    const boatIndex = boats.findIndex((b) => b.id === id)

    if (boatIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Boat not found",
        },
        { status: 404 },
      )
    }

    boats.splice(boatIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Boat deleted successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete boat",
      },
      { status: 500 },
    )
  }
}
