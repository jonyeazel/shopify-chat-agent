"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"

const ROTATE_INTERVAL = 6000 // 6 seconds per site

export function LiveShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const sites = PORTFOLIO_DATA.liveSites

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sites.length)
      setIsLoaded(false)
    }, ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [sites.length])

  const currentSite = sites[currentIndex]

  return (
    <div className="w-full h-full flex flex-col">
      {/* Site showcase */}
      <div className="flex-1 relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <iframe
              src={currentSite.url}
              className="w-full h-full border-0 pointer-events-none"
              title={currentSite.name}
              onLoad={() => setIsLoaded(true)}
              style={{ 
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.3s ease"
              }}
            />
            {/* Loading state */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Subtle gradient overlay at bottom for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-4">
        {sites.slice(0, 8).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentIndex(i)
              setIsLoaded(false)
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex 
                ? "bg-foreground w-4" 
                : "bg-foreground/20 hover:bg-foreground/40"
            }`}
            aria-label={`View site ${i + 1}`}
          />
        ))}
        {sites.length > 8 && (
          <span className="text-[10px] text-muted-foreground ml-1">+{sites.length - 8}</span>
        )}
      </div>
    </div>
  )
}
