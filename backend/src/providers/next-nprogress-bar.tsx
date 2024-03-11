"use client"

import { useTailwindConfig } from "@/hooks/useTailwindConfig"
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { Suspense } from "react"

export function NextNProgressProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useTailwindConfig()

  return (
    <>
      <Suspense>
        <ProgressBar
          height="4px"
          options={{ showSpinner: false }}
          shallowRouting
          color={theme.colors.primary.DEFAULT}
        />
      </Suspense>
      {children}
    </>
  )
}
