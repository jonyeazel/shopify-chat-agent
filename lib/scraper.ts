// Simple scraper without problematic regex

export interface ScrapedSite {
  name: string
  description: string
  logo: string | null
  favicon: string | null
  primaryColor: string
  type: "shopify" | "ecommerce" | "service" | "portfolio" | "restaurant" | "creator" | "other"
  products: Array<{
    id: string
    title: string
    price: string
    image: string
    compareAtPrice?: string
  }>
  services: Array<{
    name: string
    description: string
    price?: string
  }>
  socialLinks: {
    instagram?: string
    twitter?: string
    facebook?: string
    tiktok?: string
    youtube?: string
  }
  contact: {
    email?: string
    phone?: string
    address?: string
  }
}

export async function scrapeUrl(url: string): Promise<ScrapedSite | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OfferCardBot/1.0)",
      },
    })

    if (!response.ok) return null

    const html = await response.text()

    // Extract basic meta info
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i)

    // Detect site type
    const isShopify = html.includes("Shopify") || html.includes("cdn.shopify.com")
    const isEcommerce = html.includes("add-to-cart") || html.includes("product") || html.includes("price")

    // Extract email
    const emailMatch = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i)

    return {
      name: titleMatch?.[1]?.trim() || new URL(url).hostname,
      description: descMatch?.[1]?.trim() || "",
      logo: null,
      favicon: faviconMatch?.[1] || null,
      primaryColor: "#253a2e",
      type: isShopify ? "shopify" : isEcommerce ? "ecommerce" : "service",
      products: [],
      services: [],
      socialLinks: {},
      contact: {
        email: emailMatch?.[0] || undefined,
      },
    }
  } catch (error) {
    console.error("Scrape error:", error)
    return null
  }
}
