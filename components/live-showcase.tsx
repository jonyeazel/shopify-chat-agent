"use client"

import { motion } from "framer-motion"

export function LiveShowcase() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden rounded-xl">
      {/* Subtle grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0a0a0a 1px, transparent 1px),
            linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Soft radial gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99, 91, 255, 0.03) 0%, transparent 70%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              25,000+ prompts
            </span>
          </div>
          
          <h2 className="text-[28px] font-semibold text-foreground leading-tight tracking-[-0.02em] mb-3">
            Type an idea.
            <br />
            <span className="text-muted-foreground">Watch it exist.</span>
          </h2>
          
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            The world's most experienced AI builder shares the exact prompts that work.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col gap-3 text-[13px] text-muted-foreground/70"
        >
          <div className="flex items-center justify-center gap-4">
            <span>"This is sick dude"</span>
            <span className="text-foreground/20">•</span>
            <span>"Mind blown"</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
