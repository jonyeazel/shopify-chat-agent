import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 60

interface MessagingAudit {
  url: string
  timestamp: string
  
  // Core identity
  brandName: string | null
  tagline: string | null
  heroHeadline: string | null
  
  // What they sell
  productCategory: string | null
  productNames: string[]
  priceRange: { min: number | null; max: number | null }
  
  // Value props found on the page
  valueProps: string[]
  
  // Offers and hooks
  offers: string[] // Free shipping, discounts, guarantees
  
  // Social proof snippets
  socialProof: string[]
  
  // Raw text snippets for context
  keyPhrases: string[]
  
  // Platform for context
  platform: "shopify" | "woocommerce" | "bigcommerce" | "custom" | "unknown"
  
  // Basic load check (slow sites kill ad ROAS)
  loadTime: number
  isSlow: boolean
}

async function fetchWithTimeout(url: string, timeout = 15000): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

function extractText(html: string): string {
  // Remove scripts and styles
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
  text = text.replace(/<[^>]+>/g, " ")
  text = text.replace(/\s+/g, " ")
  return text.trim()
}

function extractHeroHeadline(html: string): string | null {
  // Look for hero section headlines - usually in h1, h2, or large text in hero/banner sections
  
  // Try h1 first
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
  if (h1Match && h1Match[1].trim().length > 5 && h1Match[1].trim().length < 100) {
    return h1Match[1].trim()
  }
  
  // Look for hero-specific elements
  const heroPatterns = [
    /<[^>]*(?:hero|banner|headline|masthead)[^>]*>([^<]{10,100})</i,
    /<h2[^>]*>([^<]{10,80})<\/h2>/i,
  ]
  
  for (const pattern of heroPatterns) {
    const match = html.match(pattern)
    if (match && match[1].trim().length > 5) {
      return match[1].trim()
    }
  }
  
  return null
}

function extractTagline(html: string): string | null {
  // Look for meta description first - often the best tagline
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)
  
  if (metaMatch && metaMatch[1].length < 160) {
    return metaMatch[1].trim()
  }
  
  // Look for og:description
  const ogMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
  if (ogMatch) {
    return ogMatch[1].trim()
  }
  
  return null
}

function extractBrandName(html: string): string | null {
  // Try og:site_name first
  const ogSite = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i)
  if (ogSite) return ogSite[1].trim()
  
  // Try title tag, strip common suffixes
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch) {
    let title = titleMatch[1].trim()
    // Remove common suffixes
    title = title.replace(/\s*[-–|:].*(official|store|shop|home|welcome).*$/i, "")
    title = title.replace(/\s*[-–|:].*$/i, "") // Remove anything after separator
    if (title.length > 2 && title.length < 50) {
      return title.trim()
    }
  }
  
  return null
}

function extractProductNames(html: string): string[] {
  const products: string[] = []
  
  // Look for product titles in common patterns
  const patterns = [
    /<[^>]*class=["'][^"']*product[_-]?title[^"']*["'][^>]*>([^<]+)</gi,
    /<[^>]*class=["'][^"']*product[_-]?name[^"']*["'][^>]*>([^<]+)</gi,
    /<h[23][^>]*class=["'][^"']*product[^"']*["'][^>]*>([^<]+)</gi,
  ]
  
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(html)) !== null && products.length < 10) {
      const name = match[1].trim()
      if (name.length > 3 && name.length < 100 && !products.includes(name)) {
        products.push(name)
      }
    }
  }
  
  return products.slice(0, 5)
}

function extractPrices(html: string): { min: number | null; max: number | null } {
  const pricePattern = /\$[\d,]+(?:\.\d{2})?/g
  const matches = html.match(pricePattern) || []
  
  const prices = matches
    .map(p => parseFloat(p.replace(/[$,]/g, "")))
    .filter(p => p > 0 && p < 10000) // Filter unrealistic prices
  
  if (prices.length === 0) return { min: null, max: null }
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}

function extractValueProps(html: string): string[] {
  const props: string[] = []
  const lower = html.toLowerCase()
  
  // Common e-commerce value props
  const valuePropPatterns = [
    { pattern: /free\s+shipping/i, label: "Free Shipping" },
    { pattern: /free\s+returns/i, label: "Free Returns" },
    { pattern: /money[- ]back\s+guarantee/i, label: "Money-Back Guarantee" },
    { pattern: /(\d+)[- ]day\s+guarantee/i, label: (m: RegExpMatchArray) => `${m[1]}-Day Guarantee` },
    { pattern: /lifetime\s+warranty/i, label: "Lifetime Warranty" },
    { pattern: /(\d+)[- ]year\s+warranty/i, label: (m: RegExpMatchArray) => `${m[1]}-Year Warranty` },
    { pattern: /handmade|hand[- ]crafted/i, label: "Handcrafted" },
    { pattern: /organic|all[- ]natural/i, label: "Organic/Natural" },
    { pattern: /sustainable|eco[- ]friendly/i, label: "Sustainable" },
    { pattern: /made\s+in\s+(usa|america|the\s+us)/i, label: "Made in USA" },
    { pattern: /premium\s+quality/i, label: "Premium Quality" },
    { pattern: /award[- ]winning/i, label: "Award-Winning" },
    { pattern: /best[- ]seller|bestseller/i, label: "Bestseller" },
    { pattern: /limited\s+edition/i, label: "Limited Edition" },
    { pattern: /exclusive/i, label: "Exclusive" },
    { pattern: /(\d+)\+?\s*(?:5[- ]star\s+)?reviews/i, label: (m: RegExpMatchArray) => `${m[1]}+ Reviews` },
    { pattern: /as\s+seen\s+(?:on|in)/i, label: "As Seen In Media" },
  ]
  
  for (const { pattern, label } of valuePropPatterns) {
    const match = html.match(pattern)
    if (match) {
      const propLabel = typeof label === "function" ? label(match) : label
      if (!props.includes(propLabel)) {
        props.push(propLabel)
      }
    }
  }
  
  return props.slice(0, 6)
}

function extractOffers(html: string): string[] {
  const offers: string[] = []
  
  // Look for discount/offer patterns
  const offerPatterns = [
    /(\d+)%\s+off/i,
    /save\s+\$?(\d+)/i,
    /buy\s+(\d+)\s+get\s+(\d+)/i,
    /free\s+gift/i,
    /limited\s+time/i,
    /sale\s+ends/i,
    /use\s+code\s+([A-Z0-9]+)/i,
  ]
  
  for (const pattern of offerPatterns) {
    const match = html.match(pattern)
    if (match) {
      offers.push(match[0].trim())
    }
  }
  
  return offers.slice(0, 3)
}

function extractSocialProof(html: string): string[] {
  const proof: string[] = []
  
  // Look for testimonial-like patterns
  const patterns = [
    /"([^"]{20,150})"\s*[-–]\s*([A-Z][a-z]+)/g, // "Quote" - Name
    /★+.*?(\d+(?:\.\d)?)\s*(?:\/\s*5|stars?)/gi, // Star ratings
    /(\d{1,3}(?:,\d{3})*)\+?\s*(?:happy\s+)?customers/i,
    /trusted\s+by\s+(\d+(?:,\d{3})*)/i,
    /(\d+(?:\.\d)?)\s*(?:\/\s*5|out\s+of\s+5)/i,
  ]
  
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      proof.push(match[0].substring(0, 100))
    }
  }
  
  return proof.slice(0, 3)
}

function extractKeyPhrases(html: string): string[] {
  const text = extractText(html)
  const phrases: string[] = []
  
  // Extract sentences that might be good marketing copy
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20 && s.trim().length < 100)
  
  // Look for action-oriented or benefit-focused phrases
  const goodPhrasePatterns = [
    /^(?:we|our)\s/i,
    /you(?:'ll|r|\s+will)/i,
    /transform|upgrade|elevate|discover|experience/i,
    /perfect\s+for/i,
    /designed\s+(?:for|to)/i,
  ]
  
  for (const sentence of sentences) {
    for (const pattern of goodPhrasePatterns) {
      if (pattern.test(sentence) && phrases.length < 5) {
        phrases.push(sentence.trim())
        break
      }
    }
  }
  
  return phrases
}

function detectPlatform(html: string): MessagingAudit["platform"] {
  const lower = html.toLowerCase()
  
  if (lower.includes("cdn.shopify.com") || lower.includes("myshopify.com")) {
    return "shopify"
  }
  if (lower.includes("woocommerce") || lower.includes("wp-content")) {
    return "woocommerce"
  }
  if (lower.includes("bigcommerce") || lower.includes("cdn.bcapp")) {
    return "bigcommerce"
  }
  
  return "custom"
}

function guessProductCategory(html: string, brandName: string | null, products: string[]): string | null {
  const text = (extractText(html) + " " + products.join(" ")).toLowerCase()
  
  const categories = [
    { keywords: ["shoe", "sneaker", "boot", "sandal", "footwear"], category: "Footwear" },
    { keywords: ["shirt", "tee", "hoodie", "jacket", "dress", "pants", "jeans", "apparel", "clothing", "wear"], category: "Apparel" },
    { keywords: ["skincare", "serum", "moisturizer", "cleanser", "cream", "beauty"], category: "Skincare" },
    { keywords: ["supplement", "vitamin", "protein", "wellness", "health"], category: "Supplements" },
    { keywords: ["jewelry", "necklace", "ring", "bracelet", "earring"], category: "Jewelry" },
    { keywords: ["furniture", "chair", "table", "sofa", "desk", "home decor"], category: "Home & Furniture" },
    { keywords: ["pet", "dog", "cat", "puppy"], category: "Pet Products" },
    { keywords: ["baby", "kid", "child", "toddler"], category: "Baby & Kids" },
    { keywords: ["tech", "gadget", "electronic", "phone", "laptop"], category: "Tech & Electronics" },
    { keywords: ["fitness", "gym", "workout", "exercise", "sport"], category: "Fitness" },
    { keywords: ["coffee", "tea", "food", "snack", "drink"], category: "Food & Beverage" },
    { keywords: ["watch", "accessory", "bag", "wallet"], category: "Accessories" },
  ]
  
  for (const { keywords, category } of categories) {
    const matchCount = keywords.filter(k => text.includes(k)).length
    if (matchCount >= 2) return category
  }
  
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }
    
    // Normalize URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl
    }
    
    const startTime = Date.now()
    
    // Fetch the page
    let response: Response
    let html: string
    try {
      response = await fetchWithTimeout(normalizedUrl)
      html = await response.text()
    } catch (error) {
      return NextResponse.json({ 
        error: "Could not fetch the website. Please check the URL is correct and accessible." 
      }, { status: 400 })
    }
    
    const loadTime = Date.now() - startTime
    
    // Extract messaging elements
    const brandName = extractBrandName(html)
    const tagline = extractTagline(html)
    const heroHeadline = extractHeroHeadline(html)
    const productNames = extractProductNames(html)
    const priceRange = extractPrices(html)
    const valueProps = extractValueProps(html)
    const offers = extractOffers(html)
    const socialProof = extractSocialProof(html)
    const keyPhrases = extractKeyPhrases(html)
    const platform = detectPlatform(html)
    const productCategory = guessProductCategory(html, brandName, productNames)
    
    const result: MessagingAudit = {
      url: normalizedUrl,
      timestamp: new Date().toISOString(),
      brandName,
      tagline,
      heroHeadline,
      productCategory,
      productNames,
      priceRange,
      valueProps,
      offers,
      socialProof,
      keyPhrases,
      platform,
      loadTime,
      isSlow: loadTime > 3000,
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error("Audit error:", error)
    return NextResponse.json({ 
      error: "An error occurred while analyzing the site" 
    }, { status: 500 })
  }
}
