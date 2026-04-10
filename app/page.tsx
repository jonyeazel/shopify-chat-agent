"use client"
// v0 University - Main Page
import type React from "react"
import { useState, useRef, useCallback, useEffect, type MouseEvent as ReactMouseEvent } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Volume2, VolumeX } from "lucide-react"

/* Bespoke icon rail icons — 24×24 viewBox, stroke-based */
function IconAudit({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5 20 20" />
      <path d="M8 13v-2" />
      <path d="M10.5 13v-3.5" />
      <path d="M13 13v-1.5" />
    </svg>
  )
}

function IconWork({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18" />
      <circle cx="6" cy="6.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
      <circle cx="11" cy="6.5" r=".75" fill="currentColor" stroke="none" />
    </svg>
  )
}

// VIDEO - Clean play button in rounded rectangle
function IconVideo({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <polygon points="10 8.5 10 15.5 16 12" fill="currentColor" stroke="none" />
    </svg>
  )
}

// EXAMPLES - Browser window
function IconExamples({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <circle cx="6.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="6" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

// INFO - Open book with pages
function IconInfo({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

// FAQ - Clean speech bubble (no dots)
function IconFAQ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

// BUY - Lightning bolt (instant access)
function IconBuy({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// STRIPE - Official Stripe "S" mark (slanted parallelogram)
function IconStripe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
    </svg>
  )
}

// TEXT - iMessage style chat bubble
function IconText({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

import { IdentityPanel } from "@/components/chat/identity-panel"
import { ChatInput } from "@/components/chat/chat-input"
import { MessageList } from "@/components/chat/message-list"
import { StaticAvatar, HeaderAvatar } from "@/components/flip-avatar"
import { SiteAdminPanel } from "@/components/admin/site-admin-panel"
import { AdminLoginModal } from "@/components/admin/admin-login-modal"
import { InstantSiteCreator } from "@/components/admin/instant-site-creator"
import { CheckoutDrawer } from "@/components/checkout-drawer"
import { LiveShowcase } from "@/components/live-showcase"
import { ShowcaseDrawer } from "@/components/showcase-drawer"
import { TextJonDrawer } from "@/components/text-jon-drawer"
import { siteConfig } from "@/lib/site-config"
import { SmsTrigger } from "@/components/sms-trigger"
import { type AvailabilityStatus } from "@/lib/chat-config"

const SITE_ID = 1
const TEMP_ADMIN_BYPASS = true

const QUICK_ACTIONS = [
  { label: "Show me what you've built", message: "Can I see some examples of what you've built?" },
  { label: "How much is it?", message: "How much does this cost?" },
  { label: "I have a specific project in mind", message: "I have a specific project I'm trying to figure out. Can I explain my situation?" },
]

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [backgroundMedia, setBackgroundMedia] = useState<{ url: string; type: "image" | "video" } | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [availabilityStatus] = useState<AvailabilityStatus>("online")

  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showSiteCreator, setShowSiteCreator] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showShowcase, setShowShowcase] = useState(false)
  const [showTextJon, setShowTextJon] = useState(false)
  const [adminLongPressTimer, setAdminLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  // Panel resize - 25/75 split default
  const [panelWidth, setPanelWidth] = useState(25)
  const [isResizing, setIsResizing] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const handleResizeStart = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    if (!isResizing) return
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!mainRef.current) return
      const rect = mainRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setPanelWidth(Math.min(45, Math.max(15, pct)))
    }
    const handleMouseUp = () => setIsResizing(false)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const handleBackgroundUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const type = file.type.startsWith("video/") ? "video" : "image"
    setBackgroundMedia({ url, type })
    if (type === "video") setShowVolumeControl(true)
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    if (videoRef.current) videoRef.current.muted = !isMuted
  }, [isMuted])

  const handleAdminPressStart = useCallback(() => {
    const timer = setTimeout(() => {
      if (TEMP_ADMIN_BYPASS) {
        setShowAdminPanel(true)
      } else {
        setShowAdminLogin(true)
      }
    }, 2000)
    setAdminLongPressTimer(timer)
  }, [])

  const handleAdminPressEnd = useCallback(() => {
    if (adminLongPressTimer) {
      clearTimeout(adminLongPressTimer)
      setAdminLongPressTimer(null)
    }
  }, [adminLongPressTimer])

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
  }, [])

  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      setChatError(err.message || "Something went wrong. Please try again.")
    },
  })

  // Context-aware SMS link generator - must be after useChat
  const getContextAwareSmsLink = useCallback(() => {
    const userMessages = messages
      .filter(m => m.role === "user")
      .flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text) || [])
    
    const lastUserMessage = userMessages[userMessages.length - 1] || ""
    const allText = userMessages.join(" ").toLowerCase()
    
    let prefill = "Hey Jon, I was just on v0university.com"
    
    // Context-aware prefills based on conversation
    if (allText.includes("landing") || allText.includes("page")) {
      prefill = "Hey Jon, I want to build a landing page"
    } else if (allText.includes("store") || allText.includes("shop") || allText.includes("ecommerce")) {
      prefill = "Hey Jon, I need a store built"
    } else if (allText.includes("portfolio")) {
      prefill = "Hey Jon, I want a portfolio site"
    } else if (allText.includes("ready") || allText.includes("i'm in") || allText.includes("buy")) {
      prefill = "Hey Jon, I'm ready to get started"
    } else if (allText.includes("question") || allText.includes("help")) {
      prefill = "Hey Jon, quick question about v0 University"
    } else if (allText.includes("price") || allText.includes("cost") || allText.includes("$")) {
      prefill = "Hey Jon, I have a question about pricing"
    } else if (lastUserMessage.length > 10) {
      const truncated = lastUserMessage.slice(0, 40).replace(/[^\w\s]/g, "")
      prefill = `Hey Jon, re: "${truncated}..."`
    }
    
    return `sms:4078677201?body=${encodeURIComponent(prefill)}`
  }, [messages])

  const handleChatSubmit = useCallback((text: string) => {
    setChatError(null)
    if (!text.trim()) return
    sendMessage({ text })
    setInput("")
  }, [sendMessage])

  const handleSendMessage = useCallback((content: string | { text: string }) => {
    const text = typeof content === "string" ? content : content.text
    handleChatSubmit(text)
  }, [handleChatSubmit])

  const handleAuditSubmit = useCallback((url: string) => {
    handleChatSubmit(`Audit my store: ${url}`)
  }, [handleChatSubmit])

  const handleLabelUpload = useCallback((dataUrl: string, fileName: string) => {
    handleChatSubmit(`Here's my label\n\n[Uploaded image: ${fileName}]\n${dataUrl}`)
  }, [handleChatSubmit])

  useEffect(() => {
    if (error) setChatError(error.message || "Chat connection failed")
  }, [error])

  const hasMessages = messages.length > 0



  /* ──────────────────────────────────────────────────────────
   * LOCKED MOBILE SETTINGS — do NOT change without explicit request
   *
   * Card position:    position: fixed, inset: 8px (all sides)
   * Card border:      border-foreground/[0.18], md:border-0
   * Card radius:      rounded-2xl (16px)
   * Header height:    h-14 (56px)
   * Header avatar:    w-9 h-9 (36px)
   * Header title:     text-[14px]
   * Header subtitle:  text-[10px]
   * Hamburger:        w-10 h-10 tap target, 3 lines 18×1.5px, 5.5px spread, morphs to X
   * Icon rail:        w-[50px] h-[50px] circles, icons w-[15px] h-[15px], labels text-[9px]
   * Chat input:       pb-3 px-3 (12px all sides)
   * Background:       #e4e4e4
   * Card bg:          #ffffff
   * ────────────────────────────────────────────────────────── */

  return (
    <main
      ref={mainRef}
      className={`flex bg-white rounded-[24px] overflow-hidden border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)] md:bg-transparent md:rounded-none md:overflow-visible md:border-0 md:shadow-none ${isResizing ? "select-none cursor-col-resize" : ""}`}
      style={{ position: "fixed", inset: "8px" }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleBackgroundUpload}
      />

      {/* Desktop: Left identity panel */}
      <IdentityPanel
        availabilityStatus={availabilityStatus}
        input={input}
        setInput={setInput}
        onSubmit={handleChatSubmit}
        onBuyClick={() => setShowCheckout(true)}
        onVideoClick={() => setShowVideo(true)}
        onExamplesClick={() => setShowShowcase(true)}
        chatDisabled={status !== "ready"}
        style={{ width: `${panelWidth}%` }}
      />

      {/* Resize handle */}
      <div
        className="hidden md:flex items-center justify-center w-3 relative z-20 group"
        onMouseDown={handleResizeStart}
        onDoubleClick={() => setPanelWidth(25)}
      >
        <div className={`absolute w-1 h-12 rounded-full transition-colors duration-150 ${isResizing ? "bg-foreground/50" : "bg-foreground/20 group-hover:bg-foreground/40"}`} />
        <div className="absolute w-full h-full cursor-col-resize" />
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0 flex flex-col relative bg-white md:rounded-2xl md:overflow-hidden md:border md:border-foreground/[0.08]">
        {/* Background media */}
        {backgroundMedia && (
          <div className="absolute inset-0 z-0">
            {backgroundMedia.type === "image" ? (
              <img
                src={backgroundMedia.url || "/placeholder.svg"}
                alt="Background"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                src={backgroundMedia.url}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
          </div>
        )}

        <AnimatePresence>
          {backgroundMedia?.type === "video" && showVolumeControl && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onClick={toggleMute}
              className="absolute bottom-24 left-4 z-50 w-10 h-10 rounded-full bg-card/90 border border-border/60 flex items-center justify-center hover:bg-card transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-foreground" />
              )}
            </motion.button>
          )}
        </AnimatePresence>



        {/* Mobile header */}
        <header className="flex-shrink-0 relative z-40 md:hidden">
          <div className="px-3 h-14 flex items-center pt-[calc(env(safe-area-inset-top)+2px)]">
            <div
              className="flex items-center gap-1.5"
              onMouseDown={handleAdminPressStart}
              onMouseUp={handleAdminPressEnd}
              onMouseLeave={handleAdminPressEnd}
              onTouchStart={handleAdminPressStart}
              onTouchEnd={handleAdminPressEnd}
            >
              <HeaderAvatar avatarUrl={siteConfig.brand.headerLogoUrl} />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-[16px] leading-none tracking-[-0.01em]">{siteConfig.brand.name}</span>
                <span className="text-[12px] text-muted-foreground leading-none mt-1.5">{siteConfig.brand.headerSubtitle}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content row: left column + icon rail */}
        <div className="flex-1 min-h-0 flex relative">

        <div className="flex-1 min-h-0 min-w-0 flex flex-col relative">
        <input ref={fileInputRef} type="file" accept=".csv,image/*" multiple className="hidden" />

        <AdminLoginModal
          isOpen={showAdminLogin}
          onClose={() => setShowAdminLogin(false)}
          siteId={SITE_ID}
          onSuccess={() => {
            setShowAdminLogin(false)
            setShowAdminPanel(true)
          }}
          isFullscreen={false}
        />

        <SiteAdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
          siteId={SITE_ID}
          isFullscreen={false}
        />

        <InstantSiteCreator
          isOpen={showSiteCreator}
          onClose={() => setShowSiteCreator(false)}
          isFullscreen={false}
        />

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 flex flex-col relative z-10">
          {/* Top fade - matches quick reply pill fades */}
          <div 
            className="absolute top-0 left-0 right-0 h-8 z-20 pointer-events-none md:hidden"
            style={{ background: "linear-gradient(to bottom, white, transparent)" }}
          />
          <div
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide"
            style={{ overscrollBehavior: "contain" }}
          >
            <AnimatePresence mode="wait">
              {!hasMessages ? (
                <>
                  {/* Mobile landing */}
                  <motion.div
                    key="landing-mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full w-full flex flex-col items-center justify-center px-6 md:hidden"
                  >
                    <div className="text-center flex flex-col items-center w-full">
                      <motion.div
                        className="relative mb-5"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05 }}
                      >
                        <StaticAvatar avatarUrl={siteConfig.brand.avatarUrl} onLongPress={() => TEMP_ADMIN_BYPASS ? setShowAdminPanel(true) : setShowAdminLogin(true)} />
                      </motion.div>

                      <motion.h1
                        className="font-semibold text-foreground text-[22px] tracking-[-0.02em] leading-tight"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.12 }}
                      >
                        {siteConfig.brand.tagline}
                      </motion.h1>

                      <motion.p
                        className="text-[15px] text-muted-foreground mt-2 max-w-[280px] leading-relaxed"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.17 }}
                      >
                        {siteConfig.brand.subtitle}
                      </motion.p>

                      {chatError && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-sm max-w-xs"
                        >
                          <p className="text-[#b91c1c]">{chatError}</p>
                          <SmsTrigger context="error-fallback">
                            <button className="inline-block mt-2 text-[12px] text-[#b91c1c]/70 underline underline-offset-2 hover:text-[#b91c1c] cursor-pointer">
                              Text me directly instead
                            </button>
                          </SmsTrigger>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Desktop: Live site showcase */}
                  <motion.div
                    key="landing-desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="h-full hidden md:flex p-4"
                  >
                    <LiveShowcase />
                  </motion.div>
                </>
              ) : (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="w-full md:max-w-2xl md:mx-auto"
                >
                  <MessageList messages={messages} status={status} avatarUrl={siteConfig.brand.avatarUrl} onQuickReply={handleChatSubmit} onCheckout={() => setShowCheckout(true)} />
                  {chatError && (
                    <div className="px-4 py-2">
                      <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-sm">
                        <p className="text-[#b91c1c]">{chatError}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={() => { setChatError(null); if (messages.length > 0) handleChatSubmit(messages[messages.length - 1]?.parts?.find((p): p is { type: "text"; text: string } => p.type === "text")?.text || "Hello"); }}
                            className="text-[12px] text-[#b91c1c] font-medium underline underline-offset-2 hover:no-underline cursor-pointer"
                          >
                            Try again
                          </button>
                          <SmsTrigger context="error-fallback">
                            <button className="text-[12px] text-[#b91c1c]/60 underline underline-offset-2 hover:text-[#b91c1c] cursor-pointer">
                              or text me
                            </button>
                          </SmsTrigger>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Mobile: Bottom fade - matches top fade */}
          <div 
            className="flex-shrink-0 md:hidden h-10 pointer-events-none -mt-10 relative z-20" 
            style={{ background: "linear-gradient(to bottom, transparent, white)" }} 
          />
          {/* Mobile: Chat input */}
          <div className="flex-shrink-0 md:hidden pb-2 px-3 bg-white">
            <ChatInput
              input={input ?? ""}
              setInput={setInput}
              onSubmit={handleChatSubmit}
              disabled={status !== "ready"}
              showMicNudge={messages.length === 0 || (messages.length >= 2 && messages.length <= 6 && status === "ready")}
              voiceFirst={true}
            />
            <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] text-muted-foreground/50">
              <img src="/images/claude-logo.png" alt="Claude" className="w-3.5 h-3.5" />
              <span>Powered by Claude Opus 4.6</span>
            </div>
          </div>
        </div>
        </div>

        {/* Mobile: Vertical icon rail - 4 strategic buttons in sales funnel order */}
        <div className="md:hidden flex flex-col items-center justify-end gap-2.5 flex-shrink-0 pr-[16px] pl-[6px] pb-3">
          {/* See Work - Social proof */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowShowcase(true)}
            className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center ring-1 bg-foreground ring-white/[0.06] rubber-button">
              <IconExamples className="w-6 h-6 text-background" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] leading-tight font-medium text-muted-foreground">See Work</span>
          </motion.button>
          {/* Pricing - Qualifies intent */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.13, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleChatSubmit("What's the pricing?")}
            className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center ring-1 bg-foreground ring-white/[0.06] rubber-button">
              <IconFAQ className="w-6 h-6 text-background" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] leading-tight font-medium text-muted-foreground">Pricing</span>
          </motion.button>
          {/* Text Jon - Opens custom drawer first */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowTextJon(true)}
            className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-[#007AFF] rubber-button">
              <IconText className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] leading-tight font-medium text-[#007AFF]">Text Jon</span>
          </motion.button>
          {/* Buy Now - Primary CTA */}
          <motion.button
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.19, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowCheckout(true)}
            className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
          >
            <div className="w-[52px] h-[52px] rounded-full overflow-hidden stripe-pulse">
              <img src="/stripe-logo.png" alt="Checkout" className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] leading-tight font-medium text-[#635BFF]">Buy Now</span>
          </motion.button>
        </div>

        </div>
      </div>

      {/* Checkout drawer */}
      <CheckoutDrawer
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={() => handleChatSubmit("I just enrolled")}
      />

      {/* Mobile showcase drawer */}
      <ShowcaseDrawer
        isOpen={showShowcase}
        onClose={() => setShowShowcase(false)}
      />

      {/* Text Jon drawer */}
      <TextJonDrawer
        isOpen={showTextJon}
        onClose={() => setShowTextJon(false)}
        conversationContext={messages.length > 2 
          ? messages.slice(-2).flatMap(m => m.parts?.filter((p): p is { type: "text"; text: string } => p.type === "text").map(p => p.text.slice(0, 100)) || []).join(" ").slice(0, 150) + "..."
          : undefined
        }
      />
    </main>
  )
}
