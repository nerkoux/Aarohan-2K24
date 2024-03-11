import { FieldForm } from "@/app/(admin)/(routes)/admin/_components/field-form"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import * as React from "react"

interface FieldFormModalProps extends React.PropsWithChildren {
  open?: boolean
  onClose?: () => void
}

export const FieldFormModal = (props: FieldFormModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <FieldForm onSuccess={props.onClose} />
      </DialogContent>
    </Dialog>
  )
}
