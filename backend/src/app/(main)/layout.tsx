import { Navbar } from "@/components/navbar"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full flex flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
