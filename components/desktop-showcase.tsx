"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { portfolioData } from "@/lib/portfolio-data"

type ShowcaseMode = "idle" | "sites" | "video" | "site-focus"

interface DesktopShowcaseProps {
  mode: ShowcaseMode
  focusedSiteUrl?: string
}

export function DesktopShowcase({ mode, focusedSiteUrl }: DesktopShowcaseProps) {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0)
  const sites = portfolioData.liveSites

  // Auto-rotate sites when in sites mode
  useEffect(() => {
    if (mode !== "sites") return
    const interval = setInterval(() => {
      setCurrentSiteIndex((prev) => (prev + 1) % sites.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [mode, sites.length])

  const currentSite = sites[currentSiteIndex]

  return (
    <div className="h-full flex flex-col bg-neutral-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center mb-6">
              <img
                src="/images/v0-university-logo.png"
                alt="v0 University"
                className="w-16 h-16 rounded-xl"
              />
            </div>
            <h2 className="text-xl font-medium text-neutral-900 mb-2">v0 University</h2>
            <p className="text-neutral-500 text-center max-w-xs">
              Ask about the course to see examples of what you can build.
            </p>
          </motion.div>
        )}

        {mode === "sites" && (
          <motion.div
            key="sites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Site browser header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                </div>
                <span className="text-sm text-neutral-600 ml-2">{currentSite?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSiteIndex((prev) => (prev - 1 + sites.length) % sites.length)}
                  className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                <span className="text-xs text-neutral-500 min-w-[40px] text-center">
                  {currentSiteIndex + 1} / {sites.length}
                </span>
                <button
                  onClick={() => setCurrentSiteIndex((prev) => (prev + 1) % sites.length)}
                  className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
                {currentSite?.url && (
                  <a
                    href={currentSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Site iframe */}
            <div className="flex-1 relative bg-white">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={currentSite?.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={currentSite?.url}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </AnimatePresence>
            </div>

            {/* Site thumbnails */}
            <div className="flex gap-2 p-3 border-t border-neutral-200 bg-white overflow-x-auto">
              {sites.map((site, index) => (
                <button
                  key={site.url}
                  onClick={() => setCurrentSiteIndex(index)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    index === currentSiteIndex
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {site.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {mode === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="relative rounded-2xl overflow-hidden bg-neutral-200 w-full max-w-lg aspect-video cursor-pointer group">
              <img
                src="/images/video-thumbnail.jpg"
                alt="v0 University Video"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 text-neutral-900 ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-black/70 text-white text-sm font-medium">
                2:47
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-lg font-medium text-neutral-900">Build a website in 3 minutes</h3>
              <p className="text-neutral-500 mt-1">No code. No design skills. No fluff.</p>
            </div>
          </motion.div>
        )}

        {mode === "site-focus" && focusedSiteUrl && (
          <motion.div
            key="site-focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                  <div className="w-3 h-3 rounded-full bg-neutral-300" />
                </div>
              </div>
              <a
                href={focusedSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
              >
                Open in new tab <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src={focusedSiteUrl}
              className="flex-1 w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook to determine showcase mode based on conversation
export function useShowcaseMode(messages: any[]): { mode: ShowcaseMode; focusedSiteUrl?: string } {
  const [mode, setMode] = useState<ShowcaseMode>("idle")
  const [focusedSiteUrl, setFocusedSiteUrl] = useState<string | undefined>()

  useEffect(() => {
    if (messages.length === 0) {
      setMode("idle")
      return
    }

    const allText = messages
      .flatMap((m: any) => m.parts?.filter((p: any) => p.type === "text").map((p: any) => p.text.toLowerCase()) || [])
      .join(" ")

    // Check for video preview triggers
    if (
      allText.includes("preview") ||
      allText.includes("video") ||
      allText.includes("what you get")
    ) {
      setMode("video")
      return
    }

    // Check for sites/examples triggers
    if (
      allText.includes("example") ||
      allText.includes("built") ||
      allText.includes("sites") ||
      allText.includes("portfolio") ||
      allText.includes("show me")
    ) {
      setMode("sites")
      return
    }

    // Default to idle if conversation started but no specific trigger
    if (messages.length > 2) {
      setMode("sites")
    } else {
      setMode("idle")
    }
  }, [messages])

  return { mode, focusedSiteUrl }
}
