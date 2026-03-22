import { Check, ExternalLink, Gift, Play, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            You're in.
          </h1>
          <p className="text-muted-foreground">
            Here's what to do next.
          </p>
        </div>

        {/* Next steps */}
        <div className="space-y-3 mb-8">
          {/* Step 1: Watch video */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900 mb-1">Watch the core video</p>
              <p className="text-sm text-neutral-500 mb-3">Check your email. The video link is there.</p>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Play className="w-4 h-4" />
                <span>Takes 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Step 2: Get v0 credits */}
          <a
            href="https://v0.link/jon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-900 mb-1">Get $10 free v0 credits</p>
              <p className="text-sm text-emerald-700 mb-3">Sign up through this link to start building.</p>
              <div className="flex items-center gap-2 text-sm text-emerald-600">
                <Gift className="w-4 h-4" />
                <span>Free credits applied automatically</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
          </a>

          {/* Step 3: Build something */}
          <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center flex-shrink-0 text-sm font-medium">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900 mb-1">Build your first site</p>
              <p className="text-sm text-neutral-500">Use the templates and prompts from the Playbook. Start simple.</p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="p-4 border border-neutral-200 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Questions?</p>
              <p className="text-sm text-neutral-500">Text Jon directly. He reads every message.</p>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="block w-full text-center py-3 text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
