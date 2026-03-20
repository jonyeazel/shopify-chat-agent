"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"

// All gallery data is self-contained - no external imports
const GALLERY_DATA = [
  { category: "landing", label: "Stadics", url: "https://www.stadics.com" },
  { category: "saas", label: "AI Blocks", url: "https://v0-aiblocks.vercel.app" },
  { category: "saas", label: "Design Blocks", url: "https://v0-designblocks.vercel.app" },
  { category: "ecommerce", label: "Shopify Store", url: "https://v0-shopifystorefront.vercel.app" },
  { category: "landing", label: "Vibe Code", url: "https://vibecode-black.vercel.app" },
  { category: "ecommerce", label: "MudWater", url: "https://v0-mudwater.vercel.app" },
]

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onAskAbout?: (item: string) => void
}

export function MediaGallery({ isOpen, onClose, onAskAbout }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredItems = selectedCategory === "all" 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => item.category === selectedCategory)

  const handlePrev = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }, [selectedIndex])

  const handleNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }, [selectedIndex, filteredItems.length])

  const handleClose = () => {
    setSelectedIndex(null)
    onClose()
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
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Gallery Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 p-4 overflow-x-auto">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
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

            {/* Grid or Detail View */}
            {selectedIndex === null ? (
              <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto max-h-[60vh]">
                {filteredItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className="aspect-video rounded-xl overflow-hidden bg-neutral-100 relative group"
                  >
                    <iframe
                      src={item.url}
                      title={item.label}
                      className="w-full h-full border-0 pointer-events-none scale-[0.5] origin-top-left"
                      style={{ width: "200%", height: "200%" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-white text-xs font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-neutral-900">
                    {filteredItems[selectedIndex]?.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={selectedIndex === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === filteredItems.length - 1}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden bg-neutral-100">
                  <iframe
                    src={filteredItems[selectedIndex]?.url}
                    title={filteredItems[selectedIndex]?.label}
                    className="w-full h-full border-0"
                  />
                </div>
                {onAskAbout && (
                  <button
                    onClick={() => onAskAbout(filteredItems[selectedIndex]?.label || "")}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-900 text-white font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Ask about this
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
