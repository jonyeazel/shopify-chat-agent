"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TextJonDrawerProps {
  isOpen: boolean
  onClose: () => void
  conversationContext?: string
}

const QUICK_CONTEXTS = [
  { label: "Quick question", message: "Hey Jon - on your site rn. Quick q:" },
  { label: "Build it for me", message: "Hey - would rather just pay you to build it. What would that look like?" },
  { label: "Which option?", message: "Hey - not sure if I need the $497 or something more custom. Help?" },
  { label: "Bigger project", message: "Hey Jon - got a complex one. Might be consulting territory." },
]

export function TextJonDrawer({ isOpen, onClose, conversationContext }: TextJonDrawerProps) {
  const [customMessage, setCustomMessage] = useState("")
  const phoneNumber = "+14078677201"

  const handleSend = (message: string) => {
    const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
    window.location.href = smsUrl
    onClose()
  }

  const handleCustomSend = () => {
    if (customMessage.trim()) {
      handleSend(customMessage)
    }
  }

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
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-[20px] shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                  <img src="/images/jon-profile.png" alt="Jon" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Text Jon</h3>
                  <p className="text-sm text-muted-foreground">Usually replies within an hour</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* iMessage preview */}
            <div className="px-5 py-4">
              <div className="bg-muted rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-muted-foreground">
                    Your message will open in iMessage. Jon reads and responds to every text personally.
                  </p>
                </div>
                {conversationContext && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">From your conversation</p>
                    <p className="text-[13px] text-muted-foreground italic">{conversationContext}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick messages */}
            <div className="px-5 pb-3">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-3">Quick messages</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_CONTEXTS.map((ctx, i) => (
                  <Button
                    key={i}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSend(ctx.message)}
                    className="rounded-full"
                  >
                    {ctx.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom message */}
            <div className="px-5 pt-3 pb-8 border-t border-border">
              <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-3">Or write your own</p>
              <div className="flex items-end gap-2">
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Hey Jon, I was wondering..."
                  rows={2}
                  className="flex-1 resize-none rounded-2xl"
                />
                <Button
                  onClick={handleCustomSend}
                  disabled={!customMessage.trim()}
                  size="icon"
                  className="rounded-full h-10 w-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
