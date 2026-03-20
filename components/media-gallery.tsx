"use client"
// Media Gallery Component - v0 University
// Derives all gallery data locally from PORTFOLIO_DATA

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

// Local type definition
interface GalleryItemType {
  category: string
  label: string
  url: string
}

// Local category definitions
const categories = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

// Derive gallery items from portfolio data
const galleryItems: GalleryItemType[] = PORTFOLIO_DATA.galleryItems.map((item) => ({
  category: item.category,
  label: item.name,
  url: item.thumbnail,
}))

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onStartChat?: () => void
}

export function MediaGallery({ isOpen, onClose, onStartChat }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const { dragY, handleDragEnd, resetDrag } = useDrawerGesture({
    onClose,
    threshold: 100,
  })

  const filteredItems = selectedCategory === "all"
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory)

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setSelectedIndex(null)
  }, [])

  const handleItemClick = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

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

  const handleClosePreview = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const handleStartChat = useCallback(() => {
    onClose()
    onStartChat?.()
  }, [onClose, onStartChat])

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Gallery Drawer */}
          <motion.div
            key="gallery-drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springClose}
            style={{ y: dragY }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl overflow-hidden"
            style={{ height: "85vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Categories */}
            <div className="px-5 pb-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
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
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-24">
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item, index) => (
                  <motion.button
                    key={`${item.category}-${index}`}
                    onClick={() => handleItemClick(index)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 group"
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="absolute bottom-2 left-2 right-2 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {item.label}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-white via-white to-transparent">
              <button
                onClick={handleStartChat}
                className="w-full py-4 bg-neutral-900 text-white font-medium rounded-2xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Us
              </button>
            </div>

            {/* Full Preview Modal */}
            <AnimatePresence>
              {selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-white"
                >
                  {/* Preview Header */}
                  <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                    <p className="font-medium text-neutral-900">
                      {filteredItems[selectedIndex]?.label}
                    </p>
                    <button
                      onClick={handleClosePreview}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>

                  {/* Preview Image */}
                  <div className="flex-1 flex items-center justify-center p-4 h-[calc(100%-120px)]">
                    <img
                      src={filteredItems[selectedIndex]?.url}
                      alt={filteredItems[selectedIndex]?.label}
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                  </div>

                  {/* Navigation */}
                  <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-between">
                    <button
                      onClick={handlePrev}
                      disabled={selectedIndex === 0}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-30 hover:bg-neutral-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <p className="text-sm text-neutral-500">
                      {selectedIndex + 1} of {filteredItems.length}
                    </p>
                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === filteredItems.length - 1}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-30 hover:bg-neutral-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
