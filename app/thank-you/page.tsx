import { Suspense } from "react"
import { CheckCircle, Mail, Calendar, ArrowRight, FileText, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SmsTrigger } from "@/components/sms-trigger"

async function ThankYouContent({ leadId }: { leadId: string | null }) {
  if (!leadId) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-3">Thank You</h1>
        <p className="text-muted-foreground">Your request has been received.</p>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: lead } = await supabase.from("leads").select("*, quotes(*)").eq("id", leadId).single()

  const quote = lead?.quotes?.[0]
  const isPaid = quote?.proposal_paid

  return (
    <>
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-background" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {isPaid ? "Payment successful" : "Quote submitted"}
        </h1>
        <p className="text-muted-foreground">
          {isPaid ? "Your full CRO audit is ready." : "Complete your payment to unlock your personalized audit."}
        </p>
      </div>

      {isPaid && (
        <div className="bg-foreground text-background rounded-lg p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5" />
            <div>
              <h3 className="font-medium">Your Audit Report</h3>
              <p className="text-sm text-background/70">View your personalized CRO analysis</p>
            </div>
          </div>
          <Button asChild variant="secondary" className="w-full bg-background text-foreground hover:bg-background/90">
            <Link href={`/report/${leadId}`}>
              View Full Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}

      <div className="bg-muted/50 border border-border rounded-lg p-5 mb-8">
        <div className="space-y-5">
          <div className="flex items-start gap-4 text-left">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-background" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                {isPaid ? `Report summary sent to ${lead?.email}` : "Confirmation email on the way."}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left">
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-background" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Schedule a call</h3>
              <p className="text-sm text-muted-foreground">Review your audit and discuss next steps.</p>
            </div>
          </div>
        </div>
      </div>

      {lead && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-8 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Store</span>
            <span className="text-foreground font-medium">{lead.store_domain}</span>
          </div>
          {quote && (
            <>
              <div className="flex items-center justify-between text-muted-foreground mt-2">
                <span>Package</span>
                <span className="text-foreground font-medium capitalize">{quote.package_tier || "Growth"}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground mt-2">
                <span>Investment</span>
                <span className="text-foreground font-medium">
                  ${quote.base_build_price?.toLocaleString()} + ${quote.monthly_retainer}/mo
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        <Button asChild className="w-full h-11 bg-foreground text-background hover:bg-foreground/90">
          <a href="https://calendly.com/theshopifyguy/cro-strategy" target="_blank" rel="noopener noreferrer">
            Book Strategy Call
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <SmsTrigger context="thank-you">
          <Button variant="outline" className="w-full h-11 bg-transparent">
            <MessageCircle className="w-4 h-4 mr-2" />
            Text Jon
          </Button>
        </SmsTrigger>
        {isPaid && (
          <Button asChild variant="outline" className="w-full h-11 bg-transparent">
            <Link href={`/report/${leadId}`}>
              <FileText className="w-4 h-4 mr-2" />
              View Report
            </Link>
          </Button>
        )}
        <Button asChild variant="ghost" className="w-full text-muted-foreground">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Questions?{" "}
        <SmsTrigger context="thank-you">
          <button className="underline hover:text-foreground cursor-pointer">
            Text me
          </button>
        </SmsTrigger>
        {" · "}
        <a href="mailto:support@theshopifyguy.com" className="underline hover:text-foreground">
          Email
        </a>
      </p>
    </>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin mb-4" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  )
}

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead: leadId } = await searchParams

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <Suspense fallback={<LoadingState />}>
          <ThankYouContent leadId={leadId || null} />
        </Suspense>
      </div>
    </div>
  )
}
