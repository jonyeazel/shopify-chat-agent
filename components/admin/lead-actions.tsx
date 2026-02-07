"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  X,
  FileText,
  Rocket,
  Send,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Copy,
  RefreshCw,
  LinkIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { approveQuote, rejectQuote, requoteLeadAction, sendContract, triggerProjectBuild } from "@/app/actions/admin"

interface LeadActionsProps {
  lead: any
  onUpdate?: () => void
}

export function LeadActions({ lead, onUpdate }: LeadActionsProps) {
  const router = useRouter()
  const quote = lead.quotes?.[0]
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [showRequote, setShowRequote] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [requoteData, setRequoteData] = useState({
    baseBuildPrice: quote?.base_build_price || 4997,
    monthlyRetainer: quote?.monthly_retainer || 997,
    revSharePercentage: quote?.rev_share_percentage || 5,
    notes: "",
  })
  const [copied, setCopied] = useState(false)

  const handleApprove = async () => {
    if (!quote) return
    setIsLoading("approve")
    try {
      await approveQuote(quote.id, lead.id)
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleReject = async () => {
    if (!quote || !rejectReason) return
    setIsLoading("reject")
    try {
      await rejectQuote(quote.id, lead.id, rejectReason)
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(null)
      setShowReject(false)
    }
  }

  const handleRequote = async () => {
    if (!quote) return
    setIsLoading("requote")
    try {
      await requoteLeadAction(lead.id, quote.id, requoteData)
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(null)
      setShowRequote(false)
    }
  }

  const handleSendContract = async () => {
    if (!quote) return
    setIsLoading("contract")
    try {
      await sendContract(lead.id, quote.id)
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const handleTriggerBuild = async () => {
    setIsLoading("build")
    try {
      await triggerProjectBuild(lead.id)
      router.refresh()
      onUpdate?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(null)
    }
  }

  const copyLink = (path: string) => {
    const url = `${window.location.origin}${path}/${lead.id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPendingReview = lead.status === "paid" && quote?.proposal_paid && !quote?.accepted_at
  const isQualified = lead.status === "qualified" || quote?.status === "accepted"
  const isBuilding = lead.status === "building"
  const isLive = lead.status === "completed"

  const formatCurrency = (n: number) => `$${n.toLocaleString()}`

  return (
    <div className="space-y-6">
      {/* Store metrics summary */}
      {lead.store_metrics && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Health Score</p>
            <p className="text-lg font-semibold text-foreground">{lead.store_metrics.health_score}/100</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Opportunity</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(lead.store_metrics.revenue_opportunity || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Pending Review Actions */}
      {isPendingReview && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-700 mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Requires Your Review</span>
          </div>
          <p className="text-sm text-amber-600 mb-4">
            This lead paid $97 for a proposal. Review their metrics and approve, reject, or requote.
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleApprove}
              disabled={isLoading !== null}
              size="sm"
              className="bg-[#2f4a3a] hover:bg-[#253a2e] text-white"
            >
              {isLoading === "approve" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              Approve
            </Button>
            <Button onClick={() => setShowRequote(true)} disabled={isLoading !== null} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-1" />
              Requote
            </Button>
            <Button
              onClick={() => setShowReject(true)}
              disabled={isLoading !== null}
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>

          {showReject && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-foreground mb-2">Reason for rejection:</p>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Store doesn't meet minimum revenue requirements..."
                className="bg-background border-border mb-2"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={!rejectReason || isLoading !== null}
                  size="sm"
                  variant="destructive"
                >
                  {isLoading === "reject" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                </Button>
                <Button onClick={() => setShowReject(false)} size="sm" variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {showRequote && (
            <div className="mt-4 p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-foreground mb-3">Adjust pricing:</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-muted-foreground">Build Price</label>
                  <Input
                    type="number"
                    value={requoteData.baseBuildPrice}
                    onChange={(e) => setRequoteData({ ...requoteData, baseBuildPrice: Number(e.target.value) })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Monthly</label>
                  <Input
                    type="number"
                    value={requoteData.monthlyRetainer}
                    onChange={(e) => setRequoteData({ ...requoteData, monthlyRetainer: Number(e.target.value) })}
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Rev %</label>
                  <Input
                    type="number"
                    value={requoteData.revSharePercentage}
                    onChange={(e) => setRequoteData({ ...requoteData, revSharePercentage: Number(e.target.value) })}
                    className="bg-background border-border"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRequote} disabled={isLoading !== null} size="sm">
                  {isLoading === "requote" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send New Quote"}
                </Button>
                <Button onClick={() => setShowRequote(false)} size="sm" variant="ghost">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Qualified Actions */}
      {isQualified && !isBuilding && (
        <div className="bg-[#e8f2ea] border border-[#93b89d] rounded-lg p-4">
          <div className="flex items-center gap-2 text-[#253a2e] mb-3">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Ready for Contract</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSendContract}
              disabled={isLoading !== null}
              size="sm"
              className="bg-[#2f4a3a] hover:bg-[#253a2e] text-white"
            >
              {isLoading === "contract" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-1" />
              )}
              Create Contract
            </Button>
            <Button onClick={() => copyLink("/sign")} size="sm" variant="outline">
              {copied ? <Check className="w-4 h-4 mr-1" /> : <LinkIcon className="w-4 h-4 mr-1" />}
              Copy Signing Link
            </Button>
            <Button onClick={handleTriggerBuild} disabled={isLoading !== null} size="sm" variant="outline">
              {isLoading === "build" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Rocket className="w-4 h-4 mr-1" />
              )}
              Start Build
            </Button>
          </div>
        </div>
      )}

      {/* Building */}
      {isBuilding && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700 mb-3">
            <Rocket className="w-4 h-4" />
            <span className="text-sm font-medium">Project In Progress</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={`/portal/${lead.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Portal
              </a>
            </Button>
            <Button onClick={() => copyLink("/portal")} size="sm" variant="outline">
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              Copy Link
            </Button>
          </div>
        </div>
      )}

      {/* Live */}
      {isLive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-3">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Project Live</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={`/portal/${lead.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Client Portal
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">Quick Links</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
            <a href={`/report/${lead.id}`} target="_blank" rel="noopener noreferrer">
              <FileText className="w-3 h-3 mr-1" />
              Report
            </a>
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
            <a href={`https://${lead.store_domain}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Store
            </a>
          </Button>
        </div>
      </div>

      {/* Issues preview */}
      {lead.cro_issues?.length > 0 && (
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Top Issues</p>
          <div className="space-y-2">
            {lead.cro_issues.slice(0, 3).map((issue: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      issue.severity === "critical"
                        ? "bg-red-500"
                        : issue.severity === "high"
                          ? "bg-amber-500"
                          : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-foreground truncate max-w-[180px]">{issue.title}</span>
                </div>
                <span className="text-red-600 text-xs">-{formatCurrency(issue.estimated_impact || 0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
