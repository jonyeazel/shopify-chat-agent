// Portfolio data for v0 University showcase

export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "Stadics", url: "https://v0-stadics.vercel.app/" },
    { name: "MUD WTR", url: "https://v0-mudwater.vercel.app" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/" },
    { name: "vCommerce", url: "https://v0-vcommercepdp-three.vercel.app" },
    { name: "Neon", url: "https://v0-neon-v0-templates.vercel.app/" },
    { name: "ViberrPro", url: "https://v0-viberrpro.vercel.app/" },
    { name: "Brez Product", url: "https://v0-brez-product-page.vercel.app" },
  ],

  galleryItems: [
    {
      category: "landing",
      name: "OMG Landing",
      url: "https://v0-omg-landing.vercel.app",
      thumbnail: "https://v0-omg-landing.vercel.app/og-image.png",
    },
    {
      category: "ecommerce",
      name: "MUD WTR",
      url: "https://v0-mudwater.vercel.app",
      thumbnail: "https://v0-mudwater.vercel.app/og-image.png",
    },
    {
      category: "ecommerce",
      name: "vCommerce PDP",
      url: "https://v0-vcommercepdp-three.vercel.app",
      thumbnail: "https://v0-vcommercepdp-three.vercel.app/og-image.png",
    },
    {
      category: "saas",
      name: "Stadics",
      url: "https://v0-stadics.vercel.app",
      thumbnail: "https://v0-stadics.vercel.app/og-image.png",
    },
    {
      category: "saas",
      name: "AI Blocks",
      url: "https://v0-aiblocks.vercel.app",
      thumbnail: "https://v0-aiblocks.vercel.app/og-image.png",
    },
    {
      category: "landing",
      name: "Neon Templates",
      url: "https://v0-neon-v0-templates.vercel.app",
      thumbnail: "https://v0-neon-v0-templates.vercel.app/og-image.png",
    },
  ],
}

export function getGalleryByCategory(category: string) {
  if (category === "all") return PORTFOLIO_DATA.galleryItems
  return PORTFOLIO_DATA.galleryItems.filter((item) => item.category === category)
}

export type LiveSite = { name: string; url: string }

// Backwards compatible export - both import styles work
export const portfolioSites = PORTFOLIO_DATA.liveSites
