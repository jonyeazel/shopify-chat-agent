"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Calendar, MessageCircle, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Share2, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { SmsTrigger } from "@/components/sms-trigger"

interface ReportViewProps {
  lead: any
  metrics: any
  monthlyMetrics: any[]
  issues: any[]
  quote: any
}

export function ReportView({ lead, metrics, monthlyMetrics, issues, quote }: ReportViewProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`

  const chartData = monthlyMetrics.map((m) => ({
    month: new Date(m.month).toLocaleDateString("en-US", { month: "short" }),
    conversionRate: (m.conversion_rate * 100).toFixed(2),
  }))

  const handlePrint = () => window.print()

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: `CRO Audit - ${lead.store_domain}`, url })
    } else {
      navigator.clipboard.writeText(url)
      alert("Link copied to clipboard")
    }
  }

  const healthScore = metrics?.health_score || 0

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50 print:static">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">CRO Audit Report</h1>
            <p className="text-sm text-muted-foreground">{lead.store_domain}</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              <Calendar className="w-4 h-4 mr-2" />
              Book Call
            </Button>
          </div>
        </div>
      </header>

      <main ref={reportRef} className="max-w-4xl mx-auto px-6 py-12">
        {/* Executive Summary */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="text-sm text-muted-foreground font-medium mb-2 uppercase tracking-wide">Executive Summary</p>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Your Store's Health Check</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Based on our analysis of {lead.store_domain}, we've identified key opportunities to improve conversions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Health Score */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    className={
                      healthScore < 40 ? "text-red-500" : healthScore < 70 ? "text-amber-500" : "text-[#3d6049]"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-foreground">{healthScore}</span>
                  <span className="text-xs text-muted-foreground">out of 100</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-500 mb-1">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-xs font-medium">Current</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{formatPercent(metrics?.conversion_rate || 0)}</p>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#3d6049] mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Benchmark</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">2.50%</p>
                  <p className="text-xs text-muted-foreground">Target Rate</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                <p className="text-sm text-red-600 mb-1">Revenue Opportunity</p>
                <p className="text-3xl font-bold text-red-600">{formatCurrency(metrics?.revenue_opportunity || 0)}</p>
                <p className="text-xs text-red-500/70 mt-1">Based on reaching benchmark conversion rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Chart */}
        {chartData.length > 1 && (
          <section className="mb-16 print:break-before-page">
            <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Trend</h3>
            <div className="bg-muted/30 border border-border rounded-lg p-6">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3d6049" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3d6049" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#a1a1aa" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #e4e4e7",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="#3d6049"
                    strokeWidth={2}
                    fill="url(#colorConversion)"
                    name="Conversion %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Key Metrics */}
        <section className="mb-16">
          <h3 className="text-lg font-semibold text-foreground mb-4">Key Metrics</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total Sessions", value: metrics?.total_sessions?.toLocaleString() || "0" },
              { label: "Cart Adds", value: metrics?.sessions_with_cart_adds?.toLocaleString() || "0" },
              { label: "Reached Checkout", value: metrics?.sessions_reached_checkout?.toLocaleString() || "0" },
              { label: "Completed", value: metrics?.sessions_completed_checkout?.toLocaleString() || "0" },
              { label: "Customers", value: metrics?.total_customers?.toLocaleString() || "0" },
              { label: "Return Rate", value: formatPercent(metrics?.returning_customer_rate || 0) },
              { label: "Orders/Customer", value: metrics?.orders_per_customer?.toFixed(1) || "0" },
              { label: "AOV", value: formatCurrency(metrics?.amount_per_customer || 0) },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-muted/30 border border-border rounded-lg p-4"
              >
                <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                <p className="text-xl font-semibold text-foreground">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Issues */}
        <section className="mb-16 print:break-before-page">
          <h3 className="text-lg font-semibold text-foreground mb-4">Issues Identified ({issues.length})</h3>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border rounded-lg p-4 ${
                  issue.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : issue.severity === "high"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        issue.severity === "critical"
                          ? "text-red-500"
                          : issue.severity === "high"
                            ? "text-amber-500"
                            : "text-yellow-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{issue.title}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded uppercase ${
                            issue.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : issue.severity === "high"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.description}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <p className="text-base font-semibold text-red-600">-{formatCurrency(issue.estimated_impact)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Investment */}
        <section className="mb-16 print:break-before-page">
          <h3 className="text-lg font-semibold text-foreground mb-4">Investment</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">CRO Build ({quote?.package_tier || "growth"})</p>
                  <p className="text-sm text-muted-foreground">Complete optimization</p>
                </div>
                <p className="text-xl font-semibold text-foreground">{formatCurrency(quote?.base_build_price || 0)}</p>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Monthly Retainer</p>
                  <p className="text-sm text-muted-foreground">Ongoing support</p>
                </div>
                <p className="text-xl font-semibold text-foreground">
                  {formatCurrency(quote?.monthly_retainer || 0)}/mo
                </p>
              </div>
            </div>

            <div className="bg-foreground text-background p-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Investment</p>
                  <p className="text-sm text-background/70">One-time + monthly</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(quote?.total_upfront || 0)}</p>
                  <p className="text-sm text-background/70">+ {formatCurrency(quote?.monthly_retainer || 0)}/mo</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI */}
          <div className="mt-4 bg-muted/30 border border-border rounded-lg p-5">
            <h4 className="font-medium text-foreground mb-4">Return on Investment</h4>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#2f4a3a]">
                  {Math.round((metrics?.revenue_opportunity || 0) / (quote?.base_build_price || 1))}x
                </p>
                <p className="text-xs text-muted-foreground">First Year ROI</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.ceil((quote?.base_build_price || 0) / ((metrics?.revenue_opportunity || 1) / 12))} mo
                </p>
                <p className="text-xs text-muted-foreground">Payback Period</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency((metrics?.revenue_opportunity || 0) / 12)}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Lift</p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-16">
          <h3 className="text-lg font-semibold text-foreground mb-4">What's Included</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Complete conversion audit",
              "Mobile-optimized redesign",
              "Checkout optimization",
              "Speed improvements",
              "Analytics setup",
              "Email capture optimization",
              "A/B testing framework",
              "Monthly reports",
              "Dedicated support",
              "Quarterly strategy calls",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="w-4 h-4 text-[#3d6049] flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-10 border-t border-border print:hidden">
          <h3 className="text-xl font-semibold text-foreground mb-3">Ready to get started?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Let's discuss your results and create an implementation plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90" asChild>
              <a href="https://calendly.com/theshopifyguy/cro-strategy" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Call
              </a>
            </Button>
            <SmsTrigger context="post-report" storeDomain={lead.store_domain}>
              <Button size="lg" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Text Jon
              </Button>
            </SmsTrigger>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>
            Prepared for: <span className="text-foreground">{lead.contact_name || lead.email}</span>
          </p>
          <p className="mt-1">The Shopify Guy — Conversion Rate Optimization</p>
        </div>
      </main>
    </div>
  )
}
