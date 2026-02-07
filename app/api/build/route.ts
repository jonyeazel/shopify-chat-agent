import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// This endpoint is called to trigger the automated build pipeline
// In production, this would integrate with the v0 API

export async function POST(req: Request) {
  const { projectId, leadId } = await req.json()

  if (!projectId && !leadId) {
    return NextResponse.json({ error: "projectId or leadId required" }, { status: 400 })
  }

  const supabase = await createClient()

  // Get the project/lead info
  let project
  let lead

  if (projectId) {
    const { data } = await supabase.from("projects").select("*, leads(*), quotes(*)").eq("id", projectId).single()
    project = data
    lead = data?.leads
  } else {
    const { data: leadData } = await supabase
      .from("leads")
      .select("*, store_metrics(*), quotes(*), cro_issues(*)")
      .eq("id", leadId)
      .single()
    lead = leadData

    // Create project if it doesn't exist
    const { data: newProject } = await supabase
      .from("projects")
      .insert({
        lead_id: leadId,
        quote_id: leadData?.quotes?.[0]?.id,
        status: "building",
        build_started_at: new Date().toISOString(),
        baseline_conversion_rate: leadData?.store_metrics?.conversion_rate,
      })
      .select()
      .single()
    project = newProject
  }

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  }

  // Generate build instructions for v0
  const buildInstructions = {
    projectId: project?.id,
    storeDomain: lead.store_domain,
    storefrontApiKey: lead.storefront_api_key,
    packageTier: lead.quotes?.[0]?.package_tier || "growth",

    // Template configuration based on package
    template: {
      starter: {
        features: ["conversion-optimized-theme", "mobile-optimization", "speed-optimization", "basic-analytics"],
      },
      growth: {
        features: [
          "conversion-optimized-theme",
          "mobile-optimization",
          "speed-optimization",
          "advanced-analytics",
          "ab-testing-framework",
          "checkout-optimization",
          "email-capture-optimization",
        ],
        includeAbDomain: true,
      },
      scale: {
        features: [
          "conversion-optimized-theme",
          "mobile-optimization",
          "speed-optimization",
          "enterprise-analytics",
          "ab-testing-framework",
          "checkout-optimization",
          "email-capture-optimization",
          "automation-suite",
          "custom-integrations",
        ],
        includeAbDomain: true,
        includeAutomation: true,
      },
    },

    // Priority issues to fix
    priorityIssues: lead.cro_issues
      ?.filter((i: any) => i.severity === "critical" || i.severity === "high")
      .map((i: any) => ({
        type: i.issue_type,
        title: i.title,
        severity: i.severity,
      })),

    // Metrics for context
    currentMetrics: {
      conversionRate: lead.store_metrics?.conversion_rate,
      healthScore: lead.store_metrics?.health_score,
      aov: lead.store_metrics?.amount_per_customer,
      sessions: lead.store_metrics?.total_sessions,
    },

    // v0 prompt template
    v0Prompt: generateV0Prompt(lead, lead.quotes?.[0]),
  }

  // Update project status
  await supabase
    .from("projects")
    .update({
      status: "building",
      build_started_at: new Date().toISOString(),
    })
    .eq("id", project?.id)

  // Update lead status
  await supabase.from("leads").update({ status: "building" }).eq("id", lead.id)

  return NextResponse.json({
    success: true,
    buildInstructions,
    message: "Build pipeline triggered. Project will be 95% complete when ready for review.",
  })
}

function generateV0Prompt(lead: any, quote: any): string {
  const tier = quote?.package_tier || "growth"

  return `
Create a high-converting Shopify headless storefront for ${lead.store_domain}.

## Store Context
- Current conversion rate: ${((lead.store_metrics?.conversion_rate || 0) * 100).toFixed(2)}%
- Target: 2.5% (industry benchmark)
- AOV: $${lead.store_metrics?.amount_per_customer?.toFixed(0) || "N/A"}
- Health Score: ${lead.store_metrics?.health_score || 0}/100

## Package: ${tier.charAt(0).toUpperCase() + tier.slice(1)}

## Required Features
${
  tier === "starter"
    ? `
- Conversion-optimized product pages
- Mobile-first responsive design
- Speed-optimized images and code
- Basic analytics tracking
`
    : tier === "growth"
      ? `
- Everything in Starter
- A/B testing framework
- Advanced checkout optimization
- Email capture with exit intent
- Product recommendations engine
- Real-time inventory urgency
`
      : `
- Everything in Growth
- Full automation suite
- Custom integrations
- Personalization engine
- Advanced analytics dashboard
`
}

## Priority Fixes
${
  lead.cro_issues
    ?.filter((i: any) => i.severity === "critical")
    .map((i: any) => `- ${i.title}`)
    .join("\n") || "None specified"
}

## Storefront API
- Domain: ${lead.store_domain}
${lead.storefront_api_key ? `- API Key: ${lead.storefront_api_key}` : "- API Key: To be provided"}

Build a production-ready storefront that addresses these conversion issues and implements best practices for Shopify CRO.
`
}
