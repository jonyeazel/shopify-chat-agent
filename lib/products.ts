export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  thumbnail?: string
}

// v0 University product catalog
export const PRODUCTS: Product[] = [
  {
    id: "v0-university",
    name: "v0 University",
    description: "57-second video lesson + smart templates. Build your first website with AI.",
    priceInCents: 29700, // $297
    thumbnail: "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg",
  },
]

// Helper to get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// The main product
export const V0_UNIVERSITY = PRODUCTS[0]
