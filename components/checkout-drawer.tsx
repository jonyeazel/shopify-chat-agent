"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Check, Loader2 } from "lucide-react"
import { V0_PLAYBOOK, LIVE_BUILD, BUILD_SPRINT, formatPrice, getStackValue, type Product } from "@/lib/products"
import { startCheckout } from "@/app/actions/stripe"

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  productId?: string
}

const PRODUCT_IMAGE = "https://img.youtube.com/vi/i9na_W31rLg/maxresdefault.jpg"

export function CheckoutDrawer({ isOpen, onClose, productId = "v0-playbook" }: CheckoutDrawerProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    productId === "live-build" ? LIVE_BUILD : 
    productId === "build-sprint" ? BUILD_SPRINT : 
    V0_PLAYBOOK
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const checkoutUrl = await startCheckout(selectedProduct.id)
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

  const stackValue = getStackValue(selectedProduct)

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
            className="fixed inset-x-0 bottom-0 z-50 md:hidden max-h-[92vh] overflow-hidden"
          >
            <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh]">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-10 h-1 bg-neutral-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 pb-4 flex-shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">{selectedProduct.headline}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5">
                {/* Tier selector */}
                <div className="flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
                  {[V0_PLAYBOOK, LIVE_BUILD, BUILD_SPRINT].map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedProduct.id === product.id
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {formatPrice(product.priceInCents)}
                    </button>
                  ))}
                </div>

                {/* What's included */}
                <div className="pb-4">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                    What you get
                  </h4>
                  <div className="space-y-2">
                    {selectedProduct.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-neutral-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value stack */}
                {stackValue > 0 && (
                  <div className="pb-4">
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-neutral-500">Total value</span>
                        <span className="text-sm text-neutral-400 line-through">${stackValue.toLocaleString()}+</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">Your price</span>
                        <span className="text-xl font-bold text-neutral-900">{formatPrice(selectedProduct.priceInCents)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* v0 Referral */}
                <a
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl mb-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <img src="/v0-logo-light.png" alt="v0" className="w-6 h-6 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">Get $10 free on v0</p>
                    <p className="text-xs text-neutral-400">Sign up with this link</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </a>
              </div>

              {/* Fixed CTA */}
              <div className="px-5 pb-6 pt-4 border-t border-neutral-100 flex-shrink-0">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-neutral-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>{selectedProduct.cta} — {formatPrice(selectedProduct.priceInCents)}</>
                  )}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">
                  Secure checkout via Stripe
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
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg hidden md:block"
          >
            <div className="h-full bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">{selectedProduct.headline}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-600" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Tier selector */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {[V0_PLAYBOOK, LIVE_BUILD, BUILD_SPRINT].map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        selectedProduct.id === product.id
                          ? "bg-neutral-900 text-white ring-2 ring-neutral-900 ring-offset-2"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      <div className="text-lg font-bold">{formatPrice(product.priceInCents)}</div>
                      <div className="text-xs opacity-70 mt-0.5">{product.name}</div>
                    </button>
                  ))}
                </div>

                {/* What's included */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">
                    What you get
                  </h4>
                  <div className="space-y-3">
                    {selectedProduct.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-neutral-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value stack */}
                {stackValue > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
                      Value breakdown
                    </h4>
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <div className="space-y-2 mb-3">
                        {selectedProduct.valueStack.filter(v => v.value > 0).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-neutral-600">{item.item}</span>
                            <span className="text-neutral-400">${item.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-neutral-200 pt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-900">Total value</span>
                        <span className="text-sm text-neutral-400 line-through">${stackValue.toLocaleString()}+</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold text-neutral-900">Your price</span>
                        <span className="text-2xl font-bold text-neutral-900">{formatPrice(selectedProduct.priceInCents)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgency */}
                {selectedProduct.urgency && (
                  <div className="mb-6 p-3 bg-amber-50 rounded-xl text-center">
                    <span className="text-sm text-amber-700 font-medium">{selectedProduct.urgency}</span>
                  </div>
                )}

                {/* v0 Referral */}
                <a
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <img src="/v0-logo-light.png" alt="v0" className="w-7 h-7 object-contain" />
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
                    <>{selectedProduct.cta} — {formatPrice(selectedProduct.priceInCents)}</>
                  )}
                </button>
                <p className="text-xs text-neutral-400 text-center mt-3">
                  Secure checkout via Stripe
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
