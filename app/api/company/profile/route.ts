import { type NextRequest, NextResponse } from "next/server"

// Backend server URL - defaults to localhost:3001 if not set
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

// GET /api/company/profile - Get company profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get("companyId")

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Company ID is required",
        },
        { status: 400 },
      )
    }

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/company/profile?companyId=${encodeURIComponent(companyId)}`, {
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
          error: data.error || "Failed to get company profile",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Get company profile error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get company profile",
      },
      { status: 500 },
    )
  }
}

// POST /api/company/profile - Create or update company profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Company ID is required",
        },
        { status: 400 },
      )
    }

    // Forward request to backend server
    const response = await fetch(`${BACKEND_URL}/api/company/profile`, {
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
          error: data.error || "Failed to create/update company profile",
        },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Create/update company profile error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create/update company profile",
      },
      { status: 500 },
    )
  }
}

