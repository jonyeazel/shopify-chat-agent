"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Lock, Sparkles } from "lucide-react"

// 5 Foundation Templates - curated, not overwhelming
const FOUNDATION_TEMPLATES = [
  {
    id: "landing",
    name: "Landing Page",
    tagline: "Convert visitors into customers",
    color: "#10B981",
    description: "Hero, features, social proof, CTA. The structure that sells.",
    useCases: ["Product launches", "SaaS pages", "Course sales", "App downloads"],
    preview: "Everything you need to capture attention and drive action. Hero section, feature grid, testimonials, pricing, and CTA—all working together."
  },
  {
    id: "portfolio",
    name: "Portfolio",
    tagline: "Showcase your best work",
    color: "#8B5CF6",
    description: "Projects, about, contact. Clean and memorable.",
    useCases: ["Designers", "Developers", "Creators", "Freelancers"],
    preview: "A minimal showcase that lets your work speak. Project grid, about section, and contact—nothing more, nothing less."
  },
  {
    id: "store",
    name: "Store",
    tagline: "Sell products online",
    color: "#F59E0B",
    description: "Products, cart, checkout. The e-commerce essentials.",
    useCases: ["Shopify stores", "Digital products", "Merchandise", "Physical goods"],
    preview: "Product cards, collection grid, cart drawer, and checkout flow. Everything needed to sell, nothing that slows you down."
  },
  {
    id: "blog",
    name: "Blog",
    tagline: "Share your ideas",
    color: "#EC4899",
    description: "Posts, reading experience, newsletter. Content that connects.",
    useCases: ["Personal blogs", "Company updates", "Thought leadership", "Newsletters"],
    preview: "Article layout with great typography, post cards for browsing, and newsletter capture. Content-first design."
  },
  {
    id: "app",
    name: "Web App",
    tagline: "Build interactive tools",
    color: "#3B82F6",
    description: "Dashboard, data, actions. App-like experiences.",
    useCases: ["SaaS dashboards", "Admin panels", "Internal tools", "AI interfaces"],
    preview: "Sidebar nav, data tables, cards, and actions. The foundation for any tool or dashboard you can imagine."
  }
]

// 5 Power Prompts - the exact words that work
const POWER_PROMPTS = [
  {
    name: "The Starter",
    description: "Gets you 80% there in one prompt",
    prompt: "Build a [type] for [purpose]. Include [sections]. Style: modern, minimal, professional."
  },
  {
    name: "The Refiner",
    description: "Fixes what doesn't look right",
    prompt: "Make this more [adjective]. Specifically: [what to change]. Keep [what to preserve]."
  },
  {
    name: "The Cloner",
    description: "Recreates sites you admire",
    prompt: "Match the style of [reference]. Same layout, different content. Focus on [specific element]."
  },
  {
    name: "The Expander",
    description: "Adds sections without breaking things",
    prompt: "Add a [section type] between [existing sections]. Match existing styles exactly."
  },
  {
    name: "The Polisher",
    description: "Makes it feel premium",
    prompt: "Add subtle animations, better spacing, micro-interactions. Make it feel expensive."
  }
]

// Template card component
function TemplateCard({ 
  template, 
  index,
  isExpanded,
  onToggle
}: { 
  template: typeof FOUNDATION_TEMPLATES[0]
  index: number
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onToggle}
      className="group cursor-pointer"
    >
      <div 
        className="relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
        style={{ 
          borderColor: isExpanded ? template.color : 'rgb(229 231 235)',
          background: isExpanded ? `${template.color}08` : 'white'
        }}
      >
        {/* Number badge */}
        <div 
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: template.color }}
        >
          {index + 1}
        </div>
        
        {/* Template name */}
        <h3 className="text-xl font-semibold text-foreground mb-1">
          {template.name}
        </h3>
        
        {/* Tagline */}
        <p className="text-sm font-medium mb-3" style={{ color: template.color }}>
          {template.tagline}
        </p>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          {template.description}
        </p>
        
        {/* Use cases */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.useCases.map((use) => (
            <span 
              key={use} 
              className="px-2 py-0.5 rounded-full text-[11px] bg-neutral-100 text-neutral-600"
            >
              {use}
            </span>
          ))}
        </div>
        
        {/* Expanded preview */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {template.preview}
            </p>
          </div>
        </motion.div>
        
        {/* Expand indicator */}
        <div className="flex items-center justify-center mt-2">
          <div 
            className={`w-1 h-1 rounded-full transition-all duration-200 ${isExpanded ? 'bg-neutral-400' : 'bg-neutral-300'}`} 
          />
        </div>
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            Included with Playbook
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            5 Templates. 5 Prompts.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Intentionally curated. Not 100 templates you'll never use.
            These 5 cover 90% of what people actually build.
          </p>
        </motion.div>
      </section>

      {/* Foundation Templates */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-foreground">Foundation Templates</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FOUNDATION_TEMPLATES.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              isExpanded={expandedId === template.id}
              onToggle={() => setExpandedId(expandedId === template.id ? null : template.id)}
            />
          ))}
        </div>
      </section>

      {/* Power Prompts */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-foreground">Power Prompts</h2>
        </div>
        
        <div className="space-y-3">
          {POWER_PROMPTS.map((prompt, index) => (
            <motion.div
              key={prompt.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="p-5 rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{prompt.name}</h3>
                  <p className="text-sm text-muted-foreground">{prompt.description}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-900 text-white">
                  {index + 1}
                </span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-neutral-50 font-mono text-xs text-neutral-600">
                {prompt.prompt}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="text-center p-8 rounded-3xl bg-neutral-900 text-white">
          <h3 className="text-xl font-semibold mb-2">Ready to build?</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Get the templates, prompts, and the core method video.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-medium hover:bg-neutral-100 transition-colors"
          >
            Get The Playbook — $297
          </Link>
        </div>
      </section>
    </div>
  )
}
