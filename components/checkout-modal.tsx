"use client"

import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Loader2 } from "lucide-react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startProposalCheckout, startBuildCheckout } from "@/app/actions/stripe"
import { useRouter } from "next/navigation"
import type { PricingQuote } from "@/lib/pricing"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  leadId: string
  selectedPackage?: string
  pricing?: PricingQuote
  paymentModel?: string
  includeAbDomain?: boolean
  onSuccess?: () => void
}

export function CheckoutModal({
  isOpen,
  onClose,
  leadId,
  selectedPackage,
  pricing,
  paymentModel,
  includeAbDomain = false,
  onSuccess,
}: CheckoutModalProps) {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "checkout" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  const isProposalCheckout = !selectedPackage || !pricing

  const fetchClientSecret = useCallback(async () => {
    try {
      if (isProposalCheckout) {
        // $97 proposal fee
        return await startProposalCheckout(leadId)
      } else {
        // Build deposit based on package
        return await startBuildCheckout(leadId, selectedPackage!, includeAbDomain)
      }
    } catch (err) {
      setError("Failed to initialize checkout. Please try again.")
      setStatus("error")
      throw err
    }
  }, [leadId, isProposalCheckout, selectedPackage, includeAbDomain])

  const handleComplete = () => {
    setStatus("success")
    setTimeout(() => {
      onSuccess?.()
      router.push(`/thank-you?lead=${leadId}`)
    }, 2000)
  }

  const checkoutAmount = isProposalCheckout ? 97 : pricing?.baseBuildPrice || 0

  const checkoutTitle = isProposalCheckout
    ? "CRO Audit Proposal"
    : `${selectedPackage?.charAt(0).toUpperCase()}${selectedPackage?.slice(1)} Package Deposit`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{checkoutTitle}</h2>
                <p className="text-sm text-muted-foreground">
                  {isProposalCheckout
                    ? "Unlock your personalized CRO audit"
                    : `50% deposit: $${(checkoutAmount / 2).toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
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
                  <h3 className="text-xl font-semibold text-foreground mb-2">Payment Successful</h3>
                  <p className="text-muted-foreground text-center">
                    {isProposalCheckout
                      ? "Your full audit report is being generated."
                      : "Your project deposit has been received."}
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Redirecting...</span>
                  </div>
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
