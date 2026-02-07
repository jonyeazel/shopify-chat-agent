// API route to create a new site from scraped data

import { type NextRequest, NextResponse } from "next/server"
import { createSite } from "@/lib/site-context"
import { scrapeUrl } from "@/lib/scraper"

export async function POST(req: NextRequest) {
  try {
    const { url, referralCode, ownerEmail } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Scrape the URL
    const scrapedData = await scrapeUrl(url)

    if (!scrapedData) {
      return NextResponse.json({ error: "Failed to scrape URL" }, { status: 400 })
    }

    // Look up referrer if code provided
    let referredBy: number | undefined
    if (referralCode) {
      const { createClient } = await import("@/lib/supabase/server")
      const supabase = await createClient()
      const { data: referrer } = await supabase.from("sites").select("id").eq("referral_code", referralCode).single()

      if (referrer) {
        referredBy = referrer.id
      }
    }

    // Create the site
    const site = await createSite({
      sourceUrl: url,
      sourceType: scrapedData.type,
      siteName: scrapedData.name,
      tagline: scrapedData.tagline || undefined,
      logoUrl: scrapedData.logo || undefined,
      avatarUrl: scrapedData.favicon || undefined,
      primaryColor: scrapedData.primaryColor,
      products: scrapedData.products,
      referredBy,
      ownerEmail,
    })

    if (!site) {
      return NextResponse.json({ error: "Failed to create site" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      site: {
        id: site.id,
        subdomain: site.subdomain,
        previewUrl: `https://${site.subdomain}.offercard.io`,
        referralCode: site.referralCode,
      },
    })
  } catch (error) {
    console.error("Create site API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
