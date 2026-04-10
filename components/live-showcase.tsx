"use client"

import { motion } from "framer-motion"

const USE_CASES = [
  { label: "Landing Pages", time: "2 min" },
  { label: "Shopify Stores", time: "10 min" },
  { label: "SaaS Dashboards", time: "15 min" },
  { label: "Portfolios", time: "5 min" },
]

const BEFORE_AFTER = [
  { before: "$5,000 landing page", after: "$0 + 2 minutes" },
  { before: "2 weeks for revisions", after: "Say 'make it darker'" },
  { before: "Hiring a Shopify dev", after: "Build it yourself" },
]

export function LiveShowcase() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0a0a0a 1px, transparent 1px),
            linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      {/* Soft radial gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 30%, rgba(99, 91, 255, 0.04) 0%, transparent 60%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg px-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
              25,000+ prompts refined
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-[32px] font-semibold text-foreground leading-[1.15] tracking-[-0.02em] mb-3">
            The skill that replaces
            <br />
            <span className="text-muted-foreground">designers and developers.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground/80">
            One prompt method. Any website. Forever yours.
          </p>
        </motion.div>

        {/* Use cases */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-10"
        >
          {USE_CASES.map((item, i) => (
            <div 
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]"
            >
              <span className="text-[13px] text-foreground/90 font-medium">{item.label}</span>
              <span className="text-[12px] text-muted-foreground/60">{item.time}</span>
            </div>
          ))}
        </motion.div>

        {/* Before/After */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="space-y-2.5"
        >
          {BEFORE_AFTER.map((item, i) => (
            <div 
              key={i}
              className="flex items-center gap-3 text-[13px]"
            >
              <span className="text-muted-foreground/50 line-through flex-1 text-right">{item.before}</span>
              <span className="text-foreground/20">→</span>
              <span className="text-foreground/80 flex-1">{item.after}</span>
            </div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[13px] text-muted-foreground/50 italic">
            "I would kill for your seed prompt structure" — Brooks
          </p>
        </motion.div>
      </div>
    </div>
  )
}
