import { FieldCard } from "@/components/field-card"
import { Button } from "@/components/ui/button"
import { makeRequest } from "@/lib/axios"
import { ApiError } from "@/types/axios"
import { Event, Field } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader2Icon, X } from "lucide-react"
import { toast } from "sonner"

interface EventFieldCardProps {
  event: Event
  field: Field
}

export const EventFieldCard = ({ event, field }: EventFieldCardProps) => {
  const queryClient = useQueryClient()

  const fieldUnlinkMutation = useMutation({
    mutationKey: ["@FIELD_UNLINK"],
    async mutationFn(data: { fieldId: string; eventId: string }) {
      const res = await makeRequest.get(
        `/fields/${data.fieldId}/unlink/events/${data.eventId}`
      )
      return res.data
    },
    onSuccess(data) {
      toast.success(data.message)
    },
    onError(error: AxiosError<ApiError>) {
      toast.error(error.response?.data.error)
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["@EVENT", event.id],
      })
    },
  })

  return (
    <div className="flex items-center gap-x-2">
      <FieldCard {...field} />
      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          fieldUnlinkMutation.mutate({
            fieldId: field.id,
            eventId: event.id,
          })
        }
        disabled={fieldUnlinkMutation.isPending}>
        {fieldUnlinkMutation.isPending ? (
          <Loader2Icon className="w-4 h-5 animate-spin" />
        ) : (
          <X className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}
