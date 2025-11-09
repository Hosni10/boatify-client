import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase, COLLECTIONS } from "@/server/db"

// POST /api/auth/login - Authenticate user and login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection(COLLECTIONS.USERS).findOne({
      email: body.email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(body.password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Return success response (without password)
    const userResponse = {
      id: user._id?.toString() || "",
      email: user.email,
      companyName: user.companyName,
      companyId: user.companyId,
      role: user.role,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: "Login successful",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to login",
      },
      { status: 500 },
    )
  }
}




