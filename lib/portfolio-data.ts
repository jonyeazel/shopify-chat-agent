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
  
  // Pricing - simple, anti-course positioning
  pricing: {
    video: { 
      name: "v0 University", 
      price: "$297", 
      description: "One 3-minute video. All templates included.",
      features: ["3-minute video tutorial", "AI-powered smart templates", "Build a site the same day"],
      popular: true,
      chatPrompt: "Tell me about v0 University"
    },
  },

  // Testimonials - collecting first 20
  testimonials: [
    {
      name: "Coming soon",
      role: "First 20 students",
      quote: "We're collecting testimonials from the first 20 people who can vouch this works.",
      result: "Be one of the first 20",
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
