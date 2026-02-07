"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Loader2, X, Check } from "lucide-react"

import { HealthScoreDial } from "./health-score-dial"
import { OpportunityCounter } from "./opportunity-counter"
import { PricingPackage } from "./pricing-package"
import { PaymentModelSelector } from "./payment-model-selector"
import { createLead } from "@/app/actions/leads"
import type { WizardState } from "@/lib/types"
import {
  calculateHealthScore,
  identifyCROIssues,
  calculatePricing,
  type StoreMetrics,
} from "@/lib/pricing"

const AVATAR_URL = "/images/gemini-generated-image-d9bdhjd9bdhjd9bd.jpeg"

interface QuoteWizardProps {
  onComplete?: (state: WizardState) => void
  onClose?: () => void
}

export function QuoteWizard({ onComplete, onClose }: QuoteWizardProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [inputValue, setInputValue] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [state, setState] = useState<WizardState>({
    step: 1,
    storeDomain: "",
    email: "",
    contactName: "",
    phone: "",
    metricsSource: null,
    lifetimeMetrics: {},
    monthlyMetrics: [],
    ltvMetrics: {},
    issues: [],
    includeAbDomain: false,
  })

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const totalSteps = 7

  const goNext = useCallback(() => {
    setDirection(1)
    setStep((s) => Math.min(s + 1, totalSteps - 1))
    setInputValue("")
  }, [])

  const goBack = useCallback(() => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Auto-focus input
  useEffect(() => {
    const timer = setTimeout(() => {
      const input = document.getElementById("wizard-input") as HTMLInputElement
      if (input) {
        input.focus()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [step])

  const handleUrlSubmit = () => {
    if (!inputValue.trim()) return
    const clean = inputValue.replace(/^https?:\/\//, "").replace(/\/$/, "")
    updateState({ storeDomain: clean })
    goNext()
  }

  const handleNameSubmit = () => {
    if (!inputValue.trim()) return
    updateState({ contactName: inputValue.trim() })
    goNext()
  }

  const handleEmailSubmit = () => {
    if (!inputValue.includes("@")) return
    updateState({ email: inputValue.trim() })
    goNext()
  }

  const analyzeData = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      // Convert quiz answers to rough metrics
      const convRateMap: Record<string, number> = { "Under 1%": 0.7, "1-2%": 1.5, "2-3%": 2.5, "Over 3%": 3.5 }
      const aovMap: Record<string, number> = { "Under $50": 35, "$50-100": 75, "$100-200": 150, "Over $200": 250 }
      
      const convRate = convRateMap[state.lifetimeMetrics.convRate as string] || 1.5
      const aov = aovMap[state.lifetimeMetrics.aov as string] || 75
      
      const fullMetrics: StoreMetrics = {
        totalSessions: 10000,
        conversionRate: convRate,
        avgSessionDuration: 120,
        totalVisitors: 8000,
        sessionsCompletedCheckout: Math.round(10000 * (convRate / 100)),
        sessionsWithCartAdds: Math.round(10000 * 0.08),
        sessionsReachedCheckout: Math.round(10000 * 0.04),
        totalCustomers: 500,
        returningCustomerRate: 0.2,
        ordersPerCustomer: 1.3,
        amountPerCustomer: aov * 1.3,
      }
      const healthScore = calculateHealthScore(fullMetrics, state.monthlyMetrics)
      const issues = identifyCROIssues(fullMetrics, state.monthlyMetrics)
      const pricing = calculatePricing(fullMetrics, issues)
      updateState({ healthScore, issues, pricing })
      setIsAnalyzing(false)
      goNext()
    }, 1500)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createLead(state)
      onComplete?.({ ...state, leadId: result.lead.id })
    } catch (error) {
      console.error("Failed to create lead:", error)
      setIsSubmitting(false)
    }
  }

  const canProceedFromData = state.lifetimeMetrics.revenue && state.lifetimeMetrics.convRate && state.lifetimeMetrics.aov

  const canProceedFromPackage = state.selectedPackage && state.selectedPaymentModel

  const progress = ((step + 1) / totalSteps) * 100

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={AVATAR_URL || "/placeholder.svg"} alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm font-medium">TheShopifyGuy</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {step + 1} of {totalSteps}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-xl mx-auto mt-4">
          <div className="h-0.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 0: URL with iframe */}
          {step === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm sm:max-w-md space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">What's your store?</h1>
                <p className="text-muted-foreground mt-2 text-sm">Drop your URL and I'll take a look</p>
              </div>

              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  id="wizard-input"
                  type="text"
                  placeholder="yourstore.com"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    const clean = e.target.value.replace(/^https?:\/\//, "").replace(/\/$/, "")
                    updateState({ storeDomain: clean })
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                  className="flex-1 h-12 rounded-full bg-muted/50 border-0 text-base px-5 outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!state.storeDomain}
                  className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-20 transition-opacity"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">What's your name?</h1>
                <p className="text-muted-foreground mt-2 text-sm">So I know who I'm talking to</p>
              </div>

              <div className="flex gap-2">
                <input
                  id="wizard-input"
                  type="text"
                  placeholder="First name works"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                  className="flex-1 h-12 rounded-full bg-muted/50 border-0 text-base px-5 outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <button
                  onClick={handleNameSubmit}
                  disabled={!inputValue.trim()}
                  className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-20 transition-opacity"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Where should I send your report?</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Hey {state.contactName.split(" ")[0]}, just need your email
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  id="wizard-input"
                  type="email"
                  placeholder="you@company.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                  className="flex-1 h-12 rounded-full bg-muted/50 border-0 text-base px-5 outline-none focus:ring-1 focus:ring-foreground/20"
                />
                <button
                  onClick={handleEmailSubmit}
                  disabled={!inputValue.includes("@")}
                  className="h-12 w-12 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-20 transition-opacity"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Quick metrics quiz */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Quick metrics check</h1>
                <p className="text-muted-foreground mt-2 text-sm">Just rough numbers - no login needed</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Monthly revenue?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Under $10k", "$10k-50k", "$50k-100k", "Over $100k"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateState({ lifetimeMetrics: { ...state.lifetimeMetrics, revenue: opt } })}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          state.lifetimeMetrics.revenue === opt 
                            ? "border-foreground bg-foreground/5" 
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Conversion rate?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Under 1%", "1-2%", "2-3%", "Over 3%"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateState({ lifetimeMetrics: { ...state.lifetimeMetrics, convRate: opt } })}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          state.lifetimeMetrics.convRate === opt 
                            ? "border-foreground bg-foreground/5" 
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Average order value?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Under $50", "$50-100", "$100-200", "Over $200"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => updateState({ lifetimeMetrics: { ...state.lifetimeMetrics, aov: opt } })}
                        className={`p-3 rounded-xl border text-sm transition-all ${
                          state.lifetimeMetrics.aov === opt 
                            ? "border-foreground bg-foreground/5" 
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={analyzeData}
                  disabled={!state.lifetimeMetrics.revenue || !state.lifetimeMetrics.convRate || !state.lifetimeMetrics.aov || isAnalyzing}
                  className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-20 transition-opacity flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      See my score
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Analysis results */}
          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm sm:max-w-md space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Here's what I found</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-center">
                  <HealthScoreDial score={state.healthScore?.overall || 0} />
                </div>
                <div className="flex justify-center">
                  <OpportunityCounter amount={state.pricing?.revenueOpportunity || 0} />
                </div>
              </div>

              {state.issues && state.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Top issues to fix:</p>
                  {state.issues.slice(0, 3).map((issue, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border">
                      <p className="text-sm font-medium">{issue.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  onClick={goNext}
                  className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium flex items-center gap-2"
                >
                  See pricing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Package selection */}
          {step === 5 && (
            <motion.div
              key="step-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm sm:max-w-3xl space-y-6 px-4"
            >
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Pick your path</h1>
                <p className="text-muted-foreground mt-2 text-sm">Based on your store's potential</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {state.pricing?.packages.map((pkg) => (
                  <PricingPackage
                    key={pkg.tier}
                    tier={pkg.tier}
                    price={pkg.price}
                    features={pkg.features}
                    roi={pkg.roi}
                    selected={state.selectedPackage === pkg.tier}
                    onSelect={() => updateState({ selectedPackage: pkg.tier })}
                  />
                ))}
              </div>

              {state.selectedPackage && (
                <div className="max-w-md mx-auto">
                  <PaymentModelSelector
                    selected={state.selectedPaymentModel}
                    onSelect={(model) => updateState({ selectedPaymentModel: model })}
                    pricing={state.pricing}
                  />
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  onClick={goNext}
                  disabled={!canProceedFromPackage}
                  className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-20 transition-opacity flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 6: Confirmation */}
          {step === 6 && (
            <motion.div
              key="step-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-sm space-y-6 px-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#c4dbc9] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#2f4a3a]" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">Ready to go</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  {state.contactName.split(" ")[0]}, you're getting the {state.selectedPackage} package
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Store</span>
                  <span className="font-medium">{state.storeDomain}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium capitalize">{state.selectedPackage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium capitalize">{state.selectedPaymentModel?.replace("_", " ")}</span>
                </div>
              </div>

              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Get started"
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Back button */}
      {step > 0 && step < 6 && (
        <footer className="flex-shrink-0 p-4">
          <div className="max-w-xl mx-auto">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
