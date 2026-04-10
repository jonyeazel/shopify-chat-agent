"use client"

import { useRef, useEffect, useState, useCallback, useMemo } from "react"
import type { UIMessage } from "ai"
import { ChevronDown, ExternalLink, Copy, Check, ThumbsUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { detectContentToShow } from "@/lib/content-detection"
import { SmsTrigger } from "@/components/sms-trigger"
import type { SmsContext } from "@/lib/sms"
import { determineConversationPhase } from "@/lib/chat-config"
import {
  PricingCard,
  LiveSitesDisplay,
  VideoPreview,
  V0ReferralCard,
  FAQAccordion,
  CoursePreview,
  SkillAssessment,
  renderMessageWithSmsLinks,
  IntentSeedDisplay,
  BeforeAfterComparison,
  ProfileLinkCard,
  PDFDownloadCard,
  ProductCard,
  ProductShowcase,
} from "./content-displays"
import { PaymentOptions } from "./payment-options"

interface MessageListProps {
  messages: UIMessage[]
  status: string
  avatarUrl: string
  onQuickReply?: (text: string) => void
  onCheckout?: () => void
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

// Message action button component - smooth, minimal
function MessageAction({ 
  onClick, 
  icon: Icon, 
  activeIcon: ActiveIcon,
  label,
  isActive 
}: { 
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  activeIcon?: React.ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
}) {
  const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={`p-1.5 rounded-md transition-colors duration-200 ${
        isActive 
          ? "text-neutral-700" 
          : "text-neutral-300 hover:text-neutral-500"
      }`}
      title={label}
    >
      <DisplayIcon className="w-3.5 h-3.5" />
    </button>
  )
}

// Text Jon CTA: Only shows in specific high-intent moments, never as default
function getSmsCta(messages: UIMessage[]): { label: string; context: SmsContext; show: boolean } {
  const phase = determineConversationPhase(messages)
  const msgCount = messages.length
  const allText = messages
    .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.toLowerCase()) || [])
    .join(" ")
  
  // Don't show in first 4 messages - let them engage with AI first
  if (msgCount <= 4) {
    return { label: "Text Jon", context: "general", show: false }
  }

  // Show when ready to buy - high-intent moment
  if (phase === "ready_to_buy" || allText.includes("i'm in") || allText.includes("let's do it")) {
    return { label: "Text Jon", context: "ready-to-start", show: true }
  }

  // Show after explicit pricing questions
  if (allText.includes("$497") || allText.includes("$3,497")) {
    return { label: "Text Jon", context: "post-pricing", show: true }
  }

  // Show for done-for-you interest
  if (allText.includes("do it for me") || allText.includes("build it for me") || allText.includes("hire you")) {
    return { label: "Text Jon", context: "dfy-interest", show: true }
  }

  // Show after 8+ messages if they seem engaged but not converting
  if (msgCount >= 8 && (allText.includes("?") || allText.includes("how") || allText.includes("what"))) {
    return { label: "Text Jon", context: "engaged", show: true }
  }

  // Default - don't show
  return { label: "Text Jon", context: "general", show: false }
}

// Quick reply suggestions — QUESTION-FIRST approach
// Step 1: Extract the question at the END of the message (that's what matters)
// Step 2: Generate replies that ANSWER that question
function getQuickReplies(lastAssistantMessage: string, allMessages: UIMessage[]): string[] {
  const lower = lastAssistantMessage.toLowerCase()
  
  // Extract the last sentence (usually the question)
  const sentences = lower.split(/[.!]/).filter(s => s.trim())
  const lastSentence = sentences[sentences.length - 1]?.trim() || lower
  
  // === PRIORITY 1: Match the ending question ===
  
  // "want to try?" / "want to try with your business?"
  if (lastSentence.includes("want to try")) {
    return ["yeah", "show me first", "with what"]
  }
  
  // "want to see it?" / "want to see it build?"
  if (lastSentence.includes("want to see")) {
    return ["yeah", "how long", "different one?"]
  }
  
  // "what are you building?" / "building?"
  if (lastSentence.includes("building") && lastSentence.includes("?")) {
    return ["landing page", "store", "not sure yet"]
  }
  
  // "what brings you here?"
  if (lastSentence.includes("brings you") || lastSentence.includes("bring you")) {
    return ["need a site", "curious", "checking it out"]
  }
  
  // "got a project?" / "project in mind?"
  if (lastSentence.includes("project")) {
    return ["yeah", "few ideas", "exploring"]
  }
  
  // "building or curious?" / "building something or just curious?"
  if (lastSentence.includes("or") && (lastSentence.includes("curious") || lastSentence.includes("building"))) {
    return ["building", "curious", "both"]
  }
  
  // "what does it sell?" / "what's it sell?"
  if (lastSentence.includes("sell")) {
    return ["clothes", "digital stuff", "services"]
  }
  
  // "who's it for?"
  if (lastSentence.includes("who") && lastSentence.includes("for")) {
    return ["small biz", "consumers", "b2b"]
  }
  
  // "what kind?" / "what type?"
  if (lastSentence.includes("what kind") || lastSentence.includes("what type")) {
    return ["ecommerce", "saas", "agency"]
  }
  
  // "make sense?" / "got it?" / "follow?"
  if (lastSentence.includes("make sense") || lastSentence.includes("got it") || lastSentence.includes("follow")) {
    return ["yeah", "sorta", "wait what"]
  }
  
  // "which one?" / "which camp?"
  if (lastSentence.includes("which")) {
    return ["first", "second", "not sure"]
  }
  
  // "ready?" / "ready to..."
  if (lastSentence.includes("ready")) {
    return ["yeah", "almost", "one sec"]
  }
  
  // "what's the hesitation?" / "what's holding you back?"
  if (lastSentence.includes("hesitation") || lastSentence.includes("holding")) {
    return ["price", "timing", "not sure yet"]
  }
  
  // "what would help?" / "help you decide?"
  if (lastSentence.includes("help") && lastSentence.includes("?")) {
    return ["examples", "more info", "thinking"]
  }
  
  // Generic yes/no question ending in "?"
  if (lastSentence.endsWith("?") && lastSentence.length < 50) {
    return ["yeah", "nah", "maybe"]
  }
  
  // === PRIORITY 2: Content-based (if no clear question) ===
  
  // Showed an Intent Seed / prompt
  if (lower.includes("your prompt") || lower.includes("prompt:") || lower.includes("you'd say:")) {
    return ["that's it?", "show me", "different one"]
  }
  
  // Mentioned pricing
  if (lower.includes("$497") || lower.includes("$3,497")) {
    return ["what's in it", "other options", "ok"]
  }
  
  // Mentioned credibility
  if (lower.includes("25k") || lower.includes("25,000") || lower.includes("@yeazel")) {
    return ["nice", "show me", "ok"]
  }
  
  // === PRIORITY 3: Fallback based on length ===
  
  // Short statement (no question) - prompt them forward
  if (lower.length < 80 && !lower.includes("?")) {
    return ["ok", "and?", "go on"]
  }
  
  // Longer explanation - acknowledge and move forward
  return ["ok", "got it", "what's next"]
}
  
  // AI asked a simple yes/no
  if (lower.length < 50 && lower.endsWith("?")) {
    return ["yeah", "nah", "depends"]
  }

  // Mid conversation fallback (messages 3-6)
  if (msgCount <= 6) {
    return ["ok", "go on", "wait"]
  }

  // Late conversation fallback (7+)
  return ["ok", "next", "actually"]
}

// Check if two messages are from the same sender and close in time (within 2min)
function isContinuation(current: UIMessage, previous: UIMessage | undefined): boolean {
  if (!previous) return false
  if (current.role !== previous.role) return false
  if (!current.createdAt || !previous.createdAt) return false
  const gap = new Date(current.createdAt).getTime() - new Date(previous.createdAt).getTime()
  return gap < 120_000
}

export function MessageList({ messages, status, avatarUrl, onQuickReply, onCheckout }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const lastMessageCount = useRef(messages.length)
  
  const copyMessage = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])
  
  const toggleLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

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
    const el = containerRef.current
    if (!el) return
    
    let lastScrollHeight = el.scrollHeight
    const interval = setInterval(() => {
      if (el.scrollHeight !== lastScrollHeight && checkIfNearBottom()) {
        el.scrollTo({
          top: el.scrollHeight - el.clientHeight,
          behavior: "smooth"
        })
        lastScrollHeight = el.scrollHeight
      }
    }, 100)
    
    return () => clearInterval(interval)
  }, [status, checkIfNearBottom])

  // Scroll to bottom when streaming ends (chips appear)
  useEffect(() => {
    if (status === "ready" && checkIfNearBottom()) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 80)
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

    if (detected.type === "skillAssessment") {
      return <SkillAssessment />
    }
    if (detected.type === "coursePreview") {
      return <CoursePreview />
    }
    if (detected.type === "faq") {
      return <FAQAccordion />
    }
    if (detected.type === "v0Referral") {
      return <V0ReferralCard />
    }
    if (detected.type === "liveSites") {
      return <LiveSitesDisplay />
    }
    if (detected.type === "videoPreview") {
      return <VideoPreview />
    }
    if (detected.type === "pricing") {
      return <PricingCard name={detected.data.name} price={detected.data.price} description={detected.data.description} />
    }
    if (detected.type === "paymentOptions") {
      return (
        <PaymentOptions
          onCheckout={onCheckout}
        />
      )
    }
    if (detected.type === "intentSeed" && detected.data?.prompt) {
      return <IntentSeedDisplay prompt={detected.data.prompt} />
    }
    if (detected.type === "beforeAfter") {
      return <BeforeAfterComparison />
    }
    if (detected.type === "profileLink") {
      return <ProfileLinkCard />
    }
    if (detected.type === "pdfDownload") {
      return <PDFDownloadCard />
    }
    if (detected.type === "productCard" && detected.data) {
      return (
        <ProductCard 
          name={detected.data.name} 
          price={detected.data.price} 
          description={detected.data.description}
          onCheckout={onCheckout}
        />
      )
    }
    if (detected.type === "productShowcase") {
      return <ProductShowcase />
    }

    return null
  }

  const renderToolResult = (toolResult: any) => {
    if (!toolResult?.display) return null

    if (toolResult.type === "live_sites") {
      return <LiveSitesDisplay />
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              layout="position"
              layoutId={`message-${message.id}`}
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
                    <div className="flex items-center justify-end gap-2 mb-1.5">
                      {message.createdAt && (
                        <span className="text-[10px] text-muted-foreground/60">{formatRelativeTime(message.createdAt)}</span>
                      )}
                      <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                        <span className="text-[8px] font-semibold text-white">you</span>
                      </div>
                    </div>
                  )}
                  <div className="max-w-[85%] ml-auto">
                    <p className="text-[14px] whitespace-pre-wrap leading-relaxed text-foreground text-right">
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
                <div 
                  className="w-full group/message"
                  onMouseEnter={() => setHoveredMessageId(message.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
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
                  <div className="relative">
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
                            
                            {/* Message actions - desktop only, hidden on mobile */}
                            {!isCurrentlyStreaming && (
                              <div 
                                className={`hidden md:flex items-center gap-0.5 mt-2 transition-opacity duration-200 ${
                                  hoveredMessageId === message.id || copiedId === message.id || likedIds.has(message.id)
                                    ? "opacity-100" 
                                    : "opacity-0"
                                }`}
                              >
                                <MessageAction
                                  onClick={() => copyMessage(part.text, message.id)}
                                  icon={Copy}
                                  activeIcon={Check}
                                  label={copiedId === message.id ? "Copied!" : "Copy"}
                                  isActive={copiedId === message.id}
                                />
                                <MessageAction
                                  onClick={() => toggleLike(message.id)}
                                  icon={ThumbsUp}
                                  label={likedIds.has(message.id) ? "Liked" : "Helpful"}
                                  isActive={likedIds.has(message.id)}
                                />
                              </div>
                            )}
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

          <AnimatePresence mode="wait">
            {status === "streaming" && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={avatarUrl || "/placeholder.svg"} alt="" className="w-6 h-6 rounded-full object-cover" />
                </div>
                <div className="flex items-center gap-[3px] pl-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-[5px] h-[5px] rounded-full bg-neutral-300 animate-pulse"
                      style={{ 
                        animationDelay: `${i * 150}ms`,
                        animationDuration: "1s"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Reply Chips - left-aligned, no cutoff */}
          <div 
            className={`pt-4 transition-opacity duration-300 ${
              status === "ready" && messages.length > 0 && messages[messages.length - 1]?.role === "assistant" && onQuickReply
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex flex-wrap gap-2">
              {getQuickReplies(
                messages[messages.length - 1]?.parts
                  ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
                  .map(p => p.text)
                  .join(" ") || "",
                messages
              ).map((reply) => (
                <button
                  key={reply}
                  onClick={() => onQuickReply?.(reply)}
                  className="py-2.5 px-4 rounded-full text-[13px] font-medium border border-border bg-background text-foreground hover:bg-muted active:bg-muted/80 active:scale-[0.98] transition-all duration-150"
                >
                  {reply}
                </button>
              ))}
              {(() => {
                const cta = getSmsCta(messages)
                if (!cta.show) return null
                return (
                  <SmsTrigger key="sms-cta" context={cta.context}>
                    <button
                      className="py-2.5 px-4 rounded-full text-[13px] font-medium border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 active:scale-[0.98] transition-colors duration-150 cursor-pointer"
                    >
                      {cta.label}
                    </button>
                  </SmsTrigger>
                )
              })()}
            </div>
          </div>

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
    </div>
  )
}
