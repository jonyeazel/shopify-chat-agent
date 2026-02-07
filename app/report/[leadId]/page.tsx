import { createClient } from "@/lib/supabase/server"
import { ReportView } from "@/components/report/report-view"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Lock } from "lucide-react"

interface ReportPageProps {
  params: Promise<{ leadId: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { leadId } = await params
  const supabase = await createClient()

  const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single()

  if (!lead) {
    notFound()
  }

  const { data: metrics } = await supabase.from("store_metrics").select("*").eq("lead_id", leadId).single()

  const { data: monthlyMetrics } = await supabase
    .from("monthly_metrics")
    .select("*")
    .eq("lead_id", leadId)
    .order("month", { ascending: true })

  const { data: issues } = await supabase.from("cro_issues").select("*").eq("lead_id", leadId)

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (!quote?.proposal_paid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">Report Locked</h1>
          <p className="text-muted-foreground mb-8">
            Complete your purchase to unlock your personalized CRO audit report with detailed analysis and
            recommendations.
          </p>
          <Button asChild className="h-11 px-8 bg-foreground text-background hover:bg-foreground/90">
            <Link href="/">Get Your Audit</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ReportView
      lead={lead}
      metrics={metrics}
      monthlyMetrics={monthlyMetrics || []}
      issues={issues || []}
      quote={quote}
    />
  )
}
