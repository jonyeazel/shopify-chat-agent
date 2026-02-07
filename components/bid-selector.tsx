"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, X } from "lucide-react"
import type { Service, ServiceTier } from "@/lib/services"

interface BidSelectorProps {
  service: Service
  onSelect: (tier: ServiceTier, email: string, description: string) => void
  onClose: () => void
}

export function BidSelector({ service, onSelect, onClose }: BidSelectorProps) {
  const [step, setStep] = useState<"tier" | "details">("tier")
  const [selectedTier, setSelectedTier] = useState<ServiceTier | null>(null)
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

  const handleTierSelect = (tier: ServiceTier) => {
    setSelectedTier(tier)
    setStep("details")
  }

  const handleSubmit = () => {
    if (selectedTier && email) {
      onSelect(selectedTier, email, description)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-background rounded-t-xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <AnimatePresence mode="wait">
            {step === "tier" && (
              <motion.div
                key="tier"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-3"
              >
                <p className="text-sm text-muted-foreground mb-4">Select your budget level:</p>
                {service.tiers.map((tier, index) => (
                  <button
                    key={index}
                    onClick={() => handleTierSelect(tier)}
                    className="w-full p-4 rounded-xl border border-border hover:border-foreground/50 transition-colors text-left flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-medium">{tier.name}</p>
                      <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">${tier.price.toLocaleString()}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </button>
                ))}

                {/* FAQs */}
                {service.faqs.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-3">Common questions:</p>
                    <div className="space-y-3">
                      {service.faqs.map((faq, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium">{faq.question}</p>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === "details" && selectedTier && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setStep("tier")}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  ← Back to options
                </button>

                <div className="p-4 rounded-xl bg-muted/30 border border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedTier.name}</span>
                    <span className="text-lg font-semibold">${selectedTier.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTier.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:border-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tell me about the project (optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What are you trying to accomplish?"
                      rows={3}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:border-foreground/50 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step === "details" && (
          <div className="p-4 border-t border-border">
            <button
              onClick={handleSubmit}
              disabled={!email}
              className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Submit Request
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2">I'll review and respond within 24 hours</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
