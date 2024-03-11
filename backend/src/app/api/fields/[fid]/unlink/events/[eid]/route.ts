import { auth } from "@/auth"
import { db } from "@/lib/prisma"

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

    if (!field) {
      return Response.json(
        {
          error: "Field does not exist!",
        },
        { status: 400 }
      )
    }

    await db.eventField.delete({
      where: {
        eventId_fieldId: {
          eventId: params.eid,
          fieldId: params.fid,
        },
      },
    })

    return Response.json(
      {
        message: "Field unlinked successfully!",
      },
      { status: 200 }
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
