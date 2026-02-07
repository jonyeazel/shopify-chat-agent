// Multi-tenant site context
// Loads site configuration based on domain

import { createClient } from "@/lib/supabase/server"

export interface SiteConfig {
  id: number
  subdomain: string | null
  customDomain: string | null
  sourceUrl: string | null
  sourceType: "shopify" | "service" | "portfolio" | "restaurant" | "other" | null

  // Branding
  siteName: string
  tagline: string | null
  logoUrl: string | null
  avatarUrl: string | null
  primaryColor: string
  backgroundMediaUrl: string | null
  backgroundMediaType: "image" | "video" | null

  // Music
  musicTrackUrl: string | null
  musicArtist: string | null
  musicTitle: string | null

  // AI
  aiSystemPrompt: string | null
  aiPersonality: string

  // Shopify
  shopifyDomain: string | null
  shopifyStorefrontToken: string | null
  shopifyConnected: boolean

  // Products
  products: Product[]

  // Affiliate
  referredBy: number | null
  referralCode: string | null

  // Status
  status: "preview" | "active" | "suspended" | "deleted"
  isTemplate: boolean
}

export interface Product {
  id: string
  title: string
  description: string
  price: string
  compareAtPrice?: string
  image: string
  handle: string
  available: boolean
}

// Get site config by domain
export async function getSiteByDomain(domain: string): Promise<SiteConfig | null> {
  const supabase = await createClient()

  // Check custom domain first, then subdomain
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .or(`custom_domain.eq.${domain},subdomain.eq.${domain.split(".")[0]}`)
    .single()

  if (error || !data) {
    return null
  }

  return transformSiteData(data)
}

// Get site by ID
export async function getSiteById(id: number): Promise<SiteConfig | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sites").select("*").eq("id", id).single()

  if (error || !data) {
    return null
  }

  return transformSiteData(data)
}

// Get site by referral code
export async function getSiteByReferralCode(code: string): Promise<SiteConfig | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sites").select("*").eq("referral_code", code).single()

  if (error || !data) {
    return null
  }

  return transformSiteData(data)
}

// Transform database row to SiteConfig
function transformSiteData(data: Record<string, unknown>): SiteConfig {
  return {
    id: data.id as number,
    subdomain: data.subdomain as string | null,
    customDomain: data.custom_domain as string | null,
    sourceUrl: data.source_url as string | null,
    sourceType: data.source_type as SiteConfig["sourceType"],
    siteName: data.site_name as string,
    tagline: data.tagline as string | null,
    logoUrl: data.logo_url as string | null,
    avatarUrl: data.avatar_url as string | null,
    primaryColor: data.primary_color as string,
    backgroundMediaUrl: data.background_media_url as string | null,
    backgroundMediaType: data.background_media_type as SiteConfig["backgroundMediaType"],
    musicTrackUrl: data.music_track_url as string | null,
    musicArtist: data.music_artist as string | null,
    musicTitle: data.music_title as string | null,
    aiSystemPrompt: data.ai_system_prompt as string | null,
    aiPersonality: data.ai_personality as string,
    shopifyDomain: data.shopify_domain as string | null,
    shopifyStorefrontToken: data.shopify_storefront_token as string | null,
    shopifyConnected: data.shopify_connected as boolean,
    products: (data.products as Product[]) || [],
    referredBy: data.referred_by as number | null,
    referralCode: data.referral_code as string | null,
    status: data.status as SiteConfig["status"],
    isTemplate: data.is_template as boolean,
  }
}

// Create a new site from scraped data
export async function createSite(params: {
  sourceUrl: string
  sourceType: SiteConfig["sourceType"]
  siteName: string
  tagline?: string
  logoUrl?: string
  avatarUrl?: string
  primaryColor?: string
  products?: Product[]
  referredBy?: number
  ownerEmail?: string
}): Promise<SiteConfig | null> {
  const supabase = await createClient()

  // Generate unique referral code
  const referralCode = `CARD${Date.now().toString(36).toUpperCase()}`

  // Get next subdomain
  const { count } = await supabase.from("sites").select("*", { count: "exact", head: true })

  const subdomain = `card-${(count || 0) + 1}`

  const { data, error } = await supabase
    .from("sites")
    .insert({
      subdomain,
      source_url: params.sourceUrl,
      source_type: params.sourceType,
      site_name: params.siteName,
      tagline: params.tagline,
      logo_url: params.logoUrl,
      avatar_url: params.avatarUrl,
      primary_color: params.primaryColor || "#253a2e",
      products: params.products || [],
      referred_by: params.referredBy,
      referral_code: referralCode,
      owner_email: params.ownerEmail,
      status: "preview",
    })
    .select()
    .single()

  if (error || !data) {
    console.error("Failed to create site:", error)
    return null
  }

  return transformSiteData(data)
}
