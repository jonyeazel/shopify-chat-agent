"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckout } from "@/app/actions/stripe"
import { V0_UNIVERSITY } from "@/lib/products"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Separate component for the Stripe embed to isolate lifecycle
function StripeCheckoutEmbed({ 
  clientSecret, 
  onComplete 
}: { 
  clientSecret: string
  onComplete: () => void 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const checkoutRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    async function initCheckout() {
      if (!containerRef.current || checkoutRef.current) return
      
      const stripe = await stripePromise
      if (!stripe || !mounted) return

      try {
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret,
        })

        if (!mounted) {
          checkout.destroy()
          return
        }

        checkoutRef.current = checkout
        checkout.mount(containerRef.current)

        // Poll for completion (Stripe embedded checkout doesn't have a reliable callback in this mode)
        // The session will redirect or we can check status
      } catch (err) {
        console.error("Failed to mount checkout:", err)
      }
    }

    initCheckout()

    return () => {
      mounted = false
      if (checkoutRef.current) {
        try {
          checkoutRef.current.destroy()
        } catch (e) {
          // Ignore destroy errors
        }
        checkoutRef.current = null
      }
    }
  }, [clientSecret])

  return <div ref={containerRef} className="min-h-[400px]" />
}

export function CheckoutDrawer({ isOpen, onClose, onSuccess }: CheckoutDrawerProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "checkout" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const sessionKey = useRef(0)

  const fetchClientSecret = useCallback(async () => {
    setStatus("loading")
    setError(null)
    
    try {
      const secret = await startCheckout(V0_UNIVERSITY.id)
      if (secret) {
        setClientSecret(secret)
        setStatus("checkout")
      } else {
        setError("Failed to initialize checkout.")
        setStatus("error")
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Failed to initialize checkout. Please try again.")
      setStatus("error")
    }
  }, [])

  useEffect(() => {
    if (isOpen && status === "idle") {
      fetchClientSecret()
    }
    
    if (!isOpen && status !== "idle") {
      // Full reset when drawer closes
      sessionKey.current += 1
      setStatus("idle")
      setClientSecret(null)
      setError(null)
    }
  }, [isOpen, status, fetchClientSecret])

  const handleComplete = useCallback(() => {
    setStatus("success")
    onSuccess?.()
    setTimeout(() => {
      onClose()
    }, 3000)
  }, [onSuccess, onClose])

  const handleRetry = useCallback(() => {
    sessionKey.current += 1
    setClientSecret(null)
    fetchClientSecret()
  }, [fetchClientSecret])

  const price = (V0_UNIVERSITY.priceInCents / 100).toFixed(0)

  // Don't render anything if not open (prevents stale Stripe instances)
  if (!isOpen) return null

  const headerContent = (
    <>
      {V0_UNIVERSITY.thumbnail && (
        <img 
          src={V0_UNIVERSITY.thumbnail} 
          alt={V0_UNIVERSITY.name}
          className="w-16 h-10 md:w-20 md:h-12 object-cover rounded-md md:rounded-lg"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-neutral-900">{V0_UNIVERSITY.name}</p>
        <p className="text-sm text-neutral-500">${price} · Instant access</p>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 active:bg-neutral-300 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-neutral-600" />
      </button>
    </>
  )

  const checkoutContent = (
    <div key={sessionKey.current}>
      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Something went wrong</h3>
          <p className="text-neutral-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4"
          >
            <Check className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">You're in!</h3>
          <p className="text-neutral-500 text-center">Check your email for access to the video and templates.</p>
        </div>
      )}

      {(status === "loading" || status === "idle") && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
          <p className="text-sm text-neutral-500">Loading checkout...</p>
        </div>
      )}

      {status === "checkout" && clientSecret && (
        <StripeCheckoutEmbed 
          key={sessionKey.current}
          clientSecret={clientSecret} 
          onComplete={handleComplete} 
        />
      )}
    </div>
  )

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />

      {/* Mobile: slide up from bottom */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      >
        <div className="bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
            {headerContent}
          </div>
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "75vh" }}>
            {checkoutContent}
          </div>
        </div>
      </motion.div>

      {/* Desktop: slide in from right */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-[480px] z-50 hidden md:block"
      >
        <div className="h-full bg-white shadow-2xl flex flex-col">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-100">
            {headerContent}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutContent}
          </div>
        </div>
      </motion.div>
    </>
  )
}
