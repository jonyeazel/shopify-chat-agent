"use client"

import React, { useState, useEffect, useRef, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Loader2, ArrowRight, Upload, X, Play, Gift, Check } from "lucide-react"
// Portfolio data is now defined locally for chat displays
import { VibeFrame } from "@/components/ui/vibe-frame"
import { SmsTrigger } from "@/components/sms-trigger"
import { useIsMobile } from "@/hooks/use-mobile"

// FAQ Accordion - Beautiful expandable Q&A
const FAQ_ITEMS = [
  {
    question: "What is The Cook Method?",
    answer: "Jon's prompting system: Intent Seed (36 words or less), Cook Protocol (hand creative control to AI), and Cook Cycles (iterate with 'Cook'). Outcome-focused prompts beat detailed specs."
  },
  {
    question: "Can I do this with no technical background?",
    answer: "Yes. The method is about describing outcomes, not writing code. If you can describe what you want in plain English, you can build with this system."
  },
  {
    question: "What do I get for $497?",
    answer: "The v0 Tutor teaches The Cook Method: the prompting system, S-tier prompt examples, and direct access to Jon. Build unlimited sites yourself, forever."
  },
  {
    question: "What if I want you to build it for me?",
    answer: "Clone This Site ($3,497) - Jon builds this exact AI sales experience for your business. Your voice, your pricing, your products. Done in ~2 weeks."
  },
  {
    question: "Why should I trust this?",
    answer: "Jon has 25,000+ generations on v0. Check v0.app/@yeazel for proof and free templates. $10k+ spent experimenting so you don't have to."
  }
]

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="my-4 space-y-2">
      {FAQ_ITEMS.map((item, index) => (
        <div 
          key={index}
          className="border border-neutral-200 rounded-xl overflow-hidden bg-white"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="text-[15px] font-medium text-neutral-900 pr-4">{item.question}</span>
            <ChevronRight 
              className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-90' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 text-[14px] text-neutral-600 leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

// v0 Referral Card - Lead magnet for free credits
export function V0ReferralCard() {
  return (
    <a 
      href="https://v0.link/jon"
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 flex items-center gap-3 p-4 bg-neutral-900 rounded-2xl active:bg-neutral-800 hover:bg-neutral-800 transition-colors group"
    >
      <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="/v0-logo-light.png" alt="v0" className="w-7 h-7 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-white font-medium">Get $10 free credits on v0</p>
        <p className="text-[13px] text-neutral-400">Sign up with this link to start building</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
        <ArrowRight className="w-4 h-4 text-white" />
      </div>
    </a>
  )
}

// Course Preview - Bento grid showing what's included in v0 Tutor
const COURSE_MODULES = [
  { 
    title: "The Cook Method",
    subtitle: "Intent Seeds + Cook Protocol + Cycles",
    icon: "play",
    highlight: true
  },
  { 
    title: "S-Tier Prompt Library",
    subtitle: "Outcome-focused prompts that work",
    icon: "grid"
  },
  { 
    title: "Live Build Examples",
    subtitle: "Watch real sites get built",
    icon: "browser"
  },
  { 
    title: "Direct Access to Jon",
    subtitle: "Text him when you're stuck",
    icon: "refresh"
  },
]

export function CoursePreview() {
  return (
    <div className="my-4">
      <div className="grid grid-cols-2 gap-2">
        {COURSE_MODULES.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-2xl border ${
              module.highlight 
                ? 'bg-neutral-900 text-white border-neutral-800 col-span-2' 
                : 'bg-white border-neutral-200'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${
              module.highlight ? 'bg-white/10' : 'bg-neutral-100'
            }`}>
              {module.icon === "play" && (
                <Play className={`w-4 h-4 ${module.highlight ? 'text-white' : 'text-neutral-600'}`} fill="currentColor" />
              )}
              {module.icon === "grid" && (
                <svg className={`w-4 h-4 ${module.highlight ? 'text-white' : 'text-neutral-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              )}
              {module.icon === "browser" && (
                <svg className={`w-4 h-4 ${module.highlight ? 'text-white' : 'text-neutral-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                </svg>
              )}
              {module.icon === "refresh" && (
                <svg className={`w-4 h-4 ${module.highlight ? 'text-white' : 'text-neutral-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              )}
            </div>
            <p className={`text-[14px] font-medium ${module.highlight ? 'text-white' : 'text-neutral-900'}`}>
              {module.title}
            </p>
            <p className={`text-[12px] mt-0.5 ${module.highlight ? 'text-white/60' : 'text-neutral-500'}`}>
              {module.subtitle}
            </p>
          </motion.div>
        ))}
      </div>
      <p className="text-[12px] text-neutral-400 text-center mt-3">
        $497 one-time. Lifetime access.
      </p>
    </div>
  )
}

// Skill Assessment Quiz - Routes to right product
const ASSESSMENT_QUESTIONS = [
  {
    question: "What are you trying to accomplish?",
    options: [
      { label: "Build sites for my own business", value: "own-business" },
      { label: "Build sites for clients / agency work", value: "agency" },
      { label: "Want a site like this one built for me", value: "done-for-me" },
      { label: "Just exploring what's possible", value: "exploring" }
    ]
  },
  {
    question: "How much time do you have?",
    options: [
      { label: "I need this live ASAP", value: "asap" },
      { label: "A few weeks to learn", value: "weeks" },
      { label: "No rush, just want to do it right", value: "no-rush" },
      { label: "Don't have time to learn, need it done", value: "no-time" }
    ]
  },
  {
    question: "What's your comfort with prompting AI?",
    options: [
      { label: "Never tried it", value: "never" },
      { label: "Tried but results were meh", value: "meh" },
      { label: "Pretty comfortable, want to level up", value: "comfortable" },
      { label: "I'd rather not, just do it for me", value: "skip" }
    ]
  }
]

const ASSESSMENT_RESULTS: Record<string, { title: string; message: string; product: string; price: string }> = {
  "own-business": { 
    title: "v0 Tutor is perfect for you", 
    message: "You'll learn The Cook Method and be able to build unlimited sites for your business. $497, one time.",
    product: "v0 Tutor",
    price: "$497"
  },
  "agency": { 
    title: "This will 10x your output", 
    message: "Agencies using The Cook Method build sites in hours, not weeks. $497 investment pays for itself on the first project.",
    product: "v0 Tutor",
    price: "$497"
  },
  "done-for-me": { 
    title: "Clone This Site is what you want", 
    message: "Jon builds this exact AI sales experience for your business. Your AI, your pricing, your voice. $3,497.",
    product: "Clone This Site",
    price: "$3,497"
  },
  "no-time": { 
    title: "Let's get this built for you", 
    message: "No learning curve. Jon builds it, you use it. Clone This Site: $3,497.",
    product: "Clone This Site",
    price: "$3,497"
  },
  "skip": { 
    title: "Done-for-you is your best path", 
    message: "Clone This Site gets you this exact experience without the learning. $3,497, Jon handles everything.",
    product: "Clone This Site",
    price: "$3,497"
  },
  "never": { 
    title: "You'll pick this up fast", 
    message: "The Cook Method is designed for beginners. 36 words or less. You'll be building in under an hour.",
    product: "v0 Tutor",
    price: "$497"
  },
  "meh": { 
    title: "This is the missing piece", 
    message: "Meh results come from wrong prompting approach. The Cook Method is outcome-focused. That's the difference.",
    product: "v0 Tutor",
    price: "$497"
  },
  default: { 
    title: "v0 Tutor recommended", 
    message: "Based on your answers, learning The Cook Method will give you the most value. $497, lifetime access.",
    product: "v0 Tutor",
    price: "$497"
  }
}

export function SkillAssessment({ onComplete }: { onComplete?: (result: string) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (value: string) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    
    if (step < ASSESSMENT_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setShowResult(true)
      onComplete?.(value)
    }
  }

  const getResult = () => {
    // Find the most relevant result based on answers - prioritize done-for-me signals
    for (const answer of answers) {
      if (["done-for-me", "no-time", "skip"].includes(answer)) {
        return ASSESSMENT_RESULTS[answer]
      }
    }
    for (const answer of answers) {
      if (ASSESSMENT_RESULTS[answer]) {
        return ASSESSMENT_RESULTS[answer]
      }
    }
    return ASSESSMENT_RESULTS.default
  }

  if (showResult) {
    const result = getResult()
    const isClone = result.product === "Clone This Site"
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`my-4 p-5 rounded-2xl ${isClone ? 'bg-gradient-to-br from-violet-900 to-purple-900' : 'bg-neutral-900'}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-white">{result.title}</span>
          </div>
          <span className="text-[17px] font-bold text-white">{result.price}</span>
        </div>
        <p className="text-[14px] text-white/70 leading-relaxed mb-4">
          {result.message}
        </p>
        <button className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98] ${
          isClone ? 'bg-white text-violet-900 hover:bg-violet-100' : 'bg-white text-neutral-900 hover:bg-neutral-100'
        }`}>
          Get {result.product}
        </button>
      </motion.div>
    )
  }

  const currentQuestion = ASSESSMENT_QUESTIONS[step]

  return (
    <div className="my-4">
      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {ASSESSMENT_QUESTIONS.map((_, i) => (
          <div 
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-neutral-900' : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-[15px] font-medium text-neutral-900 mb-3">
            {currentQuestion.question}
          </p>
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="w-full p-3.5 text-left text-[14px] bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Video Preview Card — shows the video thumbnail with play button
export function VideoPreview({ 
  onPlay 
}: { 
  onPlay?: () => void 
}) {
  const videoUrl = "https://youtu.be/i9na_W31rLg"
  const thumbnailUrl = "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg"
  
  const handleClick = () => {
    if (onPlay) {
      onPlay()
    } else {
      window.open(videoUrl, "_blank")
    }
  }
  
  return (
    <div className="my-4">
      <div 
        className="relative rounded-2xl overflow-hidden bg-neutral-100 cursor-pointer group"
        onClick={handleClick}
      >
        <img
          src={thumbnailUrl}
          alt="v0 University Video"
          className="w-full aspect-video object-cover"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-200">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <Play className="w-7 h-7 text-neutral-900 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-medium">
          0:57
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <p className="text-[15px] font-medium text-foreground">
          Build your first website with AI
        </p>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          57 seconds. No experience needed.
        </p>
      </div>
    </div>
  )
}

// SMS Button — renders inline SMS deep links as tappable text in chat.
// Styled like an iMessage link: blue, underlined, same weight as surrounding text.
function SmsButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <SmsTrigger context="general">
      <button
        className="inline text-[#007AFF] underline underline-offset-2 decoration-[#007AFF]/30 hover:decoration-[#007AFF]/60 active:opacity-70 transition-all duration-150 cursor-pointer"
      >
        {children}
      </button>
    </SmsTrigger>
  )
}

// Parse message text and render SMS links as buttons, strip non-SMS markdown links
export function renderMessageWithSmsLinks(text: string): React.ReactNode {
  // First strip non-SMS markdown links — convert [text](url) to just "text"
  // This prevents broken display like "(javascript:void(0))" when AI generates markdown links
  const cleaned = text.replace(/\[([^\]]+)\]\((?!sms:)[^)]+\)/g, "$1")
  
  // Match markdown-style SMS links: [TEXT](sms:...)
  const smsLinkRegex = /\[([^\]]+)\]\((sms:[^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = smsLinkRegex.exec(cleaned)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(cleaned.slice(lastIndex, match.index))
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
  if (lastIndex < cleaned.length) {
    parts.push(cleaned.slice(lastIndex))
  }

  return parts.length > 0 ? parts : cleaned
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

// Real sites built with v0 - showing what's possible
const PORTFOLIO_SITES = [
  { name: "Stadics", url: "https://v0-stadics.vercel.app/" },
  { name: "MUD WTR", url: "https://v0-mudwater.vercel.app" },
  { name: "AI Blocks", url: "https://v0-aiblocks.vercel.app/" },
  { name: "vCommerce", url: "https://v0-vcommercepdp-three.vercel.app" },
]

export const LiveSitesDisplay = memo(function LiveSitesDisplay() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedSite = PORTFOLIO_SITES[selectedIndex]
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameWidth, setFrameWidth] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
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

  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const device = isMobile ? "mobile" : "desktop"
  let displayWidth = frameWidth

  if (isMobile && viewportHeight > 0 && frameWidth > 0) {
    // Cap the frame to 60% of viewport height so AI text, tabs,
    // quick reply chips, and chat input all remain visible
    const maxTotalHeight = Math.floor(viewportHeight * 0.6)
    const maxScreenHeight = maxTotalHeight - 100 // header(46) + footer(46) + border(8)
    if (maxScreenHeight > 0) {
      const maxWidth = Math.floor(maxScreenHeight * 393 / 673 + 8)
      displayWidth = Math.min(displayWidth, maxWidth)
    }
  }

  return (
    <div ref={containerRef} className="my-5">
      {/* Tab selector — centered, no scroll */}
      <div className="flex gap-1 mb-3 justify-center">
        {PORTFOLIO_SITES.map((site, i) => (
          <button
            key={site.name}
            onClick={() => setSelectedIndex(i)}
            className="relative px-3.5 py-1.5 rounded-full text-[12px] transition-colors duration-150"
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
              borderRadius={isMobile ? 44 : 12}
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
      <div className="my-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#ebebeb]">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground">Analyzing your store...</span>
      </div>
    )
  }

  return (
    <div className="my-4">
      <div className="flex items-center gap-2 rounded-xl bg-[#ebebeb] pl-4 pr-1.5 py-1.5">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="yourstore.com"
          className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/50 outline-none border-none"
          style={{ fontSize: "16px" }}
        />
        <button
          onClick={handleSubmit}
          disabled={!url.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 active:scale-[0.92] bg-foreground text-background disabled:bg-foreground/[0.08]"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="text-[11px] text-destructive mt-1.5 pl-4">{error}</p>}
    </div>
  )
}

// Label Upload — lets users upload a product label for rendering requests
export function LabelUpload({
  onSubmitLabel,
}: {
  onSubmitLabel: (dataUrl: string, fileName: string) => void
}) {
  const [preview, setPreview] = useState<{ dataUrl: string; name: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/") && !file.name.endsWith(".pdf")) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview({ dataUrl, name: file.name })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const handleSubmit = () => {
    if (!preview || submitted) return
    setSubmitted(true)
    onSubmitLabel(preview.dataUrl, preview.name)
  }

  if (submitted) {
    return (
      <div className="my-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#ebebeb]">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        <span className="text-[13px] text-muted-foreground">Label received �� hang tight.</span>
      </div>
    )
  }

  return (
    <div className="my-4">
      <div
        className={`rounded-xl transition-colors duration-150 ${
          isDragging
            ? "bg-[#e0e0e0] ring-1 ring-foreground/15"
            : "bg-[#ebebeb]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="flex items-center gap-3 pl-3 pr-1.5 py-1.5">
            <img
              src={preview.dataUrl}
              alt="Label preview"
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <span className="flex-1 min-w-0 text-[13px] text-foreground truncate">
              {preview.name}
            </span>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/[0.06] transition-colors duration-150 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5 text-foreground/40" />
            </button>
            <button
              onClick={handleSubmit}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-foreground text-background transition-all duration-150 active:scale-[0.92] hover:opacity-90"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-3 pl-4 pr-1.5 py-3 cursor-pointer group"
          >
            <Upload className="w-[18px] h-[18px] text-foreground/30 group-hover:text-foreground/50 transition-colors duration-150 flex-shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-left text-[15px] text-muted-foreground/50">
              {isDragging ? "Drop here" : "Upload your label"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
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

// Intent Seed Display - Shows the generated prompt with copy button
export function IntentSeedDisplay({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-4 p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-2">Your Intent Seed</p>
          <p className="text-[15px] text-white font-medium leading-relaxed">"{prompt}"</p>
          <p className="text-[12px] text-neutral-500 mt-2">{prompt.split(' ').length} words</p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// Before/After Comparison - Shows the transformation
export function BeforeAfterComparison() {
  return (
    <div className="my-4 space-y-3">
      {/* Before */}
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </div>
          <span className="text-[12px] font-medium text-red-700 uppercase tracking-wide">What people do</span>
        </div>
        <p className="text-[13px] text-red-900 leading-relaxed">
          "Create a landing page with a hero section, headline that says Transform Your Body, subheadline about my 12-week program, green CTA button, three columns with icons..."
        </p>
        <p className="text-[11px] text-red-600 mt-2">150+ words. Micromanaging the AI. Mediocre results.</p>
      </div>

      {/* After */}
      <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-[12px] font-medium text-green-700 uppercase tracking-wide">The Cook Method</span>
        </div>
        <p className="text-[15px] text-green-900 font-medium leading-relaxed">
          "Fitness coach landing page that makes transformation feel inevitable"
        </p>
        <p className="text-[11px] text-green-600 mt-2">9 words. Outcome-focused. Better results.</p>
      </div>
    </div>
  )
}

// v0 Profile Link - Shows Jon's profile with free templates
export function ProfileLinkCard() {
  return (
    <a 
      href="https://v0.app/@yeazel"
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 flex items-center gap-4 p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src="/v0-logo-light.png" alt="v0" className="w-7 h-7 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-foreground">Jon's v0 Profile</p>
        <p className="text-[12px] text-muted-foreground">25,000+ generations. Free templates.</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </a>
  )
}

// PDF Download - The Cook Method framework
export function PDFDownloadCard() {
  return (
    <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[14px] font-medium text-amber-900">The Cook Method Framework</p>
          <p className="text-[12px] text-amber-700">Intent Seed + Cook Protocol + Cook Cycles</p>
        </div>
      </div>
      <a 
        href="/cook-method-framework.pdf" 
        download
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white text-[13px] font-medium hover:bg-amber-600 active:scale-[0.98] transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download PDF
      </a>
    </div>
  )
}

// Product Card - Shows specific product with buy button
export function ProductCard({ 
  name, 
  price, 
  description,
  onCheckout 
}: { 
  name: string
  price: string
  description: string
  onCheckout?: () => void
}) {
  const is497 = price === "$497"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`my-4 p-4 rounded-2xl border ${
        is497 
          ? 'bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700' 
          : 'bg-gradient-to-br from-violet-900 to-purple-900 border-violet-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-neutral-400 mb-1">Recommended</p>
          <p className="text-[17px] font-semibold text-white">{name}</p>
        </div>
        <p className="text-[22px] font-bold text-white">{price}</p>
      </div>
      <p className="text-[13px] text-neutral-300 mb-4">{description}</p>
      <button
        onClick={onCheckout}
        className={`w-full py-3 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98] ${
          is497 
            ? 'bg-white text-neutral-900 hover:bg-neutral-100' 
            : 'bg-violet-500 text-white hover:bg-violet-400'
        }`}
      >
        Get {name}
      </button>
    </motion.div>
  )
}

// Sample DTC products for showcase
const SHOWCASE_PRODUCTS = [
  {
    id: 1,
    name: "BREZ Flow",
    brand: "BREZ",
    category: "Functional Beverage",
    price: "$36.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-nHoi51tyaFKCEbqkALzbt1tISurVNg.png"
  },
  {
    id: 2,
    name: "Daily Synbiotic",
    brand: "Seed",
    category: "Probiotics",
    price: "$49.99",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-sR5osBp8g9vT2FaMP3pMkmNNuW6CLb.png"
  },
  {
    id: 3,
    name: "Foaming Face Wash",
    brand: "Kylie Skin",
    category: "Skincare",
    price: "$24.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-JgcMBkKZfcOSWKixM7wGZOdMgJV3pP.png"
  },
  {
    id: 4,
    name: "ACV Gummies",
    brand: "Goli",
    category: "Supplements",
    price: "$19.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-Y5jHz0XHGvI5uuhFPDyH4u8Y3Khi4L.png"
  },
  {
    id: 5,
    name: "AG1",
    brand: "Athletic Greens",
    category: "Daily Nutrition",
    price: "$99.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-emHwGqX9u42G6jvKzfXWpHgWAjUGSF.png"
  },
  {
    id: 6,
    name: "Coffee Alternative",
    brand: "MUD\\WTR",
    category: "Beverages",
    price: "$40.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-20w7N1qAIanHlIo6easrZSGy9bGec5.png"
  },
  {
    id: 7,
    name: "Crunch Bar",
    brand: "Feastables",
    category: "Snacks",
    price: "$4.99",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-sOHMw2k2WkYQWJVrYZoE12gAKtlLWm.png"
  },
  {
    id: 8,
    name: "Green Apple Cinnamon",
    brand: "Oats Overnight",
    category: "Breakfast",
    price: "$3.49",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/26-vvNnEP2osINhZv1J88i5JwTr7a1X3L.png"
  },
  {
    id: 9,
    name: "Sparkling Water",
    brand: "Saratoga",
    category: "Beverages",
    price: "$2.99",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27-H0tIjAB182yMULCU5jFUXB9L3ui8Bi.png"
  },
  {
    id: 10,
    name: "Santal 33",
    brand: "Le Labo",
    category: "Fragrance",
    price: "$312.00",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/39-d44CjAKUFLLkeMNskpiBjYhayzHeWg.png"
  }
]

// Product Showcase - Swipeable carousel of DTC products
export function ProductShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = 180
    const newIndex = Math.round(scrollLeft / cardWidth)
    setActiveIndex(Math.min(newIndex, SHOWCASE_PRODUCTS.length - 1))
  }

  const handleDownload = async (product: typeof SHOWCASE_PRODUCTS[0]) => {
    setDownloadingId(product.id)
    try {
      const response = await fetch(product.image)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${product.brand.toLowerCase().replace(/\\/g, '')}-${product.name.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Download failed:', err)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <p className="text-[13px] font-medium text-foreground">Product Cards Example</p>
          <p className="text-[11px] text-muted-foreground">Swipe to browse, tap to download</p>
        </div>
        <span className="text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {activeIndex + 1} / {SHOWCASE_PRODUCTS.length}
        </span>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SHOWCASE_PRODUCTS.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex-shrink-0 w-[170px] snap-start"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-border/40 shadow-sm">
              {/* Product Image */}
              <div className="relative aspect-square bg-neutral-50 p-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {/* Download button */}
                <button
                  onClick={() => handleDownload(product)}
                  disabled={downloadingId === product.id}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center transition-colors"
                >
                  {downloadingId === product.id ? (
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Product Info */}
              <div className="p-3 pt-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">{product.brand}</p>
                <p className="text-[13px] font-medium text-neutral-900 leading-tight mb-1 line-clamp-1">{product.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-500">{product.category}</span>
                  <span className="text-[13px] font-semibold text-neutral-900">{product.price}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicators */}
      <div className="flex justify-center gap-1.5 mt-2">
        {SHOWCASE_PRODUCTS.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === activeIndex ? 'w-4 bg-foreground' : 'w-1.5 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Caption */}
      <p className="text-[11px] text-center text-muted-foreground mt-3">
        Real product cards built with v0. Each one took ~30 seconds.
      </p>
    </div>
  )
}
