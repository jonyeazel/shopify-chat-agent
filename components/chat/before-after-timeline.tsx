"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import type { CaseStudy } from "@/lib/component-data"

interface BeforeAfterTimelineProps {
  caseStudy: CaseStudy
}

const spring = { type: "spring" as const, stiffness: 450, damping: 30 }

export function BeforeAfterTimeline({ caseStudy }: BeforeAfterTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const milestone = caseStudy.milestones[activeIndex]

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    // Scroll the dot into view
    const dots = scrollRef.current?.children
    if (dots?.[index]) {
      (dots[index] as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="my-4 rounded-xl border border-border/60 bg-background overflow-hidden"
    >
      <div className="p-4">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-4">{caseStudy.clientName}</p>

        {/* Timeline dots */}
        <div className="relative mb-4">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />

          <div
            ref={scrollRef}
            className="flex items-center justify-between relative"
          >
            {caseStudy.milestones.map((m, i) => (
              <button
                key={m.date}
                onClick={() => handleDotClick(i)}
                className="flex flex-col items-center gap-1.5 relative z-10 active:scale-[0.92] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1 -m-1"
                style={{ minWidth: 44, minHeight: 44 }}
              >
                <div
                  className={`rounded-full transition-all duration-150 ${
                    i === activeIndex
                      ? "w-3 h-3 bg-foreground"
                      : i < activeIndex
                        ? "w-2.5 h-2.5 bg-foreground/40"
                        : "w-2 h-2 border border-foreground/30 bg-background"
                  }`}
                />
                <span className={`text-[10px] whitespace-nowrap ${
                  i === activeIndex ? "text-foreground font-medium" : "text-muted-foreground"
                }`}>
                  {m.date}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone card */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className="p-4 rounded-xl bg-muted/30"
        >
          <p className="text-[13px] font-semibold text-foreground">{milestone.label}</p>
          <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{milestone.description}</p>

          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Conv Rate</p>
              <p className="text-[15px] font-semibold tabular-nums text-foreground">{milestone.metrics.conversionRate}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Revenue</p>
              <p className="text-[15px] font-semibold tabular-nums text-foreground">{milestone.metrics.revenue}</p>
            </div>
          </div>

          {/* Quote */}
          {milestone.quote && (
            <div className="mt-3 pt-3 border-t border-border/40">
              <p className="text-[13px] italic text-foreground/80 leading-relaxed">"{milestone.quote.text}"</p>
              <p className="text-[11px] text-muted-foreground mt-1">{milestone.quote.author}, {milestone.quote.role}</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
