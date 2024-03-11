import { auth } from "@/auth"
import { db } from "@/lib/prisma"

export const GET = auth(async (req) => {
  try {
    const { user } = req.auth!

    if (user.role !== "ADMIN") {
      return Response.json(
        {
          error: "Unauthorized!",
        },
        { status: 403 }
      )
    }

    const fields = await db.field.findMany()

    return Response.json(
      {
        fields,
        message: "Fields fetched successfully!",
      },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 }
    )
  }
})

export const POST = auth(async (req) => {
  try {
    const body = await req.json()

    const { user } = req.auth!

    if (user.role !== "ADMIN") {
      return Response.json(
        {
          error: "Unauthorized!",
        },
        { status: 403 }
      )
    }

    const field = await db.field.create({
      data: body,
    })

    return Response.json(
      {
        field,
        message: "Field created successfully!",
      },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 }
    )
  }
})
