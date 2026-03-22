"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { siteConfig } from "@/lib/site-config"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaGallery } from "@/components/media-gallery"
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
    { icon: Play, label: "Preview", action: onVideoClick || (() => onSubmit("Show me the video")) },
    { icon: LayoutGrid, label: "Examples", action: onExamplesClick || (() => onSubmit("Show me examples")) },
    { icon: Info, label: "How It Works", action: () => onSubmit("How does this work?") },
    { icon: HelpCircle, label: "Pricing", action: () => onSubmit("What are the pricing options?") },
    { icon: CreditCard, label: "Get Started", action: onBuyClick, highlight: true },
  ]

  return (
    <aside
      className="hidden md:flex flex-shrink-0 flex-col h-full bg-card rounded-2xl overflow-hidden border border-foreground/[0.12]"
      style={style}
    >
      <MediaGallery isOpen={showGallery} onClose={closeGallery} onAskAbout={onSubmit} />

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Avatar */}
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
        </div>

        {/* Tagline */}
        <h1 className="text-[24px] font-semibold text-foreground leading-tight tracking-[-0.02em] text-center max-w-[280px]">
          <span className="block">Build sites with AI.</span>
          <span className="block">No code. No designers.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] text-muted-foreground mt-3 text-center max-w-[280px] leading-relaxed">
          Learn the system in minutes. Build forever.
        </p>

        {/* Action buttons - horizontal row */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {actionButtons.map(({ icon: Icon, label, action, highlight }) => (
            <button
              key={label}
              onClick={action}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-medium transition-all ${
                highlight 
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 cta-pulse" 
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
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
