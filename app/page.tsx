"use client"

import type React from "react"
import { useState, useMemo, useRef, useCallback, useEffect, type MouseEvent as ReactMouseEvent } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Volume2, VolumeX, Search, Layers, DollarSign, MessageCircle, Image } from "lucide-react"

import { IdentityPanel } from "@/components/chat/identity-panel"
import { ChatInput } from "@/components/chat/chat-input"
import { MessageList } from "@/components/chat/message-list"
import { SlideMenu } from "@/components/chat/slide-menu"
import { StaticAvatar, HeaderAvatar } from "@/components/flip-avatar"
import { SiteAdminPanel } from "@/components/admin/site-admin-panel"
import { AdminLoginModal } from "@/components/admin/admin-login-modal"
import { InstantSiteCreator } from "@/components/admin/instant-site-creator"
import { InstantContentDrawer, type DrawerType } from "@/components/chat/instant-content-drawer"
import { MediaGallery } from "@/components/media-gallery"
import { siteConfig } from "@/lib/site-config"
import { getSmsHref } from "@/lib/sms"
import { SmsTrigger } from "@/components/sms-trigger"
import {
  getMenuItems,
  determineConversationPhase,
  type AvailabilityStatus,
} from "@/lib/chat-config"

const SITE_ID = 1
const TEMP_ADMIN_BYPASS = true

const QUICK_ACTIONS = [
  { label: "Get a free audit", message: "Can you audit my store?" },
  { label: "See your work", message: "Show me some stores you've built" },
  { label: "View pricing", message: "What do you charge?" },
  { label: "Text me", message: null, sms: true },
]

export default function Home() {
  const [showMenu, setShowMenu] = useState(false)
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
  const [menuLongPressTimer, setMenuLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null)
  const openDrawer = useCallback((type: DrawerType) => setActiveDrawer(type), [])
  const closeDrawer = useCallback(() => setActiveDrawer(null), [])

  const [showMobileGallery, setShowMobileGallery] = useState(false)
  const openMobileGallery = useCallback(() => setShowMobileGallery(true), [])
  const closeMobileGallery = useCallback(() => setShowMobileGallery(false), [])

  // Panel resize
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

  const handleMenuPressStart = useCallback(() => {
    const timer = setTimeout(() => {
      if (TEMP_ADMIN_BYPASS) {
        setShowAdminPanel(true)
      } else {
        setShowAdminLogin(true)
      }
    }, 2000)
    setMenuLongPressTimer(timer)
  }, [])

  const handleMenuPressEnd = useCallback(() => {
    if (menuLongPressTimer) {
      clearTimeout(menuLongPressTimer)
      setMenuLongPressTimer(null)
    }
  }, [menuLongPressTimer])

  const handleMenuClick = useCallback(() => {
    if (!menuLongPressTimer) {
      setShowMenu(true)
    }
  }, [menuLongPressTimer])

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

  useEffect(() => {
    if (error) setChatError(error.message || "Chat connection failed")
  }, [error])

  const hasMessages = messages.length > 0
  const menuItems = useMemo(
    () =>
      getMenuItems(
        sendMessage,
        setShowMenu,
        fileInputRef,
        backgroundInputRef,
        setShowSiteCreator,
        openDrawer,
      ),
    [sendMessage, openDrawer],
  )

  const smsHref = getSmsHref()

  return (
    <main
      ref={mainRef}
      className={`flex mx-[6px] md:m-3 bg-card rounded-3xl overflow-hidden border border-foreground/[0.12] md:bg-transparent md:rounded-none md:overflow-visible md:border-0 ${isResizing ? "select-none cursor-col-resize" : ""}`}
      style={{ height: "calc(100dvh - var(--edge-padding) * 2)" }}
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

      <MediaGallery isOpen={showMobileGallery} onClose={closeMobileGallery} onAskAbout={handleChatSubmit} />

      {/* Desktop: Left identity panel */}
      <IdentityPanel
        availabilityStatus={availabilityStatus}
        input={input}
        setInput={setInput}
        onSubmit={handleChatSubmit}
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

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-50 bg-card/90 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-foreground" />
                </div>
                <p className="text-lg font-medium text-foreground">Drop files here</p>
                <p className="text-sm text-muted-foreground mt-1">CSVs or images</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile header */}
        <header className="flex-shrink-0 relative z-40 md:hidden">
          <div className="px-4 h-14 flex items-center justify-between pt-[env(safe-area-inset-top)]">
            <div className="flex items-center gap-3">
              <HeaderAvatar avatarUrl={siteConfig.brand.avatarUrl} />
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-[14px] leading-none tracking-[-0.01em]">{siteConfig.brand.name}</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-1">{siteConfig.brand.subtitle}</span>
              </div>
            </div>
            <button
              onClick={handleMenuClick}
              onMouseDown={handleMenuPressStart}
              onMouseUp={handleMenuPressEnd}
              onMouseLeave={handleMenuPressEnd}
              onTouchStart={handleMenuPressStart}
              onTouchEnd={handleMenuPressEnd}
              className="w-10 h-10 flex flex-col items-end justify-center gap-[5px] rounded-full active:bg-muted/40 active:scale-[0.92] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Menu (hold for admin)"
            >
              <span className="w-[11px] h-[1.5px] bg-foreground rounded-full" />
              <span className="w-[18px] h-[1.5px] bg-foreground rounded-full" />
            </button>
          </div>
        </header>

        <InstantContentDrawer
          type={activeDrawer}
          onClose={closeDrawer}
          isFullscreen={false}
          onAskAbout={(prompt) => handleSendMessage(prompt)}
        />

        {/* Content row: left column + icon rail */}
        <div className="flex-1 min-h-0 flex relative">

        <SlideMenu isOpen={showMenu} onClose={() => setShowMenu(false)} items={menuItems} isFullscreen={false} />

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
                    className="h-full w-full flex flex-col items-center justify-end pb-6 px-6 md:hidden"
                  >
                    <div className="text-center flex flex-col items-center w-full">
                      <motion.div
                        className="relative mb-5"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.05 }}
                      >
                        <StaticAvatar avatarUrl={siteConfig.brand.avatarUrl} availabilityStatus={availabilityStatus} onLongPress={openMobileGallery} />
                      </motion.div>

                      <motion.h1
                        className="font-semibold text-foreground text-[18px] tracking-[-0.01em]"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.12 }}
                      >
                        {siteConfig.brand.tagline}
                      </motion.h1>

                      <motion.p
                        className="text-[12px] text-muted-foreground mt-1.5"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.17 }}
                      >
                        Shopify design & development
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

                  {/* Desktop empty state */}
                  <motion.div
                    key="landing-desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full hidden md:flex flex-col items-center justify-center px-4"
                  >
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about your store.
                    </p>
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
                  <MessageList messages={messages} status={status} avatarUrl={siteConfig.brand.avatarUrl} onQuickReply={handleChatSubmit} onAuditSubmit={handleAuditSubmit} />
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

          {/* Desktop: Starter prompts footer */}
          <div className="flex-shrink-0 relative bg-card hidden md:block">
            <div className="flex items-center justify-center gap-2 px-4 py-3">
              {QUICK_ACTIONS.map((action, i) => {
                const btn = (
                  <button
                    key={i}
                    onClick={action.sms ? undefined : () => {
                      if (action.message) handleChatSubmit(action.message)
                    }}
                    className={`py-1.5 px-3 rounded-full text-[12px] transition-colors duration-150 whitespace-nowrap ${
                      action.sms
                        ? "bg-foreground text-background hover:opacity-90 cursor-pointer"
                        : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {action.label}
                  </button>
                )
                if (action.sms) {
                  return <SmsTrigger key={i}>{btn}</SmsTrigger>
                }
                return btn
              })}
            </div>
          </div>
          {/* Mobile: Fade above input */}
          <div className="flex-shrink-0 md:hidden h-6 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--card))" }} />
          {/* Mobile: Chat input */}
          <div className="flex-shrink-0 md:hidden pb-[max(env(safe-area-inset-bottom),8px)] px-3">
            <ChatInput
              input={input ?? ""}
              setInput={setInput}
              onSubmit={handleChatSubmit}
              disabled={status !== "ready"}
            />
          </div>
        </div>
        </div>

        {/* Mobile: Vertical icon rail */}
        <div className={`md:hidden flex flex-col items-center justify-end gap-2 flex-shrink-0 pr-3 pb-[max(env(safe-area-inset-bottom),12px)] ${showMenu ? "opacity-0 pointer-events-none" : ""}`}>
          {[
            { icon: Search, label: "Audit", action: () => handleChatSubmit("Can you audit my store?") },
            { icon: Layers, label: "Work", action: () => openDrawer("portfolio") },
            { icon: DollarSign, label: "Price", action: () => openDrawer("pricing") },
            { icon: MessageCircle, label: "Text", action: () => { window.location.href = smsHref } },
            { icon: Image, label: "Gallery", action: () => setShowMobileGallery(true) },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center active:scale-[0.92] active:opacity-80 transition-all duration-150 bg-foreground">
                <Icon className="w-4 h-4 text-background" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
            </button>
          ))}
        </div>

        </div>
      </div>
    </main>
  )
}
