"use client"

import { motion } from "framer-motion"
import { X, ExternalLink } from "lucide-react"

interface VideoDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const VIDEO_ID = "i9na_W31rLg"
const VIDEO_URL = `https://youtu.be/${VIDEO_ID}`

export function VideoDrawer({ isOpen, onClose }: VideoDrawerProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      />

      {/* Mobile: Centered video modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-4 z-50 flex items-center justify-center"
      >
        <div className="w-full max-w-lg bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">v0 University</span>
              <span className="text-xs text-white/50">· 0:57</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Video embed */}
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
          <div className="px-4 py-4 bg-neutral-900">
            <p className="text-sm font-medium text-white">
              Build your first website with AI
            </p>
            <p className="text-xs text-white/50 mt-1">
              57 seconds. No experience needed.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  )
}
