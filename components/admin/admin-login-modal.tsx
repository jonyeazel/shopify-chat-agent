"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, ArrowRight, Check, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  siteId: number
  onSuccess: () => void
  isFullscreen?: boolean
}

export function AdminLoginModal({ isOpen, onClose, siteId, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, isOpen)

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
        <motion.div
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

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
              {/* Content */}
              <div className="px-6 py-6">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
