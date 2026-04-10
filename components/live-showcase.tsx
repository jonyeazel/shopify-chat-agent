"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

// Magnetic dot grid component
function MagneticDotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    const dotSpacing = 32
    const dotRadius = 1
    const maxDisplacement = 20
    const attractionRadius = 120
    
    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      const cols = Math.ceil(rect.width / dotSpacing) + 1
      const rows = Math.ceil(rect.height / dotSpacing) + 1
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * dotSpacing
          const baseY = j * dotSpacing
          
          // Calculate distance to mouse
          const dx = mouseRef.current.x - baseX
          const dy = mouseRef.current.y - baseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          let offsetX = 0
          let offsetY = 0
          let opacity = 0.08
          
          if (distance < attractionRadius && distance > 0) {
            // Gravitational pull toward cursor
            const force = Math.pow(1 - distance / attractionRadius, 2)
            offsetX = (dx / distance) * maxDisplacement * force
            offsetY = (dy / distance) * maxDisplacement * force
            opacity = 0.08 + (0.25 * force)
          }
          
          ctx.beginPath()
          ctx.arc(baseX + offsetX, baseY + offsetY, dotRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(10, 10, 10, ${opacity})`
          ctx.fill()
        }
      }
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    
    draw()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'auto' }}
    />
  )
}

const USE_CASES = [
  { label: "Landing Pages", description: "In an afternoon" },
  { label: "Shopify Stores", description: "Complete" },
  { label: "SaaS Dashboards", description: "Production-ready" },
  { label: "Portfolios", description: "Live today" },
]

const BEFORE_AFTER = [
  { before: "Hired someone", after: "Built it yourself" },
  { before: "Waited 4 weeks", after: "Done by Friday" },
  { before: "Paid $5-50k", after: "Paid $497 total" },
]

export function LiveShowcase() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-white">
      {/* Magnetic dot grid background */}
      <MagneticDotGrid />
      
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
              Prompt Engineering
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
            For the people who
            <br />
            <span className="text-muted-foreground">build, buy & sell websites.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground/80">
            Learn the method that changes everything.
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
              className="flex flex-col items-start px-4 py-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]"
            >
              <span className="text-[13px] text-foreground/90 font-medium">{item.label}</span>
              <span className="text-[12px] text-muted-foreground/60 mt-0.5">{item.description}</span>
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
            "I built my entire store in an afternoon" — Jon, DTC founder
          </p>
        </motion.div>

        {/* Powered by badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-8 flex justify-center"
        >
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
            <img src="/images/claude-logo.png" alt="Claude" className="w-4 h-4" />
            <span>Powered by Claude Opus 4.6</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
