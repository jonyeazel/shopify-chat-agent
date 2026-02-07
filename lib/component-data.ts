import { Zap, Calendar, Target, FileText, BarChart3, Palette, ShoppingCart, Search, Code, Smartphone } from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ── Case Studies (Before/After Timeline) ──────────────────────────────

export interface TimelineMilestone {
  date: string
  label: string
  description: string
  metrics: { conversionRate: string; revenue: string }
  quote?: { text: string; author: string; role: string }
}

export interface CaseStudy {
  clientName: string
  milestones: TimelineMilestone[]
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    clientName: "Goli Gummies",
    milestones: [
      {
        date: "Jan 15",
        label: "Store Audit",
        description: "Found 12 CRO issues across mobile checkout, PDP layout, and trust signals",
        metrics: { conversionRate: "0.8%", revenue: "$45k/mo" },
        quote: { text: "The audit alone paid for itself", author: "Marcus Chen", role: "CEO" },
      },
      {
        date: "Jan 22",
        label: "Mobile Overhaul",
        description: "Rebuilt checkout flow, added sticky ATC, compressed hero images",
        metrics: { conversionRate: "1.4%", revenue: "$52k/mo" },
      },
      {
        date: "Feb 3",
        label: "PDP Redesign",
        description: "New product pages with urgency messaging and social proof sections",
        metrics: { conversionRate: "2.1%", revenue: "$78k/mo" },
        quote: { text: "Our bounce rate dropped 40% overnight", author: "Marcus Chen", role: "CEO" },
      },
      {
        date: "Feb 10",
        label: "CRO Polish",
        description: "A/B tested upsell flows, added post-purchase offers",
        metrics: { conversionRate: "2.6%", revenue: "$112k/mo" },
        quote: { text: "ROI was 8x in month one", author: "Marcus Chen", role: "CEO" },
      },
    ],
  },
]

// ── Testimonials (Specificity Cards) ──────────────────────────────────

export interface Testimonial {
  name: string
  title: string
  company: string
  beforeRevenue: string
  afterRevenue: string
  timeline: string
  quote: string
  storeUrl?: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marcus Chen",
    title: "CEO",
    company: "Goli Gummies",
    beforeRevenue: "$45k",
    afterRevenue: "$112k/mo",
    timeline: "4 weeks",
    quote: "Jon fixed our mobile checkout and added urgency messaging. ROI was 8x in month one.",
    storeUrl: "https://v0-vcommercepdp-three.vercel.app",
  },
  {
    name: "Sarah Kim",
    title: "Founder",
    company: "BREZ",
    beforeRevenue: "$22k",
    afterRevenue: "$67k/mo",
    timeline: "3 weeks",
    quote: "Our PDP was losing people at the fold. Jon rebuilt it and conversions tripled.",
    storeUrl: "https://v0-brez-product-page.vercel.app",
  },
  {
    name: "David Park",
    title: "Head of DTC",
    company: "Seed Probiotics",
    beforeRevenue: "$180k",
    afterRevenue: "$340k/mo",
    timeline: "6 weeks",
    quote: "We thought our site was fine. Jon showed us $160k/mo in leaked revenue.",
    storeUrl: "https://v0-vcommercepdp.vercel.app",
  },
  {
    name: "Alex Rivera",
    title: "Co-Founder",
    company: "MUD\\WTR",
    beforeRevenue: "$95k",
    afterRevenue: "$210k/mo",
    timeline: "5 weeks",
    quote: "The Smart Store AI system changed everything. Personalized PDPs convert at 2x our old pages.",
    storeUrl: "https://v0-mudwater.vercel.app",
  },
]

// ── Speed Options (Commitment Selector) ───────────────────────────────

export interface SpeedOption {
  id: string
  icon: LucideIcon
  title: string
  subtitle: string
  price: string
  timeline: string
  nextSteps: string[]
}

export const SPEED_OPTIONS: SpeedOption[] = [
  {
    id: "fast",
    icon: Zap,
    title: "This week",
    subtitle: "48-hour redesign",
    price: "$5k",
    timeline: "Get live by Friday",
    nextSteps: [
      "I'll text you within 2 hours",
      "Quick 15-min call to confirm scope",
      "You send store access",
      "48 hours later: new store live",
    ],
  },
  {
    id: "standard",
    icon: Calendar,
    title: "This month",
    subtitle: "Full CRO build",
    price: "$7.5k",
    timeline: "2-week turnaround",
    nextSteps: [
      "I'll text you within 2 hours",
      "30-min strategy call",
      "Full audit + mockups in 3 days",
      "Build + launch in 2 weeks",
    ],
  },
  {
    id: "later",
    icon: Target,
    title: "When it's right",
    subtitle: "Let's stay in touch",
    price: "Free",
    timeline: "Monthly tips + priority queue",
    nextSteps: [
      "Drop your email below",
      "Get weekly CRO tips",
      "Priority booking when you're ready",
      "No spam, unsubscribe anytime",
    ],
  },
]

// ── Deliverables (Process Preview Stack) ──────────────────────────────

export interface Deliverable {
  icon: LucideIcon
  title: string
  description: string
}

export const DELIVERABLES: Record<string, Deliverable[]> = {
  redesign: [
    { icon: Search, title: "CRO Audit Report", description: "12-page PDF with prioritized fixes and revenue projections" },
    { icon: Palette, title: "Custom Design System", description: "Typography, colors, and component library matched to your brand" },
    { icon: Smartphone, title: "Mobile-First Rebuild", description: "Every page rebuilt for thumb-friendly mobile shopping" },
    { icon: ShoppingCart, title: "Checkout Optimization", description: "Streamlined cart and checkout with trust signals" },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Custom GA4 setup tracking conversions, AOV, and funnel drops" },
    { icon: Code, title: "Speed Optimization", description: "Sub-2s load times with lazy loading and image compression" },
  ],
  smartStore: [
    { icon: Search, title: "AI Quiz Funnel", description: "Personalized product recommendations based on customer answers" },
    { icon: Smartphone, title: "10 Custom PDPs", description: "Each page tailored to a different customer profile" },
    { icon: FileText, title: "100 Ad Creatives", description: "Static and video ads optimized for Meta and TikTok" },
    { icon: BarChart3, title: "Conversion Tracking", description: "Full-funnel analytics from ad click to purchase" },
    { icon: Palette, title: "Brand System", description: "Complete visual identity aligned across all touchpoints" },
    { icon: Code, title: "Shopify Integration", description: "Seamless setup with your existing store and apps" },
  ],
  default: [
    { icon: Search, title: "Store Audit", description: "Complete analysis of conversion blockers and quick wins" },
    { icon: Palette, title: "Design Mockups", description: "High-fidelity designs for every page before we build" },
    { icon: Smartphone, title: "Mobile Build", description: "Pixel-perfect implementation optimized for mobile" },
    { icon: ShoppingCart, title: "Checkout Flow", description: "Streamlined path from product page to purchase" },
    { icon: BarChart3, title: "Analytics Setup", description: "Conversion tracking and revenue attribution" },
    { icon: Code, title: "Performance Tuning", description: "Speed optimization and Core Web Vitals fixes" },
  ],
}
