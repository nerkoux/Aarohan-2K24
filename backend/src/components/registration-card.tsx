import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Event, Registration } from "@prisma/client"
import { CheckIcon, CopyIcon, IndianRupeeIcon, InfoIcon } from "lucide-react"
import { useState } from "react"

export const RegistrationCard = (
  props: Registration & {
    event: Event
  }
) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)

    return setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const registrationId = "```" + props.id + "```"

  const message = encodeURIComponent(
    `Hi, I've registered for Aarohan. Could you please share the payment QR Code for confirmation? My Registration ID is ${registrationId}. Thanks!`
  )

  const onCheckout = () => {
    window.open(
      `https://api.whatsapp.com/send?phone=+918696655651&text=${message}`
    )
  }

  return (
    <Card className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="w-4 h-4 absolute top-4 right-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
        </TooltipTrigger>
        <TooltipContent>
          {props.hasPaid ? (
            <p>You&apos;ve already paid for this event. 🎉</p>
          ) : (
            <p className="text-sm text-muted-foreground max-w-sm">
              Tap checkout, smoothly transition to WhatsApp for secure payment
              and confirmation. 💵💬
            </p>
          )}
        </TooltipContent>
      </Tooltip>
      <CardHeader>
        <CardTitle>{props.event.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {props.event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormItem>
          <Label>Registration ID</Label>
          <div className="flex items-center gap-x-2">
            <Input
              className="h-8 text-xs flex-1"
              defaultValue={props.id}
              readOnly
            />
            <Button
              size="mini"
              variant="ghost"
              onClick={onCopy.bind(null, props.id)}>
              {isCopied ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </FormItem>
        <div className="space-y-2">
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Payment Status
          </p>
          {props.hasPaid ? (
            <Badge variant="success">Paid</Badge>
          ) : (
            <Badge variant="secondary">Unconfirmed</Badge>
          )}
          <a href="https://api.whatsapp.com/send?phone=+918696655651&text=I%27ve%20registered%20for%20an%20aarohan%20event%20and%20hence%20want%20to%20proceed%20with%20the%20payment%20for%20the%20confirmation%20%2C%20kindly%20provide%20me%20the%20QR%20Code%20for%20the%20payment%20and%20for%20the%20confirmation%20%2C%20my%20registration%20id%20is%20--%20%3E%20[Registration%20ID%20Here]" className="bg-green-500 px-4 rounded-xl float-right font-normal">Pay here</a>
        </div>
        <Button
          className="w-full"
          onClick={onCheckout}
          disabled={props.hasPaid}>
          Checkout
          <IndianRupeeIcon className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
