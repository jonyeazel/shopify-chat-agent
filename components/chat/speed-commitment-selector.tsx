"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { SPEED_OPTIONS } from "@/lib/component-data"
import type { SpeedOption } from "@/lib/component-data"

interface SpeedCommitmentSelectorProps {
  onSelect?: (option: SpeedOption) => void
  onPhoneSubmit?: (phone: string) => void
}

const spring = { type: "spring" as const, stiffness: 450, damping: 30 }

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function SpeedCommitmentSelector({ onSelect, onPhoneSubmit }: SpeedCommitmentSelectorProps) {
  const [selected, setSelected] = useState<SpeedOption | null>(null)
  const [phone, setPhone] = useState("")

  const handleSelect = (option: SpeedOption) => {
    setSelected(option)
    onSelect?.(option)
  }

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, "")
    if (digits.length >= 10) {
      onPhoneSubmit?.(digits)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="my-4"
    >
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="options"
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.12 }}
            className="space-y-2"
          >
            {SPEED_OPTIONS.map((option, i) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.04 + i * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option)}
                className="w-full p-4 rounded-xl border border-border/60 bg-background text-left hover-lift hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <option.icon className="w-[18px] h-[18px] text-foreground/70" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground">{option.title}</p>
                    <p className="text-[13px] text-muted-foreground">{option.subtitle}</p>
                    <p className="text-[12px] text-muted-foreground mt-1">{option.price} · {option.timeline}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="next-steps"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            className="rounded-xl border border-border/60 bg-background p-4"
          >
            {/* Selected confirmation */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/40">
              <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-background" strokeWidth={2.5} />
              </div>
              <p className="text-[13px] text-foreground">
                <span className="font-semibold">{selected.title}</span>
                <span className="text-muted-foreground"> · {selected.price}</span>
              </p>
            </div>

            {/* Next steps */}
            <div className="space-y-2.5">
              {selected.nextSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.08 + i * 0.04 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-[12px] text-muted-foreground font-medium tabular-nums mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                  <p className="text-[13px] text-foreground leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>

            {/* Phone input (for "fast" and "standard" options) */}
            {selected.id !== "later" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.3 }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  onKeyDown={(e) => e.key === "Enter" && handlePhoneSubmit()}
                  placeholder="(555) 555-5555"
                  className="flex-1 px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-sm tabular-nums focus:outline-none focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                />
                <button
                  onClick={handlePhoneSubmit}
                  disabled={phone.replace(/\D/g, "").length < 10}
                  className="px-5 py-3 rounded-xl bg-action text-action-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Send
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Email input for "later" option */}
            {selected.id === "later" && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: 0.3 }}
                className="mt-4 flex gap-2"
              >
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-border/60 bg-muted/20 text-sm focus:outline-none focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                />
                <button
                  className="px-5 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Join
                </button>
              </motion.div>
            )}

            {/* Back button */}
            <button
              onClick={() => setSelected(null)}
              className="mt-3 text-[12px] text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Change selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
