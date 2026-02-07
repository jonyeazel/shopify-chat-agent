"use server"

import { createClient } from "@/lib/supabase/server"

export async function approveQuote(quoteId: string, leadId: string) {
  const supabase = await createClient()

  // Update quote status
  await supabase
    .from("quotes")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)

  // Update lead status
  await supabase
    .from("leads")
    .update({
      status: "qualified",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)

  // TODO: Send approval email to lead
  return { success: true }
}

export async function rejectQuote(quoteId: string, leadId: string, reason: string) {
  const supabase = await createClient()

  await supabase
    .from("quotes")
    .update({
      status: "rejected",
      admin_notes: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)

  await supabase
    .from("leads")
    .update({
      status: "churned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)

  // TODO: Send rejection email
  return { success: true }
}

export async function requoteLeadAction(
  leadId: string,
  oldQuoteId: string,
  data: {
    baseBuildPrice: number
    monthlyRetainer: number
    revSharePercentage: number
    notes: string
  },
) {
  const supabase = await createClient()

  // Mark old quote as requoted
  await supabase.from("quotes").update({ status: "requoted" }).eq("id", oldQuoteId)

  // Create new quote
  const { data: newQuote } = await supabase
    .from("quotes")
    .insert({
      lead_id: leadId,
      base_build_price: data.baseBuildPrice,
      monthly_retainer: data.monthlyRetainer,
      rev_share_percentage: data.revSharePercentage,
      ab_domain_upsell: 2997,
      total_upfront: data.baseBuildPrice,
      proposal_fee: 97,
      proposal_paid: true, // They already paid
      admin_override_price: data.baseBuildPrice,
      admin_notes: data.notes,
      status: "sent",
    })
    .select()
    .single()

  // TODO: Send requote email
  return { success: true, quote: newQuote }
}

export async function sendContract(leadId: string, quoteId: string) {
  const supabase = await createClient()

  // Get lead and quote info
  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

  const { data: quote } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (!lead || !quote) throw new Error("Lead or quote not found")

  // Create contract record
  const { data: contract } = await supabase
    .from("contracts")
    .insert({
      lead_id: leadId,
      quote_id: quoteId,
      contract_type: "service_agreement",
      total_value: quote.base_build_price + quote.monthly_retainer * 12,
      monthly_amount: quote.monthly_retainer,
      rev_share_percentage: quote.rev_share_percentage,
      status: "pending_signature",
      terms: JSON.stringify({
        buildFee: quote.base_build_price,
        monthlyRetainer: quote.monthly_retainer,
        revShare: quote.rev_share_percentage,
        paymentTerms: "Net 7 days",
        killSwitch: true,
        startDate: new Date().toISOString(),
      }),
    })
    .select()
    .single()

  // Update lead status
  await supabase.from("leads").update({ status: "proposal_sent" }).eq("id", leadId)

  // TODO: Send contract email via DocuSign or similar
  return { success: true, contract }
}

export async function triggerProjectBuild(leadId: string) {
  const supabase = await createClient()

  // Get lead info
  const { data: lead } = await supabase.from("leads").select("*, store_metrics(*), quotes(*)").eq("id", leadId).single()

  if (!lead) throw new Error("Lead not found")

  // Create project record
  const { data: project } = await supabase
    .from("projects")
    .insert({
      lead_id: leadId,
      quote_id: lead.quotes?.[0]?.id,
      status: "queued",
      build_started_at: new Date().toISOString(),
      baseline_conversion_rate: lead.store_metrics?.conversion_rate,
    })
    .select()
    .single()

  // Update lead status
  await supabase.from("leads").update({ status: "building" }).eq("id", leadId)

  // TODO: Trigger v0 API to create project
  // This would integrate with v0's API to auto-create a new project
  // with the store domain, Storefront API key, and template

  return {
    success: true,
    project,
    buildInstructions: {
      storeDomain: lead.store_domain,
      storefrontApiKey: lead.storefront_api_key,
      templateType: lead.quotes?.[0]?.package_tier || "growth",
      priorityIssues: [], // Would come from cro_issues table
    },
  }
}

export async function pauseProject(projectId: string, reason: string) {
  const supabase = await createClient()

  await supabase
    .from("projects")
    .update({
      status: "paused",
      payments_current: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  // TODO: Trigger DNS/proxy update to show "Account Suspended" page
  return { success: true }
}

export async function terminateProject(projectId: string) {
  const supabase = await createClient()

  await supabase
    .from("projects")
    .update({
      status: "terminated",
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)

  // TODO: Remove DNS records, archive project
  return { success: true }
}

export async function getAdminStats() {
  const supabase = await createClient()

  const { data: leads } = await supabase.from("leads").select("status, created_at")

  const { data: quotes } = await supabase.from("quotes").select("proposal_paid, proposal_fee, base_build_price, status")

  const { data: projects } = await supabase.from("projects").select("status, revenue_generated, total_paid")

  const proposalRevenue = quotes?.filter((q) => q.proposal_paid).reduce((sum, q) => sum + (q.proposal_fee || 0), 0) || 0

  const buildRevenue =
    quotes?.filter((q) => q.status === "accepted").reduce((sum, q) => sum + (q.base_build_price || 0), 0) || 0

  const activeProjects = projects?.filter((p) => p.status === "live").length || 0

  const mrr = activeProjects * 997 // Simplified, would calculate actual retainers

  return {
    totalLeads: leads?.length || 0,
    newLeadsThisWeek: leads?.filter((l) => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .length,
    conversionRate:
      leads?.length > 0 ? ((quotes?.filter((q) => q.status === "accepted").length || 0) / leads.length) * 100 : 0,
    proposalRevenue,
    buildRevenue,
    totalRevenue: proposalRevenue + buildRevenue,
    activeProjects,
    mrr,
    arr: mrr * 12,
  }
}
