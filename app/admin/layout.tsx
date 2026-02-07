import type React from "react"
import Link from "next/link"
import { BarChart3, Users, Home } from "lucide-react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function checkAdminAuth() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("admin_token")?.value
  const validToken = process.env.ADMIN_SECRET_KEY

  // If no ADMIN_SECRET_KEY is set, allow access (development mode)
  if (!validToken) return true

  return adminToken === validToken
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthed = await checkAdminAuth()

  if (!isAuthed) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav for admin */}
      <nav className="bg-background border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-foreground font-semibold">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center font-bold text-sm text-background">
              S
            </div>
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/admin"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Leads</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Logout
            </button>
          </form>
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Site</span>
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
