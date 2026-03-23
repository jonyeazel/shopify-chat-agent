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
    headline: "Your private AI tutor. 24/7. Forever.",
    description: "The exact methodology behind 25,000+ prompts. Completely automated.",
    priceInCents: 49700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Private AI Tutor (24/7 access)",
      "The 36-Word Seed Prompt System",
      "The 'Cook' Workflow",
      "Domain Linking Guide (Vercel)",
      "Stripe Integration Guide",
      "Supabase Setup Guide",
      "Lifetime Access"
    ],
    valueStack: [
      { item: "Private AI Tutor", value: 2997 },
      { item: "Seed Prompt System", value: 997 },
      { item: "Integration Guides", value: 497 },
      { item: "Lifetime Access", value: 1997 },
    ],
    cta: "Get Lifetime Access",
    urgency: "One-time payment. No calls."
  },
  {
    id: "clone-site",
    name: "Clone This Site",
    headline: "This exact site. Built for your business.",
    description: "AI sales agent. Stripe checkout. 24/7 lead capture. Yours.",
    priceInCents: 349700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Exact Clone of v0university.com",
      "AI Conversation Layer (trained on you)",
      "Stripe Checkout Integration",
      "SMS Lead Notifications",
      "Custom Domain Setup",
      "14 Days of Optimization",
      "v0 Tutor Access (included)"
    ],
    valueStack: [
      { item: "AI-Powered Site Clone", value: 10000 },
      { item: "Custom AI Training", value: 3000 },
      { item: "Stripe + SMS Integration", value: 2000 },
      { item: "14-Day Optimization", value: 1500 },
      { item: "v0 Tutor Access", value: 497 },
    ],
    cta: "Get Your Site",
    urgency: "2 spots per month"
  },
  {
    id: "ai-consulting",
    name: "AI Consulting",
    headline: "I don't just build sites. I build machines.",
    description: "Custom AI agents, automation systems, scalable workflows.",
    priceInCents: 0, // Custom pricing - starts at $10k
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Discovery Call",
      "Custom AI Agent Development",
      "Automation Systems",
      "Scalable Workflows",
      "Ongoing Strategy",
      "Direct Access to Jon"
    ],
    valueStack: [
      { item: "Custom Development", value: 25000 },
      { item: "Automation Systems", value: 10000 },
      { item: "Strategy Calls", value: 5000 },
    ],
    cta: "Book Discovery Call",
    urgency: "Starts at $10k"
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
