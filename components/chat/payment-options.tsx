"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import { V0_UNIVERSITY } from "@/lib/products"

export function PaymentOptions({
  onCheckout,
}: {
  onCheckout?: () => void
}) {
  const price = (V0_UNIVERSITY.priceInCents / 100).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      className="my-4"
    >
      <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-neutral-900">{V0_UNIVERSITY.name}</p>
            <p className="text-sm text-neutral-500">One-time payment</p>
          </div>
          <p className="text-xl font-semibold text-neutral-900">${price}</p>
        </div>

        <div className="text-sm text-neutral-600 mb-4 space-y-1">
          <p>3-minute video tutorial</p>
          <p>AI-powered smart templates</p>
          <p>Build a site today</p>
        </div>

        <button
          onClick={onCheckout}
          className="w-full py-3 px-4 rounded-xl bg-neutral-900 text-white font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.98] transition-all"
        >
          <CreditCard className="w-4 h-4" />
          Get instant access
        </button>
      </div>
    </motion.div>
  )
}
