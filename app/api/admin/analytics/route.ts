// Admin API - analytics data
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get("siteId")
  const period = req.nextUrl.searchParams.get("period") || "7d"

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

  // Verify ownership
  const { data: site } = await supabase.from("sites").select("owner_email").eq("id", siteId).single()

  if (!site || site.owner_email !== user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Calculate date range
  const days = period === "30d" ? 30 : period === "90d" ? 90 : 7
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get conversations count
  const { count: conversationCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("site_id", siteId)
    .gte("created_at", startDate.toISOString())

  // Get leads count
  const { count: leadsCount } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("site_id", siteId)
    .gte("created_at", startDate.toISOString())

  // Get usage data
  const { data: usageData } = await supabase
    .from("usage")
    .select("*")
    .eq("site_id", siteId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  // Calculate totals
  const totalMessages = usageData?.reduce((sum, row) => sum + (row.messages || 0), 0) || 0
  const totalTokens = usageData?.reduce((sum, row) => sum + (row.tokens || 0), 0) || 0
  const totalPageViews = usageData?.reduce((sum, row) => sum + (row.page_views || 0), 0) || 0

  return NextResponse.json({
    period,
    conversations: conversationCount || 0,
    leads: leadsCount || 0,
    messages: totalMessages,
    tokens: totalTokens,
    pageViews: totalPageViews,
    usageByDay: usageData || [],
  })
}
