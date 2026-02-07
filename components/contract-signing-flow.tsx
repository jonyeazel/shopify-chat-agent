"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { CheckCircle, FileText, CreditCard, Rocket, ArrowRight, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ContractGenerator } from "./contract-generator"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startContractCheckout } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface ContractSigningFlowProps {
  lead: any
  quote: any
  contract: any
}

export function ContractSigningFlow({ lead, quote, contract }: ContractSigningFlowProps) {
  const [step, setStep] = useState<"review" | "sign" | "pay" | "success">("review")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToKillSwitch, setAgreedToKillSwitch] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const canProceed = agreedToTerms && agreedToKillSwitch

  const handleSignContract = async () => {
    setIsProcessing(true)
    setTimeout(() => {
      setStep("pay")
      setIsProcessing(false)
    }, 1500)
  }

  const fetchClientSecret = useCallback(async () => {
    const clientSecret = await startContractCheckout(lead.id, quote.id)
    return clientSecret
  }, [lead.id, quote.id])

  const handlePaymentComplete = () => {
    setStep("success")
    setTimeout(() => {
      window.location.href = `/portal/${lead.id}`
    }, 3000)
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  const steps = [
    { id: "review", label: "Review Contract", icon: FileText },
    { id: "sign", label: "Sign Agreement", icon: CheckCircle },
    { id: "pay", label: "Pay Deposit", icon: CreditCard },
    { id: "success", label: "Get Started", icon: Rocket },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-muted border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center font-bold text-lg text-background">
                S
              </div>
              <div>
                <h1 className="text-sm font-bold">Contract Signing</h1>
                <p className="text-xs text-muted-foreground">{lead.store_domain}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-muted/50 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i <= currentStepIndex ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-sm hidden sm:block ${i <= currentStepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < currentStepIndex ? "bg-foreground" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Review Step */}
        {step === "review" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Review Your Contract</h2>
              <p className="text-muted-foreground">Please review the terms below before signing</p>
            </div>

            <ContractGenerator lead={lead} quote={quote} />

            <div className="mt-8 text-center">
              <Button
                onClick={() => setStep("sign")}
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background px-8 rounded-xl"
              >
                I've Reviewed - Continue to Sign
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Sign Step */}
        {step === "sign" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Sign Agreement</h2>
              <p className="text-muted-foreground">Confirm your agreement to the contract terms</p>
            </div>

            <div className="bg-muted border border-border rounded-xl p-6 mb-6">
              <h3 className="font-semibold mb-4">Agreement Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium capitalize">{quote.package_tier || "Growth"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Build Fee</span>
                  <span className="font-medium">{formatCurrency(quote.base_build_price)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Monthly Retainer</span>
                  <span className="font-medium">{formatCurrency(quote.monthly_retainer)}/mo</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Due Today (50% Deposit)</span>
                  <span className="text-[#3d6049] font-bold">{formatCurrency(quote.base_build_price / 2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="flex items-start gap-3 p-4 bg-muted border border-border rounded-xl cursor-pointer hover:border-foreground/20 transition-colors">
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-medium">I agree to the Service Agreement</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I have read and agree to all terms and conditions outlined in the contract above.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors">
                <Checkbox
                  checked={agreedToKillSwitch}
                  onCheckedChange={(checked) => setAgreedToKillSwitch(checked as boolean)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm text-amber-800 font-medium">I understand the Service Control Clause</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I understand that services may be suspended if payment is not received within 14 days of the due
                    date, and I will receive 7 days notice before any interruption.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("review")} className="flex-1 rounded-xl">
                Back to Review
              </Button>
              <Button
                onClick={handleSignContract}
                disabled={!canProceed || isProcessing}
                className="flex-1 bg-foreground hover:bg-foreground/90 text-background rounded-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing...
                  </>
                ) : (
                  <>
                    Sign & Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Pay Step */}
        {step === "pay" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Pay Deposit</h2>
              <p className="text-muted-foreground">
                Pay {formatCurrency(quote.base_build_price / 2)} to start your project
              </p>
            </div>

            <div className="bg-muted border border-border rounded-xl overflow-hidden">
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{
                  fetchClientSecret,
                  onComplete: handlePaymentComplete,
                }}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </motion.div>
        )}

        {/* Success Step */}
        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#e8f2ea] flex items-center justify-center"
            >
              <Rocket className="w-10 h-10 text-[#3d6049]" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-3">You're All Set!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your project is now in our build queue. We'll start working on your optimized store immediately.
            </p>
            <div className="bg-muted border border-border rounded-xl p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold mb-3">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#3d6049]" />
                  Confirmation email sent to {lead.email}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#3d6049]" />
                  Build starts within 24 hours
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#3d6049]" />
                  Track progress in your client portal
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to your portal...</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
