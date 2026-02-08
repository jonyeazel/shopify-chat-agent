"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import type { Deliverable } from "@/lib/component-data"

interface ProcessPreviewStackProps {
  deliverables: Deliverable[]
}

const spring = { type: "spring" as const, stiffness: 450, damping: 30 }

export function ProcessPreviewStack({ deliverables }: ProcessPreviewStackProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const touchStartRef = useRef(0)
  const touchDeltaRef = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    touchDeltaRef.current = 0
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current
    // Clamp visual feedback to ±60px for a rubber-band feel
    const clamped = Math.max(-60, Math.min(60, touchDeltaRef.current * 0.4))
    setDragX(clamped)
  }, [])

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaRef.current
    const threshold = 40
    setDragX(0)

    if (delta < -threshold && activeIndex < deliverables.length - 1) {
      setActiveIndex(prev => prev + 1)
    } else if (delta > threshold && activeIndex > 0) {
      setActiveIndex(prev => prev - 1)
    }
  }, [activeIndex, deliverables.length])

  // Show up to 3 cards in the stack (active + 2 behind)
  const visibleCards = deliverables.map((d, i) => {
    const offset = i - activeIndex
    return { ...d, offset, originalIndex: i }
  }).filter(d => d.offset >= 0 && d.offset <= 2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="my-4"
    >
      {/* Card stack */}
      <div
        className="relative h-[180px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {visibleCards.reverse().map((card) => (
          <motion.div
            key={card.originalIndex}
            initial={false}
            animate={{
              y: card.offset * 8,
              x: card.offset === 0 ? dragX + card.offset * 4 : card.offset * 4,
              scale: 1 - card.offset * 0.03,
              opacity: card.offset === 0 ? 1 : 0.6,
              zIndex: deliverables.length - card.offset,
              rotateZ: card.offset === 0 ? dragX * 0.03 : 0,
            }}
            transition={dragX !== 0 ? { type: "tween", duration: 0 } : spring}
            className="absolute inset-0 rounded-xl border border-border/60 bg-background p-4"
          >
            {card.offset === 0 && (
              <>
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                </div>
                <p className="text-[16px] font-semibold text-foreground">{card.title}</p>
                <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{card.description}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination dots + counter */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1.5">
          {deliverables.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full p-0.5 -m-0.5"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-150 ${
                  i === activeIndex ? "bg-foreground" : "bg-foreground/20"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          {activeIndex + 1} of {deliverables.length}
        </p>
      </div>
    </motion.div>
  )
}
