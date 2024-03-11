import "@/styles/globals.css"

import { Toaster } from "@/components/ui/sonner"
import { siteConfig } from "@/config/site.config"
import { fontSans } from "@/lib/fonts"
import { NextAuthProvider } from "@/providers/next-auth"
import { NextNProgressProvider } from "@/providers/next-nprogress-bar"
import { TanstackQueryProvider } from "@/providers/tanstack-query"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata = siteConfig.metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={fontSans.className}>
        <NextNProgressProvider>
          <TanstackQueryProvider>
            <NextAuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <SpeedInsights />
              <Analytics />
              <Toaster position="top-right" richColors />
            </NextAuthProvider>
          </TanstackQueryProvider>
        </NextNProgressProvider>
      </body>
    </html>
  )
}
