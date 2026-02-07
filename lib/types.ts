export interface Lead {
  id: string
  email: string
  store_domain: string
  store_name?: string
  storefront_api_key?: string
  contact_name?: string
  phone?: string
  created_at: string
  updated_at: string
  status: "new" | "qualified" | "proposal_sent" | "paid" | "building" | "completed" | "churned"
  source: string
}

export interface Quote {
  id: string
  lead_id: string
  base_build_price: number
  monthly_retainer: number
  rev_share_percentage: number
  ab_domain_upsell: number
  total_upfront: number
  proposal_fee: number
  proposal_paid: boolean
  proposal_paid_at?: string
  stripe_payment_id?: string
  status: "pending" | "sent" | "accepted" | "rejected" | "expired" | "requoted"
  accepted_at?: string
  expires_at?: string
  package_tier?: "starter" | "growth" | "scale"
  payment_model?: "retainer" | "rev_share" | "hybrid"
  admin_override_price?: number
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  lead_id: string
  quote_id?: string
  v0_project_url?: string
  ab_test_domain?: string
  production_domain?: string
  status: "queued" | "building" | "review" | "deployed" | "live" | "paused" | "terminated"
  build_started_at?: string
  build_completed_at?: string
  deployed_at?: string
  next_payment_due?: string
  payments_current: boolean
  last_payment_at?: string
  total_paid: number
  baseline_conversion_rate?: number
  current_conversion_rate?: number
  revenue_generated: number
  created_at: string
  updated_at: string
}

export interface WizardState {
  step: number
  leadId?: string
  storeDomain: string
  email: string
  contactName: string
  phone: string
  metricsSource: "manual" | "csv" | null
  lifetimeMetrics: Partial<import("./pricing").StoreMetrics>
  monthlyMetrics: import("./pricing").MonthlyMetric[]
  ltvMetrics: Partial<import("./pricing").StoreMetrics>
  healthScore?: import("./pricing").HealthScore
  issues: import("./pricing").CROIssue[]
  pricing?: import("./pricing").PricingQuote
  selectedPackage?: "starter" | "growth" | "scale"
  selectedPaymentModel?: "retainer" | "rev_share" | "hybrid"
  includeAbDomain: boolean
}
