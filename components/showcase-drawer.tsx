"use client"
// Mobile showcase drawer for portfolio sites
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

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false)
    }
  }, [isOpen, currentIndex])

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
    setCurrentIndex((prev) => (prev + 1) % portfolioSites.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + portfolioSites.length) % portfolioSites.length)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-12 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex-1 bg-neutral-900 rounded-t-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-neutral-400 ml-2">Live Sites</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* URL Bar */}
              <div className="px-4 py-2 border-b border-neutral-800">
                <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-3 py-2">
                  <span className="text-xs text-neutral-400 truncate flex-1">
                    {currentSite.url}
                  </span>
                  <a
                    href={currentSite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Site iframe */}
              <div className="flex-1 relative bg-white">
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                    <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                  </div>
                )}
                <iframe
                  src={currentSite.url}
                  className="w-full h-full border-0"
                  onLoad={() => setIsLoaded(true)}
                  title={currentSite.name}
                />
              </div>

              {/* Footer with navigation */}
              <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <button
                    onClick={goPrev}
                    className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{currentSite.name}</p>
                    <div className="flex gap-1.5 justify-center mt-2">
                      {portfolioSites.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i === currentIndex ? "bg-white" : "bg-neutral-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={goNext}
                    className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
