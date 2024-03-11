import { db } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth()
    const { user } = session!

    const event = await db.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        eventFields: {
          select: {
            field: true,
          },
        },
        registrations: {
          where: {
            bossId: user.id,
          },
        },
      },
    })

    return Response.json(
      {
        event,
        message: "Event fetched successfully!",
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
