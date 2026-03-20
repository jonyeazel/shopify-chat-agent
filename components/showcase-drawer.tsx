"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"

const sites = PORTFOLIO_DATA.liveSites

interface ShowcaseDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ShowcaseDrawer({ isOpen, onClose }: ShowcaseDrawerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [direction, setDirection] = useState(0)

  const currentSite = sites[currentIndex]

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false)
    }
  }, [isOpen, currentIndex])

  const goNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % sites.length)
    setIsLoaded(false)
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + sites.length) % sites.length)
    setIsLoaded(false)
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold) goNext()
    else if (info.offset.x > threshold) goPrev()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[95vh] bg-background rounded-t-2xl flex flex-col overflow-hidden"
          >
            {/* Minimal header - just close button and external link */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
              <a
                href={currentSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-medium">{currentSite.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Full-height iframe - swipeable */}
            <motion.div
              className="flex-1 mx-3 mb-3 rounded-xl overflow-hidden border border-border/50 bg-white"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: direction * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -30 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full relative"
                >
                  <iframe
                    src={currentSite.url}
                    className="w-full h-full border-0"
                    title={currentSite.name}
                    onLoad={() => setIsLoaded(true)}
                    style={{ 
                      opacity: isLoaded ? 1 : 0,
                      transition: "opacity 0.2s ease"
                    }}
                    loading="lazy"
                  />
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-50">
                      <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Pagination dots only */}
            <div className="flex items-center justify-center gap-2 pb-8 pt-1 flex-shrink-0">
              {sites.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1)
                    setCurrentIndex(i)
                    setIsLoaded(false)
                  }}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === currentIndex 
                      ? "bg-foreground w-5" 
                      : "bg-foreground/20 w-2 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
