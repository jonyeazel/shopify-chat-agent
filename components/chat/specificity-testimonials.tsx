"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { Testimonial } from "@/lib/component-data"

interface SpecificityTestimonialsProps {
  testimonials: Testimonial[]
}

const spring = { type: "spring" as const, stiffness: 450, damping: 30 }

export function SpecificityTestimonials({ testimonials }: SpecificityTestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="my-4 -mx-4"
    >
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 pb-2"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.06 + i * 0.03 }}
              className="flex-shrink-0 w-[280px] snap-center rounded-xl border border-border/60 bg-background p-4"
            >
              {/* Author */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-[12px] font-semibold text-muted-foreground">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{t.title}, {t.company}</p>
                </div>
              </div>

              {/* Numbers */}
              <div className="mb-3">
                <p className="text-[20px] font-semibold tabular-nums text-foreground leading-tight">
                  {t.beforeRevenue} <span className="text-muted-foreground mx-1">&rarr;</span> {t.afterRevenue}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">in {t.timeline}</p>
              </div>

              {/* Quote */}
              <p className="text-[13px] text-foreground/80 leading-relaxed mb-3">"{t.quote}"</p>

              {/* Store link */}
              {t.storeUrl && (
                <a
                  href={t.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-foreground/60 underline decoration-foreground/20 hover:decoration-foreground/40 hover:text-foreground/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  See their store
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </motion.div>
          ))}
        </div>

        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-2 w-8 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, var(--card))" }}
        />
      </div>
    </motion.div>
  )
}
