import Link from "next/link"

export const AdminNavbar = () => {
  return (
    <header className="min-h-[4rem] max-h-[4rem] border-b px-4 xl:px-0">
      <div className="h-full max-w-6xl mx-auto items-center flex justify-between">
        <nav className="gap-x-8 flex">
          <Link href="/admin" className="text-sm font-bold">
            Aarohan Admin
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Events
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Registrations
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Settings
          </Link>
        </nav>
      </div>
    </header>
  )
}
