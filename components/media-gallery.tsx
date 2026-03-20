"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

// Local types - not imported to avoid dependency issues
interface GalleryItemType {
  category: string
  label: string
  url: string
}

// Local data derived from PORTFOLIO_DATA
const categories = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

const galleryItems: GalleryItemType[] = PORTFOLIO_DATA.galleryItems.map((item) => ({
  category: item.category,
  label: item.name,
  url: item.thumbnail,
}))

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToChat?: () => void
}

export function MediaGallery({ isOpen, onClose, onNavigateToChat }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryItemType | null>(null)

  const filteredItems =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory)

  const { y, handleDragEnd, handleDragStart, handleDrag, isDragging } = useDrawerGesture({
    onClose,
    threshold: 100,
  })

  const handleCTAClick = useCallback(() => {
    onClose()
    onNavigateToChat?.()
  }, [onClose, onNavigateToChat])

  if (!isOpen) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={springClose}
        style={{ y }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-white rounded-t-3xl shadow-2xl overflow-hidden md:hidden touch-none"
      >
        <div className="sticky top-0 z-10 bg-white pt-3 pb-2 px-4 border-b border-neutral-100">
          <div
            className="w-10 h-1 bg-neutral-300 rounded-full mx-auto mb-3 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
          />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-neutral-100 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((cat) => (
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
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ height: "calc(85vh - 180px)", overscrollBehavior: "contain" }}
        >
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedImage(item)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 group"
              >
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 p-4 bg-white border-t border-neutral-100">
          <button
            onClick={handleCTAClick}
            className="w-full py-3 bg-neutral-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Ask about custom builds
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-[60] bg-black/90"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-[60] flex items-center justify-center"
            >
              <div className="relative w-full max-w-2xl">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.label}
                  className="w-full rounded-2xl"
                />
                <p className="text-white text-center mt-4 font-medium">{selectedImage.label}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
