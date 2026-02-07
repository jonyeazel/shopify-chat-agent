import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { getAdminStats } from "@/app/actions/admin"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch all leads with their quotes
  const { data: leads } = await supabase
    .from("leads")
    .select(
      `
      *,
      quotes (*),
      store_metrics (*),
      cro_issues (*)
    `,
    )
    .order("created_at", { ascending: false })

  // Get stats
  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard leads={leads || []} stats={stats} />
    </div>
  )
}
