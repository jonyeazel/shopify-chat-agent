"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface PricingPackageProps {
  tier: "starter" | "growth" | "scale"
  price: number
  monthlyRetainer?: number
  features: string[]
  roi?: number
  recommended?: boolean
  onSelect: () => void
  selected?: boolean
}

const tierConfig = {
  starter: {
    name: "Starter",
    description: "Core optimizations",
  },
  growth: {
    name: "Growth",
    description: "Full CRO implementation",
  },
  scale: {
    name: "Scale",
    description: "Enterprise solution",
  },
}

export function PricingPackage({
  tier,
  price,
  monthlyRetainer,
  features,
  roi,
  recommended,
  onSelect,
  selected,
}: PricingPackageProps) {
  const config = tierConfig[tier]

  return (
    <motion.button
      onClick={onSelect}
      className={`relative border rounded-xl p-5 flex flex-col h-full text-left transition-all ${
        selected
          ? "border-foreground bg-muted/30"
          : recommended
            ? "border-foreground"
            : "border-border hover:border-muted-foreground"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      {recommended && (
        <div className="absolute -top-2.5 left-4">
          <span className="bg-foreground text-background text-[10px] font-medium px-2.5 py-0.5 rounded-full">
            Recommended
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">{config.name}</h3>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground tabular-nums">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
              price,
            )}
          </span>
        </div>
        {monthlyRetainer && (
          <p className="text-xs text-muted-foreground mt-1">
            +{" "}
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
              monthlyRetainer,
            )}
            /mo
          </p>
        )}
      </div>

      <ul className="space-y-2 mb-4 flex-1">
        {features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-foreground flex-shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <div
        className={`w-full py-2.5 rounded-full text-center text-sm font-medium transition-colors ${
          selected ? "bg-foreground text-background" : "bg-muted text-foreground"
        }`}
      >
        {selected ? "Selected" : "Select"}
      </div>
    </motion.button>
  )
}
