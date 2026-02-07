import { createClient } from "@/lib/supabase/server"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"

export default async function AnalyticsPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase.from("leads").select("*, quotes(*), store_metrics(*)")

  const { data: projects } = await supabase.from("projects").select("*")

  const { data: payments } = await supabase
    .from("payment_history")
    .select("*")
    .order("created_at", { ascending: false })

  return <AnalyticsDashboard leads={leads || []} projects={projects || []} payments={payments || []} />
}
