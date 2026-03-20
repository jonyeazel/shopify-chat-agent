export type GalleryCategory = "stores" | "portfolios" | "landing"

export const GALLERY_CATEGORIES: { value: GalleryCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "stores", label: "Stores" },
  { value: "portfolios", label: "Portfolios" },
  { value: "landing", label: "Landing Pages" },
]

export type GalleryItem = {
  url: string
  label: string
  aspect: "1:1" | "9:16"
  category: GalleryCategory
}

// Sites Jon built with AI - showing what's possible
export const GALLERY_ITEMS: GalleryItem[] = [
  { url: "https://v0-stadics.vercel.app/", label: "Stadics", aspect: "9:16", category: "landing" },
  { url: "https://www.stadics.com", label: "Stadics Live", aspect: "9:16", category: "landing" },
  { url: "https://v0-neon-v0-templates.vercel.app/", label: "Neon Templates", aspect: "9:16", category: "landing" },
  { url: "https://clever-tiger-875.vercel.app/", label: "Clever Tiger", aspect: "9:16", category: "landing" },
  { url: "https://www.theshopifyguy.dev", label: "Shopify Guy", aspect: "9:16", category: "portfolios" },
  { url: "https://swift-bear-260.vercel.app/", label: "Swift Bear", aspect: "9:16", category: "landing" },
  { url: "https://v0-shopifystorefront.vercel.app/", label: "Shopify Storefront", aspect: "9:16", category: "stores" },
  { url: "https://v0-aiblocks.vercel.app/", label: "AI Blocks", aspect: "9:16", category: "landing" },
  { url: "https://v0-designblocks.vercel.app/", label: "Design Blocks", aspect: "9:16", category: "landing" },
  { url: "https://v0-build-v0-platform-eta.vercel.app/", label: "v0 Platform", aspect: "9:16", category: "landing" },
  { url: "https://jolly-shark-267.vercel.app/", label: "Jolly Shark", aspect: "9:16", category: "landing" },
  { url: "https://vibecode-black.vercel.app/", label: "Vibecode", aspect: "9:16", category: "landing" },
  { url: "https://v0-vcommercepdp-three.vercel.app", label: "vCommerce PDP", aspect: "9:16", category: "stores" },
  { url: "https://v0-brez-product-page.vercel.app", label: "Brez Product", aspect: "9:16", category: "stores" },
  { url: "https://v0-vcommercepdp.vercel.app/", label: "vCommerce", aspect: "9:16", category: "stores" },
  { url: "https://v0-mudwater.vercel.app", label: "MUD WTR", aspect: "9:16", category: "stores" },
  { url: "https://www.ilyavolgin.com", label: "Ilya Volgin", aspect: "9:16", category: "portfolios" },
  { url: "https://www.molar.digital", label: "Molar Digital", aspect: "9:16", category: "portfolios" },
  { url: "https://v0-viberrpro.vercel.app/", label: "Viberr Pro", aspect: "9:16", category: "landing" },
]

export function getGalleryByCategory(category: GalleryCategory): GalleryItem[] {
  return GALLERY_ITEMS.filter((item) => item.category === category)
}

// Sites for chat display - what Jon built with AI
export const PORTFOLIO_DATA = {
  liveSites: [
    { name: "Stadics", url: "https://v0-stadics.vercel.app/" },
    { name: "Shopify Storefront", url: "https://v0-shopifystorefront.vercel.app/" },
    { name: "vCommerce PDP", url: "https://v0-vcommercepdp-three.vercel.app" },
    { name: "MUD WTR", url: "https://v0-mudwater.vercel.app" },
    { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/" },
    { name: "Design Blocks", url: "https://v0-designblocks.vercel.app/" },
    { name: "Vibecode", url: "https://vibecode-black.vercel.app/" },
    { name: "Viberr Pro", url: "https://v0-viberrpro.vercel.app/" },
    { name: "Ilya Volgin", url: "https://www.ilyavolgin.com" },
    { name: "Molar Digital", url: "https://www.molar.digital" },
    { name: "Shopify Guy", url: "https://www.theshopifyguy.dev" },
    { name: "Brez Product", url: "https://v0-brez-product-page.vercel.app" },
  ],
}

export type LiveSite = { name: string; url: string }
