"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"

// All data is defined locally - no external imports for gallery data
const GALLERY_DATA = [
  { category: "landing", label: "AI Landing", url: "/gallery/ai-landing.jpg" },
  { category: "ecommerce", label: "Store Front", url: "/gallery/store.jpg" },
  { category: "saas", label: "Dashboard", url: "/gallery/dashboard.jpg" },
  { category: "landing", label: "Portfolio", url: "/gallery/portfolio.jpg" },
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
  onStartChat?: () => void
}

export function MediaGallery({ isOpen, onClose, onStartChat }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filteredItems = selectedCategory === "all"
    ? GALLERY_DATA
    : GALLERY_DATA.filter((item) => item.category === selectedCategory)

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < filteredItems.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value)
                    setSelectedIndex(null)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="px-5 pb-6 grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
              {filteredItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className="aspect-video bg-neutral-100 rounded-xl overflow-hidden relative group"
                >
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>

            {onStartChat && (
              <div className="px-5 pb-6">
                <button
                  onClick={onStartChat}
                  className="w-full py-3 bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Start a conversation
                </button>
              </div>
            )}

            <AnimatePresence>
              {selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white flex flex-col"
                >
                  <div className="flex items-center justify-between p-4">
                    <button
                      onClick={() => setSelectedIndex(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-neutral-500">
                      {selectedIndex + 1} / {filteredItems.length}
                    </span>
                    <div className="w-10" />
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full aspect-video bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-400">
                      {filteredItems[selectedIndex]?.label}
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 p-4">
                    <button
                      onClick={handlePrevious}
                      disabled={selectedIndex === 0}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === filteredItems.length - 1}
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-neutral-100 disabled:opacity-30"
                    >
                      <ChevronRight className="w-6 h-6" />
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
