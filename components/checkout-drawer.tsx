"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Loader2, Zap, Clock, Shield, ArrowRight } from "lucide-react"
import { V0_UNIVERSITY } from "@/lib/products"
import { startCheckout } from "@/app/actions/stripe"

// v0 logo SVG for branding
function V0Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 20" fill="currentColor" className={className}>
      <path d="M12.64 3.6L7.52 16.4H4.72L0 3.6h2.88l3.28 10.08L9.44 3.6h3.2z"/>
      <path d="M22.72 10c0 3.92-2.96 6.64-6.8 6.64-3.84 0-6.8-2.72-6.8-6.64s2.96-6.64 6.8-6.64c3.84 0 6.8 2.72 6.8 6.64zm-10.72 0c0 2.48 1.6 4.24 3.92 4.24 2.32 0 3.92-1.76 3.92-4.24s-1.6-4.24-3.92-4.24c-2.32 0-3.92 1.76-3.92 4.24z"/>
    </svg>
  )
}

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
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-neutral-200" />
          </div>

          {/* Content */}
          <div className="px-5 pb-8 pt-2">
            {/* Header with close */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">Complete Your Purchase</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Product card - fixed aspect ratio */}
            <div className="bg-neutral-50 rounded-2xl p-4 mb-5">
              <div className="flex gap-4">
                {V0_UNIVERSITY.thumbnail && (
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
                    <img 
                      src={V0_UNIVERSITY.thumbnail} 
                      alt={V0_UNIVERSITY.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900">{V0_UNIVERSITY.name}</p>
                  <p className="text-2xl font-bold text-neutral-900 mt-1">${price}</p>
                </div>
              </div>
            </div>

            {/* Quick benefits - CRO */}
            <div className="flex items-center justify-between mb-5 text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>57 sec lesson</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lifetime access</span>
              </div>
            </div>

            {/* Branded v0 referral link */}
            <a 
              href="https://v0.link/jon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-5 p-3 bg-neutral-900 rounded-xl active:bg-neutral-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <V0Logo className="w-5 h-2.5 text-neutral-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">Get $10 free on v0</p>
                <p className="text-xs text-neutral-400">Sign up with this link</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
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
              className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Get Instant Access - ${price}
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
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            {/* Product card - fixed aspect ratio */}
            <div className="bg-neutral-50 rounded-2xl p-5 mb-6">
              <div className="flex gap-4">
                {V0_UNIVERSITY.thumbnail && (
                  <div className="w-28 h-20 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
                    <img 
                      src={V0_UNIVERSITY.thumbnail} 
                      alt={V0_UNIVERSITY.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-neutral-900 text-lg">{V0_UNIVERSITY.name}</p>
                  <p className="text-3xl font-bold text-neutral-900 mt-1">${price}</p>
                  <p className="text-sm text-neutral-500 mt-1">One-time payment</p>
                </div>
              </div>
            </div>

            {/* What you get - CRO */}
            <div className="mb-6">
              <h3 className="font-medium text-neutral-900 mb-4">What's included:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">57-second video lesson</p>
                    <p className="text-xs text-neutral-500">Learn the core technique fast</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Smart templates included</p>
                    <p className="text-xs text-neutral-500">Skip the setup, start building</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Lifetime access</p>
                    <p className="text-xs text-neutral-500">All future updates included</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Branded v0 referral link */}
            <a 
              href="https://v0.link/jon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-6 p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <V0Logo className="w-6 h-3 text-neutral-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">Get $10 free credits on v0</p>
                <p className="text-xs text-neutral-400">Use this link when you sign up</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0" />
            </a>

            <div className="mt-auto">
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
                className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Get Instant Access - ${price}
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
