import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | v0 University",
  description: "Frequently asked questions about v0 University, pricing, and how the AI tutor works.",
}

const FAQS = [
  {
    q: "What exactly is v0?",
    a: "v0 is Vercel's AI that turns text descriptions into working websites. You describe what you want, it builds it. v0 University teaches you how to get the best results from it."
  },
  {
    q: "Do I need to know how to code?",
    a: "No. If you can describe something, you can build it. The whole point is that v0 handles the technical stuff. You just need to know what you want."
  },
  {
    q: "What's the '36-word seed prompt' method?",
    a: "It's the pattern Jon discovered after 25,000+ prompts. You start with a concise description (36 words or less), then say 'Cook' to let the AI iterate. Simple, but it works every time."
  },
  {
    q: "How is this different from just using v0 myself?",
    a: "You could figure it out yourself — Jon did. It took 25,000 prompts. The Tutor gives you the shortcuts: what works, what doesn't, and how to get professional results immediately."
  },
  {
    q: "What does '$497 for lifetime access' mean?",
    a: "One payment. Access forever. No subscriptions, no recurring fees. The AI Tutor is yours to use whenever you want, as much as you want."
  },
  {
    q: "What's the difference between v0 Tutor and Clone This Site?",
    a: "v0 Tutor ($497) teaches you to build. Clone This Site ($3,497) means Jon builds it for you — this exact site, customized for your business, with the AI trained on what you do."
  },
  {
    q: "Do I need a v0 account?",
    a: "Yes. You'll need a v0 account to actually build things. Sign up at v0.dev — Jon's referral link (v0.link/jon) gets you $10 in free credits."
  },
  {
    q: "How much does v0 itself cost?",
    a: "v0 has a free tier and paid plans starting at $20/month. Most people find the free tier enough to get started. The $50/month plan removes most limits."
  },
  {
    q: "What can I build with this?",
    a: "Landing pages, Shopify storefronts, portfolios, SaaS dashboards, product pages, blogs — basically any website. If you can describe it, you can build it."
  },
  {
    q: "How long does it take to build a site?",
    a: "A simple landing page: 5-15 minutes. A full Shopify-style product page: 30-60 minutes. A complex dashboard: a few hours. It depends on how much you iterate."
  },
  {
    q: "Is there a guarantee?",
    a: "The transformation is immediate — you'll know within minutes if this is for you. If you have questions before buying, just ask the AI on the homepage or text Jon directly."
  },
  {
    q: "Can I text Jon?",
    a: "Yes. +1 (407) 867-7201. He reads every message."
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to v0 University
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight mb-2">Frequently Asked Questions</h1>
          <p className="text-neutral-500">Everything you need to know about v0 University.</p>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5">
              <h2 className="font-medium text-neutral-900 mb-2">{faq.q}</h2>
              <p className="text-[15px] text-neutral-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-neutral-200 text-center">
          <p className="text-neutral-600 mb-4">Still have questions?</p>
          <div className="flex items-center justify-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Ask the AI
            </Link>
            <a 
              href="sms:+14078677201"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#007AFF] text-white text-sm font-medium rounded-xl hover:bg-[#0066DD] transition-colors"
            >
              Text Jon
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
