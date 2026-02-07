import { createClient } from "@/lib/supabase/server"
import { ContractGenerator } from "@/components/contract-generator"
import { redirect } from "next/navigation"

export default async function ContractPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!lead || !quote) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <ContractGenerator lead={lead} quote={quote} />
    </div>
  )
}
