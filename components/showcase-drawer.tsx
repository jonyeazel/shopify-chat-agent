"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"

const portfolioSites = PORTFOLIO_DATA.liveSites

interface ShowcaseDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ShowcaseDrawer({ isOpen, onClose }: ShowcaseDrawerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const currentSite = portfolioSites[currentIndex]

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false)
    }
  }, [isOpen, currentIndex])

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    setTouchStart(null)
  }

  const goNext = () => {
    setIsLoaded(false)
    setCurrentIndex((i) => (i + 1) % portfolioSites.length)
  }

  const goPrev = () => {
    setIsLoaded(false)
    setCurrentIndex((i) => (i - 1 + portfolioSites.length) % portfolioSites.length)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Mobile: Full-screen slide-up panel */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 top-12 z-50 flex flex-col"
      >
        <div 
          className="flex-1 bg-neutral-900 rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/70">Live Sites · Built with AI</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border-b border-white/5">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            
            {/* URL bar */}
            <div className="flex-1 flex items-center gap-2 bg-neutral-700 rounded-md px-3 py-1.5 mx-2">
              <span className="text-[11px] text-white/50 truncate flex-1">
                {currentSite.url.replace('https://', '')}
              </span>
              <a 
                href={currentSite.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Site iframe */}
          <div className="flex-1 relative bg-white">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
              </div>
            )}
            <iframe
              key={currentSite.url}
              src={currentSite.url}
              title={currentSite.name}
              className="w-full h-full border-0"
              onLoad={() => setIsLoaded(true)}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Footer controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-t border-white/10">
            {/* Prev button */}
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Site info */}
            <div className="text-center flex-1 px-4">
              <p className="text-sm font-medium text-white truncate">{currentSite.name}</p>
              <p className="text-xs text-white/50">{currentIndex + 1} of {portfolioSites.length}</p>
            </div>

            {/* Next button */}
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 py-3 bg-neutral-900">
            {portfolioSites.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsLoaded(false); setCurrentIndex(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex 
                    ? "bg-white w-4" 
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
