import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClientPortal } from "@/components/portal/client-portal"

export default async function PortalPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from("leads")
    .select("*, store_metrics(*), quotes(*), cro_issues(*)")
    .eq("id", leadId)
    .single()

  if (!lead) {
    redirect("/")
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return <ClientPortal lead={lead} project={project} contract={contract} quote={lead.quotes?.[0]} />
}
