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

const STATUS_COLOR: Record<string, string> = {
  online: "var(--forest-500)",
  away: "#d4a017",
  offline: "#888",
}

export function IdentityPanel({ availabilityStatus, input, setInput, onSubmit, chatDisabled, style }: IdentityPanelProps) {
  const { brand, stats } = siteConfig
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
            className="w-[104px] h-[104px] rounded-full object-cover"
            style={{
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
            }}
            draggable={false}
            onClick={openGallery}
          />
          <div
            className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full"
            style={{
              backgroundColor: STATUS_COLOR[availabilityStatus] ?? STATUS_COLOR.offline,
              boxShadow: "0 0 0 2.5px var(--card)",
            }}
          />
        </div>

        {/* Name */}
        <h1
          className="text-[22px] font-semibold text-foreground leading-none tracking-[-0.02em]"
        >
          {brand.name}
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-muted-foreground mt-1.5">
          {brand.subtitle}
        </p>

        {/* Divider */}
        <div className="w-8 h-px bg-foreground/10 my-6" />

        {/* Tagline */}
        <p className="text-[16px] text-foreground leading-relaxed text-center max-w-[240px]">
          {brand.tagline}
        </p>

        <p className="text-[13px] text-muted-foreground mt-1.5">
          Design. Dev. Strategy.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-2 mt-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-3 py-1.5 rounded-full border border-foreground/10 text-center"
            >
              <span className="text-[13px] font-semibold text-foreground leading-none">
                {stat.value}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-[0.05em]">
                {stat.label}
              </span>
            </div>
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
          placeholder="Type a message..."
        />
      </div>
    </aside>
  )
}
