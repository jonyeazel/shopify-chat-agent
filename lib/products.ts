export interface Product {
  id: string
  name: string
  headline: string
  description: string
  priceInCents: number
  originalPriceInCents?: number
  thumbnail?: string
  includes: string[]
  valueStack: { item: string; value: number }[]
  cta: string
  urgency?: string
}

// Three-tier offer structure
export const PRODUCTS: Product[] = [
  {
    id: "v0-playbook",
    name: "The v0 Playbook",
    headline: "Build sites with AI. No code. No designers. No limits.",
    description: "The complete system for building professional websites using v0.",
    priceInCents: 29700,
    originalPriceInCents: 139700,
    thumbnail: "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg",
    includes: [
      "Core Method Video — the prompt structure that works",
      "78 Production-Ready Templates",
      "13 Live Site Breakdowns",
      "200+ Prompt Swipe File",
      "Lifetime Updates",
      "Direct SMS Access to Jon"
    ],
    valueStack: [
      { item: "Core Method Video", value: 97 },
      { item: "78 Templates", value: 497 },
      { item: "13 Site Breakdowns", value: 297 },
      { item: "200+ Prompt Swipes", value: 197 },
      { item: "Lifetime Updates", value: 297 },
      { item: "SMS Access", value: 0 }, // priceless
    ],
    cta: "Get Instant Access",
    urgency: "Templates updated weekly"
  },
  {
    id: "live-build",
    name: "Live Build Session",
    headline: "Your site. Built live. In 60 minutes.",
    description: "1-on-1 with Jon. You leave with a finished, deployed website.",
    priceInCents: 149700,
    thumbnail: "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg",
    includes: [
      "60-min Live Build (your project, not a demo)",
      "Full Session Recording",
      "The v0 Playbook (included)",
      "7 Days Post-Session SMS Support",
      "Priority Rebooking"
    ],
    valueStack: [
      { item: "60-min Live Build", value: 1500 },
      { item: "Session Recording", value: 297 },
      { item: "v0 Playbook", value: 297 },
      { item: "7-Day SMS Support", value: 497 },
    ],
    cta: "Book Your Session",
    urgency: "Limited spots per week"
  },
  {
    id: "build-sprint",
    name: "The Build Sprint",
    headline: "Your entire web presence. Built in a week.",
    description: "3 Live Build sessions. Landing page, portfolio, and one custom project.",
    priceInCents: 499700,
    thumbnail: "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg",
    includes: [
      "3 Live Build Sessions (60 min each)",
      "Full Web Presence: Landing + Portfolio + Custom",
      "All Session Recordings",
      "The v0 Playbook (included)",
      "30 Days Unlimited SMS Support",
      "Quarterly Check-in Call"
    ],
    valueStack: [
      { item: "3 Live Builds", value: 4500 },
      { item: "All Recordings", value: 891 },
      { item: "v0 Playbook", value: 297 },
      { item: "30-Day Support", value: 1497 },
      { item: "Quarterly Call", value: 500 },
    ],
    cta: "Apply for Sprint",
    urgency: "2 spots per month"
  }
]

// Helper to get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Quick accessors
export const V0_PLAYBOOK = PRODUCTS[0]
export const LIVE_BUILD = PRODUCTS[1]
export const BUILD_SPRINT = PRODUCTS[2]

// Legacy alias
export const V0_UNIVERSITY = V0_PLAYBOOK

// Calculate total stack value
export function getStackValue(product: Product): number {
  return product.valueStack.reduce((sum, item) => sum + item.value, 0)
}

// Format price
export function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString()}`
}
