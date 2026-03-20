"use client"

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

// EXAMPLES - Four websites grid
function IconExamples({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
      <path d="M5 5h2" strokeWidth="1" />
      <path d="M15 5h2" strokeWidth="1" />
      <path d="M5 15h2" strokeWidth="1" />
      <path d="M15 15h2" strokeWidth="1" />
    </svg>
  )
}

// INFO - Book with bookmark
function IconInfo({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6v7l2.5-1.5L17 13V6" fill="currentColor" stroke="none" opacity="0.3" />
      <path d="M12 6v7l2.5-1.5L17 13V6" />
    </svg>
  )
}

// FAQ - Question mark in speech bubble
function IconFAQ({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

// BUY - Unlock/key icon
function IconBuy({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 17.5v2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
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
import { VideoDrawer } from "@/components/video-drawer"
import { siteConfig } from "@/lib/site-config"
import { SmsTrigger } from "@/components/sms-trigger"
import { type AvailabilityStatus } from "@/lib/chat-config"

const SITE_ID = 1
const TEMP_ADMIN_BYPASS = true

const QUICK_ACTIONS = [
  { label: "Watch the video", message: "Show me the video" },
  { label: "See examples", message: "Show me examples of sites people have built" },
  { label: "How much is it?", message: "How much does v0 University cost?" },
  { label: "Text Jon", message: null, sms: true },
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
  const [showVideo, setShowVideo] = useState(false)
  const [adminLongPressTimer, setAdminLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  // Panel resize
  const [panelWidth, setPanelWidth] = useState(35)
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
      className={`flex bg-card rounded-[24px] overflow-hidden border border-foreground/20 md:bg-transparent md:rounded-none md:overflow-visible md:border-0 rubber-card md:[box-shadow:none] ${isResizing ? "select-none cursor-col-resize" : ""}`}
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
        onDoubleClick={() => setPanelWidth(35)}
      >
        <div className={`absolute w-1 h-12 rounded-full transition-colors duration-150 ${isResizing ? "bg-foreground/50" : "bg-foreground/20 group-hover:bg-foreground/40"}`} />
        <div className="absolute w-full h-full cursor-col-resize" />
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0 flex flex-col relative bg-card md:rounded-2xl md:overflow-hidden md:border md:border-foreground/[0.12]">
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
          <div className="px-3 h-14 flex items-center pt-[env(safe-area-inset-top)]">
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
                        <SmsTrigger context="error-fallback">
                          <button className="inline-block mt-2 text-[12px] text-[#b91c1c]/70 underline underline-offset-2 hover:text-[#b91c1c] cursor-pointer">
                            Text me directly instead
                          </button>
                        </SmsTrigger>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Mobile: Fade above input */}
          <div className="flex-shrink-0 md:hidden h-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--card))" }} />
          {/* Mobile: Chat input */}
          <div className="flex-shrink-0 md:hidden pb-3 px-3">
            <ChatInput
              input={input ?? ""}
              setInput={setInput}
              onSubmit={handleChatSubmit}
              disabled={status !== "ready"}
              showMicNudge={messages.length >= 2 && messages.length <= 6 && status === "ready"}
            />
          </div>
        </div>
        </div>

        {/* Mobile: Vertical icon rail */}
        <div className="md:hidden flex flex-col items-center justify-end gap-2 flex-shrink-0 pr-[16px] pl-[6px] pb-[max(env(safe-area-inset-bottom),16px)]">
          {([
            { icon: IconVideo, label: "Video", action: () => setShowVideo(true) },
            { icon: IconExamples, label: "Examples", action: () => setShowShowcase(true) },
            { icon: IconInfo, label: "Info", action: () => handleChatSubmit("Tell me more about v0 University") },
            { icon: IconFAQ, label: "FAQ", action: () => handleChatSubmit("What are the most common questions about v0 University?") },
            { icon: IconBuy, label: "Buy", action: () => setShowCheckout(true) },
          ] as const).map(({ icon: Icon, label, ...rest }) => {
            const btn = (
              <button
                key={label}
                onClick={"action" in rest ? rest.action : undefined}
                className="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
              >
                <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center bg-foreground rubber-button ring-1 ring-white/[0.06]">
                  <Icon className="w-7 h-7 text-background" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight font-medium">{label}</span>
              </button>
            )
            return btn
          })}
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

      {/* Video drawer */}
      <VideoDrawer
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </main>
  )
}
