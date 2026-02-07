import { PORTFOLIO_DATA, getGalleryByCategory } from "./portfolio-data"
import { CASE_STUDIES, TESTIMONIALS, DELIVERABLES } from "./component-data"

export type DetectedContent = {
  type: "gallery" | "liveSites" | "pricing" | "allPricing" | "siteAudit" | "emailCapture" | "revenueLeak" | "beforeAfterTimeline" | "testimonials" | "speedCommitment" | "processPreviewStack"
  data?: any
}

export function detectContentToShow(text: string): DetectedContent | null {
  const lower = text.toLowerCase()

  // PDPs / live sites - show the mobile iframe previews
  // Triggers on AI responses like "Here are a few stores I've built recently"
  if (
    lower.includes("here are a few") ||
    lower.includes("here are some") ||
    lower.includes("stores i've built") ||
    lower.includes("stores i built") ||
    lower.includes("i've built recently") ||
    lower.includes("i built recently") ||
    lower.includes("recent builds") ||
    lower.includes("few stores") ||
    lower.includes("some stores") ||
    lower.includes("check these out") ||
    lower.includes("take a look at")
  ) {
    return { type: "liveSites", data: PORTFOLIO_DATA.liveSites }
  }

  // Product shots / bottle renders
  if (
    lower.includes("product shot") ||
    lower.includes("bottle") ||
    lower.includes("render") ||
    lower.includes("photography") ||
    lower.includes("photos i")
  ) {
    return { type: "gallery", data: { images: getGalleryByCategory("product-shots"), name: "Product Shots", price: 397 } }
  }

  // Ad creatives
  if (
    lower.includes("ad creative") ||
    lower.includes("static ad") ||
    lower.includes("banner") ||
    lower.includes("infographic") ||
    lower.includes("graphic design")
  ) {
    return { type: "gallery", data: { images: getGalleryByCategory("ad-creatives"), name: "Ad Creatives", price: 249 } }
  }

  // Store design work
  if (
    lower.includes("store design") ||
    lower.includes("store layout") ||
    lower.includes("page design") ||
    lower.includes("design work")
  ) {
    return { type: "gallery", data: { images: getGalleryByCategory("store-design"), name: "Store Design", price: 1497 } }
  }

  // Smart Store AI
  if (
    lower.includes("smart store") ||
    lower.includes("ai system") ||
    lower.includes("ai quiz") ||
    lower.includes("ai-powered") ||
    lower.includes("$15k") ||
    lower.includes("15,000")
  ) {
    return { type: "pricing", data: { name: "Smart Store AI System", price: "$15,000", description: "AI quiz + 10 PDPs + 100 ads" } }
  }

  // Store redesign
  if (
    lower.includes("redesign") ||
    lower.includes("$5k") ||
    lower.includes("5,000") ||
    lower.includes("$2k start") ||
    lower.includes("48 hour")
  ) {
    return { type: "pricing", data: { name: "Store Redesign", price: "$5,000", description: "$2k start + $3k on delivery, 48hr turnaround" } }
  }

  // All pricing / services overview
  if (
    lower.includes("here's what i offer") ||
    lower.includes("what i offer") ||
    lower.includes("services i offer") ||
    lower.includes("pricing breakdown") ||
    lower.includes("here are my services") ||
    lower.includes("my services")
  ) {
    return { type: "allPricing", data: PORTFOLIO_DATA.pricing }
  }

  // Site audit - show URL input when AI asks for a URL
  if (
    (lower.includes("drop your") || lower.includes("paste your") || lower.includes("share your")) && 
    (lower.includes("url") || lower.includes("store") || lower.includes("link") || lower.includes("site")) ||
    lower.includes("quick wins") ||
    lower.includes("audit your") ||
    lower.includes("i'll take a look") ||
    lower.includes("give you 3") ||
    lower.includes("free audit") ||
    (lower.includes("send") && lower.includes("url")) ||
    (lower.includes("what's your") && lower.includes("url"))
  ) {
    return { type: "siteAudit", data: null }
  }

  // Email capture - show after tips or audit results are delivered
  if (
    (lower.includes("here are") && (lower.includes("quick win") || lower.includes("recommendation") || lower.includes("tip"))) ||
    (lower.includes("implement") && lower.includes("today")) ||
    lower.includes("audit results") ||
    lower.includes("here's what i found") ||
    lower.includes("i noticed") && lower.includes("could")
  ) {
    return { type: "emailCapture", data: { context: "tips" } }
  }

  // Revenue Leak Calculator — shows when AI mentions opportunity cost
  if (
    lower.includes("leaving on the table") ||
    lower.includes("revenue gap") ||
    lower.includes("here's what you're losing") ||
    lower.includes("let me show you the math") ||
    lower.includes("opportunity cost") ||
    (lower.includes("conversion rate") && lower.includes("sessions") && lower.includes("aov"))
  ) {
    return { type: "revenueLeak", data: null }
  }

  // Before/After Timeline — case study transformations
  if (
    lower.includes("let me show you a transformation") ||
    lower.includes("here's what happened with") ||
    lower.includes("case study") ||
    lower.includes("here's how we took") ||
    (lower.includes("before") && lower.includes("after") && lower.includes("timeline"))
  ) {
    return { type: "beforeAfterTimeline", data: CASE_STUDIES[0] }
  }

  // Specificity Testimonials — social proof with real numbers
  if (
    lower.includes("here's what clients say") ||
    lower.includes("what clients say") ||
    lower.includes("real results") ||
    lower.includes("don't take my word") ||
    lower.includes("proof") ||
    lower.includes("testimonial") ||
    lower.includes("client results")
  ) {
    return { type: "testimonials", data: TESTIMONIALS }
  }

  // Speed Commitment Selector — timeline picker
  if (
    lower.includes("how fast do you want") ||
    lower.includes("ready to move forward") ||
    lower.includes("when do you want to start") ||
    lower.includes("timeline works for you") ||
    lower.includes("pick your speed") ||
    lower.includes("how quickly")
  ) {
    return { type: "speedCommitment", data: null }
  }

  // Process Preview Stack — deliverables breakdown
  if (
    lower.includes("here's what you get") ||
    lower.includes("what's included") ||
    lower.includes("deliverables") ||
    lower.includes("everything in the package") ||
    lower.includes("here's what's in")
  ) {
    // Try to match package type from context
    const isSmartStore = lower.includes("smart store") || lower.includes("ai system")
    const isRedesign = lower.includes("redesign") || lower.includes("rebuild")
    const packageKey = isSmartStore ? "smartStore" : isRedesign ? "redesign" : "default"
    return { type: "processPreviewStack", data: DELIVERABLES[packageKey] }
  }

  return null
}
