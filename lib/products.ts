export interface Product {
  id: string
  stripePriceId?: string // Stripe price ID for checkout (optional - will create dynamically if not set)
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

// Four-tier offer structure
export const PRODUCTS: Product[] = [
  {
    id: "v0-playbook",
    // Dynamic pricing at $197
    name: "See It For Yourself",
    headline: "Download the skillset. Build in seconds.",
    description: "Quick walkthrough with Jon. Watch a website appear from a sentence.",
    priceInCents: 19700,
    originalPriceInCents: 29700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Quick walkthrough with Jon",
      "Fill-in-the-blank prompt system",
      "5 Foundation Templates",
      "5 Power Prompts",
      "Free Custom Domain",
      "$50 in v0 Credits"
    ],
    valueStack: [
      { item: "Walkthrough with Jon", value: 297 },
      { item: "Prompt System", value: 297 },
      { item: "5 Templates", value: 197 },
      { item: "Custom Domain", value: 20 },
      { item: "$50 v0 Credits", value: 50 },
    ],
    cta: "Try It Now",
    urgency: "Limited time: $197"
  },
  {
    id: "live-build",
    stripePriceId: "price_1TDeFURjQCLburECQeLUBw4t",
    name: "Build With Me",
    headline: "Your project. Built live. Skill transferred.",
    description: "1-on-1 with Jon. You click, he guides. Leave knowing how to build.",
    priceInCents: 149700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Live 1:1 Build Session",
      "Your Real Project (not a demo)",
      "Full Session Recording",
      "7 Days SMS Support",
      "See It For Yourself (included)"
    ],
    valueStack: [
      { item: "Live 1:1 Session", value: 1500 },
      { item: "Your Project Built", value: 500 },
      { item: "Session Recording", value: 297 },
      { item: "7-Day Support", value: 497 },
    ],
    cta: "Book Your Session",
    urgency: "Limited spots weekly"
  },
  {
    id: "done-for-you",
    // Premium tier
    name: "Done-For-You",
    headline: "Jon's exact system. Built for your business.",
    description: "High-converting, AI-native site. You get what works.",
    priceInCents: 649700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Jon's Full System Rebuilt",
      "Customized for Your Business",
      "AI Conversation Layer",
      "Stripe Checkout Integration",
      "30 Days Optimization",
      "Monthly Strategy Call"
    ],
    valueStack: [
      { item: "Full System Clone", value: 15000 },
      { item: "Custom AI Training", value: 5000 },
      { item: "Stripe Integration", value: 2000 },
      { item: "30-Day Optimization", value: 3000 },
    ],
    cta: "Get Your Site",
    urgency: "Premium option"
  },
  {
    id: "ai-consulting",
    // Custom pricing
    name: "AI Consulting",
    headline: "I don't just build sites. I build machines.",
    description: "Custom AI agents, automation systems, scalable workflows.",
    priceInCents: 0, // Custom pricing
    thumbnail: "/jon-avatar.jpg",
    includes: [
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
    cta: "Let's Talk",
    urgency: "Custom pricing"
  },
  {
    id: "v0-tutor",
    stripePriceId: "price_v0tutor", // Will create in Stripe
    name: "v0 Tutor",
    headline: "Your private AI tutor. 24/7. Forever.",
    description: "The exact methodology that built 25,000+ prompts. Lifetime access.",
    priceInCents: 49700,
    thumbnail: "/jon-avatar.jpg",
    includes: [
      "Private AI Tutor (24/7 access)",
      "The 36-Word Seed Prompt System",
      "Domain Linking Walkthrough",
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
    urgency: "One-time payment"
  }
]

// Helper to get product by ID
export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Quick accessors
export const SEE_IT = PRODUCTS[0]
export const BUILD_WITH_ME = PRODUCTS[1]
export const DONE_FOR_YOU = PRODUCTS[2]
export const AI_CONSULTING = PRODUCTS[3]
export const V0_TUTOR = PRODUCTS[4]

// Legacy aliases
export const V0_PLAYBOOK = SEE_IT
export const LIVE_BUILD = BUILD_WITH_ME

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
