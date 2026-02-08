"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem } from "@/lib/portfolio-data"

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onAskAbout?: (prompt: string) => void
}

export function MediaGallery({ isOpen, onClose, onAskAbout }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const filtered = GALLERY_ITEMS

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === 0 ? filtered.length - 1 : prev - 1
    )
  }, [filtered.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev === null ? null : prev === filtered.length - 1 ? 0 : prev + 1
    )
  }, [filtered.length])

  const handleBack = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedIndex(null)
    onClose()
  }, [onClose])

  const handleAskAbout = useCallback((item: GalleryItem) => {
    const categoryLabel = GALLERY_CATEGORIES.find((c) => c.value === item.category)?.label || "this"
    const prompt = `Tell me about your ${categoryLabel.toLowerCase()} work — like "${item.label}"`
    onAskAbout?.(prompt)
    handleClose()
  }, [onAskAbout, handleClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedIndex !== null) {
          setSelectedIndex(null)
        } else {
          handleClose()
        }
      }
      if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "ArrowRight") handleNext()
      }
    },
    [selectedIndex, handleClose, handlePrev, handleNext]
  )

  const selected = selectedIndex !== null ? filtered[selectedIndex] : null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/15 backdrop-blur-sm"
            onClick={selectedIndex !== null ? handleBack : handleClose}
          />

          <AnimatePresence mode="wait">
            {selected ? (
              /* Lightbox view */
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 flex flex-col md:flex-row items-center gap-4 mx-4 max-w-[90vw] max-h-[90vh]"
              >
                <button
                  onClick={handlePrev}
                  className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-card border border-border items-center justify-center hover:bg-muted transition-colors duration-150"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                <div className="relative bg-card rounded-xl overflow-hidden shadow-lg border border-border">
                  <img
                    src={selected.url}
                    alt={selected.label}
                    className="max-h-[55vh] md:max-h-[70vh] max-w-[85vw] md:max-w-[65vw] object-contain"
                  />
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <div>
                      <p className="text-[13px] text-foreground">{selected.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {GALLERY_CATEGORIES.find((c) => c.value === selected.category)?.label}
                      </p>
                    </div>
                    {onAskAbout && (
                      <button
                        onClick={() => handleAskAbout(selected)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background text-[12px] hover:opacity-90 transition-opacity duration-150"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Ask about this
                      </button>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-card border border-border items-center justify-center hover:bg-muted transition-colors duration-150"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>

                {/* Mobile nav */}
                <div className="flex md:hidden items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 rounded-full bg-card border border-border text-[12px] text-muted-foreground"
                  >
                    Back to grid
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Grid view — bottom sheet on mobile, centered card on desktop */
              <motion.div
                key="grid"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="relative z-10 w-full md:w-auto md:max-w-4xl md:mx-4 bg-card rounded-t-2xl md:rounded-xl border-t md:border border-border md:shadow-lg overflow-hidden flex flex-col"
                style={{ maxHeight: "85vh" }}
              >
                {/* Drag handle — mobile only */}
                <div className="md:hidden flex justify-center pt-2 pb-1 flex-shrink-0">
                  <div className="w-8 h-1 rounded-full bg-muted-foreground/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-end px-4 md:px-5 py-3 md:py-4 flex-shrink-0">
                  <button
                    onClick={handleClose}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-150"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-2">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filtered.map((item, i) => (
                      <GalleryThumbnail
                        key={`${filter}-${i}`}
                        item={item}
                        index={i}
                        onClick={handleSelect}
                      />
                    ))}
                  </div>
                  {filtered.length === 0 && (
                    <p className="text-center text-[13px] text-muted-foreground py-12">No images in this category.</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function GalleryThumbnail({
  item,
  index,
  onClick,
}: {
  item: GalleryItem
  index: number
  onClick: (index: number) => void
}) {
  return (
    <button
      onClick={() => onClick(index)}
      className="w-full aspect-square overflow-hidden rounded-lg group relative bg-muted/40"
    >
      <img
        src={item.url}
        alt={item.label}
        className="w-full h-full object-cover transition-opacity duration-150 group-hover:opacity-90"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191919]/60 to-transparent px-2.5 pb-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <p className="text-[11px] text-white">{item.label}</p>
      </div>
    </button>
  )
}
