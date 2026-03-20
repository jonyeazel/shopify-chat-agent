"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS, V0_UNIVERSITY } from "@/lib/products"

export async function startCheckout(productId: string = V0_UNIVERSITY.id) {
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
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.thumbnail ? [product.thumbnail] : undefined,
          },
          unit_amount: product.priceInCents,
        },
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
