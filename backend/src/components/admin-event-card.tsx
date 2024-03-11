import { AddFieldForm } from "@/components/add-field-form"
import { EventCard } from "@/components/event-card"
import { EventFieldCard } from "@/components/event-field-card"
import { Skeleton } from "@/components/ui/skeleton"
import { makeRequest } from "@/lib/axios"
import { ApiResponse } from "@/types/axios"
import { Event, Field, Registration } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

export const AdminEventCard = (event: Event) => {
  const eventQuery = useQuery<
    ApiResponse<{
      eventFields: Array<{
        field: Field
      }>
      registrations: Array<Registration>
    }>
  >({
    queryKey: ["@EVENT", event.id],
    async queryFn() {
      const res = await makeRequest.get(`/events/${event.id}`)
      return res.data
    },
  })

  const skeletons = Array.from({ length: 2 }, (_, i) => i)

  return (
    <div className="space-y-4">
      <EventCard {...event} />
      <AddFieldForm {...event} />
      <div className="grid grid-cols-1 space-y-4">
        {eventQuery.isLoading &&
          skeletons.map((_, idx) => <Skeleton key={idx} className="h-10" />)}
        {eventQuery.data &&
          eventQuery.data.event.eventFields.map(({ field }) => (
            <EventFieldCard key={field.id} event={event} field={field} />
          ))}
      </div>
    </div>
  )
}
