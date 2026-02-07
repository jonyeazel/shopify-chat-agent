"use client"

import { motion } from "framer-motion"

interface MetricCardProps {
  label: string
  value: string | number
  benchmark?: string | number
  status?: "good" | "warning" | "critical" | "neutral"
  delay?: number
}

export function MetricCard({ label, value, benchmark, status = "neutral", delay = 0 }: MetricCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-foreground"
      case "warning":
        return "text-amber-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-foreground"
    }
  }

  return (
    <motion.div
      className="border border-border rounded-lg p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-xl font-semibold tabular-nums ${getStatusColor()}`}>{value}</p>
      {benchmark && <p className="text-xs text-muted-foreground mt-2">Benchmark: {benchmark}</p>}
    </motion.div>
  )
}
