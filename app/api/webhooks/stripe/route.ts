import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { sendProposalPaidNotification, sendKillSwitchWarningNotification } from "@/app/actions/notifications"

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const { leadId, productId, quoteId, type } = session.metadata || {}

      if (leadId && productId === "cro-audit-proposal") {
        await supabase
          .from("quotes")
          .update({
            proposal_paid: true,
            proposal_paid_at: new Date().toISOString(),
            stripe_payment_id: session.payment_intent as string,
            status: "sent",
          })
          .eq("lead_id", leadId)

        await supabase.from("leads").update({ status: "paid" }).eq("id", leadId)

        const { data: quote } = await supabase.from("quotes").select("id").eq("lead_id", leadId).single()

        await supabase.from("payment_history").insert({
          lead_id: leadId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: 9700,
          payment_type: "proposal",
          status: "completed",
          paid_at: new Date().toISOString(),
        })

        await sendProposalPaidNotification(leadId)
      }

      if (leadId && type === "contract_deposit") {
        await supabase
          .from("quotes")
          .update({
            status: "accepted",
            accepted_at: new Date().toISOString(),
          })
          .eq("id", quoteId)

        await supabase.from("leads").update({ status: "building" }).eq("id", leadId)

        // Update contract status
        await supabase
          .from("contracts")
          .update({
            status: "signed",
            signed_at: new Date().toISOString(),
          })
          .eq("lead_id", leadId)

        // Get quote for amount
        const { data: quote } = await supabase.from("quotes").select("base_build_price").eq("id", quoteId).single()

        await supabase.from("payment_history").insert({
          lead_id: leadId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: Math.round((quote?.base_build_price || 0) / 2) * 100,
          payment_type: "deposit",
          status: "completed",
          paid_at: new Date().toISOString(),
        })

        // Create project
        const { data: metrics } = await supabase
          .from("store_metrics")
          .select("conversion_rate")
          .eq("lead_id", leadId)
          .single()

        await supabase.from("projects").insert({
          lead_id: leadId,
          quote_id: quoteId,
          status: "queued",
          build_started_at: new Date().toISOString(),
          baseline_conversion_rate: metrics?.conversion_rate,
        })
      }

      if (leadId && session.metadata?.packageTier) {
        const packageTier = session.metadata.packageTier
        const includeAbDomain = session.metadata.includeAbDomain === "true"

        await supabase
          .from("quotes")
          .update({
            package_tier: packageTier,
            ab_domain_upsell: includeAbDomain ? 2997 : 0,
            status: "accepted",
            accepted_at: new Date().toISOString(),
          })
          .eq("lead_id", leadId)

        await supabase.from("leads").update({ status: "building" }).eq("id", leadId)
      }
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        await supabase
          .from("projects")
          .update({
            payments_current: true,
            last_payment_date: new Date().toISOString(),
            subscription_status: "active",
          })
          .eq("stripe_subscription_id", subscriptionId)

        // Record payment
        const { data: project } = await supabase
          .from("projects")
          .select("id, lead_id")
          .eq("stripe_subscription_id", subscriptionId)
          .single()

        if (project) {
          await supabase.from("payment_history").insert({
            lead_id: project.lead_id,
            project_id: project.id,
            stripe_invoice_id: invoice.id,
            amount: invoice.amount_paid,
            payment_type: "retainer",
            status: "completed",
            paid_at: new Date().toISOString(),
          })
        }
      }
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      if (subscriptionId) {
        const { data: project } = await supabase
          .from("projects")
          .select("id")
          .eq("stripe_subscription_id", subscriptionId)
          .single()

        if (project) {
          await supabase
            .from("projects")
            .update({
              payments_current: false,
              subscription_status: "past_due",
            })
            .eq("id", project.id)

          await sendKillSwitchWarningNotification(project.id)
        }
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from("projects")
        .update({
          status: "paused",
          payments_current: false,
          subscription_status: "canceled",
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription

      await supabase
        .from("projects")
        .update({
          subscription_status: subscription.status,
          next_payment_date: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
        })
        .eq("stripe_subscription_id", subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
