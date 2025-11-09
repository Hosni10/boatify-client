import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with MongoDB connection
const boats = [
  {
    id: 1,
    name: "Sunset Cruiser",
    type: "Luxury Yacht",
    capacity: 12,
    price: 450,
    location: "Marina Bay",
    status: "available",
    bookings: 24,
    revenue: 10800,
    features: ["Air Conditioning", "Full Kitchen", "Entertainment System"],
    image: "/luxury-yacht-boat.jpg",
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    name: "Speed Demon",
    type: "Speed Boat",
    capacity: 6,
    price: 280,
    location: "Harbor Point",
    status: "available",
    bookings: 18,
    revenue: 5040,
    features: ["High Speed", "GPS Navigation", "Safety Equipment"],
    image: "/speed-boat-fast.jpg",
    rating: 4.9,
    reviews: 18,
  },
]

// GET /api/boats - Fetch all boats
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with MongoDB query
    // const boats = await db.collection('boats').find({}).toArray()

    return NextResponse.json({
      success: true,
      data: boats,
      count: boats.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch boats",
      },
      { status: 500 },
    )
  }
}

// POST /api/boats - Create a new boat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.type || !body.capacity || !body.price || !body.location) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // TODO: Replace with MongoDB insert
    // const result = await db.collection('boats').insertOne(body)

    const newBoat = {
      id: Math.max(...boats.map((b) => b.id), 0) + 1,
      ...body,
      status: "available",
      bookings: 0,
      revenue: 0,
    }

    boats.push(newBoat)

    return NextResponse.json(
      {
        success: true,
        data: newBoat,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create boat",
      },
      { status: 500 },
    )
  }
}
