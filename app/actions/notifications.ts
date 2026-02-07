"use server"

import { createClient } from "@/lib/supabase/server"

interface EmailData {
  to: string
  subject: string
  body: string
  leadId?: string
}

// This would integrate with your email provider (Resend, SendGrid, etc.)
export async function sendEmail(data: EmailData) {
  // For now, we'll log the email and store it in the database
  // In production, integrate with Resend or similar
  console.log("[v0] Email would be sent:", data)

  const supabase = await createClient()

  // Store notification record
  if (data.leadId) {
    await supabase.from("chat_messages").insert({
      lead_id: data.leadId,
      role: "system",
      content: `Email sent: ${data.subject}`,
      metadata: { type: "email_notification", to: data.to },
    })
  }

  return { success: true }
}

export async function sendProposalPaidNotification(leadId: string) {
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("*, store_metrics(*), quotes(*)").eq("id", leadId).single()

  if (!lead) return { success: false, error: "Lead not found" }

  const metrics = lead.store_metrics
  const quote = lead.quotes?.[0]

  // Send to admin
  await sendEmail({
    to: "admin@theshopifyguy.com",
    subject: `New Paid Proposal: ${lead.store_domain}`,
    body: `
      New proposal paid!

      Store: ${lead.store_domain}
      Contact: ${lead.contact_name} (${lead.email})
      Health Score: ${metrics?.health_score}/100
      Revenue Opportunity: $${Math.round(metrics?.revenue_opportunity || 0).toLocaleString()}
      
      Quote Details:
      - Package: ${quote?.package_tier}
      - Build: $${quote?.base_build_price?.toLocaleString()}
      - Retainer: $${quote?.monthly_retainer}/mo

      Review and approve: ${process.env.NEXT_PUBLIC_APP_URL || ""}/admin
    `,
    leadId,
  })

  // Send to customer
  await sendEmail({
    to: lead.email,
    subject: "Your CRO Audit is Ready - The Shopify Guy",
    body: `
      Hi ${lead.contact_name},

      Thank you for your payment! Your full CRO audit for ${lead.store_domain} is now ready.

      View your complete report here:
      ${process.env.NEXT_PUBLIC_APP_URL || ""}/report/${leadId}

      Key Findings:
      - Store Health Score: ${metrics?.health_score}/100
      - Conversion Rate: ${((metrics?.conversion_rate || 0) * 100).toFixed(2)}%
      - Revenue Opportunity: $${Math.round(metrics?.revenue_opportunity || 0).toLocaleString()}

      Ready to transform your store? Book your strategy call:
      https://calendly.com/theshopifyguy/cro-strategy

      Best,
      The Shopify Guy Team
    `,
    leadId,
  })

  return { success: true }
}

export async function sendContractNotification(leadId: string, contractUrl: string) {
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

  if (!lead) return { success: false }

  await sendEmail({
    to: lead.email,
    subject: "Your CRO Service Agreement - Action Required",
    body: `
      Hi ${lead.contact_name},

      Great news! Your quote has been approved and we're ready to start building your optimized store.

      Please review and sign your service agreement here:
      ${contractUrl}

      What happens next:
      1. Review and sign the contract
      2. Complete the initial payment
      3. We'll start building within 48 hours

      Questions? Reply to this email or book a quick call.

      Best,
      The Shopify Guy Team
    `,
    leadId,
  })

  return { success: true }
}

export async function sendPaymentReminderNotification(projectId: string) {
  const supabase = await createClient()

  const { data: project } = await supabase.from("projects").select("*, leads(*)").eq("id", projectId).single()

  if (!project?.leads) return { success: false }

  const lead = project.leads as any

  await sendEmail({
    to: lead.email,
    subject: "Payment Reminder - The Shopify Guy",
    body: `
      Hi ${lead.contact_name},

      This is a friendly reminder that your monthly retainer payment is due.

      To avoid any service interruption, please ensure your payment method is up to date.

      If you have any questions about your account, please reach out.

      Best,
      The Shopify Guy Team
    `,
    leadId: lead.id,
  })

  return { success: true }
}

export async function sendKillSwitchWarningNotification(projectId: string) {
  const supabase = await createClient()

  const { data: project } = await supabase.from("projects").select("*, leads(*)").eq("id", projectId).single()

  if (!project?.leads) return { success: false }

  const lead = project.leads as any

  await sendEmail({
    to: lead.email,
    subject: "URGENT: Service Suspension Warning - The Shopify Guy",
    body: `
      Hi ${lead.contact_name},

      Your payment is past due and your optimized store is at risk of suspension.

      Please update your payment method within 7 days to avoid service interruption.

      If you're experiencing any issues, please contact us immediately so we can help resolve them.

      Best,
      The Shopify Guy Team
    `,
    leadId: lead.id,
  })

  return { success: true }
}
