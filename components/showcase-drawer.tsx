"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { X } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"

const portfolioSites = PORTFOLIO_DATA.liveSites

interface ShowcaseDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function ShowcaseDrawer({ isOpen, onClose }: ShowcaseDrawerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [direction, setDirection] = useState(0)

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
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x < -threshold) {
      goNext()
    } else if (info.offset.x > threshold) {
      goPrev()
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 h-[85vh] bg-background rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Minimal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <span className="text-sm font-medium text-foreground">{currentSite.name}</span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Swipeable iframe area with padding */}
            <div className="flex-1 p-3 overflow-hidden">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="w-full h-full rounded-xl overflow-hidden border border-border/30 bg-white relative"
              >
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
              </motion.div>
            </div>

            {/* Instagram-style pagination dots */}
            <div className="flex justify-center gap-1.5 pb-6 pt-2">
              {portfolioSites.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-[#0095F6] w-3"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
