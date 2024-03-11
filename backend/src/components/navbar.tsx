"use client"

import { LogoutAlertDialog } from "@/components/logout-alert-dialog"
import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import Link from "next/link"

export const Navbar = () => {
  return (
    <header className="min-h-[4rem] max-h-[4rem] border-b px-4 xl:px-0">
      <div className="h-full max-w-6xl mx-auto items-center flex justify-between">
        <nav className="ml-auto gap-x-8 flex">
          <Link
            href="/events"
            className="text-sm font-medium cursor-pointer bg-gradient-to-r from-fuchsia-700 to-pink-700 bg-clip-text text-transparent">
            Events
          </Link>
          <Link href="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
        </nav>
        <LogoutAlertDialog>
          <Button variant="outline" className="ml-8">
            <LogOutIcon className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </LogoutAlertDialog>
      </div>
    </header>
  )
}
