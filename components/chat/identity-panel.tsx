"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { siteConfig } from "@/lib/site-config"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaGallery } from "@/components/media-gallery"

interface IdentityPanelProps {
  availabilityStatus: "online" | "away" | "offline"
  input: string
  setInput: (value: string) => void
  onSubmit: (text: string) => void
  chatDisabled: boolean
  style?: React.CSSProperties
}

export function IdentityPanel({ availabilityStatus, input, setInput, onSubmit, chatDisabled, style }: IdentityPanelProps) {
  const { brand } = siteConfig
  const [showGallery, setShowGallery] = useState(false)
  const openGallery = useCallback(() => setShowGallery(true), [])
  const closeGallery = useCallback(() => setShowGallery(false), [])

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

        {/* Tagline - the hook */}
        <h1 className="text-[24px] font-semibold text-foreground leading-tight tracking-[-0.02em] text-center">
          {brand.tagline}
        </h1>

        {/* Subtitle - simple and direct */}
        <p className="text-[15px] text-muted-foreground mt-3 text-center max-w-[260px] leading-relaxed">
          {brand.subtitle}
        </p>
      </div>

      {/* Chat input */}
      <div className="px-4 pb-4 pt-2">
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={onSubmit}
          disabled={chatDisabled}
          placeholder="Tell me what you'd build..."
        />
      </div>
    </aside>
  )
}
