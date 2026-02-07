"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const SIDEKICK_PROMPTS = [
  {
    title: "Lifetime CRO Metrics",
    prompt: `Export to CSV: all-time sessions, conversion rate, average session duration, online store visitors, sessions that completed checkout, sessions with cart additions, sessions that reached checkout`,
    filename: "lifetime_cro_metrics.csv",
  },
  {
    title: "Monthly CRO Trends",
    prompt: `Export to CSV by month for the last 12 months: sessions, sessions that completed checkout, conversion rate, average session duration, online store visitors, sessions with cart additions`,
    filename: "monthly_cro_metrics.csv",
  },
  {
    title: "Customer LTV Data",
    prompt: `Export to CSV: total customers, returning customer rate, average number of orders per customer, average amount spent per customer`,
    filename: "customer_ltv_metrics.csv",
  },
]

const FIND_SIDEKICK_STEPS = {
  desktop: [
    "Log into your Shopify admin (yourstorename.myshopify.com/admin)",
    "Look for the search bar at the top of the page",
    "Click it or press ⌘K (Mac) or Ctrl+K (Windows)",
    "Type your question or paste the prompt below",
    "Sidekick will generate the data and provide a download link",
  ],
  mobile: [
    "Open the Shopify app on your phone",
    "Tap the search icon at the bottom of the screen",
    "Tap 'Ask Sidekick' at the top",
    "Paste or type the prompt below",
    "Download the CSV when Sidekick generates it",
  ],
}

export function SidekickGuide() {
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile">("desktop")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showSteps, setShowSteps] = useState(true)

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-background">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Get Your Store Data</h3>
        <p className="text-sm text-muted-foreground mt-1">Use Shopify Sidekick to export your analytics in 2 minutes</p>
      </div>

      <div className="border-b border-border">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors text-left"
        >
          <span className="text-sm font-medium text-foreground">How to find Sidekick</span>
          <span className="text-xs text-muted-foreground">{showSteps ? "Hide" : "Show"}</span>
        </button>

        <AnimatePresence>
          {showSteps && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                {/* Desktop/Mobile Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab("desktop")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === "desktop"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setActiveTab("mobile")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeTab === "mobile"
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Mobile App
                  </button>
                </div>

                {/* Steps */}
                <ol className="space-y-2">
                  {FIND_SIDEKICK_STEPS[activeTab].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-foreground/80">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5">
        <p className="text-sm font-medium text-foreground mb-3">Copy & paste these prompts into Sidekick:</p>
        <div className="space-y-3">
          {SIDEKICK_PROMPTS.map((item, index) => (
            <div
              key={index}
              className="border border-border rounded-xl p-4 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground break-words">"{item.prompt}"</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 h-8 px-3 rounded-lg bg-transparent"
                  onClick={() => copyToClipboard(item.prompt, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3 h-3 mr-1.5" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1.5" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save as: <span className="font-medium">{item.filename}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer tip */}
      <div className="px-5 py-4 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> After Sidekick generates each report, click the
          download link and upload the CSV files here.
        </p>
      </div>
    </div>
  )
}
