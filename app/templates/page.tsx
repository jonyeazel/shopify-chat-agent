"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Download, Lock } from "lucide-react"

// Template category data
const TEMPLATE_CATEGORIES = [
  {
    id: "landing",
    name: "Landing Pages",
    count: 12,
    color: "#3B82F6",
    description: "High-converting hero sections, features, and CTAs",
    files: ["hero-sections.tsx", "feature-grids.tsx", "pricing-tables.tsx", "testimonials.tsx"]
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    count: 8,
    color: "#10B981",
    description: "Product pages, carts, and checkout flows",
    files: ["product-cards.tsx", "cart-drawer.tsx", "checkout-form.tsx", "collection-grid.tsx"]
  },
  {
    id: "saas",
    name: "SaaS Dashboards",
    count: 15,
    color: "#8B5CF6",
    description: "Analytics, tables, charts, and admin panels",
    files: ["dashboard-layout.tsx", "data-tables.tsx", "chart-cards.tsx", "sidebar-nav.tsx"]
  },
  {
    id: "portfolio",
    name: "Portfolios",
    count: 6,
    color: "#F59E0B",
    description: "Creative showcases for designers and developers",
    files: ["project-grid.tsx", "about-section.tsx", "contact-form.tsx", "skill-bars.tsx"]
  },
  {
    id: "blog",
    name: "Blogs & Content",
    count: 9,
    color: "#EC4899",
    description: "Article layouts, MDX templates, and reading experiences",
    files: ["article-layout.tsx", "post-cards.tsx", "newsletter-cta.tsx", "author-bio.tsx"]
  },
  {
    id: "agency",
    name: "Agency Sites",
    count: 7,
    color: "#06B6D4",
    description: "Services, case studies, and team sections",
    files: ["services-grid.tsx", "case-study.tsx", "team-cards.tsx", "process-steps.tsx"]
  },
  {
    id: "ai",
    name: "AI & Chat",
    count: 11,
    color: "#F97316",
    description: "Chat interfaces, AI tools, and prompt UIs",
    files: ["chat-interface.tsx", "message-list.tsx", "prompt-input.tsx", "ai-response.tsx"]
  },
  {
    id: "mobile",
    name: "Mobile-First",
    count: 10,
    color: "#EF4444",
    description: "App-like experiences optimized for touch",
    files: ["bottom-nav.tsx", "swipe-cards.tsx", "pull-refresh.tsx", "gesture-drawer.tsx"]
  }
]

// Stylized folder component
function TemplateFolder({ 
  category, 
  index,
  isHovered,
  onHover
}: { 
  category: typeof TEMPLATE_CATEGORIES[0]
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
      className="group cursor-pointer"
    >
      <div className="relative">
        {/* Folder back */}
        <div 
          className="absolute inset-0 rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ 
            background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`,
            border: `1px solid ${category.color}30`
          }}
        />
        
        {/* Folder tab */}
        <div 
          className="absolute -top-3 left-4 w-16 h-5 rounded-t-lg"
          style={{ backgroundColor: `${category.color}40` }}
        />
        
        {/* Main folder body */}
        <div 
          className="relative p-6 rounded-2xl transition-all duration-300 group-hover:translate-y-[-2px]"
          style={{ 
            background: `linear-gradient(180deg, ${category.color}15 0%, transparent 100%)`,
            borderTop: `2px solid ${category.color}50`
          }}
        >
          {/* v0 badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-medium">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/>
            </svg>
            v0
          </div>
          
          {/* Folder icon */}
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${category.color}25` }}
          >
            <svg 
              className="w-7 h-7 transition-transform duration-300 group-hover:rotate-[-5deg]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke={category.color} 
              strokeWidth="1.5"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              <path d="M3 7h18" strokeDasharray="4 2" opacity="0.5" />
            </svg>
          </div>
          
          {/* Category name */}
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {category.name}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {category.description}
          </p>
          
          {/* File count */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {category.count} templates
            </span>
            <div 
              className="flex items-center gap-1 text-xs font-medium transition-colors"
              style={{ color: category.color }}
            >
              <Download className="w-3.5 h-3.5" />
              .zip
            </div>
          </div>
          
          {/* File preview on hover */}
          <motion.div
            initial={false}
            animate={{ 
              height: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Included files
              </p>
              <div className="space-y-1">
                {category.files.map((file) => (
                  <div key={file} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                    {file}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  
  const totalTemplates = TEMPLATE_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to v0 University
          </Link>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            Included with purchase
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {totalTemplates} templates included
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Template Library
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready templates organized by category. 
            Each folder contains battle-tested components you can prompt v0 to customize.
          </p>
        </motion.div>
      </section>

      {/* Template Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATE_CATEGORIES.map((category, index) => (
            <TemplateFolder
              key={category.id}
              category={category}
              index={index}
              isHovered={hoveredId === category.id}
              onHover={setHoveredId}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-white dark:text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 19h20L12 2zm0 4l6.5 11h-13L12 6z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">v0 University</p>
                <p className="text-sm text-muted-foreground">All templates + video course</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get instant access - $297
            </Link>
            
            <p className="text-xs text-muted-foreground">
              One-time payment. Lifetime updates.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
