"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const VIDEO_ID = "i9na_W31rLg"
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`

export function VideoDrawer({ isOpen, onClose }: VideoDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80"
          />

          {/* Modal */}
          <motion.div
            key="video-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-lg bg-card rounded-[20px] shadow-2xl overflow-hidden border border-border">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">v0 University</span>
                  <span className="text-xs text-muted-foreground">· 0:57</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-8 w-8 rounded-full"
                  >
                    <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Video */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="v0 University Video"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Footer */}
              <div className="px-4 py-4 bg-card">
                <p className="text-sm font-medium text-foreground">
                  Build your first website with AI
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  57 seconds. No experience needed.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
