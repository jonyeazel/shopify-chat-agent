"use client"

import { motion } from "framer-motion"
// Fixed import - V0_TUTOR replaces deprecated V0_UNIVERSITY
import { V0_TUTOR, formatPrice } from "@/lib/products"

export function PaymentOptions({
  onCheckout,
}: {
  onCheckout?: () => void
}) {
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
            <p className="font-medium text-neutral-900">{V0_TUTOR.name}</p>
            <p className="text-sm text-neutral-500">Lifetime access</p>
          </div>
          <p className="text-xl font-semibold text-neutral-900">{formatPrice(V0_TUTOR.priceInCents)}</p>
        </div>

        <div className="text-sm text-neutral-600 mb-4 space-y-1">
          <p>Private AI tutor 24/7</p>
          <p>36-word seed prompt system</p>
          <p>Domain, Stripe, Supabase guides</p>
        </div>

        <button
          onClick={onCheckout}
          className="w-full py-3 px-4 rounded-xl bg-[#635BFF] text-white font-medium flex items-center justify-center gap-2 hover:bg-[#5851ea] active:scale-[0.98] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
          </svg>
          Get instant access
        </button>
      </div>
    </motion.div>
  )
}
