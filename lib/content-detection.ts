import { PORTFOLIO_DATA } from "./portfolio-data"

export type DetectedContent = {
  type: "videoPreview" | "liveSites" | "pricing" | "paymentOptions"
  data?: any
}

export function detectContentToShow(text: string): DetectedContent | null {
  const lower = text.toLowerCase()

  // Video preview - show the 3-minute video thumbnail
  if (
    lower.includes("preview of the video") ||
    lower.includes("here's a preview") ||
    lower.includes("here's the video") ||
    lower.includes("what you get") ||
    lower.includes("3-minute video") ||
    lower.includes("3 minute video") ||
    lower.includes("here's what's inside") ||
    (lower.includes("video") && lower.includes("preview"))
  ) {
    return { type: "videoPreview", data: null }
  }

  // Live sites - show portfolio iframes
  if (
    lower.includes("here are some sites") ||
    lower.includes("here are a few") ||
    lower.includes("built with v0") ||
    lower.includes("student sites") ||
    lower.includes("sites built") ||
    lower.includes("examples of what") ||
    lower.includes("check these out") ||
    lower.includes("take a look") ||
    lower.includes("here's what people have built")
  ) {
    return { type: "liveSites", data: PORTFOLIO_DATA.liveSites }
  }

  // Pricing - show simple $297 card
  if (
    lower.includes("$297") ||
    lower.includes("it's $297") ||
    lower.includes("costs $297") ||
    lower.includes("price is") ||
    (lower.includes("cost") && lower.includes("video"))
  ) {
    return { type: "pricing", data: { name: "v0 University", price: "$297", description: "One video. All templates." } }
  }

  // Payment options - when ready to buy
  if (
    lower.includes("ready to buy") ||
    lower.includes("here's how to pay") ||
    lower.includes("payment link") ||
    lower.includes("checkout") ||
    lower.includes("stripe") ||
    lower.includes("pay now")
  ) {
    return { type: "paymentOptions", data: null }
  }

  return null
}
