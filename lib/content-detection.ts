export type DetectedContent = {
  type: "videoPreview" | "liveSites" | "pricing" | "paymentOptions" | "v0Referral" | "faq" | "coursePreview" | "skillAssessment"
  data?: any
}

export function detectContentToShow(text: string): DetectedContent | null {
  const lower = text.toLowerCase()

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
    lower.includes("course includes") ||
    (lower.includes("inside") && lower.includes("course")) ||
    (lower.includes("get") && lower.includes("access"))
  ) {
    return { type: "coursePreview", data: null }
  }

  // FAQ - show accordion when answering common questions
  if (
    (lower.includes("how does this") && lower.includes("work")) ||
    (lower.includes("is this for") && lower.includes("non-technical")) ||
    (lower.includes("why") && lower.includes("$297")) ||
    lower.includes("common questions") ||
    lower.includes("people usually ask") ||
    lower.includes("frequently asked") ||
    (lower.includes("three main") && lower.includes("things"))
  ) {
    return { type: "faq", data: null }
  }

  // v0 Referral - show the lead magnet card
  if (
    lower.includes("v0.link/jon") ||
    lower.includes("$10 free") ||
    lower.includes("$10 credit") ||
    lower.includes("free credits") ||
    (lower.includes("sign up") && lower.includes("v0") && lower.includes("link"))
  ) {
    return { type: "v0Referral", data: null }
  }

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
    return { type: "liveSites", data: null }
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
