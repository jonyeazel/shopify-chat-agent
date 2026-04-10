export type DetectedContent = {
  type: "videoPreview" | "liveSites" | "pricing" | "paymentOptions" | "v0Referral" | "faq" | "coursePreview" | "skillAssessment" | "intentSeed" | "beforeAfter" | "profileLink" | "pdfDownload" | "productCard"
  data?: any
}

export function detectContentToShow(text: string): DetectedContent | null {
  const lower = text.toLowerCase()

  // Intent Seed Generation - when AI generates a custom prompt for them
  if (
    (lower.includes("you'd say:") || lower.includes("your seed prompt") || lower.includes("your intent seed")) &&
    (lower.includes("'") || lower.includes('"'))
  ) {
    // Extract the prompt from quotes
    const singleQuoteMatch = text.match(/'([^']{10,80})'/)?.[1]
    const doubleQuoteMatch = text.match(/"([^"]{10,80})"/)?.[1]
    const prompt = singleQuoteMatch || doubleQuoteMatch
    if (prompt) {
      return { type: "intentSeed", data: { prompt } }
    }
  }

  // Before/After comparison - when showing the transformation
  if (
    (lower.includes("before") && lower.includes("after")) ||
    lower.includes("most people do this") ||
    lower.includes("150 words") ||
    lower.includes("what people type") ||
    (lower.includes("instead of") && lower.includes("words"))
  ) {
    return { type: "beforeAfter", data: null }
  }

  // Profile Link - when mentioning v0 profile
  if (
    lower.includes("v0.app/@yeazel") ||
    lower.includes("check my profile") ||
    lower.includes("my v0 profile") ||
    lower.includes("free templates")
  ) {
    return { type: "profileLink", data: null }
  }

  // Product Card - when quoting specific pricing
  if (
    (lower.includes("$497") && (lower.includes("tutor") || lower.includes("learn"))) ||
    (lower.includes("$3,497") && lower.includes("clone"))
  ) {
    const is497 = lower.includes("$497")
    return { 
      type: "productCard", 
      data: is497 
        ? { name: "v0 Tutor", price: "$497", description: "The Cook Method. Build unlimited sites yourself." }
        : { name: "Clone This Site", price: "$3,497", description: "This exact AI sales experience for your business." }
    }
  }

  // PDF Download - when offering the framework
  if (
    lower.includes("download") ||
    lower.includes("the framework") ||
    lower.includes("grab the") ||
    lower.includes("here's the pdf") ||
    (lower.includes("cook method") && lower.includes("doc"))
  ) {
    return { type: "pdfDownload", data: null }
  }

  // Skill Assessment - interactive quiz
  if (
    lower.includes("let me help you figure out") ||
    lower.includes("let's see if this is right") ||
    lower.includes("quick assessment") ||
    lower.includes("few questions to help") ||
    (lower.includes("assessment") && lower.includes("right for"))
  ) {
    return { type: "skillAssessment", data: null }
  }

  // Course Preview - what's included
  if (
    lower.includes("what's included") ||
    lower.includes("what you get") ||
    lower.includes("here's what's inside") ||
    lower.includes("course includes")
  ) {
    return { type: "coursePreview", data: null }
  }

  // v0 Referral - show the lead magnet card
  if (
    lower.includes("v0.link/jon") ||
    lower.includes("$10 free") ||
    lower.includes("$10 credit") ||
    lower.includes("free credits")
  ) {
    return { type: "v0Referral", data: null }
  }

  // Video preview
  if (
    lower.includes("here's a preview") ||
    lower.includes("here's the video") ||
    (lower.includes("video") && lower.includes("preview"))
  ) {
    return { type: "videoPreview", data: null }
  }

  // Live sites - show portfolio
  if (
    lower.includes("here are some sites") ||
    lower.includes("built with v0") ||
    lower.includes("examples of what") ||
    lower.includes("check these out") ||
    lower.includes("take a look at")
  ) {
    return { type: "liveSites", data: null }
  }

  // Payment options - when ready to buy
  if (
    lower.includes("ready to buy") ||
    lower.includes("tap buy now") ||
    lower.includes("hit buy now") ||
    lower.includes("let's do it")
  ) {
    return { type: "paymentOptions", data: null }
  }

  return null
}
