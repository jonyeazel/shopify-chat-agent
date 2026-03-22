"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS, V0_PLAYBOOK } from "@/lib/products"

export async function startCheckout(productId: string = V0_PLAYBOOK.id) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error("Product not found")
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?canceled=true`,
    metadata: {
      productId: product.id,
      source: "v0-university",
    },
  })

  return session.url
}

// Embedded checkout - returns client secret for inline Stripe form
export async function startEmbeddedCheckout(productId: string = V0_PLAYBOOK.id): Promise<string> {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error("Product not found")
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      productId: product.id,
      source: "v0-university",
    },
  })

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session")
  }

  return session.client_secret
}
