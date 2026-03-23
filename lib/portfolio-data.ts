// Portfolio data for v0 University
// All exports are defined at the top level for build compatibility

export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "Stadics", url: "https://www.stadics.com" },
    { name: "Ilya Volgin", url: "https://www.ilyavolgin.com" },
    { name: "Vibe Code", url: "https://vibecode-black.vercel.app" },
    { name: "Neon Templates", url: "https://v0-neon-v0-templates.vercel.app" },
    { name: "MudWater", url: "https://v0-mudwater.vercel.app" },
    { name: "Shopify Storefront", url: "https://v0-shopifystorefront.vercel.app" },
    { name: "Commerce PDP", url: "https://v0-vcommercepdp.vercel.app" },
    { name: "Brez Product", url: "https://v0-brez-product-page.vercel.app" },
    { name: "Viberr Pro", url: "https://v0-viberrpro.vercel.app" },
  ],
  galleryItems: [
    { name: "Modern Landing", category: "landing", thumbnail: "/gallery/landing-1.jpg" },
    { name: "Product Page", category: "ecommerce", thumbnail: "/gallery/ecommerce-1.jpg" },
    { name: "Dashboard UI", category: "saas", thumbnail: "/gallery/saas-1.jpg" },
    { name: "Hero Section", category: "landing", thumbnail: "/gallery/landing-2.jpg" },
    { name: "Checkout Flow", category: "ecommerce", thumbnail: "/gallery/ecommerce-2.jpg" },
    { name: "Analytics View", category: "saas", thumbnail: "/gallery/saas-2.jpg" },
  ],
}

export type LiveSite = { name: string; url: string }

// Backwards compatible export
export const portfolioSites = PORTFOLIO_DATA.liveSites

// Helper function
export function getGalleryByCategory(category: string) {
  if (category === "all") return PORTFOLIO_DATA.galleryItems
  return PORTFOLIO_DATA.galleryItems.filter((item) => item.category === category)
}
