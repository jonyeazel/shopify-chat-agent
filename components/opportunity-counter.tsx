"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface OpportunityCounterProps {
  amount: number
}

export function OpportunityCounter({ amount }: OpportunityCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = amount / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(amount, increment * step)
      setDisplayAmount(current)

      if (step >= steps) {
        clearInterval(timer)
        setDisplayAmount(amount)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [amount])

  return (
    <motion.div
      className="border border-border rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xs text-muted-foreground mb-2">Annual opportunity</p>
      <p className="text-3xl font-semibold text-foreground tabular-nums">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(displayAmount)}
      </p>
      <p className="text-xs text-muted-foreground mt-2">At industry-standard conversion</p>
    </motion.div>
  )
}
