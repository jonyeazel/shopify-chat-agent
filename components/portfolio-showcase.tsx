"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, ExternalLink, Smartphone } from "lucide-react"

interface PortfolioShowcaseProps {
  sites: { name: string; url: string; thumbnail?: string }[]
  onClose: () => void
}

export function PortfolioShowcase({ sites, onClose }: PortfolioShowcaseProps) {
  const [selectedSite, setSelectedSite] = useState<(typeof sites)[0] | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:hidden"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-background rounded-t-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold">My Work</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!selectedSite ? (
            <div className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground text-center mb-4">View on desktop for full experience</p>
              {sites.map((site, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSite(site)}
                  className="w-full p-4 rounded-xl border border-border hover:border-foreground/30 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{site.name}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <button onClick={() => setSelectedSite(null)} className="text-sm text-muted-foreground">
                  ← Back
                </button>
                <span className="text-sm font-medium">{selectedSite.name}</span>
                <a
                  href={selectedSite.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Open
                </a>
              </div>
              <div className="flex-1 bg-white">
                <iframe
                  src={selectedSite.url}
                  className="w-full h-full min-h-[500px]"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
