export interface Product {
  id: string
  stripePriceId: string // Stripe price ID for checkout
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
    stripePriceId: "price_1TDeFNRjQCLburEC7Cr2WEds",
    name: "The v0 Playbook",
    headline: "Your site live TODAY. Zero experience needed.",
    description: "20-minute video. Your website on your domain. Guaranteed.",
    priceInCents: 19700,
    originalPriceInCents: 29700,
    thumbnail: "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg",
    includes: [
      "Core Method Video (20 min)",
      "5 Foundation Templates",
      "5 Power Prompts",
      "Free Custom Domain",
      "$50 in v0 Credits",
      "Direct SMS to Jon"
    ],
    valueStack: [
      { item: "Core Method Video", value: 297 },
      { item: "5 Foundation Templates", value: 297 },
      { item: "5 Power Prompts", value: 197 },
      { item: "Custom Domain", value: 20 },
      { item: "$50 v0 Credits", value: 50 },
    ],
    cta: "Get Instant Access",
    urgency: "Limited time: $197 (normally $297)"
  },
  {
    id: "live-build",
    stripePriceId: "price_1TDeFURjQCLburECQeLUBw4t",
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
    stripePriceId: "price_1TDeFZRjQCLburECw63Ynqym",
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
