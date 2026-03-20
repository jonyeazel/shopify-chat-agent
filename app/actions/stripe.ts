"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS, V0_UNIVERSITY } from "@/lib/products"

export async function startCheckout(productId: string = V0_UNIVERSITY.id) {
  const product = PRODUCTS.find((p) => p.id === productId)
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
      productId: product.id,
      source: "v0-university",
    },
  })

  return session.client_secret
}
