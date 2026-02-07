"use server"

import { createClient } from "@/lib/supabase/server"
import type { WizardState } from "@/lib/types"
import { calculateHealthScore, identifyCROIssues, calculatePricing, type StoreMetrics } from "@/lib/pricing"

export async function createLead(state: WizardState) {
  const supabase = await createClient()

  // Create lead
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      email: state.email,
      store_domain: state.storeDomain,
      contact_name: state.contactName,
      phone: state.phone || null,
      status: "new",
    })
    .select()
    .single()

  if (leadError) throw leadError

  // Store metrics
  const fullMetrics: StoreMetrics = {
    totalSessions: state.lifetimeMetrics.totalSessions || 0,
    conversionRate: state.lifetimeMetrics.conversionRate || 0,
    avgSessionDuration: state.lifetimeMetrics.avgSessionDuration || 0,
    totalVisitors: state.lifetimeMetrics.totalVisitors || 0,
    sessionsCompletedCheckout: state.lifetimeMetrics.sessionsCompletedCheckout || 0,
    sessionsWithCartAdds: state.lifetimeMetrics.sessionsWithCartAdds || 0,
    sessionsReachedCheckout: state.lifetimeMetrics.sessionsReachedCheckout || 0,
    totalCustomers: state.ltvMetrics.totalCustomers || 0,
    returningCustomerRate: state.ltvMetrics.returningCustomerRate || 0,
    ordersPerCustomer: state.ltvMetrics.ordersPerCustomer || 0,
    amountPerCustomer: state.ltvMetrics.amountPerCustomer || 0,
  }

  const healthScore = calculateHealthScore(fullMetrics, state.monthlyMetrics)
  const issues = identifyCROIssues(fullMetrics, state.monthlyMetrics)
  const pricing = calculatePricing(fullMetrics, issues)

  // Insert store metrics
  await supabase.from("store_metrics").insert({
    lead_id: lead.id,
    total_sessions: fullMetrics.totalSessions,
    conversion_rate: fullMetrics.conversionRate,
    avg_session_duration: fullMetrics.avgSessionDuration,
    total_visitors: fullMetrics.totalVisitors,
    sessions_completed_checkout: fullMetrics.sessionsCompletedCheckout,
    sessions_with_cart_adds: fullMetrics.sessionsWithCartAdds,
    sessions_reached_checkout: fullMetrics.sessionsReachedCheckout,
    total_customers: fullMetrics.totalCustomers,
    returning_customer_rate: fullMetrics.returningCustomerRate,
    orders_per_customer: fullMetrics.ordersPerCustomer,
    amount_per_customer: fullMetrics.amountPerCustomer,
    health_score: healthScore.overall,
    revenue_opportunity: pricing.revenueOpportunity,
  })

  // Insert monthly metrics
  if (state.monthlyMetrics.length > 0) {
    await supabase.from("monthly_metrics").insert(
      state.monthlyMetrics.map((m) => ({
        lead_id: lead.id,
        month: m.month,
        sessions: m.sessions,
        sessions_completed_checkout: m.sessionsCompletedCheckout,
        conversion_rate: m.conversionRate,
        avg_session_duration: m.avgSessionDuration,
        visitors: m.visitors,
        sessions_with_cart_adds: m.sessionsWithCartAdds,
      })),
    )
  }

  // Insert CRO issues
  if (issues.length > 0) {
    await supabase.from("cro_issues").insert(
      issues.map((issue) => ({
        lead_id: lead.id,
        issue_type: issue.type,
        severity: issue.severity,
        title: issue.title,
        description: issue.description,
        estimated_impact: issue.estimatedImpact,
        fix_price: issue.fixPrice,
      })),
    )
  }

  // Create initial quote
  const { data: quote } = await supabase
    .from("quotes")
    .insert({
      lead_id: lead.id,
      base_build_price: pricing.baseBuildPrice,
      monthly_retainer: pricing.monthlyRetainer,
      rev_share_percentage: pricing.revSharePercentage,
      ab_domain_upsell: pricing.abDomainUpsell,
      total_upfront: pricing.baseBuildPrice,
      proposal_fee: pricing.proposalFee,
      package_tier: state.selectedPackage,
      payment_model: state.selectedPaymentModel,
      status: "pending",
    })
    .select()
    .single()

  return { lead, quote, healthScore, issues, pricing }
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId)

  if (error) throw error
}

export async function getLeadWithDetails(leadId: string) {
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

  const { data: metrics } = await supabase.from("store_metrics").select("*").eq("lead_id", leadId).single()

  const { data: monthlyMetrics } = await supabase
    .from("monthly_metrics")
    .select("*")
    .eq("lead_id", leadId)
    .order("month", { ascending: true })

  const { data: issues } = await supabase
    .from("cro_issues")
    .select("*")
    .eq("lead_id", leadId)
    .order("severity", { ascending: true })

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return { lead, metrics, monthlyMetrics, issues, quote }
}
