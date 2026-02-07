"use client"

import React, { useState, useEffect, useRef, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, MessageCircle, Loader2, ArrowRight } from "lucide-react"
import type { PricingItem } from "@/lib/portfolio-data"
import type { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { VibeFrame } from "@/components/ui/vibe-frame"
import { SmsTrigger } from "@/components/sms-trigger"
import { useIsMobile } from "@/hooks/use-mobile"

// SMS Button — renders inline SMS deep links as tappable buttons in chat.
// On mobile: opens SMS directly. On desktop: opens QR dialog.
function SmsButton({ href, children }: { href: string; children: React.ReactNode }) {
  // Extract context from the href body parameter for SmsTrigger
  // The href is the raw sms: URI from the AI — we pass it through for mobile,
  // but SmsTrigger handles the mobile/desktop split.
  return (
    <SmsTrigger context="general">
      <button
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background font-medium text-[13px] hover:opacity-90 active:scale-95 transition-all duration-150 mx-0.5 cursor-pointer"
      >
        <MessageCircle className="w-3 h-3" />
        {children}
      </button>
    </SmsTrigger>
  )
}

// Parse message text and render SMS links as buttons
export function renderMessageWithSmsLinks(text: string): React.ReactNode {
  // Match markdown-style SMS links: [TEXT](sms:...)
  const smsLinkRegex = /\[([^\]]+)\]\((sms:[^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = smsLinkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    // Add the SMS button
    parts.push(
      <SmsButton key={match.index} href={match[2]}>
        {match[1]}
      </SmsButton>
    )
    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export function ImageGallery({
  images,
  serviceName,
  price,
}: {
  images: { url: string; label: string }[] | string[]
  serviceName?: string
  price?: number
}) {
  // Normalize to always have url/label structure
  const normalizedImages = images.map((img) => 
    typeof img === "string" ? { url: img, label: "" } : img
  )
  
  return (
    <div className="my-3">
      <div className="relative -mx-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 px-4">
          {normalizedImages.map((img, i) => (
            <div key={i} className="flex-shrink-0 snap-center">
              <div className="relative rounded-xl overflow-hidden bg-muted/30">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={img.label || `${serviceName || "Portfolio"} ${i + 1}`}
                  className="h-44 w-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=176&width=176"
                  }}
                />
                {img.label && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                    <p className="text-[10px] font-medium text-white">{img.label}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Right fade */}
        <div 
          className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, hsl(var(--card)))" }}
        />
      </div>
      {serviceName && price && (
        <p className="text-sm text-muted-foreground mt-2">
          {serviceName} starting at ${price}
        </p>
      )}
    </div>
  )
}

export function PricingCard({ name, price, description }: { name: string; price: string; description?: string }) {
  return (
    <div className="my-3 p-3 rounded-xl border border-border/60 bg-background">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">{name}</p>
        <p className="font-semibold text-sm">{price}</p>
      </div>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}

export function ServiceCatalog({
  services,
  category,
  onSelectService,
}: {
  services: any[]
  category: string
  onSelectService: (serviceId: string) => void
}) {
  return (
    <div className="my-3 space-y-2">
      <p className="text-sm text-muted-foreground">{category}</p>
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelectService(service.id)}
          className="w-full p-3 rounded-xl border border-border hover:border-foreground/30 transition-colors text-left flex items-center justify-between group"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{service.name}</p>
            <p className="text-sm text-muted-foreground truncate">{service.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <span className="text-sm font-medium whitespace-nowrap">${service.tiers[0]?.price.toLocaleString()}+</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
          </div>
        </button>
      ))}
    </div>
  )
}

export function FaqDisplay({
  serviceName,
  faqs,
}: {
  serviceName: string
  faqs: { question: string; answer: string }[]
}) {
  return (
    <div className="my-3 p-4 rounded-xl bg-muted/30 border border-border">
      <p className="font-medium mb-3">{serviceName} FAQ</p>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="text-sm">
            <p className="font-medium">{faq.question}</p>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const PORTFOLIO_SITES = [
  { name: "Goli", url: "https://v0-vcommercepdp-three.vercel.app", category: "Supplements" },
  { name: "Brez", url: "https://v0-brez-product-page.vercel.app", category: "Beverages" },
  { name: "Seed", url: "https://v0-vcommercepdp.vercel.app", category: "Probiotics" },
  { name: "Mud Water", url: "https://v0-mudwater.vercel.app", category: "Wellness" },
]

export const LiveSitesDisplay = memo(function LiveSitesDisplay() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedSite = PORTFOLIO_SITES[selectedIndex]
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        // Measure the actual container width instead of the window
        setFrameWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const device = isMobile ? "mobile" : "desktop"
  // On mobile: center a phone-sized frame. On desktop: fill the container width.
  const displayWidth = isMobile
    ? Math.min(260, frameWidth - 32)
    : frameWidth

  return (
    <div ref={containerRef} className="my-4">
      {/* Tab selector with sliding indicator */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
        {PORTFOLIO_SITES.map((site, i) => (
          <button
            key={site.name}
            onClick={() => setSelectedIndex(i)}
            className="relative flex-shrink-0 px-4 py-2 rounded-full text-[13px] transition-colors duration-150"
            style={{ color: selectedIndex === i ? "var(--background)" : "var(--muted-foreground)" }}
          >
            {selectedIndex === i && (
              <motion.div
                layoutId="site-tab-indicator"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: "var(--foreground)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 font-medium">{site.name}</span>
          </button>
        ))}
      </div>

      {/* Frame with crossfade */}
      {displayWidth > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSite.url}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.8 }}
            className="flex justify-center"
          >
            <VibeFrame
              url={selectedSite.url}
              placeholder={selectedSite.name}
              device={device}
              width={displayWidth}
              borderRadius={isMobile ? 34 : 12}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Category label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={selectedSite.category}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] text-muted-foreground text-center mt-3 uppercase tracking-[0.05em]"
        >
          {selectedSite.category}
        </motion.p>
      </AnimatePresence>
    </div>
  )
})

// Site Audit Input - lets users paste their URL for instant CRO feedback
export function SiteAuditInput({ 
  onSubmitUrl 
}: { 
  onSubmitUrl: (url: string) => void 
}) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  // Auto-focus the input on mount
  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = () => {
    if (!url.trim() || submitted) return
    
    setError("")
    
    // Validate URL format
    let normalizedUrl = url.trim()
    // Remove common prefixes users might type
    normalizedUrl = normalizedUrl.replace(/^(https?:\/\/)?(www\.)?/i, "")
    normalizedUrl = `https://${normalizedUrl}`
    
    try {
      new URL(normalizedUrl)
      setSubmitted(true)
      onSubmitUrl(normalizedUrl)
    } catch {
      setError("Enter a valid URL")
    }
  }

  if (submitted) {
    return (
      <div className="my-4 flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-muted/20">
        <div className="relative">
          <Loader2 className="w-5 h-5 animate-spin text-foreground/60" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Analyzing your store...</p>
          <p className="text-xs text-muted-foreground">Checking CRO signals, load time, and more</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="paste your store URL"
          className="flex-1 px-4 py-3 rounded-xl border border-border/60 bg-background text-sm focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/5 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim()}
          className="px-5 py-3 rounded-xl bg-action text-action-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Audit
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export function AllPricingDisplay({ 
  pricing, 
  onSelectService 
}: { 
  pricing: typeof PORTFOLIO_DATA.pricing
  onSelectService?: (chatPrompt: string) => void 
}) {
  const items = Object.values(pricing)
  // Featured item (popular) goes first, then the rest
  const featured = items.find(item => item.popular)
  const regularItems = items.filter(item => !item.popular)
  
  return (
    <div className="my-4 space-y-3">
      {/* Featured/Popular item - uses warm action color for conversion */}
      {featured && (
        <button
          onClick={() => onSelectService?.(featured.chatPrompt || featured.name)}
          className="w-full p-4 rounded-xl bg-action text-action-foreground text-left transition-all active:scale-[0.99] hover:opacity-95"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-action-foreground/60 font-medium">Most Popular</span>
              <p className="font-semibold text-base mt-0.5">{featured.name}</p>
            </div>
            <p className="text-lg font-bold">{featured.price}</p>
          </div>
          <p className="text-sm text-action-foreground/70 mb-3">{featured.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {featured.features?.slice(0, 3).map((f, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-action-foreground/15 text-action-foreground/90">
                {f}
              </span>
            ))}
          </div>
        </button>
      )}
      
      {/* 2-column grid for regular items */}
      <div className="grid grid-cols-2 gap-2">
        {regularItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectService?.(item.chatPrompt || item.name)}
            className="p-3 rounded-xl border border-border/60 bg-background text-left transition-all active:scale-[0.98] hover:border-foreground/20 hover:bg-muted/30"
          >
            <p className="font-semibold text-sm text-foreground">{item.price}</p>
            <p className="font-medium text-sm text-foreground mt-1 leading-tight">{item.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
          </button>
        ))}
      </div>
      
      {/* Subtle hint */}
      <p className="text-[10px] text-muted-foreground/60 text-center">Tap any service to learn more</p>
    </div>
  )
}

// Email capture component for strategic moments
export function EmailCapture({ 
  context = "tips",
  onSubmit 
}: { 
  context?: "tips" | "pricing" | "audit"
  onSubmit?: (email: string) => void 
}) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const contextCopy = {
    tips: { title: "Get more tips like this", desc: "Weekly CRO insights, no spam" },
    pricing: { title: "Get pricing updates", desc: "Be first to know about deals" },
    audit: { title: "Save your audit results", desc: "Get a copy in your inbox" },
  }

  const { title, desc } = contextCopy[context]

  const handleSubmit = () => {
    if (!email.trim()) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email")
      return
    }
    setSubmitted(true)
    onSubmit?.(email)
  }

  if (submitted) {
    return (
      <div className="my-4 p-4 rounded-xl bg-muted/30 text-center">
        <p className="text-sm text-foreground">You're in.</p>
      </div>
    )
  }

  return (
    <div className="my-4 p-4 rounded-xl border border-border/40 bg-muted/20">
      <p className="text-sm font-medium text-foreground mb-0.5">{title}</p>
      <p className="text-[11px] text-muted-foreground mb-3">{desc}</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="you@email.com"
          className="flex-1 px-3 py-2.5 rounded-lg border border-border/60 bg-background text-sm focus:outline-none focus:border-foreground/30 transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={!email.trim()}
          className="px-4 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40"
        >
          Send
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
}
