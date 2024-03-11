import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { makeRequest } from "@/lib/axios"
import { ApiError } from "@/types/axios"
import { yupResolver } from "@hookform/resolvers/yup"
import { User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as y from "yup"

const schema = y.object({
  email: y
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
})

interface MemberSearchFormProps {
  onSearch: (user: User) => void
}

export const MemberSearchForm = (props: MemberSearchFormProps) => {
  const form = useForm({
    resolver: yupResolver(schema),
  })

  const searchMemberMutation = useMutation({
    mutationKey: ["@SEARCH_MEMBER"],
    async mutationFn() {
      const res = await makeRequest.get("/search/users", {
        params: {
          email: form.watch("email"),
        },
      })
      return res.data
    },
    onSuccess(data) {
      form.setValue("email", String())
      props.onSearch(data.user)
    },
    onError(error: AxiosError<ApiError>) {
      if (error.response) {
        toast.error(error.response.data.error)
      }
    },
  })

  const onSubmit = form.handleSubmit(() => {
    searchMemberMutation.mutate()
  })

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  placeholder="friend@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Search for a member by email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={searchMemberMutation.isPending}>
          {searchMemberMutation.isPending ? (
            <Loader2Icon className="w-4 h-5 animate-spin mr-2" />
          ) : (
            <PlusIcon className="w-4 h-4 mr-2" />
          )}
          Add
        </Button>
      </form>
    </Form>
  )
}
