import { Check, ExternalLink, Gift } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          You're in!
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Check your email for access to the video and templates.
        </p>

        {/* Free credits CTA */}
        <a
          href="https://v0.link/jon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-6 hover:bg-emerald-100 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-emerald-900">Get $10 free credits</p>
            <p className="text-sm text-emerald-700">Sign up for v0 with this link</p>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        </a>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium rounded-full hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
