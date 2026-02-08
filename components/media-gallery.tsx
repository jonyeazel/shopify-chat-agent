"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

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

  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, isOpen)

  const handleClose = useCallback(() => {
    setSelectedIndex(null)
    close()
  }, [close])

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
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-[100]"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          autoFocus
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ease-out ${isClosing ? "opacity-0" : ""}`}
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
                className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center gap-4 p-4"
              >
                <button
                  onClick={handlePrev}
                  className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-card border border-border items-center justify-center hover:bg-muted transition-colors duration-150"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                <div className="relative bg-card rounded-xl overflow-hidden shadow-lg border border-border max-w-[90%] md:max-w-[65vw]">
                  <img
                    src={selected.url}
                    alt={selected.label}
                    className="max-h-[55vh] md:max-h-[65vh] w-auto object-contain"
                  />
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <div>
                      <p className="text-[14px] text-foreground">{selected.label}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
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
              /* Grid view — bottom sheet */
              <motion.div
                key="grid"
                initial={{ y: "100%" }}
                animate={controls}
                exit={{ y: "100%" }}
                transition={springClose}
                drag="y"
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0.04, bottom: 0.6 }}
                onDragEnd={handleDragEnd}
                className="absolute bottom-[2px] left-[2px] right-[2px] z-10 bg-card rounded-[20px] overflow-hidden flex flex-col"
                style={{ height: "85vh", maxHeight: "100%" }}
              >
                {/* Drag handle */}
                <div
                  onPointerDown={startDrag}
                  className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                >
                  <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                    <span className="text-[13px] font-medium text-foreground">Gallery</span>
                    <button
                      onClick={handleClose}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors duration-150"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Grid */}
                  <div className="p-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filtered.map((item, i) => (
                        <GalleryThumbnail
                          key={i}
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
      className="w-full aspect-square overflow-hidden rounded-xl group relative bg-muted/40"
    >
      <img
        src={item.url}
        alt={item.label}
        className="w-full h-full object-cover transition-opacity duration-150 group-hover:opacity-90"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191919]/60 to-transparent px-3 pb-2.5 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <p className="text-[13px] text-white">{item.label}</p>
      </div>
    </button>
  )
}
