"use client"

import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [coordinates, setCoordinates] = useState({
    clientX: 0,
    clientY: 0,
  })

  const onSignIn = async () => {
    setIsLoading(true)
    await signIn("google")
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    setCoordinates({
      clientX: e.clientX,
      clientY: e.clientY,
    })
  }

  const ballTransform = `translate(${coordinates.clientX}px, ${coordinates.clientY}px)`

  return (
    <main className="h-full relative" onMouseMove={onMouseMove}>
      <div className="absolute h-full w-full inset-0 backdrop-blur-xl z-0">
        <div
          style={{ transform: ballTransform }}
          className={
            "h-[30vw] w-[30vw] rounded-bl-full rounded-br-full bg-gradient-to-r from-fuchsia-700 to-pink-700 opacity-50 absolute"
          }
        />
      </div>
      <div className="absolute h-full w-full inset-0 backdrop-blur-[250px] z-10" />
      <div className="flex items-center flex-col gap-y-4 absolute inset-0 py-48 px-4 sm:px-0 z-20">
        <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl text-center">
          Aarohan: Energizing College Teams
        </h1>
        <div className="bg-gradient-to-r from-fuchsia-700 to-pink-700 py-4 px-6 rounded-md">
          <h1 className="text-4xl font-extrabold tracking-tighter lg:text-5xl text-center text-white">
            College Fest.
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-xl text-center">
          Aarohan, the pulse of our college fest, sparks vibrant camaraderie,
          uniting teams in an electrifying celebration.
        </p>
        <Button onClick={onSignIn} disabled={isLoading}>
          {isLoading && <Loader2Icon className="w-4 h-5 animate-spin mr-2" />}
          Show events
        </Button>
      </div>
    </main>
  )
}
