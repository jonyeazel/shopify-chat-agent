"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS, V0_TUTOR } from "@/lib/products"

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

export async function startCheckout(productId: string = V0_TUTOR.id): Promise<string> {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) throw new Error("Product not found")
  if (product.priceInCents === 0) throw new Error("Custom pricing - contact Jon directly")

  const baseUrl = getBaseUrl()

  const session = await stripe.checkout.sessions.create({
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
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&product=${productId}`,
    cancel_url: `${baseUrl}/?cancelled=true`,
    metadata: {
      productId: product.id,
      source: "v0-university",
    },
  })

  if (!session.url) throw new Error("Failed to create checkout session")
  return session.url
}
