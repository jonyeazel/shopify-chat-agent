export interface Product {
  id: string
  stripePriceId?: string
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

// Optimized 3-tier structure: Touchless → Mid-Touch → High-Touch
export const PRODUCTS: Product[] = [
  {
    id: "v0-tutor",
    stripePriceId: "price_v0tutor",
    name: "v0 Tutor",
    headline: "The method that builds websites in hours, not weeks.",
    description: "For the people who build, buy & sell websites. Learn once, use forever.",
    priceInCents: 49700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "The Cook Method (Full System)",
      "Intent Seed Framework",
      "24/7 AI Tutor Access",
      "Domain + Hosting Setup",
      "Stripe Integration Guide",
      "Supabase Setup Guide",
      "Lifetime Access"
    ],
    valueStack: [
      { item: "AI Tutor (24/7)", value: 2997 },
      { item: "The Cook Method", value: 997 },
      { item: "Integration Playbooks", value: 497 },
      { item: "Lifetime Access", value: 1997 },
    ],
    cta: "Get Lifetime Access",
    urgency: "Pay once. Keep forever."
  },
  {
    id: "clone-site",
    name: "Clone This Site",
    headline: "This exact site. For your business.",
    description: "AI that sells 24/7. Stripe checkout. SMS alerts. Live in 14 days.",
    priceInCents: 349700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Full Clone of This Site",
      "AI Trained on Your Business",
      "Stripe Payment Integration",
      "SMS Lead Notifications",
      "Custom Domain + Hosting",
      "14 Days of Tweaks",
      "v0 Tutor Included"
    ],
    valueStack: [
      { item: "AI Sales Site", value: 10000 },
      { item: "Custom AI Training", value: 3000 },
      { item: "Payments + Notifications", value: 2000 },
      { item: "2 Weeks of Polish", value: 1500 },
      { item: "v0 Tutor Access", value: 497 },
    ],
    cta: "Clone It",
    urgency: "2 spots/month"
  },
  {
    id: "ai-consulting",
    name: "AI Consulting",
    headline: "I don't build sites. I build machines.",
    description: "Custom AI agents. Systems that run while you sleep. 40-hour weeks back.",
    priceInCents: 0, // Custom pricing - starts at $10k
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Discovery Call",
      "Custom AI Agents",
      "Automation Workflows",
      "Backend Systems",
      "Ongoing Support",
      "Direct Access to Jon"
    ],
    valueStack: [
      { item: "Custom AI Build", value: 25000 },
      { item: "Automation Systems", value: 10000 },
      { item: "Strategy & Support", value: 5000 },
    ],
    cta: "Book Discovery",
    urgency: "$10k minimum"
  }
]

// Helper to get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Quick accessors
export const V0_TUTOR = PRODUCTS[0]
export const CLONE_SITE = PRODUCTS[1]
export const AI_CONSULTING = PRODUCTS[2]

// Legacy aliases for backward compatibility
export const V0_PLAYBOOK = V0_TUTOR
export const LIVE_BUILD = CLONE_SITE
export const DONE_FOR_YOU = CLONE_SITE
export const SEE_IT = V0_TUTOR
export const BUILD_WITH_ME = CLONE_SITE

// Calculate total stack value
export function getStackValue(product: Product): number {
  return product.valueStack.reduce((sum, item) => sum + item.value, 0)
}

// Format price
export function formatPrice(cents: number): string {
  if (cents === 0) return "Custom"
  return `$${(cents / 100).toLocaleString()}`
}
