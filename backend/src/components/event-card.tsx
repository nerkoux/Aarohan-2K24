import { Badge } from "@/components/ui/badge"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Event } from "@prisma/client"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export const EventCard = (props: Event) => {
  return (
    <Link href={`events/${props.id}/registration`}>
      <motion.div
        tabIndex={-1}
        className="cursor-pointer rounded-lg text-card-foreground shadow-sm select-none relative overflow-hidden"
        whileTap={{ scale: 0.9 }}>
        <Image
          src={props.poster}
          alt={props.name}
          fill
          className="h-full w-full object-cover z-[-1] brightness-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r to-black from-transparent z-[-1]" />
        <CardHeader>
          <CardTitle className="line-clamp-1">{props.name}</CardTitle>
          <CardDescription className="line-clamp-3">
            {props.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {props.isGroup ? <Badge>Team</Badge> : <Badge>Solo</Badge>}
        </CardContent>
      </motion.div>
    </Link>
  )
}
