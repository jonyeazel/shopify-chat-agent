"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Smartphone, Monitor } from "lucide-react"
import { PORTFOLIO_DATA } from "@/lib/portfolio-data"
import { VibeFrame } from "@/components/ui/vibe-frame"
import { useState, useCallback, useEffect } from "react"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

type DrawerType = "portfolio" | "photos" | "pricing" | "sites" | null

interface InstantContentDrawerProps {
  type: DrawerType
  onClose: () => void
  isFullscreen?: boolean
  onAskAbout?: (prompt: string) => void
}

export function InstantContentDrawer({ type, onClose, onAskAbout }: InstantContentDrawerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState(0)
  const [viewDevice, setViewDevice] = useState<"mobile" | "desktop">("mobile")
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const check = () => setIsMobileViewport(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleAskAbout = (prompt: string) => {
    onAskAbout?.(prompt)
    close()
  }

  const handleSiteChange = useCallback((index: number) => {
    if (index === selectedSiteIndex) return
    setSlideDirection(index > selectedSiteIndex ? 1 : -1)
    setSelectedSiteIndex(index)
  }, [selectedSiteIndex])

  const navigateSite = useCallback((direction: 1 | -1) => {
    const next = selectedSiteIndex + direction
    if (next >= 0 && next < PORTFOLIO_DATA.liveSites.length) {
      setSlideDirection(direction)
      setSelectedSiteIndex(next)
    }
  }, [selectedSiteIndex])

  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, !!type)

  if (!type) return null

  const liveSites = PORTFOLIO_DATA.liveSites
  const selectedSite = liveSites[selectedSiteIndex]

  // Iframe browser layout for portfolio / sites
  if (type === "portfolio" || type === "sites") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-50"
        >
          <div
            className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ease-out ${isClosing ? "opacity-0" : ""}`}
            onClick={close}
          />

          <motion.div
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
            className="absolute bottom-[2px] left-[2px] right-[2px] bg-card rounded-[20px] overflow-hidden flex flex-col"
            style={{ height: "85vh", maxHeight: "100%" }}
          >
            {/* Drag handle */}
            <div
              onPointerDown={startDrag}
              className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 pb-2">
              <a
                href={selectedSite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1"
              >
                {selectedSite.name}
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex items-center gap-2">
                {/* Device toggle — desktop only */}
                <div className="hidden md:flex items-center bg-muted rounded-full p-0.5 gap-0.5">
                  <button
                    onClick={() => setViewDevice("mobile")}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150 ${
                      viewDevice === "mobile" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewDevice("desktop")}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-150 ${
                      viewDevice === "desktop" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={close}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Site preview — fills remaining height */}
            {isMobileViewport ? (
              <motion.div
                className="flex-1 min-h-0 overflow-hidden"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_e, info) => {
                  if (Math.abs(info.offset.x) > 60) {
                    navigateSite(info.offset.x > 0 ? -1 : 1)
                  }
                }}
              >
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={selectedSite.url}
                    custom={slideDirection}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={{
                      enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="w-full h-full"
                  >
                    <iframe
                      src={selectedSite.url}
                      title={selectedSite.name}
                      className="w-full h-full border-0 bg-white"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="flex-1 flex items-center justify-center overflow-hidden px-3"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_e, info) => {
                  if (Math.abs(info.offset.x) > 60) {
                    navigateSite(info.offset.x > 0 ? -1 : 1)
                  }
                }}
              >
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={selectedSite.url}
                    custom={slideDirection}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={{
                      enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
                    }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <VibeFrame
                      url={selectedSite.url}
                      placeholder={selectedSite.name}
                      device={viewDevice}
                      interactive
                      fillHeight
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {/* Site selector */}
            <div className="flex-shrink-0 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 px-4 w-max min-w-full justify-center">
                {liveSites.map((site, i) => (
                  <button
                    key={site.name}
                    onClick={() => handleSiteChange(i)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] transition-colors duration-150 ${
                      selectedSiteIndex === i
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {site.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  const drawerConfig = {
    photos: {
      title: "Product Shots",
      content: (
        <>
          <p className="text-[13px] text-muted-foreground mb-4">Full 8-shot set included with every build</p>
          <div className="grid grid-cols-2 gap-3">
            {PORTFOLIO_DATA.productShots.map((img, i) => {
              const imgUrl = typeof img === "string" ? img : img.url
              const imgLabel = typeof img === "string" ? "" : img.label
              return (
                <motion.button
                  key={i}
                  onClick={() => setSelectedImage(imgUrl)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border hover:border-primary/50 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={imgUrl || "/placeholder.svg"}
                    alt={imgLabel || `Product shot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {imgLabel && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
                      <p className="text-[13px] font-medium text-white">{imgLabel}</p>
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <motion.img
                  src={selectedImage}
                  alt="Enlarged product shot"
                  className="max-w-full max-h-full object-contain rounded-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ),
    },
    pricing: {
      title: "Pricing",
      content: (
        <div className="space-y-1.5 pb-4">
          {Object.values(PORTFOLIO_DATA.pricing).map((item: any, i) => (
            <motion.button 
              key={i} 
              onClick={() => handleAskAbout(item.chatPrompt || `Tell me more about ${item.name}`)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.025 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full px-4 py-3 rounded-lg text-left transition-colors duration-150 ${
                item.popular 
                  ? "bg-foreground text-background" 
                  : "bg-muted/40 hover:bg-muted/60"
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <span className={`font-medium text-[13px] ${item.popular ? "text-background" : "text-foreground"}`}>
                    {item.name}
                  </span>
                  <p className={`text-[11px] mt-0.5 ${item.popular ? "text-background/60" : "text-muted-foreground"}`}>
                    {item.description}
                  </p>
                </div>
                <span className={`text-[13px] font-semibold flex-shrink-0 ${item.popular ? "text-background" : "text-foreground"}`}>
                  {item.price}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      ),
    },
  }

  const config = drawerConfig[type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0 } }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 z-50"
      >
        <div
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ease-out ${isClosing ? "opacity-0" : ""}`}
          onClick={close}
        />

        <motion.div
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
          className="absolute bottom-[2px] left-[2px] right-[2px] bg-card rounded-[20px] overflow-hidden flex flex-col"
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

          {/* Scroll container */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <span className="text-[13px] font-medium text-foreground">{config.title}</span>
              <button
                onClick={close}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors duration-150"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">{config.content}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export type { DrawerType }
