"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MessageCircle, ExternalLink, Globe } from "lucide-react"
import { GALLERY_ITEMS, GALLERY_CATEGORIES, type GalleryItem, type GalleryCategory } from "@/lib/portfolio-data"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
  onAskAbout?: (prompt: string) => void
}

export function MediaGallery({ isOpen, onClose, onAskAbout }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "all">("all")

  const filtered = activeCategory === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === activeCategory)

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
                  {selected.category === "live-sites" ? (
                    <div className="w-[85vw] md:w-[60vw] aspect-video bg-muted relative">
                      <iframe
                        src={selected.liveUrl}
                        className="w-full h-full"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  ) : (
                    <img
                      src={selected.url}
                      alt={selected.label}
                      className="max-h-[55vh] md:max-h-[65vh] w-auto object-contain"
                    />
                  )}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                    <div>
                      <p className="text-[14px] text-foreground">{selected.label}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {GALLERY_CATEGORIES.find((c) => c.value === selected.category)?.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selected.liveUrl && (
                        <a
                          href={selected.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-foreground text-[12px] hover:bg-muted transition-colors duration-150"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Visit
                        </a>
                      )}
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
                  {/* Category Filter */}
                  <div className="px-3 pt-2 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                    {GALLERY_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setActiveCategory(cat.value)
                          setSelectedIndex(null)
                        }}
                        className={`px-3 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors duration-150 ${
                          activeCategory === cat.value
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid */}
                  <div className="p-3 pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {filtered.map((item, i) => (
                        <GalleryThumbnail
                          key={`${activeCategory}-${i}`}
                          item={item}
                          index={i}
                          onClick={handleSelect}
                        />
                      ))}
                    </div>
                    {filtered.length === 0 && (
                      <p className="text-center text-[13px] text-muted-foreground py-12">No items in this category.</p>
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
  const isLiveSite = item.category === "live-sites"
  
  return (
    <button
      onClick={() => onClick(index)}
      className="w-full aspect-square overflow-hidden rounded-xl group relative bg-muted/40"
    >
      <img
        src={item.url}
        alt={item.label}
        className="w-full h-full object-cover transition-all duration-150 group-hover:scale-[1.02]"
        loading="lazy"
      />
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#191919]/80 to-transparent px-3 pb-2.5 pt-10 ${isLiveSite ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-150`}>
        <div className="flex items-center gap-1.5">
          {isLiveSite && <Globe className="w-3 h-3 text-white/80" />}
          <p className="text-[13px] text-white font-medium">{item.label}</p>
        </div>
        {isLiveSite && (
          <p className="text-[10px] text-white/60 mt-0.5">Live Site</p>
        )}
      </div>
    </button>
  )
}
