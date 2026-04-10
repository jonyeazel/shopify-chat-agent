"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"

const portfolioSites = PORTFOLIO_DATA.liveSites

interface ShowcaseDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ShowcaseDrawer({ isOpen, onClose }: ShowcaseDrawerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const currentSite = portfolioSites[currentIndex]

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "Escape") onClose()
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex])

  const goNext = () => {
    if (currentIndex < portfolioSites.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      goNext()
    } else if (info.offset.x > threshold) {
      goPrev()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          {/* Drawer - simple slide up/down */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[90vh] bg-background rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with nav buttons */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={goNext}
                  disabled={currentIndex === portfolioSites.length - 1}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <span className="text-sm font-medium text-foreground">{currentSite.name}</span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Swipeable iframe area */}
            <motion.div 
              className="flex-1 p-3 overflow-hidden"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full h-full rounded-xl overflow-hidden border border-border/30 bg-white relative">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 pointer-events-none z-10">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <iframe
                  src={currentSite.url}
                  className="w-full h-full"
                  onLoad={() => setIsLoaded(true)}
                  title={currentSite.name}
                />
              </div>
            </motion.div>

            {/* Pagination dots + counter */}
            <div className="flex flex-col items-center gap-2 pb-8 pt-2">
              <div className="flex justify-center gap-2">
                {portfolioSites.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-foreground w-4"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground">
                {currentIndex + 1} of {portfolioSites.length} sites
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
