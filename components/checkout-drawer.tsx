"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Check, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  V0_TUTOR,
  CLONE_SITE,
  AI_CONSULTING,
  formatPrice,
  getStackValue,
  type Product,
} from "@/lib/products"
import { startCheckout } from "@/app/actions/stripe"

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  productId?: string
}

export function CheckoutDrawer({ isOpen, onClose, productId = "v0-tutor" }: CheckoutDrawerProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    productId === "clone-site" ? CLONE_SITE : 
    productId === "ai-consulting" ? AI_CONSULTING : 
    V0_TUTOR
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (selectedProduct.id === "ai-consulting") {
      window.location.href = "sms:+14078677201&body=Hey%20Jon%2C%20I%27m%20interested%20in%20AI%20Consulting"
      return
    }
    
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
  const isConsulting = selectedProduct.id === "ai-consulting"

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
            className="fixed inset-0 z-50 bg-black/60"
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
            <div className="bg-background rounded-t-[20px] shadow-2xl flex flex-col max-h-[92vh]">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/20" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between px-5 pb-4 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedProduct.headline}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 min-h-[320px]">
                {/* Tier selector */}
                <div className="flex gap-2 mb-5">
                  {[V0_TUTOR, CLONE_SITE, AI_CONSULTING].map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`flex-1 py-3 px-2 rounded-xl text-center transition-all duration-200 border-2 ${
                        selectedProduct.id === product.id
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wide mb-0.5 opacity-60">
                        {product.id === "v0-tutor" ? "Learn" : product.id === "clone-site" ? "Done for you" : "Custom"}
                      </div>
                      <div className="text-base font-bold">
                        {formatPrice(product.priceInCents)}
                      </div>
                    </button>
                  ))}
                </div>

                {/* What's included */}
                <div className="pb-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                    What you get
                  </h4>
                  <motion.div 
                    key={selectedProduct.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2.5"
                  >
                    {selectedProduct.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Fixed CTA */}
              <div className="px-5 pb-6 pt-3 bg-background flex-shrink-0 border-t border-border">
                {error && (
                  <div className="mb-3 p-3 bg-destructive/10 text-destructive text-sm rounded-xl">
                    {error}
                  </div>
                )}
                {selectedProduct.urgency && (
                  <div className="mb-3 py-2 px-3 bg-muted rounded-xl text-center">
                    <span className="text-sm text-foreground font-medium">{selectedProduct.urgency}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <div className="flex items-baseline gap-2">
                    {selectedProduct.originalPriceInCents && (
                      <span className="text-sm text-muted-foreground line-through">{formatPrice(selectedProduct.originalPriceInCents)}</span>
                    )}
                    <span className="text-2xl font-bold text-foreground">{formatPrice(selectedProduct.priceInCents)}</span>
                  </div>
                </div>
                {!isConsulting && (
                  <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>Secure Stripe checkout</span>
                  </div>
                )}
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : isConsulting ? (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Text Jon
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                      </svg>
                      {selectedProduct.cta}
                    </>
                  )}
                </Button>
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
            <div className="h-full bg-background shadow-2xl flex flex-col border-l border-border">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{selectedProduct.name}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{selectedProduct.headline}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Tier selector */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[V0_TUTOR, CLONE_SITE, AI_CONSULTING].map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        selectedProduct.id === product.id
                          ? "bg-foreground text-background ring-2 ring-foreground ring-offset-2"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1">{product.name}</div>
                      <div className="text-xl font-bold">{formatPrice(product.priceInCents)}</div>
                    </button>
                  ))}
                </div>

                {/* What's included */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                    What you get
                  </h4>
                  <div className="space-y-3">
                    {selectedProduct.includes.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-background" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Value stack */}
                {stackValue > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Value breakdown
                    </h4>
                    <div className="p-4 bg-muted/30 rounded-xl border border-border">
                      <div className="space-y-2 mb-3">
                        {selectedProduct.valueStack.filter(v => v.value > 0).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item.item}</span>
                            <span className="text-muted-foreground">${item.value.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Total value</span>
                        <span className="text-sm text-muted-foreground line-through">${stackValue.toLocaleString()}+</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-semibold text-foreground">Your price</span>
                        <span className="text-2xl font-bold text-foreground">{formatPrice(selectedProduct.priceInCents)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgency */}
                {selectedProduct.urgency && (
                  <div className="mb-6 p-3 bg-muted rounded-xl text-center">
                    <span className="text-sm text-foreground font-medium">{selectedProduct.urgency}</span>
                  </div>
                )}

                {/* v0 Referral */}
                <a
                  href="https://v0.link/jon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity"
                >
                  <div className="w-11 h-11 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                    <img src="/v0-logo-light.png" alt="v0" className="w-7 h-7 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium">Get $10 free credits on v0</p>
                    <p className="text-sm opacity-60">Sign up with this link to start building</p>
                  </div>
                  <ArrowRight className="w-5 h-5 opacity-60" />
                </a>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-xl">
                    {error}
                  </div>
                )}
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <div>
                    <span className="text-2xl font-bold text-foreground">{formatPrice(selectedProduct.priceInCents)}</span>
                    {!isConsulting && <span className="text-sm text-muted-foreground ml-1.5">USD</span>}
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : isConsulting ? (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Text Jon
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                      </svg>
                      {selectedProduct.cta}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
