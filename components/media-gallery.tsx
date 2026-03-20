"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

// Define types and derive gallery data locally from PORTFOLIO_DATA
type GalleryItem = {
  category: string
  label: string
  url: string
}

const GALLERY_ITEMS: GalleryItem[] = PORTFOLIO_DATA.galleryItems.map((item) => ({
  category: item.category,
  label: item.name,
  url: item.thumbnail,
}))

const GALLERY_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onChatClick?: () => void
}

export function MediaGallery({ isOpen, onClose, onChatClick }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredItems =
    selectedCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory)

  const handlePrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }, [selectedIndex])

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }, [selectedIndex, filteredItems.length])

  const { dragY, handleDragEnd } = useDrawerGesture({ onClose })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="gallery-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="gallery-drawer"
            style={{ y: dragY }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springClose}
            className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-white rounded-t-3xl overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
              <div className="flex items-center gap-2">
                {onChatClick && (
                  <button
                    onClick={onChatClick}
                    className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                    aria-label="Open chat"
                  >
                    <MessageCircle className="w-5 h-5 text-neutral-600" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Close gallery"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 px-5 pb-4 overflow-x-auto scrollbar-hide">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value)
                    setSelectedIndex(null)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gallery grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-20">
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item, index) => (
                  <button
                    key={`${item.category}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-2 left-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
              {selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
                >
                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close lightbox"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {selectedIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                  )}

                  <div className="max-w-[90%] max-h-[80%] bg-neutral-800 rounded-xl flex items-center justify-center p-8">
                    <span className="text-white text-lg">
                      {filteredItems[selectedIndex]?.label}
                    </span>
                  </div>

                  {selectedIndex < filteredItems.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
