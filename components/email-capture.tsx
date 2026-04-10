"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Gift, Check, Loader2 } from "lucide-react"

interface EmailCaptureProps {
  isOpen: boolean
  onClose: () => void
}

export function EmailCapture({ isOpen, onClose }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email")
      setStatus("error")
      return
    }

    setStatus("loading")
    
    try {
      // Store email - in production, connect to your email service
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      if (!res.ok) throw new Error("Failed to subscribe")
      
      setStatus("success")
      // Auto-close after success
      setTimeout(() => {
        onClose()
        setStatus("idle")
        setEmail("")
      }, 2500)
    } catch {
      setStatus("error")
      setErrorMsg("Something went wrong. Try again.")
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
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4 z-50"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              {status === "success" ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Check your inbox</h3>
                  <p className="text-sm text-neutral-500">The free prompt template is on its way.</p>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#635BFF]/10 flex items-center justify-center mb-4">
                    <Gift className="w-6 h-6 text-[#635BFF]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Get the free seed prompt</h3>
                  <p className="text-sm text-neutral-500 mb-5">
                    The exact 36-word template Jon uses to start every build. Enter your email and it&apos;s yours.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 outline-none transition-all text-sm"
                      disabled={status === "loading"}
                    />
                    
                    {status === "error" && (
                      <p className="text-xs text-red-500">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 bg-[#635BFF] text-white font-medium rounded-xl hover:bg-[#5851ea] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {status === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send me the template"
                      )}
                    </button>
                  </form>

                  <p className="text-[11px] text-neutral-400 text-center mt-4">
                    No spam. Just the template.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
