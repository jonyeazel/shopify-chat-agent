"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { siteConfig } from "@/lib/site-config"

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
  const transition = { type: "tween" as const, duration: 0.25, ease: [0.32, 0.72, 0, 1] }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={onClose}
            className="absolute inset-0 bg-foreground/15 backdrop-blur-sm z-50"
          />
          <motion.div
            key="menu"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={transition}
            className="absolute bottom-0 left-0 right-0 bg-card border-t border-border z-50 flex flex-col overflow-hidden rounded-t-xl"
            style={{ maxHeight: "85vh" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header with close */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border flex-shrink-0">
              <p className="text-[12px] text-muted-foreground">
                {siteConfig.stats.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 && " · "}
                    <span className="font-semibold text-foreground/80">{s.value}</span>{" "}{s.label}
                  </span>
                ))}
              </p>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/40 transition-colors duration-150"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 px-4 pt-3 pb-3 overflow-y-auto scrollbar-hide">
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
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isPrimary
                          ? "bg-foreground focus-visible:ring-background"
                          : "bg-muted/40 active:bg-muted/60"
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      <item.icon
                        className={`w-[18px] h-[18px] flex-shrink-0 ${
                          isPrimary ? "text-background" : "text-foreground/60"
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
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="px-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-2 flex-shrink-0">
              <p className="text-[10px] text-muted-foreground text-center">{siteConfig.brand.domain}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
