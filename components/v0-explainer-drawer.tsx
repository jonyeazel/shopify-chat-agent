"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface V0ExplainerDrawerProps {
  isOpen: boolean
  onClose: () => void
  onBuyClick?: () => void
}

export function V0ExplainerDrawer({ isOpen, onClose, onBuyClick }: V0ExplainerDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[85vh] bg-background rounded-t-[20px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
              <span className="text-sm font-medium text-foreground">About</span>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero */}
              <div className="px-5 pt-8 pb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-foreground flex items-center justify-center">
                  <img src="/v0-logo-light.png" alt="v0" className="w-9 h-9" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  v0 University
                </h1>
                <p className="text-muted-foreground">
                  Prompt engineering for websites
                </p>
              </div>

              {/* The Promise - Visual */}
              <div className="px-5 py-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Before</p>
                    <p className="text-lg font-semibold text-foreground">$5-50k</p>
                    <p className="text-[13px] text-muted-foreground">4-12 weeks</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                    <p className="text-[11px] text-primary uppercase tracking-wide mb-1">After</p>
                    <p className="text-lg font-semibold text-foreground">$497</p>
                    <p className="text-[13px] text-muted-foreground">One afternoon</p>
                  </div>
                </div>
              </div>

              {/* What You Learn */}
              <div className="px-5 py-6 border-t border-border">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-4">What you learn</p>
                <div className="space-y-3">
                  {[
                    { title: "The Cook Method", desc: "Short prompts that build complete sites" },
                    { title: "Intent Seeds", desc: "The 10-20 word prompts that work" },
                    { title: "Iteration", desc: "Fix anything with plain English" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[12px] font-medium flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-foreground">{item.title}</p>
                        <p className="text-[13px] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Proof */}
              <div className="px-5 py-6 border-t border-border bg-muted/30">
                <div className="flex items-center gap-4">
                  <img 
                    src="/jon-avatar.jpg" 
                    alt="Jon" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[14px] font-medium text-foreground">Jon Yeazel</p>
                    <p className="text-[13px] text-muted-foreground">25,000+ v0 generations</p>
                  </div>
                </div>
                <a
                  href="https://v0.app/@yeazel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:bg-muted/50 transition-colors"
                >
                  <span className="text-[13px] font-medium text-foreground">See the work</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>

              {/* Costs - Clean */}
              <div className="px-5 py-6 border-t border-border">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-4">Costs</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[14px] text-foreground">v0 Tutor (course)</span>
                    <span className="text-[14px] font-medium text-foreground">$497 once</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-[14px] text-foreground">v0 by Vercel</span>
                    <span className="text-[14px] text-muted-foreground">$20/mo (free tier available)</span>
                  </div>
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  I teach the skill. v0 is the tool.
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 py-6 border-t border-border">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    onClose()
                    onBuyClick?.()
                  }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button
                  onClick={onClose}
                  className="w-full mt-3 py-2 text-[14px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to chat
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
