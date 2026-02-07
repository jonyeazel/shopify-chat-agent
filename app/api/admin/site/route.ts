// Admin API - get and update site config
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get("siteId")

  if (!siteId) {
    return NextResponse.json({ error: "Site ID required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get site and verify ownership
  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 })
  }

  if (site.owner_email !== user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  return NextResponse.json(site)
}

export async function PATCH(req: NextRequest) {
  const { siteId, updates } = await req.json()

  if (!siteId || !updates) {
    return NextResponse.json({ error: "Site ID and updates required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify ownership
  const { data: site } = await supabase.from("sites").select("owner_email").eq("id", siteId).single()

  if (!site || site.owner_email !== user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Update site
  const { data, error } = await supabase.from("sites").update(updates).eq("id", siteId).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
