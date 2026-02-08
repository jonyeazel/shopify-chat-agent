import { PORTFOLIO_DATA, getGalleryByCategory } from "./portfolio-data"
import { CASE_STUDIES, TESTIMONIALS, DELIVERABLES } from "./component-data"

export type DetectedContent = {
  type: "gallery" | "liveSites" | "pricing" | "allPricing" | "siteAudit" | "emailCapture" | "revenueLeak" | "beforeAfterTimeline" | "testimonials" | "speedCommitment" | "processPreviewStack" | "paymentOptions" | "microConsultation" | "labelUpload"
  data?: any
}

export function detectContentToShow(text: string): DetectedContent | null {
  const lower = text.toLowerCase()

  // Payment options — show when AI presents the payment gate with methods
  if (
    (lower.includes("cash app") && lower.includes("venmo")) ||
    (lower.includes("send $97") && (lower.includes("cash app") || lower.includes("venmo") || lower.includes("zelle") || lower.includes("apple cash"))) ||
    (lower.includes("payment option") && lower.includes("$97")) ||
    (lower.includes("here's how to pay") || lower.includes("here are the payment option")) ||
    (lower.includes("pick whichever") && lower.includes("$97"))
  ) {
    // Try to extract service name from context
    const serviceMatch = lower.match(/(?:for|toward|towards)\s+(?:your\s+)?(.+?)(?:\s+project|\s*[-–—]|\s*\.|$)/i)
    return { type: "paymentOptions", data: { serviceName: serviceMatch?.[1] || null } }
  }

  // Micro consultation — standalone $97 Q&A offer
  if (
    lower.includes("micro consultation") ||
    (lower.includes("one question") && lower.includes("$97")) ||
    (lower.includes("1 question") && lower.includes("$97")) ||
    lower.includes("answer one specific question") ||
    lower.includes("quick answer for $97") ||
    (lower.includes("single question") && lower.includes("$97"))
  ) {
    return { type: "microConsultation", data: null }
  }

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

  // Label upload — when AI asks user to send/upload their product label for renderings
  if (
    (lower.includes("label") && (lower.includes("upload") || lower.includes("send me") || lower.includes("drop") || lower.includes("share") || lower.includes("attach"))) ||
    (lower.includes("label file") && (lower.includes("need") || lower.includes("grab") || lower.includes("get"))) ||
    (lower.includes("label") && lower.includes("reference") && (lower.includes("image") || lower.includes("photo") || lower.includes("file"))) ||
    (lower.includes("send") && lower.includes("label") && lower.includes("render"))
  ) {
    return { type: "labelUpload", data: null }
  }

  // Product shots / bottle renders — only when AI is showing work, not discussing the service
  if (
    (lower.includes("product shot") && (lower.includes("here are") || lower.includes("check out") || lower.includes("take a look") || lower.includes("some examples"))) ||
    lower.includes("photos i") ||
    lower.includes("here are some renders") ||
    lower.includes("here are some shots")
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

  // Store redesign — require price context or presentation phrasing, not just any mention of "redesign"
  if (
    (lower.includes("redesign") && (lower.includes("$5") || lower.includes("5,000") || lower.includes("starts at") || lower.includes("runs") || lower.includes("costs") || lower.includes("for a redesign"))) ||
    lower.includes("$2k start") ||
    (lower.includes("48 hour") && lower.includes("redesign"))
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
  // Don't trigger when the AI already performed an audit (contains specific headline/messaging critique)
  const alreadyAudited = (lower.includes("headline") || lower.includes("messaging") || lower.includes("i'd test")) && 
    (lower.includes("hero") || lower.includes("ads") || lower.includes("product page"))
  if (
    !alreadyAudited && (
      (lower.includes("drop your") || lower.includes("paste your") || lower.includes("share your")) && 
      (lower.includes("url") || lower.includes("store") || lower.includes("link") || lower.includes("site")) ||
      lower.includes("quick wins") ||
      (lower.includes("audit your") && !lower.includes("calendar") && !lower.includes("call") && !lower.includes("before")) ||
      lower.includes("i'll take a look") ||
      lower.includes("give you 3") ||
      lower.includes("free audit") ||
      (lower.includes("send") && lower.includes("url")) ||
      (lower.includes("what's your") && lower.includes("url"))
    )
  ) {
    return { type: "siteAudit", data: null }
  }

  // Email capture - only show when AI explicitly offers email signup, not on audit results
  // Disabled from auto-detection — email capture felt like bait after free value.
  // Can be manually triggered by the AI saying "want these tips in your inbox" or similar.

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
  // "real results" and "proof" removed — too generic, false-positive on quoted site copy
  if (
    lower.includes("here's what clients say") ||
    lower.includes("what clients say") ||
    lower.includes("don't take my word") ||
    lower.includes("social proof") ||
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
