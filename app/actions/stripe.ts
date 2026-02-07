"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"

export async function startChatCheckout(productId: string, customerEmail?: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error("Product not found")
  }

  const isRecurring = product.recurring === true

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          ...(isRecurring && {
            recurring: {
              interval: "month",
            },
          }),
        },
        quantity: 1,
      },
    ],
    mode: isRecurring ? "subscription" : "payment",
    metadata: {
      productId: product.id,
      source: "chat",
    },
  })

  return {
    clientSecret: session.client_secret,
    productName: product.name,
    amount: product.priceInCents / 100,
    recurring: isRecurring,
  }
}

export async function startProposalCheckout(leadId: string) {
  const product = PRODUCTS.find((p) => p.id === "cro-audit-proposal")
  if (!product) {
    throw new Error("Product not found")
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      leadId,
      productId: product.id,
    },
  })

  return session.client_secret
}

export async function startBuildCheckout(leadId: string, packageTier: string, includeAbDomain: boolean) {
  const packageProducts: Record<string, string> = {
    starter: "starter-build",
    growth: "growth-build",
    scale: "scale-build",
  }

  const productId = packageProducts[packageTier]
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error("Product not found")
  }

  const lineItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.priceInCents,
      },
      quantity: 1,
    },
  ]

  if (includeAbDomain && packageTier === "starter") {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "A/B Testing Domain",
          description: "Separate domain for side-by-side comparison testing",
        },
        unit_amount: 299700,
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: lineItems,
    mode: "payment",
    metadata: {
      leadId,
      packageTier,
      includeAbDomain: includeAbDomain ? "true" : "false",
    },
  })

  return session.client_secret
}

export async function createSubscription(leadId: string, monthlyAmount: number) {
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("email, contact_name").eq("id", leadId).single()

  if (!lead) {
    throw new Error("Lead not found")
  }

  const customers = await stripe.customers.list({ email: lead.email, limit: 1 })
  let customer = customers.data[0]

  if (!customer) {
    customer = await stripe.customers.create({
      email: lead.email,
      name: lead.contact_name,
      metadata: { leadId },
    })
  }

  // Update lead with Stripe customer ID
  await supabase.from("leads").update({ stripe_customer_id: customer.id }).eq("id", leadId)

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "CRO Monthly Retainer",
            description: "Ongoing conversion optimization and support",
          },
          unit_amount: monthlyAmount * 100,
          recurring: {
            interval: "month",
          },
        },
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })

  return {
    subscriptionId: subscription.id,
    clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
  }
}

export async function startContractCheckout(leadId: string, quoteId: string) {
  const supabase = await createClient()

  const { data: lead } = await supabase
    .from("leads")
    .select("email, contact_name, store_domain")
    .eq("id", leadId)
    .single()
  const { data: quote } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (!lead || !quote) {
    throw new Error("Lead or quote not found")
  }

  // 50% deposit
  const depositAmount = Math.round(quote.base_build_price / 2)

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `CRO Build Deposit - ${lead.store_domain}`,
            description: `50% deposit for ${quote.package_tier || "Growth"} package`,
          },
          unit_amount: depositAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      leadId,
      quoteId,
      type: "contract_deposit",
    },
  })

  return session.client_secret
}

export async function getCustomerPortalUrl(leadId: string) {
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("stripe_customer_id").eq("id", leadId).single()

  if (!lead?.stripe_customer_id) {
    throw new Error("No Stripe customer found")
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: lead.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || ""}/portal/${leadId}`,
  })

  return session.url
}
