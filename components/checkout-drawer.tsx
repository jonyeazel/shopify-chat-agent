"use client"

import { useCallback, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startChatCheckout } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutDrawerProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  amount: number
  recurring?: boolean
  customerEmail?: string
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  productId,
  productName,
  amount,
  recurring = false,
  customerEmail,
}: CheckoutDrawerProps) {
  const [status, setStatus] = useState<"loading" | "checkout" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  // Reset status when drawer opens
  useEffect(() => {
    if (isOpen) {
      setStatus("loading")
      setError(null)
    }
  }, [isOpen])

  const fetchClientSecret = useCallback(async () => {
    try {
      const result = await startChatCheckout(productId, customerEmail)
      setStatus("checkout")
      return result.clientSecret
    } catch (err) {
      setError("Failed to initialize checkout. Please try again.")
      setStatus("error")
      throw err
    }
  }, [productId, customerEmail])

  const handleComplete = () => {
    setStatus("success")
    setTimeout(() => {
      onClose()
    }, 3000)
  }

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
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-xl overflow-hidden"
            style={{ height: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-foreground">{productName}</span>
                <span className="text-[13px] text-muted-foreground">
                  ${amount.toLocaleString()}
                  {recurring && "/mo"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors duration-150"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
              {status === "error" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Checkout Error</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setStatus("loading")
                      setError(null)
                    }}
                    className="text-sm text-foreground underline underline-offset-4"
                  >
                    Try again
                  </button>
                </div>
              ) : status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-4"
                  >
                    <Check className="w-8 h-8 text-background" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground text-center">I'll reach out within 24 hours to get started.</p>
                </div>
              ) : status === "loading" ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Loading checkout...</p>
                </div>
              ) : (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret,
                    onComplete: handleComplete,
                  }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
