"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Loader2, Check, Upload, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createLead } from "@/app/actions/leads"
import { CheckoutModal } from "@/components/checkout-modal"
import { AIChat } from "@/components/ai-chat"
import type { WizardState } from "@/lib/types"
import {
  parseLifetimeMetricsCSV,
  parseMonthlyMetricsCSV,
  parseLTVMetricsCSV,
  calculateHealthScore,
  identifyCROIssues,
  calculatePricing,
  type StoreMetrics,
} from "@/lib/pricing"

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const prefillDomain = searchParams.get("domain") || ""
  const prefillEmail = searchParams.get("email") || ""
  const prefillName = searchParams.get("name") || ""

  const [phase, setPhase] = useState<"upload" | "analyzing" | "results" | "quote">("upload")
  const [leadId, setLeadId] = useState<string>()
  const [showCheckout, setShowCheckout] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [state, setState] = useState<WizardState>({
    step: 1,
    storeDomain: prefillDomain,
    email: prefillEmail,
    contactName: prefillName,
    phone: "",
    metricsSource: null,
    lifetimeMetrics: {},
    monthlyMetrics: [],
    ltvMetrics: {},
    issues: [],
    includeAbDomain: false,
  })

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const [uploads, setUploads] = useState({
    lifetime: false,
    monthly: false,
    ltv: false,
  })

  const handleFileUpload = (type: "lifetime" | "monthly" | "ltv") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string

      if (type === "lifetime") {
        const metrics = parseLifetimeMetricsCSV(content)
        updateState({ lifetimeMetrics: { ...state.lifetimeMetrics, ...metrics }, metricsSource: "csv" })
        setUploads((prev) => ({ ...prev, lifetime: true }))
      } else if (type === "monthly") {
        const metrics = parseMonthlyMetricsCSV(content)
        updateState({ monthlyMetrics: metrics, metricsSource: "csv" })
        setUploads((prev) => ({ ...prev, monthly: true }))
      } else {
        const metrics = parseLTVMetricsCSV(content)
        updateState({ ltvMetrics: { ...state.ltvMetrics, ...metrics }, metricsSource: "csv" })
        setUploads((prev) => ({ ...prev, ltv: true }))
      }
    }
    reader.readAsText(file)
  }

  const canAnalyze = uploads.lifetime && uploads.ltv

  const runAnalysis = async () => {
    setPhase("analyzing")

    await new Promise((r) => setTimeout(r, 2500))

    const fullMetrics: StoreMetrics = {
      totalSessions: state.lifetimeMetrics.totalSessions || 0,
      conversionRate: state.lifetimeMetrics.conversionRate || 0,
      avgSessionDuration: state.lifetimeMetrics.avgSessionDuration || 0,
      totalVisitors: state.lifetimeMetrics.totalVisitors || 0,
      sessionsCompletedCheckout: state.lifetimeMetrics.sessionsCompletedCheckout || 0,
      sessionsWithCartAdds: state.lifetimeMetrics.sessionsWithCartAdds || 0,
      sessionsReachedCheckout: state.lifetimeMetrics.sessionsReachedCheckout || 0,
      totalCustomers: state.ltvMetrics.totalCustomers || 0,
      returningCustomerRate: state.ltvMetrics.returningCustomerRate || 0,
      ordersPerCustomer: state.ltvMetrics.ordersPerCustomer || 0,
      amountPerCustomer: state.ltvMetrics.amountPerCustomer || 0,
    }

    const healthScore = calculateHealthScore(fullMetrics, state.monthlyMetrics)
    const issues = identifyCROIssues(fullMetrics, state.monthlyMetrics)
    const pricing = calculatePricing(fullMetrics, issues)

    updateState({
      healthScore,
      issues,
      pricing,
    })

    setPhase("results")
  }

  const proceedToQuote = async () => {
    if (isCreating) return
    setIsCreating(true)

    try {
      const result = await createLead(state)
      setLeadId(result.lead.id)
      setShowCheckout(true)
    } catch (error) {
      console.error("Failed to create lead:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCheckoutSuccess = () => {
    setShowCheckout(false)
    window.location.href = `/thank-you?lead=${leadId}`
  }

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
    return `$${n.toFixed(0)}`
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </a>
          <span className="text-sm font-medium text-foreground">{prefillDomain}</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="pt-14 min-h-screen">
        <AnimatePresence mode="wait">
          {/* Phase 1: Upload Data */}
          {phase === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 px-4"
            >
              <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,380px] gap-8">
                {/* Left: Upload form */}
                <div>
                  <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                      Upload your analytics
                    </h1>
                    <p className="text-muted-foreground">
                      Export your data from Shopify Sidekick to get a precise analysis.
                    </p>
                  </div>

                  <Tabs defaultValue="upload" className="mb-8">
                    <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="upload" className="text-sm">
                        Upload CSVs
                      </TabsTrigger>
                      <TabsTrigger value="guide" className="text-sm">
                        How to export
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-6">
                      <div className="space-y-3">
                        {/* Lifetime metrics */}
                        <div
                          className={`border rounded-xl p-4 transition-all ${uploads.lifetime ? "border-foreground/30 bg-muted/30" : "border-border hover:border-border/80"}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${uploads.lifetime ? "bg-foreground text-background" : "bg-muted"}`}
                            >
                              {uploads.lifetime ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-foreground text-sm">Lifetime CRO Metrics</span>
                                <span className="text-[10px] uppercase tracking-wider text-red-500 font-medium">
                                  Required
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">Sessions, conversion rate, cart data</p>
                              <label className="inline-flex items-center gap-1.5 text-xs text-foreground hover:underline cursor-pointer">
                                <Upload className="w-3.5 h-3.5" />
                                {uploads.lifetime ? "Replace" : "Choose file"}
                                <input
                                  type="file"
                                  accept=".csv"
                                  onChange={handleFileUpload("lifetime")}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Monthly metrics */}
                        <div
                          className={`border rounded-xl p-4 transition-all ${uploads.monthly ? "border-foreground/30 bg-muted/30" : "border-border hover:border-border/80"}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${uploads.monthly ? "bg-foreground text-background" : "bg-muted"}`}
                            >
                              {uploads.monthly ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-foreground text-sm">Monthly CRO Metrics</span>
                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                                  Optional
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">Trend analysis over time</p>
                              <label className="inline-flex items-center gap-1.5 text-xs text-foreground hover:underline cursor-pointer">
                                <Upload className="w-3.5 h-3.5" />
                                {uploads.monthly ? "Replace" : "Choose file"}
                                <input
                                  type="file"
                                  accept=".csv"
                                  onChange={handleFileUpload("monthly")}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* LTV metrics */}
                        <div
                          className={`border rounded-xl p-4 transition-all ${uploads.ltv ? "border-foreground/30 bg-muted/30" : "border-border hover:border-border/80"}`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${uploads.ltv ? "bg-foreground text-background" : "bg-muted"}`}
                            >
                              {uploads.ltv ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <FileText className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-foreground text-sm">Customer LTV Metrics</span>
                                <span className="text-[10px] uppercase tracking-wider text-red-500 font-medium">
                                  Required
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">Retention rate, order value</p>
                              <label className="inline-flex items-center gap-1.5 text-xs text-foreground hover:underline cursor-pointer">
                                <Upload className="w-3.5 h-3.5" />
                                {uploads.ltv ? "Replace" : "Choose file"}
                                <input
                                  type="file"
                                  accept=".csv"
                                  onChange={handleFileUpload("ltv")}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="guide" className="mt-6">
                      <div className="bg-muted/30 rounded-xl p-5 border border-border">
                        <h3 className="font-medium text-foreground text-sm mb-4">Exporting from Shopify Sidekick</h3>
                        <ol className="space-y-3 text-sm text-muted-foreground">
                          <li className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] flex-shrink-0 font-medium">
                              1
                            </span>
                            <span>Open Shopify Admin and click the Sidekick icon (sparkle)</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] flex-shrink-0 font-medium">
                              2
                            </span>
                            <span>Ask: "Show me my lifetime CRO metrics as a CSV"</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] flex-shrink-0 font-medium">
                              3
                            </span>
                            <span>Click download on the generated table</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] flex-shrink-0 font-medium">
                              4
                            </span>
                            <span>Repeat for "monthly CRO metrics" and "customer LTV metrics"</span>
                          </li>
                        </ol>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Button
                    onClick={runAnalysis}
                    disabled={!canAnalyze}
                    className="w-full h-11 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                  >
                    {canAnalyze ? (
                      <>
                        Run analysis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>Upload required files to continue</>
                    )}
                  </Button>
                </div>

                {/* Right: AI Chat - inline version */}
                <div className="hidden lg:block h-[calc(100vh-8rem)] sticky top-20">
                  <AIChat leadId={leadId} storeDomain={prefillDomain} inline />
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Analyzing */}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center min-h-[80vh] px-4"
            >
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-6" />
                <h2 className="text-lg font-medium text-foreground mb-2">Analyzing your data</h2>
                <p className="text-sm text-muted-foreground">Comparing against industry benchmarks...</p>
              </div>
            </motion.div>
          )}

          {/* Phase 3: Results */}
          {phase === "results" && state.healthScore && state.pricing && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-12 px-4"
            >
              <div className="max-w-3xl mx-auto">
                {/* Summary header */}
                <div className="text-center mb-10">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Analysis complete</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
                    Store health: {state.healthScore.overall}/100
                  </h1>
                  <p className="text-muted-foreground">
                    Estimated annual opportunity:{" "}
                    <span className="text-foreground font-semibold">
                      {formatCurrency(state.pricing.revenueOpportunity)}
                    </span>
                  </p>
                </div>

                {/* Health score visual */}
                <div className="flex justify-center mb-10">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-muted"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${(state.healthScore.overall / 100) * 263.9} 263.9`}
                        strokeLinecap="round"
                        className={
                          state.healthScore.overall < 40
                            ? "text-red-500"
                            : state.healthScore.overall < 70
                              ? "text-amber-500"
                              : "text-[#3d6049]"
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-semibold text-foreground">{state.healthScore.overall}</span>
                      <span className="text-xs text-muted-foreground">of 100</span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-4 gap-3 mb-10">
                  {[
                    { label: "Conversion", score: state.healthScore.conversion },
                    { label: "Retention", score: state.healthScore.retention },
                    { label: "Engagement", score: state.healthScore.engagement },
                    { label: "Trend", score: state.healthScore.trend },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-muted/30 rounded-xl border border-border">
                      <div className="text-xl font-semibold text-foreground mb-0.5">{item.score}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Issues found */}
                {state.issues && state.issues.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-sm font-medium text-foreground mb-4">Issues identified</h2>
                    <div className="space-y-2">
                      {state.issues.slice(0, 5).map((issue, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl border border-border">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              issue.severity === "critical"
                                ? "bg-red-500"
                                : issue.severity === "high"
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">{issue.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatCurrency(issue.estimatedImpact)}/yr
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="border border-border rounded-xl p-6 text-center">
                  <h2 className="text-lg font-semibold text-foreground mb-2">Get your full audit report</h2>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    Detailed breakdown of every issue, prioritized fixes, and exact implementation plan. The $97 fee is
                    applied to your project if you proceed.
                  </p>
                  <Button
                    onClick={proceedToQuote}
                    disabled={isCreating}
                    className="h-11 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-sm font-medium"
                  >
                    {isCreating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Get full audit — $97
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating AI Chat for mobile and results phase */}
      {(phase !== "upload" || (typeof window !== "undefined" && window.innerWidth < 1024)) && (
        <AIChat leadId={leadId} storeDomain={prefillDomain} />
      )}

      {/* Checkout Modal */}
      {leadId && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
          leadId={leadId}
          amount={97}
          description="Full CRO Audit Report"
        />
      )}
    </main>
  )
}
