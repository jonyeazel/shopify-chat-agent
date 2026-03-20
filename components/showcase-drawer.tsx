"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { X } from "lucide-react"
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
  }

  const goPrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + sites.length) % sites.length)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 h-[95vh] bg-background rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Minimal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-medium text-foreground">{currentSite.name}</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Swipeable iframe area with 12px padding */}
          <div className="flex-1 p-3 overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ x: direction * 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction * -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="w-full h-full rounded-xl overflow-hidden border border-border bg-white relative"
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="w-6 h-6 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
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

          {/* Instagram-style blue pagination dots */}
          <div className="flex justify-center gap-1.5 pb-6 pt-2">
            {sites.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? "bg-[#0095F6] w-2.5"
                    : "bg-[#0095F6]/30"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
