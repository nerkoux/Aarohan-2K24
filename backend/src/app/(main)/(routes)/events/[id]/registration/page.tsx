"use client"

import { MemberSearchForm } from "@/components/member-search-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { makeRequest } from "@/lib/axios"
import { ApiError, ApiResponse } from "@/types/axios"
import { yupResolver } from "@hookform/resolvers/yup"
import { Event, Field, Registration, User } from "@prisma/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import {
  AlertCircleIcon,
  BadgeIndianRupeeIcon,
  CheckCircleIcon,
  Loader2Icon,
  TrophyIcon,
  X,
} from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useParams } from "next/navigation"
import party from "party-js"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as y from "yup"

type SelectOption = {
  label: string
  value: string
}

const schema = y.object({
  participants: y.array(
    y.object({
      uid: y.string(),
      email: y.string().email(),
    })
  ),
  eventId: y.string(),
  fields: y.array(
    y.object({
      name: y.string(),
      value: y.string().required("Required"),
    })
  ),
})

export default function RegistrationPage() {
  const params = useParams()
  const { data } = useSession()

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
    mode: "onChange",
  })

  useEffect(() => {
    if (typeof params.id === "string") {
      form.setValue("eventId", params.id)
    }
  }, [params, form])

  const participants = useFieldArray({
    control: form.control,
    name: "participants",
  })

  const onRemove = (index: number) => {
    participants.remove(index)
  }

  const queryClient = useQueryClient()
  /* Registration */
  const registrationMutation = useMutation({
    mutationKey: ["@REGISTRATION"],
    async mutationFn(values: y.InferType<typeof schema>) {
      const res = await makeRequest.post("/registrations", values)
      return res.data
    },
    onSuccess(data) {
      party.confetti(document.body)
      toast.success(data.message)
      form.reset({
        eventId: String(),
        fields: [],
        participants: [],
      })
    },
    onError(error: AxiosError<ApiError>) {
      toast.error(error.response?.data.error)
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["@EVENT", params.id],
      })
    },
  })

  /* Searching in child component */
  const onSearch = (user: User) => {
    if (data && data.user.email === user.email) {
      toast.error("You are a team boss.")
      return
    }

    const isExists = participants.fields.find((prev) => prev.uid === user.id)
    if (isExists) return

    participants.append({
      uid: user.id,
      email: user.email,
    })
  }

  const eventQuery = useQuery<
    ApiResponse<
      Event & {
        eventFields: Array<{
          field: Field
        }>
        registrations: Array<Registration>
      }
    >
  >({
    queryKey: ["@EVENT", params.id],
    async queryFn() {
      const res = await makeRequest.get(`/events/${params.id}`)
      return res.data
    },
  })

  /* Next.js specific */
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  /* Handling submit */
  const onSubmit = form.handleSubmit((data) => {
    /* Validation check */
    if (data.fields) {
      for (let index = 0; index < data.fields.length; index++) {
        const { value } = data.fields[index]
        if (eventQuery.data) {
          const regex = new RegExp(
            eventQuery.data.event.eventFields?.[index].field.regex ?? /^.*$/
          )
          if (!regex.test(value)) {
            form.setError(`fields.${index}.value`, {
              type: "pattern",
              message: "Invalid value",
            })
            return // Validation failed
          }
        }
      }
    }

    /* Participants check */
    if (eventQuery.data) {
      if (eventQuery.data.event.isGroup) {
        const { minParticipants, maxParticipants } = eventQuery.data.event
        const numParticipants = participants.fields.length

        if (numParticipants < minParticipants) {
          toast.error(`Please add at least ${minParticipants} participants.`)
          return // Validation failed
        }

        if (numParticipants > maxParticipants) {
          toast.error(`You can add at most ${maxParticipants} participants.`)
          return // Validation failed
        }
      }
    }

    // Proceed with the mutation
    registrationMutation.mutate(data)
  })

  return (
    isMounted &&
    eventQuery.data && (
      <main className="h-full px-4 xl:px-0">
        {Boolean(eventQuery.data.event.registrations.length) && (
          <div className="max-w-6xl mx-auto py-4 xl:py-6">
            <Alert variant="success" className="bg-success/10">
              <CheckCircleIcon className="h-4 w-4" />
              <AlertTitle>Woah!</AlertTitle>
              <AlertDescription>
                Looks like you are registered for this event.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row py-4 xl:py-6 gap-4">
          <div className="flex-[1] space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
              {eventQuery.data.event.name}
            </h1>
            <p className="text-base text-muted-foreground">
              {eventQuery.data.event.description}
            </p>

            {eventQuery.data.event.note && (
              <Alert variant="alert" className="bg-alert/10">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Note!</AlertTitle>
                <AlertDescription>
                  {eventQuery.data.event.note}
                </AlertDescription>
              </Alert>
            )}
            <div className="w-full aspect-video relative overflow-hidden rounded-md">
              <Image
                src={eventQuery.data.event.poster}
                alt={eventQuery.data.event.name}
                fill
                layout="fill"
              />
            </div>
            <Table>
              <TableCaption>
                Carefully review the details prior to registering 😊
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Amount
                    <BadgeIndianRupeeIcon className="h-4 w-4 ml-2 inline-block" />
                  </TableHead>
                  <TableHead>
                    Reward
                    <TrophyIcon className="h-4 w-4 ml-2 inline-block" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    ₹ {eventQuery.data.event.amount}
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹ {eventQuery.data.event.reward}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex-[1] space-y-4">
            {eventQuery.data.event.isGroup && (
              <MemberSearchForm onSearch={onSearch} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.fields.map((item, index) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="rounded-full"
                  onClick={onRemove.bind(null, index)}>
                  {item.email} <X className="h-4 w-4 ml-auto" />
                </Button>
              ))}
            </div>
            <Form {...form}>
              <form className="space-y-4" onSubmit={onSubmit}>
                {eventQuery.data.event.eventFields.map((customField, index) => {
                  /* Fields */
                  form.setValue(`fields.${index}.name`, customField.field.value)

                  if (customField.field.type === "SELECT") {
                    return (
                      <FormField
                        key={customField.field.id}
                        control={form.control}
                        name={`fields.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{customField.field.name}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={Boolean(
                                eventQuery.data.event.registrations.length
                              )}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={customField.field.placeholder}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {customField.field.options.map(
                                  // @ts-ignore
                                  (option: SelectOption) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  } else
                    return (
                      <FormField
                        key={customField.field.id}
                        control={form.control}
                        name={`fields.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{customField.field.name}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={
                                  customField.field.placeholder ?? ""
                                }
                                disabled={Boolean(
                                  eventQuery.data.event.registrations.length
                                )}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                })}
                <Button
                  className="w-full"
                  disabled={
                    registrationMutation.isPending ||
                    Boolean(eventQuery.data.event.registrations.length)
                  }>
                  {registrationMutation.isPending && (
                    <Loader2Icon className="w-4 h-5 animate-spin mr-2" />
                  )}
                  Register
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    )
  )
}
