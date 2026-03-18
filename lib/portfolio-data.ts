export type GalleryCategory = "product-shots" | "store-design" | "ad-creatives" | "live-sites"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "product-shots", label: "Product Shots" },
  { value: "store-design", label: "Store Design" },
  { value: "ad-creatives", label: "Ad Creatives" },
  { value: "live-sites", label: "Live Sites" },
]

export type GalleryItem = {
  url: string
  label: string
  aspect: "1:1" | "9:16"
  category: GalleryCategory
  liveUrl?: string // External link for live sites
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // Product Shots
  { url: "/images/product-shot.png", label: "Product Shot", aspect: "1:1", category: "product-shots" },
  { url: "/images/gravity-shot.png", label: "Gravity Shot", aspect: "9:16", category: "product-shots" },
  { url: "/images/2pk-bundle.png", label: "2pk Bundle", aspect: "1:1", category: "product-shots" },
  { url: "/images/3pk-aov-booster.png", label: "3pk AOV Booster", aspect: "9:16", category: "product-shots" },
  { url: "/images/blank-bottle.png", label: "Blank Bottle", aspect: "9:16", category: "product-shots" },
  // Ad Creatives
  { url: "/images/50-50-infographic.png", label: "50/50 Infographic", aspect: "1:1", category: "ad-creatives" },
  { url: "/images/abstract-graphic.png", label: "Abstract Graphic", aspect: "1:1", category: "ad-creatives" },
  // Store Design
  { url: "/images/label-info.png", label: "Label Display", aspect: "9:16", category: "store-design" },
  // Live Sites
  { url: "/images/sites/stadics.jpg", label: "Stadics", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-stadics.vercel.app" },
  { url: "/images/sites/stadics-live.jpg", label: "Stadics Live", aspect: "1:1", category: "live-sites", liveUrl: "https://www.stadics.com" },
  { url: "/images/sites/neon-templates.jpg", label: "Neon Templates", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-neon-v0-templates.vercel.app" },
  { url: "/images/sites/portfolio-demo.jpg", label: "Portfolio Demo", aspect: "1:1", category: "live-sites", liveUrl: "https://clever-tiger-875.vercel.app" },
  { url: "/images/sites/shopify-guy.jpg", label: "The Shopify Guy", aspect: "1:1", category: "live-sites", liveUrl: "https://www.theshopifyguy.dev" },
  { url: "/images/sites/landing-page.jpg", label: "Landing Page", aspect: "1:1", category: "live-sites", liveUrl: "https://swift-bear-260.vercel.app" },
  { url: "/images/sites/shopify-storefront.jpg", label: "Shopify Storefront", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-shopifystorefront.vercel.app" },
  { url: "/images/sites/ai-blocks.jpg", label: "AI Blocks", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-aiblocks.vercel.app" },
  { url: "/images/sites/design-blocks.jpg", label: "Design Blocks", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-designblocks.vercel.app" },
  { url: "/images/sites/v0-platform.jpg", label: "v0 Platform", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-build-v0-platform-eta.vercel.app" },
  { url: "/images/sites/minimal-dark.jpg", label: "Minimal Dark", aspect: "1:1", category: "live-sites", liveUrl: "https://jolly-shark-267.vercel.app" },
  { url: "/images/sites/vibecode.jpg", label: "Vibecode", aspect: "1:1", category: "live-sites", liveUrl: "https://vibecode-black.vercel.app" },
  { url: "/images/sites/goli-pdp.jpg", label: "Goli PDP", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-vcommercepdp-three.vercel.app" },
  { url: "/images/sites/brez.jpg", label: "BREZ", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-brez-product-page.vercel.app" },
  { url: "/images/sites/seed-pdp.jpg", label: "Seed PDP", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-vcommercepdp.vercel.app" },
  { url: "/images/sites/mudwtr.jpg", label: "MUD/WTR", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-mudwater.vercel.app" },
  { url: "/images/sites/ilya-volgin.jpg", label: "Ilya Volgin", aspect: "1:1", category: "live-sites", liveUrl: "https://www.ilyavolgin.com" },
  { url: "/images/sites/molar-digital.jpg", label: "Molar Digital", aspect: "1:1", category: "live-sites", liveUrl: "https://www.molar.digital" },
  { url: "/images/sites/viberr-pro.jpg", label: "Viberr Pro", aspect: "1:1", category: "live-sites", liveUrl: "https://v0-viberrpro.vercel.app" },
]

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category)
}

export const PORTFOLIO_DATA = {
  productShots: [
    { url: "/images/product-shot.png", label: "Product Shot" },
    { url: "/images/gravity-shot.png", label: "Gravity Shot" },
    { url: "/images/2pk-bundle.png", label: "2pk Bundle" },
    { url: "/images/3pk-aov-booster.png", label: "3pk AOV Booster" },
    { url: "/images/50-50-infographic.png", label: "50/50 Infographic" },
    { url: "/images/label-info.png", label: "Label Display" },
    { url: "/images/abstract-graphic.png", label: "Abstract Graphic" },
    { url: "/images/blank-bottle.png", label: "Blank Bottle" },
  ],
  liveSites: [
    { name: "Stadics", url: "https://v0-stadics.vercel.app" },
    { name: "Stadics Live", url: "https://www.stadics.com" },
    { name: "Neon Templates", url: "https://v0-neon-v0-templates.vercel.app" },
    { name: "Portfolio Demo", url: "https://clever-tiger-875.vercel.app" },
    { name: "The Shopify Guy", url: "https://www.theshopifyguy.dev" },
    { name: "Landing Page", url: "https://swift-bear-260.vercel.app" },
    { name: "Shopify Storefront", url: "https://v0-shopifystorefront.vercel.app" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app" },
    { name: "Design Blocks", url: "https://v0-designblocks.vercel.app" },
    { name: "v0 Platform", url: "https://v0-build-v0-platform-eta.vercel.app" },
    { name: "Minimal Dark", url: "https://jolly-shark-267.vercel.app" },
    { name: "Vibecode", url: "https://vibecode-black.vercel.app" },
    { name: "Goli PDP", url: "https://v0-vcommercepdp-three.vercel.app" },
    { name: "BREZ", url: "https://v0-brez-product-page.vercel.app" },
    { name: "Seed PDP", url: "https://v0-vcommercepdp.vercel.app" },
    { name: "MUD\\WTR", url: "https://v0-mudwater.vercel.app" },
    { name: "Ilya Volgin", url: "https://www.ilyavolgin.com" },
    { name: "Molar Digital", url: "https://www.molar.digital" },
    { name: "Viberr Pro", url: "https://v0-viberrpro.vercel.app" },
  ],
  pricing: {
    smartStore: { 
      name: "Smart Store AI System", 
      price: "$15,000", 
      description: "AI-powered personalization",
      features: ["AI quiz funnel", "10 customer-profile PDPs", "100 ad creatives", "Full Shopify integration"],
      popular: true,
      isAI: true,
      chatPrompt: "Tell me about the Smart Store AI System"
    },
    storeRedesign: { 
      name: "Store Redesign", 
      price: "$5,000", 
      description: "$2k start + $3k on delivery",
      features: ["Up to 20 products", "Full CRO buildout", "48-hour turnaround", "Conversion focused"],
      popular: false,
      chatPrompt: "I want a store redesign"
    },
    singleShot: { 
      name: "Single Product Shot", 
      price: "$97",
      description: "One stunning image",
      features: ["1 hero shot", "White or lifestyle", "Hi-res delivery"],
      popular: false,
      chatPrompt: "I need a single product shot"
    },
    shotBundle: { 
      name: "Product Shot Bundle", 
      price: "$397",
      description: "8-shot package",
      features: ["8 high-quality shots", "Mix of styles", "Unlimited revisions"],
      popular: false,
      chatPrompt: "I want the 8-shot product bundle"
    },
    staticAds: { 
      name: "Ad Creatives", 
      price: "$249",
      description: "30 static ads",
      features: ["Platform optimized", "A/B variants", "Source files included"],
      popular: false,
      chatPrompt: "I need ad creatives for my store"
    },
    pdp: { 
      name: "Product Page", 
      price: "$1,497",
      description: "High-converting PDP",
      features: ["Custom sections", "Mobile-first", "Speed optimized"],
      popular: false,
      chatPrompt: "I want a custom product page built"
    },
    consulting: { 
      name: "Strategy Call", 
      price: "$500",
      description: "30 min deep dive",
      features: ["Screen share audit", "Action items", "Recording included"],
      popular: false,
      chatPrompt: "I'd like to book a strategy call"
    },
  },
}

export type PricingItem = { 
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  isAI?: boolean
  chatPrompt?: string
}
export type LiveSite = { name: string; url: string }
