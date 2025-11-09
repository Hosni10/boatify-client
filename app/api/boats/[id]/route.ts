import { type NextRequest, NextResponse } from "next/server"

// Backend server URL - defaults to localhost:3001 if not set
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

// GET /api/boats/[id] - Fetch a specific boat
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/boats/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to fetch boat",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Get boat error:", error)
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
    const { id } = params
    const body = await request.json()

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/boats/${id}`, {
      method: "PUT",
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
          error: data.error || "Failed to update boat",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Update boat error:", error)
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
    const { id } = params

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/boats/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to delete boat",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Delete boat error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete boat",
      },
      { status: 500 },
    )
  }
}
