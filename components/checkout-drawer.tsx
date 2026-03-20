"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Clock, Shield, ArrowRight, Check, Loader2 } from "lucide-react"
import { V0_UNIVERSITY } from "@/lib/products"
import { startCheckout } from "@/app/actions/stripe"
import Image from "next/image"

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

// Use thumbnail as the image source with fallback
const PRODUCT_IMAGE = "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg"

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
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const benefits = [
    { icon: Zap, text: "Instant access" },
    { icon: Clock, text: "57 sec lesson" },
    { icon: Shield, text: "Lifetime access" },
  ]

  const features = [
    "Complete v0 workflow tutorial",
    "Real project examples",
    "Prompting techniques",
    "Best practices guide",
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Mobile: Bottom sheet */}
          <motion.div
            key="checkout-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-x-0 bottom-0 z-50 md:hidden max-h-[90vh] overflow-hidden"
          >
            <div className="bg-white rounded-t-3xl shadow-2xl">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-neutral-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={PRODUCT_IMAGE}
                      alt={V0_UNIVERSITY.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">{V0_UNIVERSITY.name}</h2>
                    <p className="text-2xl font-bold text-neutral-900">${price}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Benefits */}
              <div className="flex gap-2 px-5 pb-4">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 rounded-full">
                    <benefit.icon className="w-3.5 h-3.5 text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* v0 Referral */}
              <div className="px-5 pb-4">
                <a
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src="/v0-logo-light.png" alt="v0" width={24} height={24} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Get $10 free on v0</p>
                    <p className="text-xs text-neutral-400">Sign up with this link</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </a>
              </div>

              {/* Error */}
              {error && (
                <div className="mx-5 mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              {/* CTA */}
              <div className="px-5 pb-6">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Get Instant Access - ${price}</>
                  )}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </motion.div>

          {/* Desktop: Side panel */}
          <motion.div
            key="checkout-desktop"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md hidden md:block"
          >
            <div className="h-full bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <h2 className="text-xl font-semibold text-neutral-900">Checkout</h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Product */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={PRODUCT_IMAGE}
                      alt={V0_UNIVERSITY.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{V0_UNIVERSITY.name}</h3>
                    <p className="text-sm text-neutral-500">{V0_UNIVERSITY.description}</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">${price}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg">
                      <benefit.icon className="w-4 h-4 text-neutral-600" />
                      <span className="text-sm font-medium text-neutral-700">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-neutral-900 mb-3">What&apos;s included</h4>
                  <div className="space-y-2">
                    {features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-neutral-900" />
                        <span className="text-sm text-neutral-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* v0 Referral */}
                <a
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-neutral-900 rounded-xl mb-6 hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image src="/v0-logo-light.png" alt="v0" width={28} height={28} className="object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] text-white font-medium">Get $10 free credits on v0</p>
                    <p className="text-sm text-neutral-400">Sign up with this link to start building</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                </a>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-neutral-100">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Get Instant Access - ${price}</>
                  )}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
