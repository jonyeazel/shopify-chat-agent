"use client"

// Media Gallery - v0 University Portfolio Showcase
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

// ============================================
// LOCAL TYPES AND DATA - NOT IMPORTED
// ============================================

interface GalleryItemLocal {
  category: string
  label: string
  url: string
}

const CATEGORIES_LOCAL = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
]

const ITEMS_LOCAL: GalleryItemLocal[] = PORTFOLIO_DATA.galleryItems.map((item) => ({
  category: item.category,
  label: item.name,
  url: item.thumbnail,
}))

// ============================================
// COMPONENT
// ============================================

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onStartChat?: () => void
}

export function MediaGallery({ isOpen, onClose, onStartChat }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryItemLocal | null>(null)
  const [imageError, setImageError] = useState<Set<string>>(new Set())

  const { dragY, handleDragEnd, isDragging } = useDrawerGesture({
    onClose,
    threshold: 100,
  })

  const filteredItems = selectedCategory === "all"
    ? ITEMS_LOCAL
    : ITEMS_LOCAL.filter((item) => item.category === selectedCategory)

  const handleImageError = useCallback((url: string) => {
    setImageError((prev) => new Set(prev).add(url))
  }, [])

  const handlePrevImage = useCallback(() => {
    if (!selectedImage) return
    const currentIndex = filteredItems.findIndex((item) => item.url === selectedImage.url)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1
    setSelectedImage(filteredItems[prevIndex])
  }, [selectedImage, filteredItems])

  const handleNextImage = useCallback(() => {
    if (!selectedImage) return
    const currentIndex = filteredItems.findIndex((item) => item.url === selectedImage.url)
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0
    setSelectedImage(filteredItems[nextIndex])
  }, [selectedImage, filteredItems])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springClose}
            style={{ y: dragY }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 h-[85vh] bg-background rounded-t-3xl overflow-hidden"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h2 className="text-lg font-semibold text-foreground">Gallery</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/60" />
              </button>
            </div>

            {/* Categories */}
            <div className="px-5 pb-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {CATEGORIES_LOCAL.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-foreground text-background"
                        : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto px-5 pb-24">
              <div className="grid grid-cols-2 gap-3">
                {filteredItems.map((item, index) => (
                  <motion.button
                    key={`${item.url}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedImage(item)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-foreground/5 group"
                  >
                    {!imageError.has(item.url) ? (
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(item.url)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/40">
                        <span className="text-xs">Image unavailable</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-xs text-white font-medium truncate">{item.label}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* CTA */}
            {onStartChat && (
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
                <button
                  onClick={onStartChat}
                  className="w-full py-4 bg-foreground text-background rounded-2xl font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Building
                </button>
              </div>
            )}
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <motion.img
                  key={selectedImage.url}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  src={selectedImage.url}
                  alt={selectedImage.label}
                  className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <p className="text-white text-lg font-medium">{selectedImage.label}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
