import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { password } = await request.json()
  const validPassword = process.env.ADMIN_SECRET_KEY

  if (!validPassword) {
    // No password set - allow access (dev mode)
    const cookieStore = await cookies()
    cookieStore.set("admin_token", "dev-mode", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return NextResponse.json({ success: true })
  }

  if (password !== validPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set("admin_token", validPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return NextResponse.json({ success: true })
}
