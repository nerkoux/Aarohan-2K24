"use client"

import { FieldFormModal } from "@/app/(admin)/(routes)/admin/_components/field-form-modal"
import { AdminEventCard } from "@/components/admin-event-card"
import { FieldCard } from "@/components/field-card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { makeRequest } from "@/lib/axios"
import { Event, Field } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { CheckIcon, CopyIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

type ApiResponse<T> = {
  [key: string]: T
}

export default function AdminPage() {
  const fieldsQuery = useQuery<ApiResponse<Field[]>>({
    queryKey: ["@FIELDS"],
    async queryFn() {
      const res = await makeRequest.get("/fields")
      return res.data
    },
  })

  const eventsQuery = useQuery<ApiResponse<Event[]>>({
    queryKey: ["@EVENTS"],
    async queryFn() {
      const res = await makeRequest.get("/events")
      return res.data
    },
  })

  const [isCopied, setIsCopied] = useState<boolean[]>([false, false])

  const onCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setIsCopied((prev) => {
      prev[index] = true
      return [...prev]
    })

    return setTimeout(() => {
      setIsCopied((prev) => {
        prev[index] = false
        return [...prev]
      })
    }, 2000)
  }

  const skeletons = Array.from({ length: 6 }, (_, i) => i)

  const [open, setOpen] = useState(false)

  const onClose = () => {
    setOpen(false)
  }

  const onOpen = () => {
    setOpen(true)
  }

  return (
    <main className="h-full px-4 xl:px-0">
      <div className="max-w-6xl mx-auto py-4 xl:py-6 gap-4 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-x-4">
            <Button
              size="mini"
              variant="secondary"
              className="rounded-sm"
              onClick={onOpen}>
              <PlusIcon className="w-4 h-4" />
            </Button>
            <h3 className="text-2xl font-semibold tracking-tight">Fields</h3>
          </div>
          <ScrollArea className="whitespace-nowrap w-full bg-card">
            <div className="flex w-max space-x-4">
              {fieldsQuery.isLoading &&
                skeletons.map((_, idx) => (
                  <Skeleton key={idx} className="w-40 h-10" />
                ))}
              {fieldsQuery.data &&
                fieldsQuery.data.fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-x-2">
                    <FieldCard {...field} />
                    <Button
                      size="mini"
                      variant="ghost"
                      onClick={onCopy.bind(null, field.id, index)}>
                      {isCopied[index] ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-x-4">
            <Button size="mini" variant="secondary" className="rounded-sm">
              <PlusIcon className="w-4 h-4" />
            </Button>
            <h3 className="text-2xl font-semibold tracking-tight">Events</h3>
          </div>
          <ScrollArea className="whitespace-nowrap w-full">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsQuery.isLoading &&
                skeletons.map((_, idx) => (
                  <Skeleton key={idx} className="h-72" />
                ))}
              {eventsQuery.data &&
                eventsQuery.data.events.map((event) => (
                  <AdminEventCard key={event.id} {...event} />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <FieldFormModal open={open} onClose={onClose} />
    </main>
  )
}
