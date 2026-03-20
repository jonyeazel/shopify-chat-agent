// Portfolio data for v0 University
// All exports are defined at the top level for build compatibility

export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "v0.dev", url: "https://v0.dev" },
    { name: "Vercel", url: "https://vercel.com" },
    { name: "Next.js", url: "https://nextjs.org" },
    { name: "Turbo", url: "https://turbo.build" },
    { name: "shadcn/ui", url: "https://ui.shadcn.com" },
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
