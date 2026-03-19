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

// Text Jon CTA — context-aware based on conversation phase
function getSmsCta(messages: UIMessage[]): { label: string; context: SmsContext; show: boolean } {
  const phase = determineConversationPhase(messages)
  const msgCount = messages.length
  const allText = messages
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  
  // Show SMS CTA after meaningful engagement
  const isEngaged = msgCount >= 8
  const hasShownInterest = allText.includes("enroll") || allText.includes("coaching") || allText.includes("$297") || allText.includes("$1,497") || allText.includes("$3,497")
  
  const shouldShow = isEngaged || hasShownInterest || phase === "ready_to_buy"

  if (phase === "ready_to_buy") {
    return { label: "I'm ready — text Jon", context: "ready-to-start", show: true }
  }

  if (hasShownInterest) {
    return { label: "Questions? Text Jon", context: "post-pricing", show: shouldShow }
  }

  if (phase === "interested") {
    return { label: "Talk to Jon", context: "general", show: shouldShow }
  }

  return { label: "Text Jon", context: "general", show: false }
}

// Quick reply suggestions for v0 University — discovery flow for course sales
function getQuickReplies(lastAssistantMessage: string, allMessages: UIMessage[]): string[] {
  const lower = lastAssistantMessage.toLowerCase()
  
  // Check conversation history
  const allUserText = allMessages
    .filter(m => m.role === "user")
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  
  const hasSharedGoal = ["shopify", "store", "landing page", "portfolio", "website", "client", "freelance", "agency"].some(g => allUserText.includes(g))
  const hasSharedExperience = ["tried v0", "used v0", "never", "beginner", "don't code", "no code", "designer", "developer"].some(e => allUserText.includes(e))
  const hasAskedPrice = ["how much", "price", "cost", "$297", "expensive", "afford"].some(p => allUserText.includes(p))
  
  // ENROLLMENT — AI showing enrollment page
  if (lower.includes("enrollment") || lower.includes("here's how to enroll") || lower.includes("sign up")) {
    return ["Take me there", "What's included again?", "Do you have a payment plan?"]
  }

  // READY TO BUY — signals they want to proceed
  if (lower.includes("ready to start") || lower.includes("let's do it") || lower.includes("how do i enroll")) {
    return ["Sign me up", "One more question first"]
  }

  // PRICE SHOWN — $297, $1,497, or $3,497 mentioned
  if (lower.includes("$297") || lower.includes("$1,497") || lower.includes("$3,497") || lower.includes("the course is")) {
    return ["That works for me", "What's included?", "Do students actually get results?", "Is there a guarantee?"]
  }

  // OBJECTION HANDLING — price concern
  if (lower.includes("compared to") || lower.includes("make it back") || lower.includes("save that") || lower.includes("pays for itself")) {
    return ["That makes sense", "Show me some results", "I need to think about it"]
  }

  // SHOPIFY FOUNDER FLOW — specific to store owners
  if (lower.includes("how much have you spent") || lower.includes("design work") || lower.includes("designer") || lower.includes("developer")) {
    return ["Thousands, honestly", "A few hundred", "I do it all myself", "I'm just starting out"]
  }

  // SHOPIFY CONTEXT — they mentioned having a store
  if (lower.includes("product page") || lower.includes("landing page") || lower.includes("campaign") || lower.includes("module 3")) {
    return ["Show me examples", "How long does that take to learn?", "What's the course cost?"]
  }

  // STUDENT RESULTS — after showing portfolio or success stories
  if (lower.includes("student") && (lower.includes("built") || lower.includes("launched") || lower.includes("zero experience"))) {
    return ["I want results like that", "How long did that take them?", "What's the course cost?"]
  }

  // BEGINNER REASSURANCE — addressing "I'm not technical" concern
  if (lower.includes("zero code") || lower.includes("plain english") || lower.includes("describe what you want") || lower.includes("no design experience")) {
    return ["That's exactly what I need", "What would I build first?", "Show me how it works"]
  }

  // FREE VALUE — offered a preview or sample
  if (lower.includes("preview") || lower.includes("module 1") || lower.includes("sample") || lower.includes("free")) {
    return ["Yes, show me", "What's in the full course?", "Just tell me the price"]
  }

  // YOUTUBE COMPARISON — addressing free content objection
  if (lower.includes("shortcut") || lower.includes("structured") || lower.includes("trial and error") || lower.includes("youtube")) {
    return ["I'd rather have the shortcut", "What makes this different?", "What's it cost?"]
  }

  // WHAT BRINGS YOU HERE — opening question
  if (lower.includes("what brings you") || lower.includes("wondering if they needed to") || lower.includes("paid someone")) {
    return ["I'm a Shopify founder", "I want to learn v0", "I've been burned by agencies", "Just curious what this is"]
  }

  // WHAT DO YOU WANT TO BUILD — discovery question
  if (lower.includes("what are you trying to build") || lower.includes("what would you build") || lower.includes("what's the first thing")) {
    return ["Landing pages for my store", "A portfolio site", "Client websites", "I'm not sure yet"]
  }

  // TRIED V0 BEFORE — diagnosing past experience
  if (lower.includes("what happened") || lower.includes("went wrong") || lower.includes("prompt") || lower.includes("generic results")) {
    return ["It looked too basic", "I couldn't get the code to work", "I didn't know how to prompt it", "I got frustrated and quit"]
  }

  // SHOWING COURSE CONTENT — curriculum or modules
  if (lower.includes("module") || lower.includes("curriculum") || lower.includes("what's included") || lower.includes("what you get")) {
    return ["That's exactly what I need", "How long does it take?", "What's the price?"]
  }

  // GUARANTEE QUESTION
  if (lower.includes("guarantee") || lower.includes("refund") || lower.includes("money back")) {
    return ["That's fair", "How do I sign up?", "Show me some results first"]
  }

  // TIME QUESTION — how long does it take
  if (lower.includes("45 minutes") || lower.includes("by the end of the day") || lower.includes("weekend") || lower.includes("how long")) {
    return ["That's faster than I expected", "What would I build first?", "What's the cost?"]
  }

  // COACHING MENTION — higher tier products
  if (lower.includes("coaching") || lower.includes("1:1") || lower.includes("jon") || lower.includes("direct help")) {
    return ["Tell me about coaching", "The course is enough", "What's the difference?"]
  }

  // DEFAULT — based on conversation state
  if (!hasSharedGoal) {
    return ["I have a Shopify store", "I want to build websites", "I'm just exploring", "What is v0?"]
  }
  
  if (!hasSharedExperience) {
    return ["I've never used v0", "I tried it but got stuck", "I know the basics", "I'm a complete beginner"]
  }

  if (!hasAskedPrice) {
    return ["What's the course cost?", "Show me what students built", "Is this right for me?"]
  }

  return ["Show me student sites", "What's included?", "How do I get started?"]
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
          onPaid={() => onQuickReply?.("I just enrolled")}
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
                Request submitted. You'll hear back within 24 hours.
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
