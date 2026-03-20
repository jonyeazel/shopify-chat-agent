"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

const ROTATE_INTERVAL = 8000 // 8 seconds per site

export function LiveShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const sites = PORTFOLIO_DATA.liveSites

  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sites.length)
      setIsLoaded(false)
    }, ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [sites.length, isPaused])

  const currentSite = sites[currentIndex]

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sites.length) % sites.length)
    setIsLoaded(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sites.length)
    setIsLoaded(false)
  }

  return (
    <div 
      className="w-full h-full flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Live Sites
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground/60">
            Built with AI
          </span>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="w-7 h-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Previous site"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="w-7 h-7 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Next site"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Site showcase with browser frame */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm">
          {/* Browser chrome */}
          <div className="h-9 bg-muted/30 border-b border-border/30 flex items-center px-3 gap-2">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            
            {/* URL bar */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-background/60 rounded-md text-[11px] text-muted-foreground max-w-[280px]">
                <span className="truncate">{currentSite.url.replace('https://', '')}</span>
              </div>
            </div>
            
            {/* Open link button */}
            <a
              href={currentSite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-muted/50 transition-colors"
              aria-label="Open site in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </a>
          </div>

          {/* Iframe container */}
          <div className="absolute inset-0 top-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <iframe
                  src={currentSite.url}
                  className="w-full h-full border-0"
                  title={currentSite.name}
                  onLoad={() => setIsLoaded(true)}
                  style={{ 
                    opacity: isLoaded ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: isPaused ? "auto" : "none"
                  }}
                  loading="lazy"
                />
                {/* Loading state */}
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="w-5 h-5 border-2 border-foreground/10 border-t-foreground/40 rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer with progress and site name */}
      <div className="flex items-center justify-between pt-3 px-1">
        {/* Site name */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-foreground/80">
            {currentSite.name}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {currentIndex + 1} of {sites.length}
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1">
          {sites.slice(0, 6).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i)
                setIsLoaded(false)
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? "bg-foreground w-4" 
                  : "bg-foreground/15 w-1.5 hover:bg-foreground/30"
              }`}
              aria-label={`View site ${i + 1}`}
            />
          ))}
          {sites.length > 6 && (
            <span className="text-[10px] text-muted-foreground ml-0.5">+{sites.length - 6}</span>
          )}
        </div>
      </div>
    </div>
  )
}
