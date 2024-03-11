import { auth } from "@/auth"
import { db } from "@/lib/prisma"

export const POST = auth(async (req) => {
  try {
    const { user } = req.auth!
    const body = await req.json()

    console.log(body)

    const eventId = body.eventId
    const participants = body.participants

    type Participant = {
      uid: string
      email: string
    }

    const modifiedParticipants = participants.map(
      (participant: Participant) => {
        return { id: participant.uid }
      }
    )

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    })

    if (!event) {
      return Response.json(
        {
          error: "Event not found!",
        },
        { status: 404 }
      )
    }

    // TODO: Test this
    if (!event.allowOutside && user.type === "OUTSIDER") {
      return Response.json(
        {
          error: "You are not allowed to register for this event!",
        },
        { status: 403 }
      )
    }

    /* Group & participans check */
    if (event.isGroup) {
      if (
        participants.length > event.maxParticipants ||
        participants.length < event.minParticipants
      ) {
        return Response.json(
          {
            error: "Invalid number of participants!",
          },
          { status: 400 }
        )
      }
    } else {
      if (participants.length > 0) {
        return Response.json(
          {
            error: "Invalid number of participants!",
          },
          { status: 400 }
        )
      }
    }

    const registration = await db.registration.create({
      data: {
        bossId: user.id!,
        eventId: eventId,
        details: body.fields,
        participants: {
          connect: modifiedParticipants,
        },
      },
    })

    return Response.json(
      {
        registration,
        message: "Registration successful!",
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
})
