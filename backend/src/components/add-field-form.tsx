import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeRequest } from "@/lib/axios"
import { ApiError } from "@/types/axios"
import { yupResolver } from "@hookform/resolvers/yup"
import { Event } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as y from "yup"

const schema = y.object({
  fieldId: y.string().required("Field Id is required"),
})

export const AddFieldForm = (event: Event) => {
  const form = useForm({
    resolver: yupResolver(schema),
  })

  const queryClient = useQueryClient()

  const fieldLinkMutation = useMutation({
    mutationKey: ["@FIELD_LINK", form.getValues("fieldId"), event.id],
    async mutationFn() {
      const res = await makeRequest.get(
        `/fields/${form.getValues("fieldId")}/link/events/${event.id}`
      )
      return res.data
    },
    onSuccess(data) {
      toast.success(data.message)
      form.reset({
        fieldId: String(),
      })
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

  const onSubmit = form.handleSubmit(() => {
    fieldLinkMutation.mutate()
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="fieldId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Id</FormLabel>
              <FormControl>
                <Input placeholder="xxxx-xxxx-xxx-xxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={fieldLinkMutation.isPending}>
          {fieldLinkMutation.isPending && (
            <Loader2Icon className="w-4 h-5 animate-spin mr-2" />
          )}
          Link
        </Button>
      </form>
    </Form>
  )
}
