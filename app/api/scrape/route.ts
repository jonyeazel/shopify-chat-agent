// API route to scrape a URL and return site preview data

import { type NextRequest, NextResponse } from "next/server"
import { scrapeUrl } from "@/lib/scraper"

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const scrapedData = await scrapeUrl(url)

    if (!scrapedData) {
      return NextResponse.json({ error: "Failed to scrape URL. Make sure it's accessible." }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: scrapedData,
    })
  } catch (error) {
    console.error("Scrape API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
