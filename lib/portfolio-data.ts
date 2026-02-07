export type GalleryCategory = "product-shots" | "store-design" | "ad-creatives"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "product-shots", label: "Product Shots" },
  { value: "store-design", label: "Store Design" },
  { value: "ad-creatives", label: "Ad Creatives" },
]

export type GalleryItem = {
  url: string
  label: string
  aspect: "1:1" | "9:16"
  category: GalleryCategory
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { url: "/images/product-shot.png", label: "Product Shot", aspect: "1:1", category: "product-shots" },
  { url: "/images/gravity-shot.png", label: "Gravity Shot", aspect: "9:16", category: "product-shots" },
  { url: "/images/2pk-bundle.png", label: "2pk Bundle", aspect: "1:1", category: "product-shots" },
  { url: "/images/3pk-aov-booster.png", label: "3pk AOV Booster", aspect: "9:16", category: "product-shots" },
  { url: "/images/50-50-infographic.png", label: "50/50 Infographic", aspect: "1:1", category: "ad-creatives" },
  { url: "/images/label-info.png", label: "Label Display", aspect: "9:16", category: "store-design" },
  { url: "/images/abstract-graphic.png", label: "Abstract Graphic", aspect: "1:1", category: "ad-creatives" },
  { url: "/images/blank-bottle.png", label: "Blank Bottle", aspect: "9:16", category: "product-shots" },
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
    { name: "Goli Gummies", url: "https://v0-vcommercepdp-three.vercel.app" },
    { name: "BREZ", url: "https://v0-brez-product-page.vercel.app" },
    { name: "Seed Probiotics", url: "https://v0-vcommercepdp.vercel.app" },
    { name: "MUD\\WTR", url: "https://v0-mudwater.vercel.app" },
    { name: "Athletic Greens", url: "https://v0-ag1-pdp.vercel.app" },
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
