// v0 University - simple product catalog
// One product: the 3-minute video + smart templates for $297

export interface Product {
  id: string
  name: string
  price: number
  description: string
  features: string[]
}

export const PRODUCT: Product = {
  id: "v0-university",
  name: "v0 University",
  price: 297,
  description: "One video. All templates. Build a site today.",
  features: [
    "3-minute video tutorial",
    "AI-powered smart templates",
    "Build your first site the same day",
    "Leave a 12-word testimonial if it works",
  ],
}

// No service tiers, no consulting packages, no complex pricing
// Just one thing that works
