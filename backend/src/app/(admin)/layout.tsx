import { AdminNavbar } from "@/components/admin-navbar"

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full flex flex-col">
      <AdminNavbar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
