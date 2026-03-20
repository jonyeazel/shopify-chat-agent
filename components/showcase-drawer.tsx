"use client"

import { useState, useEffect, useRef } from "react"
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
  const constraintsRef = useRef(null)

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
    if (info.offset.x < -threshold) {
      goNext()
    } else if (info.offset.x > threshold) {
      goPrev()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[92vh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Main content - light theme */}
            <div className="flex-1 bg-background rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Live Sites
                  </span>
                  <span className="text-xs text-muted-foreground/60">Built with AI</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Browser frame with padding */}
              <div className="flex-1 p-4 overflow-hidden" ref={constraintsRef}>
                <motion.div
                  className="h-full rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm flex flex-col"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                >
                  {/* Browser chrome */}
                  <div className="h-10 bg-muted/30 border-b border-border/30 flex items-center px-3 gap-2 flex-shrink-0">
                    {/* Traffic lights */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                    
                    {/* URL bar */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-3 py-1 bg-background/60 rounded-md text-[11px] text-muted-foreground max-w-[240px]">
                        <span className="truncate">{currentSite.url.replace('https://', '')}</span>
                      </div>
                    </div>
                    
                    {/* Open link button */}
                    <a
                      href={currentSite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted/50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  </div>

                  {/* Iframe */}
                  <div className="flex-1 relative bg-white">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -50 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0"
                      >
                        <iframe
                          src={currentSite.url}
                          className="w-full h-full border-0"
                          title={currentSite.name}
                          onLoad={() => setIsLoaded(true)}
                          style={{ 
                            opacity: isLoaded ? 1 : 0,
                            transition: "opacity 0.3s ease"
                          }}
                          loading="lazy"
                        />
                        {!isLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
                            <div className="w-6 h-6 border-2 border-foreground/10 border-t-foreground/40 rounded-full animate-spin" />
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Footer with site name and pagination */}
              <div className="px-4 pb-6 pt-2">
                <div className="flex items-center justify-between">
                  {/* Site name */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {currentSite.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {currentIndex + 1} of {sites.length}
                    </span>
                  </div>

                  {/* Swipe hint */}
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                    Swipe to browse
                  </span>
                </div>

                {/* Pagination dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  {sites.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1)
                        setCurrentIndex(i)
                        setIsLoaded(false)
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === currentIndex 
                          ? "bg-foreground w-6" 
                          : "bg-foreground/15 w-2 hover:bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
