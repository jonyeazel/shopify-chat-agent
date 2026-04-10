"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ExternalLink, Zap, Globe, CreditCard, Rocket, Code2, Sparkles } from "lucide-react"

interface V0ExplainerDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const PLATFORM_COMPARISON = [
  {
    name: "Traditional Developer",
    timeline: "4-12 weeks",
    cost: "$5,000 - $50,000+",
    pain: "Endless revisions, scope creep, miscommunication, invoices that keep growing",
  },
  {
    name: "Webflow / Squarespace",
    timeline: "1-4 weeks",
    cost: "$500 - $2,000 + monthly fees",
    pain: "Steep learning curve, template limitations, looks like everyone else",
  },
  {
    name: "Fiverr / Upwork",
    timeline: "1-3 weeks",
    cost: "$200 - $2,000",
    pain: "Quality roulette, communication barriers, you get what you pay for",
  },
  {
    name: "v0 + The Cook Method",
    timeline: "Hours, not weeks",
    cost: "$20/month for v0 + learning",
    pain: "None. You describe it, AI builds it, you iterate in plain English",
    highlight: true,
  },
]

const FAQ_ITEMS = [
  {
    q: "What exactly is v0?",
    a: "v0 is Vercel's AI-powered development platform. You describe what you want in plain English, and it generates production-ready code. It's not a template - it creates custom sites from your description. Think of it as having a senior developer who works at the speed of thought."
  },
  {
    q: "What's Vercel?",
    a: "Vercel is the company that created Next.js (used by Nike, Netflix, Notion, and half the Fortune 500). They're the leaders in web deployment. When you build with v0, you're using the same infrastructure that powers the world's biggest sites. One click deploys your site globally."
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT gives you code snippets you have to piece together. v0 gives you complete, working applications with a live preview. You can see your changes in real-time and deploy with one click. It's purpose-built for building websites, not general chat."
  },
  {
    q: "What about Bolt, Lovable, Replit?",
    a: "They're all good tools. But v0 is built by Vercel - the same team behind Next.js. The integration is seamless: build in v0, deploy to Vercel, connect your domain, done. No context switching. No export/import headaches. It's all one ecosystem."
  },
  {
    q: "Do I need to know how to code?",
    a: "No. That's the whole point. You describe outcomes in plain English: 'A pricing page that makes the expensive option feel obvious.' The AI handles the code. You handle the vision."
  },
  {
    q: "What can I actually build?",
    a: "Anything. Landing pages, portfolios, SaaS apps, e-commerce stores, dashboards, blogs, booking systems, membership sites. If you can describe it, v0 can build it. This site you're on right now? Built entirely with v0."
  },
  {
    q: "What about Shopify stores?",
    a: "v0 integrates beautifully with Shopify. You can build custom storefronts, landing pages for products, and marketing sites that connect to your Shopify backend. Best of both worlds: Shopify's commerce engine + v0's design freedom."
  },
  {
    q: "How much does v0 cost?",
    a: "v0 has a free tier to start. Pro is $20/month for more generations. My course ($497) teaches you how to use those generations efficiently - so you build more with less. The method pays for itself on your first project."
  },
  {
    q: "So I pay you AND pay v0?",
    a: "Yes, to be transparent: my course is $497 one-time, and v0 is $20/month (with a free tier to start). I teach you the skill. v0 is the tool. Think of it like a cooking class - you pay the chef to teach you, and you buy your own ingredients."
  },
  {
    q: "What if I've never built anything before?",
    a: "Perfect. You have no bad habits to unlearn. The Cook Method is designed for beginners. If you can text a friend, you can prompt v0. The barrier isn't technical skill - it's knowing what to say. That's what I teach."
  },
]

export function V0ExplainerDrawer({ isOpen, onClose }: V0ExplainerDrawerProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[92vh] bg-background rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-foreground">What is v0?</h2>
                <p className="text-sm text-muted-foreground">And why you&apos;ll never go back</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero Section */}
              <div className="px-5 py-6 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <img src="/v0-logo-light.png" alt="v0" className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="font-semibold">v0 by Vercel</p>
                    <p className="text-sm text-white/60">AI-Powered Development</p>
                  </div>
                </div>
                <p className="text-[15px] leading-relaxed text-white/80">
                  Describe what you want. Watch it build. Iterate in plain English. Deploy in one click. 
                  It&apos;s the first time building websites actually feels like the future.
                </p>
              </div>

              {/* Pain Is The Pitch */}
              <div className="px-5 py-6 border-b border-border/30">
                <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  The Old Way vs. The New Way
                </h3>
                <div className="space-y-3">
                  {PLATFORM_COMPARISON.map((item, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border ${
                        item.highlight 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-muted/30 border-border/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className={`font-medium ${item.highlight ? 'text-green-900' : 'text-foreground'}`}>
                          {item.name}
                        </p>
                        {item.highlight && (
                          <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-semibold rounded-full uppercase">
                            This
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4 text-[12px] mb-2">
                        <span className={item.highlight ? 'text-green-700' : 'text-muted-foreground'}>
                          {item.timeline}
                        </span>
                        <span className={item.highlight ? 'text-green-700' : 'text-muted-foreground'}>
                          {item.cost}
                        </span>
                      </div>
                      <p className={`text-[13px] ${item.highlight ? 'text-green-800' : 'text-muted-foreground'}`}>
                        {item.pain}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* The Stack */}
              <div className="px-5 py-6 border-b border-border/30">
                <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  What You Get Access To
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Sparkles, label: "AI Code Generation", desc: "Describe it, build it" },
                    { icon: Globe, label: "One-Click Deploy", desc: "Live in 30 seconds" },
                    { icon: Rocket, label: "Custom Domains", desc: "yoursite.com" },
                    { icon: Code2, label: "Full Code Access", desc: "Own everything" },
                    { icon: Zap, label: "Edge Network", desc: "Fast everywhere" },
                    { icon: CreditCard, label: "Shopify Ready", desc: "E-commerce built in" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                      <item.icon className="w-5 h-5 text-foreground mb-2" />
                      <p className="text-[13px] font-medium text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit Transparency */}
              <div className="px-5 py-6 border-b border-border/30 bg-amber-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900 mb-1">Transparency on Costs</p>
                    <p className="text-[13px] text-amber-800 leading-relaxed">
                      My course is $497 one-time. You&apos;ll also need a v0 subscription ($20/month, free tier available). 
                      I teach you the skill. v0 is the tool you use that skill with. 
                      The method I teach helps you build more with fewer credits.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Uber Moment */}
              <div className="px-5 py-6 border-b border-border/30">
                <p className="text-[15px] text-foreground leading-relaxed">
                  <span className="font-semibold">Fair warning:</span> Once you build your first site with v0, 
                  your brain gets rewired. It&apos;s like the first time you took an Uber - you don&apos;t go back 
                  to hailing cabs. I apologize in advance if you never use your old tools again.
                </p>
              </div>

              {/* FAQ Section */}
              <div className="px-5 py-6">
                <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                  {FAQ_ITEMS.map((item, i) => (
                    <div 
                      key={i}
                      className="border border-border/50 rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                      >
                        <span className="text-[14px] font-medium text-foreground pr-4">{item.q}</span>
                        <ChevronDown 
                          className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                            openFaq === i ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-[13px] text-muted-foreground leading-relaxed">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 py-6 bg-neutral-900 text-white">
                <p className="text-[15px] text-white/80 mb-4 text-center">
                  Ready to see what&apos;s possible?
                </p>
                <a
                  href="https://v0.app/@yeazel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white text-neutral-900 font-semibold text-[14px] hover:bg-neutral-100 transition-colors"
                >
                  See Jon&apos;s v0 Profile
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={onClose}
                  className="w-full mt-3 py-3 rounded-xl border border-white/20 text-white font-medium text-[14px] hover:bg-white/10 transition-colors"
                >
                  Back to Chat
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
