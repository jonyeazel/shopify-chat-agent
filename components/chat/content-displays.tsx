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
  const normalizedImages = images.map((img) => 
    typeof img === "string" ? { url: img, label: "" } : img
  )
  
  return (
    <div className="my-4">
      <div className="relative -mx-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1 px-4">
          {normalizedImages.map((img, i) => (
            <div key={i} className="flex-shrink-0 snap-center">
              <div className="relative rounded-lg overflow-hidden bg-muted/20">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={img.label || `${serviceName || "Portfolio"} ${i + 1}`}
                  className="h-52 w-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=208&width=208"
                  }}
                />
                {img.label && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-2.5 pb-2 pt-8">
                    <p className="text-[11px] text-white/90">{img.label}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div 
          className="absolute right-0 top-0 bottom-1 w-12 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, var(--card))" }}
        />
      </div>
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
        setFrameWidth(containerRef.current.offsetWidth)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const device = isMobile ? "mobile" : "desktop"
  // Fill the chat column width — this is the hero content
  const displayWidth = frameWidth

  return (
    <div ref={containerRef} className="my-5">
      {/* Tab selector */}
      <div className="flex gap-1 mb-3 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
        {PORTFOLIO_SITES.map((site, i) => (
          <button
            key={site.name}
            onClick={() => setSelectedIndex(i)}
            className="relative flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] transition-colors duration-150"
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

      {/* Frame */}
      {displayWidth > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSite.url}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.8 }}
          >
            <VibeFrame
              url={selectedSite.url}
              placeholder={selectedSite.name}
              device={device}
              width={displayWidth}
              borderRadius={isMobile ? 20 : 12}
            />
          </motion.div>
        </AnimatePresence>
      )}
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
      <div className="my-2 flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-background">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground">Analyzing your store...</span>
      </div>
    )
  }

  return (
    <div className="my-2">
      <div className="flex items-center gap-1.5 rounded-full border border-border bg-background pl-3 pr-1 py-1 transition-colors duration-150">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="paste your store URL"
          className="flex-1 min-w-0 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim()}
          className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center transition-opacity duration-150 disabled:opacity-20"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {error && <p className="text-[11px] text-destructive mt-1.5 pl-3">{error}</p>}
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
  const featured = items.find(item => item.popular)
  const regularItems = items.filter(item => !item.popular)
  
  return (
    <div className="my-5 space-y-2">
      {featured && (
        <button
          onClick={() => onSelectService?.(featured.chatPrompt || featured.name)}
          className="w-full p-4 rounded-xl bg-foreground text-background text-left transition-all active:scale-[0.99] hover:opacity-95"
        >
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <p className="font-semibold text-[15px]">{featured.name}</p>
            <p className="text-[15px] font-semibold">{featured.price}</p>
          </div>
          <p className="text-[12px] text-background/50">{featured.description}</p>
        </button>
      )}
      
      <div className="grid grid-cols-2 gap-1.5">
        {regularItems.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectService?.(item.chatPrompt || item.name)}
            className="p-3 rounded-xl border border-border/50 text-left active:scale-[0.98] transition-all duration-150 hover:border-foreground/20"
          >
            <p className="font-semibold text-[13px] text-foreground">{item.price}</p>
            <p className="text-[12px] text-foreground mt-0.5 leading-snug">{item.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
          </button>
        ))}
      </div>
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
