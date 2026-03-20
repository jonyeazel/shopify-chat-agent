// Portfolio data for v0 University
// All exports are defined at the top level for build compatibility

export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "AI Landing Page", url: "https://ai-landing-page-v0.vercel.app" },
    { name: "SaaS Dashboard", url: "https://saas-dashboard-v0.vercel.app" },
    { name: "E-commerce Store", url: "https://ecommerce-store-v0.vercel.app" },
    { name: "Portfolio Site", url: "https://portfolio-site-v0.vercel.app" },
    { name: "Blog Platform", url: "https://blog-platform-v0.vercel.app" },
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
