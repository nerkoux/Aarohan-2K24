import { db } from "@/lib/prisma"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return Response.json(
        {
          error: "Email is required",
        },
        { status: 400 },
      )
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return Response.json(
        {
          error: "User not found",
        },
        { status: 404 },
      )
    }

    return Response.json(
      {
        user,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 },
    )
  }
}
