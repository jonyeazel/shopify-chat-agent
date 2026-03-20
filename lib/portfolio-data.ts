// Portfolio data - ALL exports defined first for tree-shaking compatibility

export type GalleryItem = {
  category: string
  label: string
  url: string
}

export type LiveSite = { name: string; url: string }

// Gallery categories for filtering
export const GALLERY_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

// Main portfolio data object
export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "Stadics", url: "https://v0-stadics.vercel.app/" },
    { name: "MUD WTR", url: "https://v0-mudwater.vercel.app" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/" },
    { name: "vCommerce", url: "https://v0-vcommercepdp-three.vercel.app" },
  ],
  galleryItems: [
    { name: "Stadics Landing", category: "landing", thumbnail: "/portfolio/stadics.jpg" },
    { name: "MUD WTR Store", category: "ecommerce", thumbnail: "/portfolio/mudwtr.jpg" },
    { name: "AI Blocks", category: "saas", thumbnail: "/portfolio/aiblocks.jpg" },
    { name: "vCommerce PDP", category: "ecommerce", thumbnail: "/portfolio/vcommerce.jpg" },
  ],
  pricing: {
    video: {
      name: "v0 University",
      price: "$297",
      description: "57-second video + templates",
      popular: true,
      chatPrompt: "Tell me about the video course",
    },
    audit: {
      name: "Site Audit",
      price: "$47",
      description: "Quick CRO analysis",
      chatPrompt: "Tell me about the site audit",
    },
    done: {
      name: "Done For You",
      price: "$1,497+",
      description: "Full site build",
      chatPrompt: "Tell me about done for you",
    },
  },
}

// Gallery items in the format expected by media-gallery
export const GALLERY_ITEMS: GalleryItem[] = PORTFOLIO_DATA.galleryItems.map((item) => ({
  category: item.category,
  label: item.name,
  url: item.thumbnail,
}))

// Backwards compatible exports
export const portfolioSites = PORTFOLIO_DATA.liveSites

// Helper function for filtering
export function getGalleryByCategory(category: string): GalleryItem[] {
  if (category === "all") return GALLERY_ITEMS
  return GALLERY_ITEMS.filter((item) => item.category === category)
}
