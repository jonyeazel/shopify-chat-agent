"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { siteConfig } from "@/lib/site-config"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaGallery } from "@/components/media-gallery"
import { SmsTrigger } from "@/components/sms-trigger"
import { Play, LayoutGrid, Info, HelpCircle, CreditCard } from "lucide-react"

interface IdentityPanelProps {
  availabilityStatus: "online" | "away" | "offline"
  input: string
  setInput: (value: string) => void
  onSubmit: (text: string) => void
  onBuyClick: () => void
  onVideoClick?: () => void
  onExamplesClick?: () => void
  chatDisabled: boolean
  style?: React.CSSProperties
}

export function IdentityPanel({ availabilityStatus, input, setInput, onSubmit, onBuyClick, onVideoClick, onExamplesClick, chatDisabled, style }: IdentityPanelProps) {
  const { brand } = siteConfig
  const [showGallery, setShowGallery] = useState(false)
  const openGallery = useCallback(() => setShowGallery(true), [])
  const closeGallery = useCallback(() => setShowGallery(false), [])

  const actionButtons = [
    { icon: Play, label: "Watch", action: onVideoClick || (() => onSubmit("Show me the video")) },
    { icon: LayoutGrid, label: "Results", action: onExamplesClick || (() => onSubmit("Show me results")) },
    { icon: Info, label: "How", action: () => onSubmit("How easy is this?") },
    { icon: HelpCircle, label: "Offer", action: () => onSubmit("What's the deal?") },
    { icon: CreditCard, label: "Buy Now", action: onBuyClick, highlight: true },
  ]

  return (
    <aside
      className="hidden md:flex flex-shrink-0 flex-col h-full bg-card rounded-2xl overflow-hidden border border-foreground/[0.12]"
      style={style}
    >
      <MediaGallery isOpen={showGallery} onClose={closeGallery} onAskAbout={onSubmit} />

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Avatar with text icon */}
        <div className="relative mb-6">
          <img
            src={brand.avatarUrl || "/placeholder.svg"}
            alt={brand.name}
            className="w-[104px] h-[104px] rounded-full object-cover cursor-pointer"
            style={{
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
            }}
            draggable={false}
            onClick={openGallery}
          />
          {/* iMessage blue text icon - shows QR on desktop */}
          <SmsTrigger context="general">
            <button
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </SmsTrigger>
        </div>

        {/* Tagline */}
        <h1 className="text-[24px] font-semibold text-foreground leading-tight tracking-[-0.02em] text-center max-w-[280px]">
          <span className="block">Your site live today.</span>
          <span className="block">Zero experience needed.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] text-muted-foreground mt-3 text-center max-w-[280px] leading-relaxed">
          20-minute video. Custom domain. Guaranteed.
        </p>

        {/* Action buttons - horizontal row */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {actionButtons.map(({ icon: Icon, label, action, highlight }) => (
            <button
              key={label}
              onClick={action}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium transition-all ${
                highlight 
                  ? "bg-[#635BFF] text-white hover:bg-[#5851ea] stripe-pulse" 
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {highlight ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
              ) : (
                <Icon className="w-4 h-4" strokeWidth={1.5} />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <div className="px-4 pb-4 pt-2">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          disabled={chatDisabled}
          placeholder="Ask me anything..."
          voiceFirst={true}
        />
      </div>
    </aside>
  )
}
