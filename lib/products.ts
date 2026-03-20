export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

// v0 University product catalog
export const PRODUCTS: Product[] = [
  {
    id: "v0-university",
    name: "v0 University",
    description: "3-minute video tutorial + AI-powered smart templates. Build a website today.",
    priceInCents: 29700, // $297
  },
]

// Helper to get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// The main product
export const V0_UNIVERSITY = PRODUCTS[0]
