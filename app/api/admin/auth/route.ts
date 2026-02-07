// Admin authentication - magic link via Supabase
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, siteId } = await req.json()

  if (!email || !siteId) {
    return NextResponse.json({ error: "Email and site ID required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Verify this email owns this site
  const { data: site, error: siteError } = await supabase.from("sites").select("owner_email").eq("id", siteId).single()

  if (siteError || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 })
  }

  if (site.owner_email !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Send magic link
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${req.nextUrl.origin}/admin?site=${siteId}`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Check your email for the login link" })
}
