"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { siteConfig } from "@/lib/site-config"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaGallery } from "@/components/media-gallery"
import { SmsTrigger } from "@/components/sms-trigger"

interface IdentityPanelProps {
  availabilityStatus: "online" | "away" | "offline"
  input: string
  setInput: (value: string) => void
  onSubmit: (text: string) => void
  onBuyClick: () => void
  onVideoClick?: () => void
  onExamplesClick?: () => void
  onAboutClick?: () => void
  chatDisabled: boolean
  style?: React.CSSProperties
}

export function IdentityPanel({ 
  availabilityStatus, 
  input, 
  setInput, 
  onSubmit, 
  onBuyClick, 
  onVideoClick, 
  onExamplesClick, 
  onAboutClick,
  chatDisabled, 
  style 
}: IdentityPanelProps) {
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

      {/* Header - matches mobile */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <img
          src="/v0-logo-light.png"
          alt="v0"
          className="w-10 h-10 rounded-xl object-contain bg-black p-1.5"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-[17px] font-semibold text-foreground leading-tight">
            {brand.name}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {brand.headerSubtitle}
          </p>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Avatar */}
        <div className="relative mb-5">
          <img
            src={brand.avatarUrl || "/placeholder.svg"}
            alt={brand.name}
            className="w-[100px] h-[100px] rounded-full object-cover cursor-pointer"
            style={{
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
            }}
            draggable={false}
            onClick={openGallery}
          />
          {/* iMessage blue text icon */}
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

        {/* Headline - matches mobile */}
        <h2 className="text-[22px] font-semibold text-foreground leading-tight tracking-[-0.02em] text-center">
          {brand.tagline}
        </h2>

        {/* Body text - matches mobile */}
        <p className="text-[14px] text-muted-foreground mt-2 text-center max-w-[240px] leading-relaxed">
          {brand.subtitle}
        </p>

        {/* CTA Button - Start Conversation */}
        <button
          onClick={() => {
            const input = document.querySelector('textarea') as HTMLTextAreaElement
            if (input) {
              input.focus()
            }
          }}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-[14px] font-medium hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Start a conversation
        </button>

        {/* Quick links row - matches mobile icon rail */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={onAboutClick}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="text-[11px] text-muted-foreground">About</span>
          </button>
          <button
            onClick={onExamplesClick}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <span className="text-[11px] text-muted-foreground">Work</span>
          </button>
          <button
            onClick={() => onSubmit("What's the pricing?")}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-muted group-hover:bg-muted/80 transition-colors">
              <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-[11px] text-muted-foreground">Pricing</span>
          </button>
          <button
            onClick={onBuyClick}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#635BFF] group-hover:bg-[#5851ea] transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
            </div>
            <span className="text-[11px] text-muted-foreground">Buy</span>
          </button>
        </div>

        {/* Affiliate CTA */}
        <a
          href="https://v0.link/jon"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium bg-[#00A86B]/10 text-[#00A86B] hover:bg-[#00A86B]/20 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Get $10 Free on v0
        </a>
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
