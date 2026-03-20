"use client"

// v0.3.0 - All data self-contained, zero external imports
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

// Self-contained gallery data - NO imports from portfolio-data
const GALLERY_DATA = [
  { category: "landing", label: "Stadics", url: "https://www.stadics.com" },
  { category: "portfolio", label: "The Shopify Guy", url: "https://www.theshopifyguy.dev" },
  { category: "portfolio", label: "Ilya Volgin", url: "https://www.ilyavolgin.com" },
  { category: "portfolio", label: "Molar Digital", url: "https://www.molar.digital" },
  { category: "saas", label: "AI Blocks", url: "https://v0-aiblocks.vercel.app" },
  { category: "saas", label: "Design Blocks", url: "https://v0-designblocks.vercel.app" },
  { category: "landing", label: "Vibe Code", url: "https://vibecode-black.vercel.app" },
  { category: "saas", label: "Neon Templates", url: "https://v0-neon-v0-templates.vercel.app" },
  { category: "ecommerce", label: "MudWater", url: "https://v0-mudwater.vercel.app" },
  { category: "ecommerce", label: "Shopify Storefront", url: "https://v0-shopifystorefront.vercel.app" },
  { category: "ecommerce", label: "Commerce PDP", url: "https://v0-vcommercepdp.vercel.app" },
  { category: "ecommerce", label: "Brez Product", url: "https://v0-brez-product-page.vercel.app" },
  { category: "saas", label: "Viberr Pro", url: "https://v0-viberrpro.vercel.app" },
]

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "landing", label: "Landing Pages" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "saas", label: "SaaS" },
  { value: "portfolio", label: "Portfolios" },
]

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onAskAbout?: (item: string) => void
}

export function MediaGallery({ isOpen, onClose, onAskAbout }: MediaGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_DATA[0] | null>(null)

  const filteredItems = selectedCategory === "all"
    ? GALLERY_DATA
    : GALLERY_DATA.filter(item => item.category === selectedCategory)

  const handleClose = useCallback(() => {
    setSelectedItem(null)
    onClose()
  }, [onClose])

  const { dragHandlers, dragY, isDragging } = useDrawerGesture({ 
    onClose: handleClose,
    threshold: 100 
  })

  if (!isOpen) return null

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

          {/* Gallery Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springClose}
            style={{ y: isDragging ? dragY : 0 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] flex flex-col bg-white rounded-t-3xl shadow-2xl"
          >
            {/* Handle */}
            <div {...dragHandlers} className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-semibold text-neutral-900">Gallery</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100">
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 px-5 pb-4 overflow-x-auto no-scrollbar">
              {CATEGORY_OPTIONS.map(cat => (
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
            <div className="flex-1 overflow-y-auto px-5 pb-6">
              {selectedItem ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to gallery
                  </button>
                  
                  <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden">
                    <iframe
                      src={selectedItem.url}
                      className="w-full h-full"
                      title={selectedItem.label}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedItem.label}</h3>
                    {onAskAbout && (
                      <button
                        onClick={() => {
                          onAskAbout(selectedItem.label)
                          handleClose()
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Ask about this
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedItem(item)}
                      className="aspect-video bg-neutral-100 rounded-xl overflow-hidden relative group"
                    >
                      <iframe
                        src={item.url}
                        className="w-full h-full pointer-events-none"
                        title={item.label}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                        <span className="text-white text-sm font-medium">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
