"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import type { UIMessage } from "ai"
import { ChevronDown, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BidSelector } from "@/components/bid-selector"
import { submitBid } from "@/app/actions/bids"
import type { Service } from "@/lib/services"
import { detectContentToShow } from "@/lib/content-detection"
import { SmsTrigger } from "@/components/sms-trigger"
import type { SmsContext } from "@/lib/sms"
import { determineConversationPhase } from "@/lib/chat-config"
import {
  ImageGallery,
  PricingCard,
  ServiceCatalog,
  FaqDisplay,
  LiveSitesDisplay,
  AllPricingDisplay,
  SiteAuditInput,
  LabelUpload,
  EmailCapture,
  renderMessageWithSmsLinks,
} from "./content-displays"
import { RevenueLeakCalculator } from "./revenue-leak-calculator"
import { BeforeAfterTimeline } from "./before-after-timeline"
import { SpecificityTestimonials } from "./specificity-testimonials"
import { SpeedCommitmentSelector } from "./speed-commitment-selector"
import { ProcessPreviewStack } from "./process-preview-stack"
import { PaymentOptions, MicroConsultation } from "./payment-options"

interface MessageListProps {
  messages: UIMessage[]
  status: string
  avatarUrl: string
  onQuickReply?: (text: string) => void
  onAuditSubmit?: (url: string) => void
  onLabelUpload?: (dataUrl: string, fileName: string) => void
}

function formatRelativeTime(date: Date | undefined): string {
  if (!date) return ""
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (seconds < 60) return "now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

// Persistent SMS CTA — label and context shift based on where the conversation is.
// Uses presupposition language: the next step is always framed as already decided.

function getSmsCta(messages: UIMessage[]): { label: string; context: SmsContext; show: boolean } {
  const phase = determineConversationPhase(messages)
  const msgCount = messages.length
  const allText = messages
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  const lastAssistant = messages.filter(m => m.role === "assistant").pop()
  const lastText = lastAssistant?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map(p => p.text.toLowerCase())
    .join(" ") || ""

  // Check if the conversation has been qualified — user has shared what they sell + some problem/revenue info
  const userText = messages
    .filter(m => m.role === "user")
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  
  const hasSharedCategory = ["supplement", "fashion", "apparel", "beauty", "skincare", "food", "beverage", "merch", "clothing", "streetwear", "candle", "jewelry", "pet", "home", "decor", "wellness", "fitness", "sports", "electronics", "tech", "health", "cbd", "hemp", "coffee", "tea", "accessories", "shoes", "cosmetics", "gym", "athletic"].some(c => userText.includes(c))
  const hasSharedProblem = ["conversion", "converting", "traffic", "design", "slow", "rebrand", "broken", "redesign", "rebuild", "product page", "product shot", "render", "photo", "email", "ad", "creative", "don't buy", "not buying", "nobody buys", "not enough", "doesn't look", "look right", "fresh start", "sales"].some(p => userText.includes(p))
  const hasSharedRevenue = /\$?\d+k/.test(userText) || userText.includes("revenue") || userText.includes("/mo") || userText.includes("a month") || userText.includes("per month")
  
  // Only show SMS CTA after meaningful qualification (shared product + at least problem or revenue)
  const isQualified = hasSharedCategory && (hasSharedProblem || hasSharedRevenue)
  
  // Also show if conversation is deep enough (10+ messages means real engagement)
  const isEngaged = msgCount >= 10
  
  // Or if pricing/gate has been discussed
  const gateDiscussed = allText.includes("jonyeazel@gmail.com") || allText.includes("$97") || allText.includes("consult fee")
  
  const shouldShow = isQualified || isEngaged || gateDiscussed

  // Payment methods shown — strongest close
  const paymentShown = lastText.includes("cash app") || lastText.includes("venmo") || lastText.includes("zelle") || lastText.includes("apple cash")
  if (paymentShown && lastText.includes("$97")) {
    return { label: "I paid — text Jon", context: "ready-to-start", show: true }
  }

  // Deep closing — gate steps have been shared
  if (gateDiscussed || lastText.includes("add jonyeazel") || lastText.includes("ready to get started") || lastText.includes("text him here")) {
    return { label: "I'm ready — text Jon", context: "ready-to-start", show: shouldShow }
  }

  // Post-pricing — they've seen numbers
  if (lastText.includes("$5k") || lastText.includes("$15k") || lastText.includes("$2.5k") || lastText.includes("$2,500") || lastText.includes("$5,000") || lastText.includes("$7,500") || lastText.includes("pricing") || /\d+[\-–]\d+k/.test(lastText) || /around \d+k/.test(lastText)) {
    return { label: "Talk details — text Jon", context: "post-pricing", show: shouldShow }
  }

  // Post-audit — analysis delivered
  if (phase === "analyzed") {
    return { label: "Get the fixes — text Jon", context: "post-audit", show: shouldShow }
  }

  // Metrics shared — they're invested
  if (phase === "metrics_shared") {
    return { label: "Next steps — text Jon", context: "general", show: shouldShow }
  }

  // Qualified but still early
  if (isQualified) {
    return { label: "Talk to Jon", context: "general", show: true }
  }

  // Fallback — hide if not qualified
  return { label: "Text Jon", context: "general", show: false }
}

// Quick reply suggestions based on conversation context
function getQuickReplies(lastAssistantMessage: string, allMessages: UIMessage[]): string[] {
  const lower = lastAssistantMessage.toLowerCase()
  
  // Check conversation history to avoid redundant options
  const allUserText = allMessages
    .filter(m => m.role === "user")
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  
  const hasSharedRevenue = /\$?\d+k/.test(allUserText) || allUserText.includes("revenue") || allUserText.includes("/mo")
  const hasSharedCategory = ["supplement", "fashion", "apparel", "beauty", "skincare", "food", "beverage", "merch", "clothing", "streetwear", "candle", "jewelry", "pet", "home", "decor", "wellness", "fitness", "sports", "electronics", "tech", "toy", "craft", "vintage", "outdoor", "health", "cbd", "hemp", "coffee", "tea", "gym", "athletic", "accessories", "shoes", "cosmetics"].some(c => allUserText.includes(c))
  const hasSharedProblem = ["conversion", "converting", "traffic", "design", "slow", "rebrand", "broken", "don't buy", "not buying", "nobody buys", "not enough", "doesn't look", "look right", "fresh start", "sales"].some(p => allUserText.includes(p))
  const hasSharedBudget = /\$?\d+k\b/.test(allUserText) || /\$\d{1,3}(,\d{3})+/.test(allUserText) || /\$\d{3,}/.test(allUserText) || allUserText.includes("budget")
  const isPreLaunch = allUserText.includes("launching") || allUserText.includes("starting") || allUserText.includes("pre-launch") || allUserText.includes("not live") || allUserText.includes("haven't launched")
  const hasSharedAds = ["paid ads", "organic", "facebook ads", "google ads", "tiktok ads", "running ads", "not running ads"].some(a => allUserText.includes(a))
  
  // GATE with payment methods shown — AI has shared payment options (Cash App, Venmo, etc.)
  if ((lower.includes("cash app") || lower.includes("venmo") || lower.includes("zelle") || lower.includes("apple cash")) && lower.includes("$97")) {
    return ["Done, just sent it", "Jon's added to my store", "Is it refundable?"]
  }

  // GATE — AI has shared the steps (add email + $97 fee) without payment methods
  // Require $97 in payment/gate context, not just pricing context (e.g. "product shots start at $97")
  const is97GateContext = lower.includes("$97") && (lower.includes("send") || lower.includes("pay") || lower.includes("consultation") || lower.includes("deposit") || lower.includes("goes toward") || lower.includes("refund") || lower.includes("consult") || lower.includes("skip the line") || lower.includes("applied to"))
  if (lower.includes("jonyeazel@gmail.com") || is97GateContext || lower.includes("consult fee") || lower.includes("text him here")) {
    return ["Jon's added — what's next?", "How do I pay?", "Where does the $97 go?"]
  }

  // "I already paid" — fast-track to SMS
  if (lower.includes("text jon") && (lower.includes("nice") || lower.includes("sent") || lower.includes("paid"))) {
    return ["Done, texted him", "When will he reply?"]
  }

  // Micro consultation mentioned
  if (lower.includes("micro consultation") || (lower.includes("one question") && lower.includes("$97"))) {
    return ["I've got a question", "Tell me about the full project instead"]
  }
  
  // CLOSING — AI asking for commitment
  if (lower.includes("ready to move forward") || lower.includes("want me to send") || lower.includes("ready to get started")) {
    return ["I'm in — what now?", "What do I get?"]
  }
  
  // Conversion rate question
  if (lower.includes("conversion rate") || lower.includes("converting at")) {
    return ["Under 1%", "1-2%", "2-3%", "Honestly not sure"]
  }
  
  // AOV question
  if (lower.includes("average order") || lower.includes("aov") || lower.includes("order value")) {
    return ["Under $50", "$50-100", "$100-200", "Over $200"]
  }
  
  // Revenue questions
  if ((lower.includes("revenue") || lower.includes("monthly") || lower.includes("doing") || lower.includes("making")) && !hasSharedRevenue) {
    return ["Under $10k/mo", "$10k-50k/mo", "$50k-100k/mo", "Over $100k/mo"]
  }
  
  // What do you sell — require actual product/niche context
  if ((lower.includes("what do you sell") || lower.includes("what are you selling") || lower.includes("what kind of product") || lower.includes("what's your niche") || lower.includes("what's your product") || lower.includes("what's your store") || lower.includes("what are you working on") || lower.includes("what kind of store") || lower.includes("niche") || lower.includes("industry") || lower.includes("what products")) && !hasSharedCategory) {
    return [
      "Supplements", "Fashion/Apparel", "Beauty/Skincare", "Health/Wellness",
      "Food/Beverage", "Home/Decor", "Jewelry", "Fitness/Sports",
      "Pet Products", "Electronics", "CBD/Hemp", "Coffee/Tea", "Other"
    ]
  }
  
  // Running ads / traffic source question
  if ((lower.includes("running ads") || lower.includes("paid traffic") || lower.includes("organic traffic") || lower.includes("ads or organic") || lower.includes("how are you driving")) && !hasSharedAds) {
    return ["Paid ads", "Organic only", "Both", "Not yet"]
  }

  // Have a store already question
  if ((lower.includes("have a store") || lower.includes("got a store") || lower.includes("store already") || lower.includes("live yet") || lower.includes("site up") || lower.includes("store up")) && !allUserText.includes("shopify") && !allUserText.includes(".com")) {
    return ["Yeah, on Shopify", "Building one now", "Starting from scratch"]
  }

  // What platform question
  if (lower.includes("what platform") || lower.includes("which platform") || lower.includes("currently on")) {
    return ["Shopify", "WooCommerce", "Other platform", "Starting fresh"]
  }

  // Pre-launch stage question — "got a product ready?" / "what stage are you at?"
  if ((lower.includes("stage") || lower.includes("product ready") || lower.includes("in development") || lower.includes("from scratch")) && (lower.includes("?") || lower.includes("what"))) {
    return ["Product's ready, just need the store", "Still in development", "Got the idea, need everything"]
  }

  // Past agency/freelancer experience
  if (lower.includes("worked with") && (lower.includes("agency") || lower.includes("someone") || lower.includes("designer") || lower.includes("developer") || lower.includes("before"))) {
    return ["Yeah, it didn't work out", "First time hiring for this", "Been doing it myself"]
  }

  // Timeline questions  
  if (lower.includes("timeline") || lower.includes("when do you need") || lower.includes("how soon") || lower.includes("when are you") || lower.includes("when do you want")) {
    return ["Yesterday", "This week", "This month", "No rush"]
  }
  
  // Problem/pain point questions
  if ((lower.includes("broken") || lower.includes("problem") || lower.includes("fixed") || lower.includes("struggling") || lower.includes("main thing") || lower.includes("biggest challenge") || lower.includes("issue") || lower.includes("what's going on") || lower.includes("what brings you")) && !hasSharedProblem) {
    return ["People visit but don't buy", "The site doesn't look right", "Everything loads slow", "I need a fresh start"]
  }
  
  // Budget question — check before traffic/pricing to avoid false positives
  if ((lower.includes("budget") || lower.includes("what can you spend") || lower.includes("comfortable with") || lower.includes("invest")) && !hasSharedBudget) {
    return ["Under $2,500", "$2,500-$5,000", "$5,000-$10,000", "$10,000+"]
  }
  
  // Turnaround time mentioned
  if (lower.includes("48 hour") || lower.includes("48hr") || lower.includes("2 days")) {
    return ["That's what I need", "What's the first step?", "What's that run?"]
  }

  // "Think about it" / soft close — AI offering free value or micro consultation as downgrade
  if (lower.includes("no pressure") || lower.includes("no strings") || lower.includes("while you decide") || lower.includes("whenever you're ready") || lower.includes("take your time")) {
    return ["Actually, let's do it", "Check my store first", "I've got one question"]
  }

  // Pricing shown — match various price formats the AI uses
  if (/\$?\d+[\-–]\d+k/i.test(lower) || /\$\d+k/i.test(lower) || lower.includes("$2,500") || lower.includes("$5,000") || lower.includes("$7,500") || lower.includes("$15,000") || /around \d+k/.test(lower) || /probably \d+k/.test(lower)) {
    return ["Works for me — what's next?", "When can we start?", "What can we do at a lower number?"]
  }
  
  // Traffic vs conversions vs retention — only when explicitly offering a choice
  if (/\btraffic\b/.test(lower) && /\bconversion/.test(lower) && /\bretention\b/.test(lower)) {
    return ["Traffic", "Conversions", "Retention", "All of the above"]
  }
  
  // Product count
  if (lower.includes("how many product") || lower.includes("how many sku") || lower.includes("catalog size")) {
    return ["1-10", "10-20", "20-50", "50+"]
  }
  
  // Post-audit results — AI has delivered specific analysis/recommendations
  if (lower.includes("want me to implement") || lower.includes("implement these")) {
    return ["Yeah, let's fix it", "What would that run me?"]
  }
  
  // Post-audit — AI gave store analysis (mentions headlines, product pages, CTAs, add-to-cart, etc.)
  const isAuditAnalysis = (lower.includes("i'd test") || lower.includes("i'd change") || lower.includes("i'd fix") || lower.includes("first thing i notice") || lower.includes("here's what i see") || lower.includes("biggest issue")) && (lower.includes("headline") || lower.includes("hero") || lower.includes("product page") || lower.includes("add-to-cart") || lower.includes("above the fold") || lower.includes("mobile") || lower.includes("messaging") || lower.includes("conversion"))
  if (isAuditAnalysis) {
    return ["How do we fix that?", "What would that run me?", "How fast can you turn this around?"]
  }
  
  // Post-portfolio — AI just showed live sites/builds
  if (lower.includes("stores i've built") || lower.includes("stores i built") || lower.includes("recent builds") || (lower.includes("here are a few") && lower.includes("built"))) {
    return ["What would mine cost?", "How fast do you build?", "I need something like that"]
  }
  
  // Post-gallery — AI just showed product shots/renders
  if (lower.includes("here are some renders") || lower.includes("here are some shots") || lower.includes("recent renders") || (lower.includes("here are") && lower.includes("shot"))) {
    return ["What do you need from me to start?", "How much for eight?", "How fast do you turn these around?"]
  }

  // Store/site URL question
  if ((lower.includes("drop your") && (lower.includes("url") || lower.includes("store"))) || 
      lower.includes("quick wins") || lower.includes("free audit")) {
    return ["Yeah, here it is", "I'm still building it"]
  }
  
  // Store link request
  if (lower.includes("store") && (lower.includes("url") || lower.includes("link") || lower.includes("see it") || lower.includes("take a look"))) {
    return ["Yeah, one sec", "Still building it"]
  }
  
  // After getting a free tip
  if (lower.includes("quick win") || lower.includes("sticky") || lower.includes("one-page checkout") || lower.includes("implement today")) {
    return ["Can you just do it for me?", "What would the full thing cost?"]
  }
  
  // Confirming price
  if (lower.includes("does") && (lower.includes("work") || lower.includes("fit"))) {
    return ["Let's do it", "That's a stretch for me"]
  }

  // "Should I" / "Want me to" — AI offering to do something
  if ((lower.includes("should i") || (lower.includes("want me to") && !lower.includes("implement"))) && lower.includes("?")) {
    return ["Yeah, do it", "Tell me more first", "What's that run?"]
  }
  
  // Default based on conversation state — check what the conversation is actually about
  const isAboutProductShots = allUserText.includes("product shot") || allUserText.includes("product photo") || allUserText.includes("render") || allUserText.includes("3d")
  const isAboutAgency = allUserText.includes("agency") || allUserText.includes("white-label") || allUserText.includes("white label")
  
  if (isAboutProductShots) {
    return ["What do you need from me to start?", "How much for a set of eight?"]
  }
  if (isAboutAgency) {
    return ["Show me what you've built", "What does that run?"]
  }
  if (!hasSharedCategory && isPreLaunch) {
    return ["I need a store built", "I need product shots first", "What do most brands start with?"]
  }
  if (!hasSharedCategory) {
    return ["My store needs work", "What would you fix?", "I need this done fast"]
  }
  if (!hasSharedRevenue && !isPreLaunch && !hasSharedBudget) {
    return ["Under $10k/mo", "$10k-50k/mo", "$50k-100k/mo", "Just getting started"]
  }
  if (!hasSharedProblem) {
    return ["People visit but don't buy", "It doesn't look right", "The site feels slow"]
  }
  
  return ["Show me what you've done", "What would you recommend?"]
}

// Check if two messages are from the same sender and close in time (within 2min)
function isContinuation(current: UIMessage, previous: UIMessage | undefined): boolean {
  if (!previous) return false
  if (current.role !== previous.role) return false
  if (!current.createdAt || !previous.createdAt) return false
  const gap = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime()
  return gap < 120_000
}

export function MessageList({ messages, status, avatarUrl, onQuickReply, onAuditSubmit, onLabelUpload }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const lastMessageCount = useRef(messages.length)

  const [bidService, setBidService] = useState<Service | null>(null)
  const [bidSubmitted, setBidSubmitted] = useState(false)
  
  // Cache detected content to prevent re-detection on every render
  const detectedContentCache = useRef<Map<string, ReturnType<typeof detectContentToShow>>>(new Map())

  const checkIfNearBottom = useCallback(() => {
    if (!containerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    return scrollHeight - scrollTop - clientHeight < 100
  }, [])

  useEffect(() => {
    const nearBottom = checkIfNearBottom()
    setIsNearBottom(nearBottom)
    if (messages.length > lastMessageCount.current) {
      if (nearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      } else {
        setShowNewMessage(true)
      }
    }
    lastMessageCount.current = messages.length
  }, [messages, checkIfNearBottom])

  // Smooth auto-scroll during streaming — keeps content pinned to bottom
  useEffect(() => {
    if (status !== "streaming") return
    let raf: number
    const tick = () => {
      if (containerRef.current && checkIfNearBottom()) {
        const el = containerRef.current
        el.scrollTop = el.scrollHeight - el.clientHeight
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status, checkIfNearBottom])

  // Scroll to bottom when streaming ends (chips appear)
  useEffect(() => {
    if (status === "ready" && checkIfNearBottom()) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 120)
    }
  }, [status, checkIfNearBottom])

  const handleScroll = useCallback(() => {
    const nearBottom = checkIfNearBottom()
    setIsNearBottom(nearBottom)
    if (nearBottom) setShowNewMessage(false)
  }, [checkIfNearBottom])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowNewMessage(false)
  }

  const handleBidSubmit = async (tier: any, email: string, description: string) => {
    if (!bidService) return

    await submitBid({
      email,
      serviceCategory: bidService.category,
      serviceId: bidService.id,
      projectDescription: description || `Interested in ${bidService.name}`,
      selectedTier: tier.name,
      bidAmount: tier.price,
    })

    setBidSubmitted(true)
    setBidService(null)
    setTimeout(() => setBidSubmitted(false), 3000)
  }

  const renderSmartContent = (text: string, messageId: string) => {
    // Check cache first to prevent re-detection during re-renders
    let detected = detectedContentCache.current.get(messageId)
    if (!detected) {
      detected = detectContentToShow(text)
      if (detected) {
        detectedContentCache.current.set(messageId, detected)
      }
    }
    if (!detected) return null

    if (detected.type === "gallery") {
      return <ImageGallery images={detected.data.images} serviceName={detected.data.name} price={detected.data.price} />
    }
    if (detected.type === "liveSites") {
      return <LiveSitesDisplay />
    }
    if (detected.type === "pricing") {
      return <PricingCard name={detected.data.name} price={detected.data.price} description={detected.data.description} />
    }
    if (detected.type === "allPricing") {
      return <AllPricingDisplay pricing={detected.data} onSelectService={onQuickReply} />
    }
    
    if (detected.type === "siteAudit" && onAuditSubmit) {
      return <SiteAuditInput onSubmitUrl={onAuditSubmit} />
    }

    if (detected.type === "labelUpload" && onLabelUpload) {
      return <LabelUpload onSubmitLabel={onLabelUpload} />
    }

    if (detected.type === "emailCapture") {
      return <EmailCapture context={detected.data?.context || "tips"} />
    }

    if (detected.type === "revenueLeak") {
      return <RevenueLeakCalculator onCTA={() => onQuickReply?.("Let me fix this")} />
    }

    if (detected.type === "beforeAfterTimeline" && detected.data) {
      return <BeforeAfterTimeline caseStudy={detected.data} />
    }

    if (detected.type === "testimonials" && detected.data) {
      return <SpecificityTestimonials testimonials={detected.data} />
    }

    if (detected.type === "speedCommitment") {
      return <SpeedCommitmentSelector onSelect={(opt) => onQuickReply?.(`I want the ${opt.title} option`)} />
    }

    if (detected.type === "processPreviewStack" && detected.data) {
      return <ProcessPreviewStack deliverables={detected.data} />
    }

    if (detected.type === "paymentOptions") {
      return (
        <PaymentOptions
          serviceName={detected.data?.serviceName || undefined}
          onPaid={() => onQuickReply?.("I just sent $97")}
        />
      )
    }

    if (detected.type === "microConsultation") {
      return (
        <MicroConsultation
          onSelect={() => onQuickReply?.("I have a question for Jon")}
        />
      )
    }

    return null
  }

  const renderToolResult = (toolResult: any) => {
    if (!toolResult?.display) return null

    if (toolResult.type === "service_catalog") {
      return (
        <ServiceCatalog
          services={toolResult.services}
          category={toolResult.category}
          onSelectService={(id) => {
            const service = toolResult.services.find((s: any) => s.id === id)
            if (service) setBidService(service as Service)
          }}
        />
      )
    }

    if (toolResult.type === "bid_selector") {
      return (
        <button
          onClick={() => setBidService(toolResult.service)}
          className="my-3 w-full p-4 rounded-xl bg-foreground text-background flex items-center justify-between hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <div className="text-left">
            <p className="font-medium">{toolResult.service.name}</p>
            <p className="text-sm opacity-70">Tap to see pricing options</p>
          </div>
          <span className="font-semibold">${toolResult.service.tiers[0]?.price.toLocaleString()}+</span>
        </button>
      )
    }

    if (toolResult.type === "faqs") {
      return <FaqDisplay serviceName={toolResult.serviceName} faqs={toolResult.faqs} />
    }

    if (toolResult.type === "portfolio_gallery") {
      return <ImageGallery images={toolResult.images} serviceName={toolResult.serviceName} price={toolResult.price} />
    }

    if (toolResult.type === "live_sites") {
      return <LiveSitesDisplay />
    }

    if (toolResult.type === "iframe") {
      return (
        <div className="my-3 rounded-xl overflow-hidden border border-border sm:hidden">
          <div className="bg-muted/50 px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground truncate">{toolResult.caption}</span>
            <a
              href={toolResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe src={toolResult.url} className="w-full h-full bg-white" sandbox="allow-scripts allow-same-origin" />
        </div>
      )
    }

    if (toolResult.type === "image") {
      return (
        <div className="my-3">
          <img src={toolResult.url || "/placeholder.svg"} alt={toolResult.caption} className="rounded-xl max-w-full" />
          {toolResult.caption && <p className="text-xs text-muted-foreground mt-2">{toolResult.caption}</p>}
        </div>
      )
    }

    return null
  }

  return (
    <div className="relative h-full">
      {/* Top fade — messages dissolve as they scroll up */}
      <div
        className="absolute top-0 left-0 right-0 h-3 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, var(--card), transparent)" }}
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 pt-3 pb-4 scrollbar-hide"
        style={{ overflowAnchor: "auto", overscrollBehavior: "contain" }}
      >
        <div className="min-h-full flex flex-col justify-end">
          {messages.map((message, index) => {
            const prev = index > 0 ? messages[index - 1] : undefined
            const continuation = isContinuation(message, prev)
            const isLastMessage = index === messages.length - 1
            const isCurrentlyStreaming = status === "streaming" && isLastMessage

            return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 32,
                delay: isLastMessage ? 0.04 : 0 
              }}
              className={continuation ? "mt-1" : index === 0 ? "" : "mt-5"}
            >
              {message.role === "user" ? (
                <div className="flex flex-col items-end">
                  {message.parts?.map((part, i) => {
                    if (part.type === "text") {
                      const imageMatches = part.text.match(/data:image\/[^;]+;base64,[^\]]+/g)
                      if (imageMatches) {
                        return (
                          <div key={`images-${i}`} className="flex flex-wrap gap-2 justify-end mb-2">
                            {imageMatches.map((imgSrc, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={imgSrc || "/placeholder.svg"}
                                alt="Uploaded"
                                className="h-32 w-auto rounded-xl object-cover"
                              />
                            ))}
                          </div>
                        )
                      }
                    }
                    return null
                  })}
                  {!continuation && (
                    <div className="flex items-center gap-2 mb-1.5">
                      {message.createdAt && (
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(message.createdAt)}</span>
                      )}
                      <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-[9px] font-medium text-background">you</span>
                      </div>
                    </div>
                  )}
                  <div className="max-w-[88%] ml-auto">
                    <p className="text-[14px] whitespace-pre-wrap leading-normal text-foreground text-right">
                      {message.parts?.map((part) => {
                        if (part.type === "text") {
                          return (
                            part.text
                              .replace(/data:image\/[^;]+;base64,[^\]]+/g, "")
                              .replace(/\[Uploaded image: [^\]]+\]/g, "")
                              .replace(/\n{3,}/g, "\n\n")
                              .trim() || null
                          )
                        }
                        return null
                      })}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {!continuation && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <img
                        src={avatarUrl || "/placeholder.svg"}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      {message.createdAt && (
                        <span className="text-[10px] text-muted-foreground">{formatRelativeTime(message.createdAt)}</span>
                      )}
                    </div>
                  )}
                  <div>
                    {message.parts?.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <div key={i}>
                            <p className="text-[14px] leading-[1.55] text-foreground">
                              {renderMessageWithSmsLinks(part.text)}
                              {isCurrentlyStreaming && (
                                <span className="inline-block w-[2px] h-[14px] bg-foreground/60 ml-0.5 align-middle animate-[cursor-blink_1.2s_ease-in-out_infinite]" />
                              )}
                            </p>
                            {!isCurrentlyStreaming && renderSmartContent(part.text, message.id)}
                          </div>
                        )
                      }
                      if (part.type === "tool-invocation" && part.state === "result") {
                        const media = renderToolResult(part.result)
                        if (media) return <div key={i}>{media}</div>
                      }
                      if (part.type === "tool-invocation" && part.state === "call") {
                        return (
                          <div key={i} className="flex items-center gap-2 py-1.5">
                            <div className="flex items-center gap-1">
                              {[0, 1, 2].map((j) => (
                                <span
                                  key={j}
                                  className="w-1 h-1 rounded-full bg-muted-foreground/30 animate-pulse"
                                  style={{ animationDelay: `${j * 200}ms` }}
                                />
                              ))}
                            </div>
                            <span className="text-[12px] text-muted-foreground">thinking</span>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              )}
            </motion.div>
            )
          })}

          <AnimatePresence>
            {status === "streaming" && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                className="mt-5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={avatarUrl || "/placeholder.svg"} alt="" className="w-6 h-6 rounded-full object-cover" />
                </div>
                <div className="flex items-center gap-[5px]">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-[5px] h-[5px] rounded-full bg-foreground/25"
                      animate={{ opacity: [0.15, 0.55, 0.15], scale: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.15, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Reply Chips */}
          <AnimatePresence>
            {status === "ready" && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && onQuickReply && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 32, delay: 0.06 }}
                className="pt-3"
              >
                <div className="relative">
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                    {(() => {
                      const cta = getSmsCta(messages)
                      if (!cta.show) return null
                      return (
                        <SmsTrigger key="sms-cta" context={cta.context}>
                          <motion.button
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 32, delay: 0.08 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex-shrink-0 py-1.5 px-3.5 rounded-full text-[12px] bg-foreground text-background hover:opacity-90 transition-opacity duration-150 cursor-pointer"
                          >
                            {cta.label}
                          </motion.button>
                        </SmsTrigger>
                      )
                    })()}
                    {getQuickReplies(
                      messages[messages.length - 1]?.parts
                        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                        .map(p => p.text)
                        .join(" ") || "",
                      messages
                    ).map((reply, i) => (
                      <motion.button
                        key={reply}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                          delay: 0.1 + i * 0.02,
                        }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => onQuickReply(reply)}
                        className="flex-shrink-0 py-1.5 px-3.5 rounded-full text-[12px] border border-border/80 text-muted-foreground hover:text-foreground hover:border-foreground/30 active:bg-muted/50 transition-all duration-150"
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </div>
                  <div
                    className="absolute right-0 top-0 bottom-1 w-10 pointer-events-none"
                    style={{ background: "linear-gradient(to right, transparent, var(--card))" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {bidSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "rgba(37, 58, 46, 0.1)",
                  borderColor: "rgba(37, 58, 46, 0.3)",
                  color: "#253a2e",
                }}
              >
                Request submitted! I'll get back to you within 24 hours.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-4 flex-shrink-0" aria-hidden="true" />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <AnimatePresence>
        {showNewMessage && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-float flex items-center gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            New message
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bidService && (
          <BidSelector service={bidService} onClose={() => setBidService(null)} onSubmit={handleBidSubmit} />
        )}
      </AnimatePresence>
    </div>
  )
}
