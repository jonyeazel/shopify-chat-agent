"use client"

import { useCallback, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckout } from "@/app/actions/stripe"
import { V0_UNIVERSITY } from "@/lib/products"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CheckoutDrawer({ isOpen, onClose, onSuccess }: CheckoutDrawerProps) {
  const [status, setStatus] = useState<"loading" | "checkout" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setStatus("loading")
      setError(null)
    }
  }, [isOpen])

  const fetchClientSecret = useCallback(async () => {
    try {
      const clientSecret = await startCheckout(V0_UNIVERSITY.id)
      setStatus("checkout")
      return clientSecret
    } catch (err) {
      setError("Failed to initialize checkout. Please try again.")
      setStatus("error")
      throw err
    }
  }, [])

  const handleComplete = () => {
    setStatus("success")
    onSuccess?.()
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const price = (V0_UNIVERSITY.priceInCents / 100).toFixed(0)

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
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-neutral-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
                {V0_UNIVERSITY.thumbnail && (
                  <img 
                    src={V0_UNIVERSITY.thumbnail} 
                    alt={V0_UNIVERSITY.name}
                    className="w-16 h-10 object-cover rounded-md"
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
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "75vh" }}>
                <CheckoutContent
                  status={status}
                  error={error}
                  fetchClientSecret={fetchClientSecret}
                  handleComplete={handleComplete}
                  onRetry={() => { setStatus("loading"); setError(null) }}
                />
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
              {/* Header */}
              <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-100">
                {V0_UNIVERSITY.thumbnail && (
                  <img 
                    src={V0_UNIVERSITY.thumbnail} 
                    alt={V0_UNIVERSITY.name}
                    className="w-20 h-12 object-cover rounded-lg"
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
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <CheckoutContent
                  status={status}
                  error={error}
                  fetchClientSecret={fetchClientSecret}
                  handleComplete={handleComplete}
                  onRetry={() => { setStatus("loading"); setError(null) }}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CheckoutContent({
  status,
  error,
  fetchClientSecret,
  handleComplete,
  onRetry,
}: {
  status: "loading" | "checkout" | "success" | "error"
  error: string | null
  fetchClientSecret: () => Promise<string | null>
  handleComplete: () => void
  onRetry: () => void
}) {
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Something went wrong</h3>
        <p className="text-neutral-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  if (status === "success") {
    return (
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
    )
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400 mb-4" />
        <p className="text-sm text-neutral-500">Loading checkout...</p>
      </div>
    )
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret,
        onComplete: handleComplete,
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
