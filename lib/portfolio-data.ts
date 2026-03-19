export type GalleryCategory = "ecommerce" | "saas" | "portfolios" | "tools"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS" },
  { value: "portfolios", label: "Portfolios" },
  { value: "tools", label: "Tools" },
]

export type GalleryItem = {
  url: string
  label: string
  aspect: "1:1" | "9:16"
  category: GalleryCategory
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { url: "https://v0-stadics.vercel.app/", label: "Stadics", aspect: "9:16", category: "saas" },
  { url: "https://www.stadics.com", label: "Stadics Live", aspect: "9:16", category: "saas" },
  { url: "https://v0-neon-v0-templates.vercel.app/", label: "Neon Templates", aspect: "9:16", category: "tools" },
  { url: "https://www.theshopifyguy.dev", label: "Shopify Guy", aspect: "9:16", category: "portfolios" },
  { url: "https://v0-shopifystorefront.vercel.app/", label: "Storefront", aspect: "9:16", category: "ecommerce" },
  { url: "https://v0-aiblocks.vercel.app/", label: "AI Blocks", aspect: "9:16", category: "tools" },
  { url: "https://v0-designblocks.vercel.app/", label: "Design Blocks", aspect: "9:16", category: "tools" },
  { url: "https://vibecode-black.vercel.app/", label: "Vibecode", aspect: "9:16", category: "saas" },
  { url: "https://v0-vcommercepdp-three.vercel.app", label: "Commerce PDP", aspect: "9:16", category: "ecommerce" },
  { url: "https://v0-brez-product-page.vercel.app", label: "Brez Product", aspect: "9:16", category: "ecommerce" },
  { url: "https://v0-mudwater.vercel.app", label: "MUD\\WTR", aspect: "9:16", category: "ecommerce" },
  { url: "https://www.ilyavolgin.com", label: "Ilya Volgin", aspect: "9:16", category: "portfolios" },
  { url: "https://www.molar.digital", label: "Molar Digital", aspect: "9:16", category: "portfolios" },
  { url: "https://v0-viberrpro.vercel.app/", label: "Viberr Pro", aspect: "9:16", category: "saas" },
]

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category)
}

export const PORTFOLIO_DATA = {
  // Live sites built with v0 to showcase in iframes
  liveSites: [
    { name: "Stadics Analytics", url: "https://v0-stadics.vercel.app/", category: "SaaS" },
    { name: "Neon Templates", url: "https://v0-neon-v0-templates.vercel.app/", category: "Tools" },
    { name: "Shopify Storefront", url: "https://v0-shopifystorefront.vercel.app/", category: "E-commerce" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/", category: "Tools" },
    { name: "Design Blocks", url: "https://v0-designblocks.vercel.app/", category: "Tools" },
    { name: "Commerce PDP", url: "https://v0-vcommercepdp-three.vercel.app", category: "E-commerce" },
    { name: "Brez Product Page", url: "https://v0-brez-product-page.vercel.app", category: "E-commerce" },
    { name: "MUD\\WTR Clone", url: "https://v0-mudwater.vercel.app", category: "E-commerce" },
    { name: "Vibecode", url: "https://vibecode-black.vercel.app/", category: "SaaS" },
    { name: "Viberr Pro", url: "https://v0-viberrpro.vercel.app/", category: "SaaS" },
    { name: "Ilya Volgin Portfolio", url: "https://www.ilyavolgin.com", category: "Portfolio" },
    { name: "Molar Digital", url: "https://www.molar.digital", category: "Portfolio" },
    { name: "The Shopify Guy", url: "https://www.theshopifyguy.dev", category: "Portfolio" },
    { name: "Stadics (Live)", url: "https://www.stadics.com", category: "SaaS" },
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
      features: ["5 modules, 20+ lessons", "Prompt library", "Component templates", "Community access", "Lifetime updates"],
      popular: true,
      chatPrompt: "Tell me about the v0 Masterclass"
    },
    accelerator: { 
      name: "Accelerator", 
      price: "$1,497", 
      description: "Course + 4 weeks coaching",
      features: ["Everything in Masterclass", "4 weekly calls", "Personalized feedback", "Direct Slack access", "Priority support"],
      popular: false,
      chatPrompt: "Tell me about Accelerator coaching"
    },
    doneWithYou: { 
      name: "Done-With-You", 
      price: "$3,497",
      description: "Course + 8 weeks + we build together",
      features: ["Everything in Accelerator", "8 weeks of coaching", "Build your first project together", "Great for Shopify founders", "White-glove support"],
      popular: false,
      chatPrompt: "Tell me about the Done-With-You program"
    },
  },

  // Testimonials / social proof
  testimonials: [
    {
      name: "Sarah M.",
      role: "Shopify Founder",
      quote: "I was paying an agency for every small change. After Module 3, I rebuilt my entire product page library in one weekend.",
      result: "Built 12 pages in a weekend",
    },
    {
      name: "Marcus T.",
      role: "Freelance Developer",
      quote: "Went from never using v0 to launching a client site in 4 days. The prompt library alone saved me hours.",
      result: "First client site in 4 days",
    },
    {
      name: "Emily R.",
      role: "Marketing Director",
      quote: "I'm not technical at all. Within 48 hours of starting, I built a landing page that matched our brand perfectly.",
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
export type LiveSite = { name: string; url: string; category?: string }
export type Testimonial = { name: string; role: string; quote: string; result: string }
