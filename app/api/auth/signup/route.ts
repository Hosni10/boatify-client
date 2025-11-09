import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase, COLLECTIONS } from "@/server/db"
import type { User } from "@/lib/types"
import { ObjectId } from "mongodb"

// POST /api/auth/signup - Create a new user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.companyName || !body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Validate password strength (at least 6 characters)
    if (body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({
      email: body.email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered",
        },
        { status: 409 },
      )
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)

    // Generate companyId (using ObjectId for uniqueness)
    const companyId = new ObjectId().toString()

    // Create user object
    const newUser: User = {
      email: body.email.toLowerCase(),
      password: hashedPassword,
      companyName: body.companyName,
      companyId: companyId,
      role: "admin", // First user of a company is admin
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser)

    if (!result.insertedId) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user",
        },
        { status: 500 },
      )
    }

    // Return success response (without password)
    const userResponse = {
      id: result.insertedId.toString(),
      email: newUser.email,
      companyName: newUser.companyName,
      companyId: newUser.companyId,
      role: newUser.role,
      createdAt: newUser.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: "Account created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create account",
      },
      { status: 500 },
    )
  }
}




