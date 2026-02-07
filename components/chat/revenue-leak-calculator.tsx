"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface RevenueLeakCalculatorProps {
  onCTA?: () => void
}

const spring = { type: "spring" as const, stiffness: 450, damping: 30 }

export function RevenueLeakCalculator({ onCTA }: RevenueLeakCalculatorProps) {
  const [sessions, setSessions] = useState("")
  const [convRate, setConvRate] = useState("")
  const [aov, setAov] = useState("")
  const [calculated, setCalculated] = useState(false)
  const [displayLeak, setDisplayLeak] = useState(0)
  const animationRef = useRef<number>(0)

  const sessionsNum = parseFloat(sessions) || 0
  const convRateNum = parseFloat(convRate) || 0
  const aovNum = parseFloat(aov) || 0

  // Industry average conversion rate
  const targetRate = 2.0
  const hasAllInputs = sessionsNum > 0 && convRateNum > 0 && aovNum > 0

  const currentRevenue = sessionsNum * (convRateNum / 100) * aovNum
  const targetRevenue = sessionsNum * (targetRate / 100) * aovNum
  const monthlyLeak = targetRevenue - currentRevenue
  const annualOpportunity = monthlyLeak * 12

  // Animate the counter when values change
  const animateCounter = useCallback((target: number) => {
    const start = displayLeak
    const diff = target - start
    const duration = 800
    const startTime = performance.now()

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayLeak(Math.round(start + diff * eased))
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(step)
      }
    }

    cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(step)
  }, [displayLeak])

  useEffect(() => {
    if (hasAllInputs && convRateNum < targetRate) {
      setCalculated(true)
      animateCounter(monthlyLeak)
    } else if (hasAllInputs && convRateNum >= targetRate) {
      setCalculated(true)
      animateCounter(0)
    } else {
      setCalculated(false)
    }
  }, [sessionsNum, convRateNum, aovNum]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="my-4 rounded-xl border border-border/60 bg-background overflow-hidden"
    >
      <div className="p-4">
        {/* Inputs row */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Sessions/mo</label>
            <input
              type="text"
              inputMode="decimal"
              value={sessions}
              onChange={(e) => setSessions(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="50000"
              className="w-full px-3 py-2.5 rounded-lg border border-border/60 bg-muted/20 text-sm tabular-nums focus:outline-none focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Conv %</label>
            <input
              type="text"
              inputMode="decimal"
              value={convRate}
              onChange={(e) => setConvRate(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="1.2"
              className="w-full px-3 py-2.5 rounded-lg border border-border/60 bg-muted/20 text-sm tabular-nums focus:outline-none focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">AOV</label>
            <input
              type="text"
              inputMode="decimal"
              value={aov}
              onChange={(e) => setAov(e.target.value.replace(/[^0-9.$]/g, ""))}
              placeholder="$65"
              className="w-full px-3 py-2.5 rounded-lg border border-border/60 bg-muted/20 text-sm tabular-nums focus:outline-none focus:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {calculated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={spring}
            >
              <div className="mt-4 p-4 rounded-xl bg-muted/30">
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.05 }}
                  className="text-[32px] font-semibold tabular-nums leading-none text-foreground"
                >
                  {displayLeak > 0 ? `-$${displayLeak.toLocaleString()}` : "$0"}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: 0.1 }}
                  className="text-[13px] text-muted-foreground mt-1"
                >
                  {displayLeak > 0 ? "leaked this month" : "You're at or above industry average"}
                </motion.p>

                {annualOpportunity > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.15 }}
                    className="text-[13px] text-muted-foreground mt-3"
                  >
                    At {targetRate}% (industry avg) you'd have{" "}
                    <span className="font-semibold text-foreground">${Math.round(annualOpportunity).toLocaleString()}</span>{" "}
                    more this year
                  </motion.p>
                )}

                {displayLeak > 0 && onCTA && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCTA}
                    className="mt-4 w-full py-3 rounded-xl bg-action text-action-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Let me fix this
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
