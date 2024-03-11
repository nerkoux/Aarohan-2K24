import { db } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: {
      fid: string
      eid: string
    }
  }
) {
  try {
    const session = await auth()

    if (session && session.user.role !== "ADMIN") {
      return Response.json(
        {
          error: "Unauthorized!",
        },
        { status: 403 }
      )
    }

    const field = await db.eventField.findFirst({
      where: {
        eventId: params.eid,
        fieldId: params.fid,
      },
    })

    if (field) {
      return Response.json(
        {
          error: "Field already linked!",
        },
        { status: 400 }
      )
    }

    const eventField = await db.event.update({
      where: {
        id: params.eid,
      },
      data: {
        eventFields: {
          create: {
            fieldId: params.fid,
          },
        },
      },
    })

    return Response.json(
      {
        eventField,
        message: "Field linked successfully!",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 }
    )
  }
}
