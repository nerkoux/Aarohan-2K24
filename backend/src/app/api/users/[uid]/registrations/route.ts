import { auth } from "@/auth"
import { db } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: { uid: string } },
) {
  try {
    const session = await auth()
    const { user } = session!

    const uid = params.uid

    const isAdmin = user.role === "ADMIN"

    if (!isAdmin && user.id !== uid) {
      return Response.json(
        {
          error: "Unauthorized!",
        },
        { status: 401 },
      )
    }

    const registrationsAsBoss = await db.registration.findMany({
      where: {
        bossId: uid,
      },
      include: {
        event: true,
      },
    })

    const registrationsAsParticipant = await db.registration.findMany({
      where: {
        participants: {
          some: {
            id: uid,
          },
        },
      },
      include: {
        event: true,
      },
    })

    return Response.json({
      registrations: {
        registrationsAsBoss,
        registrationsAsParticipant,
      },
      message: "Registrations fetched successfully!",
    })
  } catch (error) {
    return Response.json(
      {
        error: "Something went wrong!",
      },
      { status: 500 },
    )
  }
}
