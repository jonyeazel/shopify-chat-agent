export type GalleryCategory = "student-builds" | "landing-pages" | "portfolios"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "student-builds", label: "Student Builds" },
  { value: "landing-pages", label: "Landing Pages" },
  { value: "portfolios", label: "Portfolios" },
]

export type GalleryItem = {
  url: string
  label: string
  aspect: "1:1" | "9:16"
  category: GalleryCategory
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { url: "/images/product-shot.png", label: "SaaS Landing", aspect: "1:1", category: "landing-pages" },
  { url: "/images/gravity-shot.png", label: "Agency Site", aspect: "9:16", category: "student-builds" },
  { url: "/images/2pk-bundle.png", label: "Product Page", aspect: "1:1", category: "landing-pages" },
  { url: "/images/3pk-aov-booster.png", label: "Portfolio", aspect: "9:16", category: "portfolios" },
  { url: "/images/50-50-infographic.png", label: "Dashboard UI", aspect: "1:1", category: "student-builds" },
  { url: "/images/label-info.png", label: "Course Page", aspect: "9:16", category: "landing-pages" },
  { url: "/images/abstract-graphic.png", label: "Creative Portfolio", aspect: "1:1", category: "portfolios" },
  { url: "/images/blank-bottle.png", label: "Startup Landing", aspect: "9:16", category: "student-builds" },
]

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category)
}

export const PORTFOLIO_DATA = {
  // Student-built sites to showcase what's possible
  liveSites: [
    { name: "SaaS Landing", url: "https://v0-vcommercepdp-three.vercel.app", builder: "Student — Week 1" },
    { name: "Agency Site", url: "https://v0-brez-product-page.vercel.app", builder: "Student — Week 2" },
    { name: "Product Page", url: "https://v0-vcommercepdp.vercel.app", builder: "Student — Week 1" },
    { name: "Portfolio", url: "https://v0-mudwater.vercel.app", builder: "Student — Week 3" },
  ],
  
  // Course curriculum modules
  curriculum: {
    module1: {
      name: "Foundation",
      description: "How v0 thinks — the mental model that changes everything",
      lessons: ["Understanding v0's design system", "Prompt structure that works", "Your first real build"],
    },
    module2: {
      name: "Components",
      description: "Building blocks for any website",
      lessons: ["Navigation & headers", "Hero sections that convert", "Feature grids & cards", "Footer & CTAs"],
    },
    module3: {
      name: "Full Pages",
      description: "Landing pages, portfolios, product pages",
      lessons: ["Landing page framework", "Portfolio structure", "Shopify product pages", "Multi-section layouts"],
    },
    module4: {
      name: "Advanced Techniques",
      description: "Animations, responsive design, polish",
      lessons: ["Animation patterns", "Mobile-first responsive", "Dark mode & themes", "Performance optimization"],
    },
    module5: {
      name: "Production",
      description: "From v0 to live site",
      lessons: ["Export & deployment", "Custom domain setup", "Iterating with v0", "Client handoff"],
    },
  },

  // Pricing tiers
  pricing: {
    masterclass: { 
      name: "The v0 Masterclass", 
      price: "$297", 
      description: "Complete video curriculum",
      features: ["5 modules, 20+ lessons", "Prompt frameworks library", "Component templates", "Student community access", "Lifetime updates"],
      popular: true,
      chatPrompt: "Tell me about the v0 Masterclass"
    },
    accelerator: { 
      name: "Accelerator Coaching", 
      price: "$1,497", 
      description: "Course + 4 weeks 1:1 with Jon",
      features: ["Everything in Masterclass", "4 weekly coaching calls", "Personalized feedback", "Direct Slack access", "Priority support"],
      popular: false,
      chatPrompt: "Tell me about Accelerator coaching"
    },
    doneWithYou: { 
      name: "Done-With-You", 
      price: "$3,497",
      description: "Course + 8 weeks + we build together",
      features: ["Everything in Accelerator", "8 weeks of coaching", "Build your first project together", "Perfect for Shopify founders", "White-glove support"],
      popular: false,
      chatPrompt: "Tell me about the Done-With-You program"
    },
  },

  // Testimonials / social proof
  testimonials: [
    {
      name: "Sarah M.",
      role: "Shopify Founder",
      quote: "I was paying $12k/year to an agency. After Module 3, I rebuilt my entire product page library in one weekend. Haven't hired a designer since.",
      result: "Saved $12k/year",
    },
    {
      name: "Marcus T.",
      role: "Freelance Developer",
      quote: "Went from never touching v0 to launching a client site in 4 days. Charged $2k for it. The course paid for itself 7x over.",
      result: "7x ROI in first month",
    },
    {
      name: "Emily R.",
      role: "Marketing Director",
      quote: "I'm not technical at all. Within 48 hours of starting, I built a landing page that outperformed everything our agency had made.",
      result: "Built first site in 48hrs",
    },
  ],
}

export type PricingItem = { 
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  chatPrompt?: string
}
export type LiveSite = { name: string; url: string; builder?: string }
export type Testimonial = { name: string; role: string; quote: string; result: string }
