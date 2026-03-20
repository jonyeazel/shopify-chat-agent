"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Clock, Shield, ArrowRight, Check } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { V0_UNIVERSITY } from "@/lib/products"
import { startEmbeddedCheckout } from "@/app/actions/stripe"
import Image from "next/image"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CheckoutDrawer({ isOpen, onClose }: CheckoutDrawerProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const price = (V0_UNIVERSITY.priceInCents / 100).toFixed(0)

  const fetchClientSecret = useCallback(
    () => startEmbeddedCheckout(V0_UNIVERSITY.id),
    []
  )

  const handleProceed = () => {
    setShowCheckout(true)
  }

  const handleClose = () => {
    setShowCheckout(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Mobile: Bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:hidden max-h-[95vh] overflow-hidden"
      >
        <div className="bg-white rounded-t-[20px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          {/* Drag handle */}
          <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
            <div className="w-9 h-1 rounded-full bg-neutral-300" />
          </div>

          <AnimatePresence mode="wait">
            {!showCheckout ? (
              <motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-5 pb-8 pt-2 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-neutral-900">Get Instant Access</h2>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                {/* Product */}
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl mb-5">
                  {V0_UNIVERSITY.thumbnail && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
                      <img 
                        src={V0_UNIVERSITY.thumbnail} 
                        alt={V0_UNIVERSITY.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900">{V0_UNIVERSITY.name}</p>
                    <p className="text-2xl font-bold text-neutral-900">${price}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">57-second video lesson</p>
                      <p className="text-xs text-neutral-500">Learn the core technique fast</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Smart templates included</p>
                      <p className="text-xs text-neutral-500">Skip the setup, start building</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Lifetime access</p>
                      <p className="text-xs text-neutral-500">All future updates included</p>
                    </div>
                  </div>
                </div>

                {/* v0 Referral - branded with actual logo */}
                <a 
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 mb-6 p-3 bg-neutral-900 rounded-xl active:bg-neutral-800 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image 
                      src="/v0-logo-light.png" 
                      alt="v0" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Get $10 free on v0</p>
                    <p className="text-xs text-neutral-400">Sign up with this link</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                </a>

                {/* CTA */}
                <button
                  onClick={handleProceed}
                  className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-neutral-800 transition-colors"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-neutral-400 text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 flex-shrink-0">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Back
                  </button>
                  <p className="text-sm font-medium text-neutral-900">Secure Checkout</p>
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                </div>

                {/* Embedded checkout */}
                <div className="flex-1 overflow-y-auto">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret: fetchClientSecret }}
                  >
                    <EmbeddedCheckout className="h-full" />
                  </EmbeddedCheckoutProvider>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Desktop: Side panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md hidden md:block"
      >
        <div className="h-full bg-white shadow-2xl flex flex-col">
          <AnimatePresence mode="wait">
            {!showCheckout ? (
              <motion.div
                key="info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900">Get Instant Access</h2>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                  {/* Product */}
                  <div className="flex items-center gap-4 p-5 bg-neutral-50 rounded-2xl mb-6">
                    {V0_UNIVERSITY.thumbnail && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0">
                        <img 
                          src={V0_UNIVERSITY.thumbnail} 
                          alt={V0_UNIVERSITY.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 text-lg">{V0_UNIVERSITY.name}</p>
                      <p className="text-3xl font-bold text-neutral-900">${price}</p>
                      <p className="text-sm text-neutral-500">One-time payment</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h3 className="font-medium text-neutral-900 mb-4">What's included:</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">57-second video lesson</p>
                          <p className="text-xs text-neutral-500">Learn the core technique fast</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">Smart templates included</p>
                          <p className="text-xs text-neutral-500">Skip the setup, start building</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">Lifetime access</p>
                          <p className="text-xs text-neutral-500">All future updates included</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* v0 Referral - branded with actual logo */}
                  <a 
                    href="https://v0.link/jon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 mb-6 p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image 
                        src="/v0-logo-light.png" 
                        alt="v0" 
                        width={28} 
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">Get $10 free credits on v0</p>
                      <p className="text-xs text-neutral-400">Use this link when you sign up</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300 transition-colors flex-shrink-0" />
                  </a>

                  <div className="mt-auto">
                    {/* CTA */}
                    <button
                      onClick={handleProceed}
                      className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors text-lg"
                    >
                      Continue to Payment
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-xs text-neutral-400 text-center mt-4">
                      Secure checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    Back
                  </button>
                  <p className="text-sm font-medium text-neutral-900">Secure Checkout</p>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>

                {/* Embedded checkout */}
                <div className="flex-1 overflow-y-auto p-6">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret: fetchClientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
