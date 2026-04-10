"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, Send } from "lucide-react"

interface TextJonDrawerProps {
  isOpen: boolean
  onClose: () => void
  conversationContext?: string // Summary of what they've been chatting about
}

const QUICK_CONTEXTS = [
  { label: "Quick question before I buy", message: "Hey Jon - was just on your site. Quick question before I pull the trigger:" },
  { label: "I want you to build it for me", message: "Hey Jon - I'd rather just pay you to build it. Can we talk about what that would look like?" },
  { label: "Not sure which option is right", message: "Hey Jon - I'm interested but not sure if I need the $497 or something more custom. Can you help me figure it out?" },
  { label: "I have a bigger project", message: "Hey Jon - I've got a more complex project. Might be consulting territory. Got a few min to chat?" },
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-neutral-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#007AFF]/20">
                  <img src="/images/jon-profile.png" alt="Jon" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Text Jon</h3>
                  <p className="text-sm text-neutral-500">Usually replies within an hour</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* iMessage-style preview */}
            <div className="px-5 pb-4">
              <div className="bg-[#f2f2f7] rounded-2xl p-4">
                <div className="flex items-start gap-2 mb-3">
                  <MessageCircle className="w-4 h-4 text-[#007AFF] mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] text-neutral-600">
                    Your message will open in iMessage. Jon reads and responds to every text personally.
                  </p>
                </div>
                {conversationContext && (
                  <div className="mt-2 pt-2 border-t border-neutral-200">
                    <p className="text-[11px] text-neutral-400 uppercase tracking-wide mb-1">From your conversation</p>
                    <p className="text-[13px] text-neutral-600 italic">{conversationContext}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick message options */}
            <div className="px-5 pb-3">
              <p className="text-[12px] text-neutral-400 uppercase tracking-wide mb-3">Quick messages</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_CONTEXTS.map((ctx, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(ctx.message)}
                    className="px-4 py-2.5 rounded-full bg-neutral-100 text-[14px] text-neutral-700 font-medium hover:bg-neutral-200 active:scale-[0.98] transition-all"
                  >
                    {ctx.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom message input */}
            <div className="px-5 pt-3 pb-8 border-t border-neutral-100">
              <p className="text-[12px] text-neutral-400 uppercase tracking-wide mb-3">Or write your own</p>
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Hey Jon, I was wondering..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-100 text-[15px] text-neutral-900 placeholder:text-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                  />
                </div>
                <button
                  onClick={handleCustomSend}
                  disabled={!customMessage.trim()}
                  className="p-3 rounded-full bg-[#007AFF] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#0077ed] active:scale-[0.95] transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
