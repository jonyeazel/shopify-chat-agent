"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, ArrowRight, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  siteId: number
  onSuccess: () => void
  isFullscreen?: boolean
}

export function AdminLoginModal({ isOpen, onClose, siteId, onSuccess, isFullscreen = false }: AdminLoginModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, siteId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send login link")
        setLoading(false)
        return
      }

      setSent(true)
      setLoading(false)

      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-50 overflow-hidden pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm pointer-events-auto ${isFullscreen ? "" : "sm:rounded-xl"}`}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className={`absolute inset-x-0 bottom-0 bg-card border-t border-border pointer-events-auto rounded-t-xl`}
            style={{ willChange: "transform" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg text-foreground">Admin Access</h2>
                <p className="text-xs text-muted-foreground">Site #{siteId}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto overscroll-contain">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg text-foreground mb-2">Check your email</h3>
                  <p className="text-sm text-muted-foreground">We sent a login link to</p>
                  <p className="text-sm font-medium text-foreground">{email}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the email associated with this site to access the admin panel.
                  </p>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-12 h-12 text-base rounded-xl"
                      required
                      autoFocus
                    />
                  </div>

                  {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary/90"
                    disabled={loading || !email}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Send Login Link
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    Only the registered site owner can access this panel.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
