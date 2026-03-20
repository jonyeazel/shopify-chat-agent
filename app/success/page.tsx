import { Check } from "lucide-react"
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
