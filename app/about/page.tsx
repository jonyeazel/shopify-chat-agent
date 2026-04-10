import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | v0 University",
  description: "Meet Jon, the world's most experienced v0 user with 25,000+ prompts. Learn the story behind v0 University.",
}

export default function AboutPage() {
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
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src="/images/jon-profile.png" 
              alt="Jon"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Jon Yeazel</h1>
              <p className="text-neutral-500">Founder, v0 University</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">The short version</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            I have 25,000+ prompts on v0. More than anyone I know of. At some point I stopped counting and started teaching.
          </p>

          <h2 className="text-xl font-semibold text-neutral-900 mb-4 mt-10">The longer version</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            I used to hire designers. I used to wait weeks for landing pages. I used to pay $5k for something that wasn&apos;t quite right, then pay more to fix it.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-4">
            Then I found v0. I got obsessed. I built sites for myself, then for friends, then for clients. Somewhere around prompt 10,000, people started asking how I was doing it.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-4">
            The answer was simple: a 36-word seed prompt and the word &quot;Cook.&quot; That&apos;s it. No fancy techniques. No secret tools. Just a pattern that works every time.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-6">
            v0 University is that pattern, packaged into something you can actually use. A private AI tutor that teaches you exactly what I learned over 25,000 prompts — without the 25,000 prompts.
          </p>

          <h2 className="text-xl font-semibold text-neutral-900 mb-4 mt-10">Why I built this</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            Everyone should be able to bring their ideas to life. Not in 2 weeks. Not for $5,000. In an afternoon, for less than $50.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-6">
            If you can describe something, you can build it. That&apos;s not a tagline. That&apos;s just true now.
          </p>

          <div className="mt-12 p-6 bg-white rounded-2xl border border-neutral-200">
            <p className="text-sm text-neutral-500 mb-4">Ready to try it?</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Talk to the AI
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
