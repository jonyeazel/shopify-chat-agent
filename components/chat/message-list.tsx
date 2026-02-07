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
import {
  ImageGallery,
  PricingCard,
  ServiceCatalog,
  FaqDisplay,
  LiveSitesDisplay,
  AllPricingDisplay,
  SiteAuditInput,
  EmailCapture,
  renderMessageWithSmsLinks,
} from "./content-displays"
import { RevenueLeakCalculator } from "./revenue-leak-calculator"
import { BeforeAfterTimeline } from "./before-after-timeline"
import { SpecificityTestimonials } from "./specificity-testimonials"
import { SpeedCommitmentSelector } from "./speed-commitment-selector"
import { ProcessPreviewStack } from "./process-preview-stack"

interface MessageListProps {
  messages: UIMessage[]
  status: string
  avatarUrl: string
  onQuickReply?: (text: string) => void
  onAuditSubmit?: (url: string) => void
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

// Quick replies that should open native SMS instead of sending a chat message.
const SMS_QUICK_REPLIES: Record<string, { context: "general" | "ready-to-start" | "post-pricing" }> = {
  "I'll text you now": { context: "ready-to-start" },
  "I'll text you": { context: "ready-to-start" },
  "Text me instead": { context: "general" },
}

function isSmsReply(label: string): boolean {
  return label in SMS_QUICK_REPLIES
}

function getSmsReplyContext(label: string) {
  return SMS_QUICK_REPLIES[label]?.context ?? "general"
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
  const hasSharedCategory = ["supplement", "fashion", "apparel", "beauty", "skincare", "food", "beverage", "merch", "clothing"].some(c => allUserText.includes(c))
  const hasSharedProblem = ["conversion", "traffic", "design", "slow", "rebrand", "broken"].some(p => allUserText.includes(p))
  
  // CLOSING - payment link or phone number
  if (lower.includes("drop your") || lower.includes("phone number") || lower.includes("text you the")) {
    return ["(send my number)", "Can we do a call first?", "I'll text you now"]
  }
  
  // Ready to move forward confirmation
  if (lower.includes("ready to move forward") || lower.includes("want me to send") || lower.includes("payment link")) {
    return ["Yes, send it", "What's included?", "I'll text you", "Need to think about it"]
  }
  
  // Conversion rate question
  if (lower.includes("conversion rate") || lower.includes("converting at")) {
    return ["Under 1%", "1-2%", "2-3%", "Not sure"]
  }
  
  // AOV question
  if (lower.includes("average order") || lower.includes("aov") || lower.includes("order value")) {
    return ["Under $50", "$50-100", "$100-200", "Over $200"]
  }
  
  // Revenue questions - check if not already shared
  if ((lower.includes("revenue") || lower.includes("monthly") || lower.includes("doing") || lower.includes("making")) && !hasSharedRevenue) {
    return ["Under $10k/mo", "$10k-50k/mo", "$50k-100k/mo", "Over $100k/mo"]
  }
  
  // What do you sell - check if not already shared
  if ((lower.includes("what do you sell") || lower.includes("what are you selling") || lower.includes("what kind of") || lower.includes("what's your") || lower.includes("niche") || lower.includes("industry")) && !hasSharedCategory) {
    return ["Supplements", "Fashion/Apparel", "Beauty/Skincare", "Home/Decor", "Food/Beverage", "Other"]
  }
  
  // Timeline questions  
  if (lower.includes("timeline") || lower.includes("when do you need") || lower.includes("how soon") || lower.includes("when are you") || lower.includes("when do you want")) {
    return ["ASAP", "1-2 weeks", "This month", "No rush"]
  }
  
  // Problem/pain point questions
  if ((lower.includes("broken") || lower.includes("problem") || lower.includes("fixed") || lower.includes("struggling") || lower.includes("main thing") || lower.includes("biggest challenge") || lower.includes("issue")) && !hasSharedProblem) {
    return ["Low conversions", "Ugly design", "Slow site", "Need rebrand", "Bad mobile experience", "No traffic"]
  }
  
  // Traffic vs conversions vs retention choice
  if (lower.includes("traffic") || lower.includes("conversion") || lower.includes("retention")) {
    if (lower.includes("or") || lower.includes(",")) {
      return ["Traffic", "Conversions", "Retention", "All of them"]
    }
  }
  
  // Subscription model
  if (lower.includes("subscription") || lower.includes("one-time") || lower.includes("recurring")) {
    return ["Subscription", "One-time only", "Both"]
  }
  
  // Product count
  if (lower.includes("how many product") || lower.includes("how many sku") || lower.includes("catalog size")) {
    return ["1-10", "10-20", "20-50", "50+"]
  }
  
  // What have you tried
  if (lower.includes("tried") || lower.includes("done before") || lower.includes("already")) {
    return ["Changed themes", "Hired someone", "Used apps", "Nothing yet"]
  }
  
  // Post-audit results - implement offer
  if (lower.includes("want me to implement") || lower.includes("implement these")) {
    return ["Yes, implement these", "How much would that cost?", "I'll try these myself first"]
  }
  
  // Store/site URL question / Audit offer
  if (lower.includes("drop your") && (lower.includes("url") || lower.includes("store")) || 
      lower.includes("quick wins") || lower.includes("free audit")) {
    return ["I'll paste my URL", "Don't have a store yet", "Just browsing for now"]
  }
  
  // Store/site URL question
  if (lower.includes("store") && (lower.includes("url") || lower.includes("link") || lower.includes("see it") || lower.includes("take a look"))) {
    return ["I'll share it", "Don't have one yet", "It's embarrassing lol"]
  }
  
  // Smart Store AI specific
  if (lower.includes("smart store") || lower.includes("ai system") || lower.includes("quiz funnel")) {
    return ["How does it work?", "Show me an example", "What's the ROI?", "$15k is steep"]
  }
  
  // Pricing shown
  if (lower.includes("$5k") || lower.includes("$15k") || lower.includes("$2.5k") || lower.includes("$2,500") || lower.includes("$5,000") || lower.includes("$7,500")) {
    return ["That works for me", "What's included?", "Show me examples first", "That's over my budget"]
  }
  
  // Budget question from AI
  if (lower.includes("budget") || lower.includes("what can you spend") || lower.includes("comfortable with") || lower.includes("invest")) {
    return ["Under $2,500", "$2,500-$5,000", "$5,000-$10,000", "$10,000-$15,000", "$15,000+"]
  }
  
  // After getting a free tip
  if (lower.includes("quick win") || lower.includes("sticky") || lower.includes("one-page checkout") || lower.includes("faq section") || lower.includes("implement today")) {
    return ["Thanks! What else?", "Can you do this for me?", "What would full service cost?", "I'll try that"]
  }
  
  // After free resources shared
  if (lower.includes("canva") || lower.includes("youtube") || lower.includes("sidekick")) {
    return ["Thanks!", "What do you charge?", "I need more help", "Show me your work"]
  }
  
  // Does X work for you / confirming price
  if (lower.includes("does") && (lower.includes("work") || lower.includes("fit"))) {
    return ["Yes, let's do it", "That's a stretch", "Need to think about it"]
  }
  
  // Default based on conversation state
  if (!hasSharedCategory) {
    return ["I need a store redesign", "Show me your work", "What's your pricing?", "Free audit please"]
  }
  if (!hasSharedRevenue) {
    return ["Under $10k/mo", "$10k-50k/mo", "$50k-100k/mo", "$100k+/mo", "Just starting"]
  }
  if (!hasSharedProblem) {
    return ["Low conversions", "Need a rebrand", "Site looks dated", "Bad mobile experience", "Not sure what's wrong"]
  }
  
  return ["Ready to start", "Show me examples", "What do you recommend?", "Text me instead"]
}

// Check if two messages are from the same sender and close in time (within 2min)
function isContinuation(current: UIMessage, previous: UIMessage | undefined): boolean {
  if (!previous) return false
  if (current.role !== previous.role) return false
  if (!current.createdAt || !previous.createdAt) return false
  const gap = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime()
  return gap < 120_000
}

export function MessageList({ messages, status, avatarUrl, onQuickReply, onAuditSubmit }: MessageListProps) {
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
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 pt-4 pb-4 scrollbar-hide"
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
                stiffness: 500, 
                damping: 35,
                delay: isLastMessage ? 0.04 : 0 
              }}
              className={continuation ? "mt-1" : index === 0 ? "" : "mt-4"}
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
                  {!continuation && message.createdAt && (
                    <span className="text-[10px] text-muted-foreground mb-1 mr-1 block">{formatRelativeTime(message.createdAt)}</span>
                  )}
                  <div className="flex items-end gap-2 ml-auto max-w-[88%]">
                    <div>
                      <p className="text-[14px] whitespace-pre-wrap leading-normal text-foreground">
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
                    {!continuation && (
                      <div className="w-5 h-5 rounded-full bg-muted flex-shrink-0 flex items-center justify-center mb-0.5">
                        <span className="text-[10px] font-medium text-muted-foreground">Y</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  {!continuation && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={avatarUrl || "/placeholder.svg"}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
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
                                <span className="inline-block w-[2px] h-[14px] bg-foreground/60 ml-0.5 align-middle animate-[cursor-blink_1s_steps(2)_infinite]" />
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
                          <div key={i} className="flex items-center gap-2 py-1">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-pulse" />
                            <span className="text-[13px] text-muted-foreground">thinking</span>
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
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <img src={avatarUrl || "/placeholder.svg"} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-border" />
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1 h-1 rounded-full bg-foreground/40"
                      animate={{ opacity: [0.2, 0.8, 0.2] }}
                      transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, delay: i * 0.18, ease: "easeInOut" }}
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ type: "spring", stiffness: 450, damping: 30, delay: 0.08 }}
                className="pt-3"
              >
                <div className="relative">
                  <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pr-4 pb-1">
                    {getQuickReplies(
                      messages[messages.length - 1]?.parts
                        ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                        .map(p => p.text)
                        .join(" ") || "",
                      messages
                    ).slice(0, 4).map((reply, i) => {
                      const sms = isSmsReply(reply)
                      const chip = (
                        <motion.button
                          key={reply}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 30,
                            delay: 0.1 + i * 0.025,
                          }}
                          whileTap={{ scale: 0.96 }}
                          onClick={sms ? undefined : () => onQuickReply(reply)}
                          className={`flex-shrink-0 py-1 px-3 rounded-full text-[12px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            sms
                              ? "bg-foreground text-background hover:opacity-90 active:scale-95 cursor-pointer"
                              : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 active:bg-muted"
                          }`}
                        >
                          {reply}
                        </motion.button>
                      )
                      if (sms) {
                        return (
                          <SmsTrigger key={reply} context={getSmsReplyContext(reply)}>
                            {chip}
                          </SmsTrigger>
                        )
                      }
                      return chip
                    })}
                  </div>

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

          <div className="h-2 flex-shrink-0" aria-hidden="true" />
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
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-lg flex items-center gap-2"
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
