export type GalleryCategory = "saas" | "portfolios" | "tools"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
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
  { url: "https://v0-aiblocks.vercel.app/", label: "AI Blocks", aspect: "9:16", category: "tools" },
  { url: "https://v0-designblocks.vercel.app/", label: "Design Blocks", aspect: "9:16", category: "tools" },
  { url: "https://vibecode-black.vercel.app/", label: "Vibecode", aspect: "9:16", category: "saas" },
  { url: "https://www.ilyavolgin.com", label: "Ilya Volgin", aspect: "9:16", category: "portfolios" },
  { url: "https://www.molar.digital", label: "Molar Digital", aspect: "9:16", category: "portfolios" },
  { url: "https://v0-viberrpro.vercel.app/", label: "Viberr Pro", aspect: "9:16", category: "saas" },
]

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category)
}

// Live sites for the desktop showcase panel
export const portfolioData = {
  liveSites: [
    { name: "Stadics", url: "https://v0-stadics.vercel.app/" },
    { name: "Neon Templates", url: "https://v0-neon-v0-templates.vercel.app/" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/" },
    { name: "Design Blocks", url: "https://v0-designblocks.vercel.app/" },
    { name: "Vibecode", url: "https://vibecode-black.vercel.app/" },
    { name: "Viberr Pro", url: "https://v0-viberrpro.vercel.app/" },
    { name: "Stadics (Live)", url: "https://www.stadics.com" },
    { name: "Ilya Volgin", url: "https://www.ilyavolgin.com" },
    { name: "Molar Digital", url: "https://www.molar.digital" },
    { name: "Shopify Guy", url: "https://www.theshopifyguy.dev" },
  ],
}

export type LiveSite = { name: string; url: string }
