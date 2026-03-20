"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Loader2, CreditCard } from "lucide-react"
import { V0_UNIVERSITY } from "@/lib/products"
import { startCheckout } from "@/app/actions/stripe"

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CheckoutDrawer({ isOpen, onClose }: CheckoutDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const price = (V0_UNIVERSITY.priceInCents / 100).toFixed(0)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const checkoutUrl = await startCheckout(V0_UNIVERSITY.id)
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        setError("Failed to create checkout session")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Mobile: Bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      >
        <div className="bg-white rounded-t-2xl shadow-2xl overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-neutral-200" />
          </div>

          {/* Content */}
          <div className="px-5 pb-8 pt-2">
            {/* Product info */}
            <div className="flex items-center gap-4 mb-6">
              {V0_UNIVERSITY.thumbnail && (
                <img 
                  src={V0_UNIVERSITY.thumbnail} 
                  alt={V0_UNIVERSITY.name}
                  className="w-20 h-12 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold text-neutral-900">{V0_UNIVERSITY.name}</p>
                <p className="text-sm text-neutral-500">${price} · Instant access</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-neutral-900 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Continue to Payment
                </>
              )}
            </button>

            <p className="text-xs text-neutral-400 text-center mt-4">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </motion.div>

      {/* Desktop: Side panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md hidden md:block"
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
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">{V0_UNIVERSITY.name}</p>
              <p className="text-sm text-neutral-500">${price} · Instant access</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm">
              {/* What you get */}
              <div className="mb-6">
                <h3 className="font-medium text-neutral-900 mb-3">What you get:</h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    57-second video lesson
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    Smart templates that do the heavy lifting
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    Lifetime access to everything
                  </li>
                </ul>
              </div>

              {/* Free credits callout */}
              <a 
                href="https://v0.link/jon"
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-6 p-3 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-colors"
              >
                <p className="text-sm text-emerald-800 font-medium">
                  Get $10 free to start building
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Use this link when you sign up for v0 →
                </p>
              </a>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full py-4 bg-neutral-900 text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continue to Payment
                  </>
                )}
              </button>

              <p className="text-xs text-neutral-400 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
