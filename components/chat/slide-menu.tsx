"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

interface MenuItem {
  icon: LucideIcon
  label: string
  description: string
  action: () => void
}

interface SlideMenuProps {
  isOpen: boolean
  onClose: () => void
  items: MenuItem[]
  isFullscreen?: boolean
}

export function SlideMenu({ isOpen, onClose, items }: SlideMenuProps) {
  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, isOpen)

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="drawer-container"
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

            {/* Stats */}
            <div className="px-4 pt-1 pb-4 flex-shrink-0">
              <div className="flex items-center justify-center gap-2 text-[11px]">
                {siteConfig.stats.map((stat, i) => (
                  <span key={stat.label} className="flex items-center gap-1">
                    <span className="text-foreground font-medium">{stat.value}</span>
                    <span className="text-muted-foreground">{stat.label}</span>
                    {i < siteConfig.stats.length - 1 && (
                      <span className="ml-1.5 text-muted-foreground/30">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
              {/* Menu items */}
              <div className="px-4 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {items.map((item, i) => {
                    const isPrimary = i === 0

                    return (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                          delay: 0.06 + i * 0.03,
                        }}
                        onClick={item.action}
                        className={`flex flex-col items-start px-4 py-3 rounded-lg text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          isPrimary
                            ? "bg-foreground focus-visible:ring-background"
                            : "bg-muted/40 active:bg-muted/60"
                        }`}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon
                            className={`w-4 h-4 flex-shrink-0 ${
                              isPrimary ? "text-background" : "text-foreground/50"
                            }`}
                            strokeWidth={1.5}
                          />
                          <span
                            className={`font-medium text-[13px] leading-tight ${
                              isPrimary ? "text-background" : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {item.description && (
                          <span
                            className={`text-[11px] leading-tight mt-1 pl-[26px] ${
                              isPrimary ? "text-background/50" : "text-muted-foreground"
                            }`}
                          >
                            {item.description}
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-4 border-t border-foreground/[0.06]">
                <div className="flex flex-col items-center gap-2">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <a
                    href={siteConfig.contact.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-foreground font-medium hover:opacity-80 transition-opacity duration-150"
                  >
                    Book a Call
                  </a>
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{siteConfig.brand.domain}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
