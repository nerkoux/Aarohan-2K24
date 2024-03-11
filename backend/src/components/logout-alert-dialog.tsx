import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2Icon } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface LogoutAlertDialogProps {
  children?: React.ReactNode
}

export const LogoutAlertDialog = (props: LogoutAlertDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onOpen = () => setOpen(true)

  const onSignOut = async () => {
    setIsLoading(true)
    await signOut()
  }

  const onCancel = () => {
    setOpen(false)
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild onClick={onOpen}>
        {props.children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? This action will securely sign you
            out of your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onSignOut} disabled={isLoading}>
            {isLoading && <Loader2Icon className="w-4 h-5 animate-spin mr-2" />}
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
