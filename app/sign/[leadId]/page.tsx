import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ContractSigningFlow } from "@/components/contract-signing-flow"

export default async function SignContractPage({ params }: { params: Promise<{ leadId: string }> }) {
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

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!lead || !quote) {
    redirect("/")
  }

  // If already signed, redirect to portal
  if (contract?.status === "signed") {
    redirect(`/portal/${leadId}`)
  }

  return <ContractSigningFlow lead={lead} quote={quote} contract={contract} />
}
