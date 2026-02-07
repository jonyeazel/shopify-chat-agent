"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  CreditCard,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  Rocket,
  Calendar,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HealthScoreDial } from "@/components/health-score-dial"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import Link from "next/link"

interface ClientPortalProps {
  lead: any
  project: any
  contract: any
  quote: any
}

const AVATAR_URL = "/images/gemini-generated-image-d9bdhjd9bdhjd9bd.jpeg"

export function ClientPortal({ lead, project, contract, quote }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "billing" | "support">("overview")

  const metrics = lead.store_metrics
  const healthScore = metrics?.health_score || 0

  const getStatusInfo = () => {
    switch (lead.status) {
      case "paid":
        return {
          label: "Audit Complete",
          color: "text-[#2f4a3a]",
          bg: "bg-[#e8f2ea]",
          border: "border-[#93b89d]",
          icon: CheckCircle,
          description: "Your CRO audit is ready for review",
        }
      case "building":
        return {
          label: "Building Your Store",
          color: "text-sky-600",
          bg: "bg-sky-50",
          border: "border-sky-200",
          icon: Rocket,
          description: "Our team is building your optimized storefront",
        }
      case "completed":
        return {
          label: "Live",
          color: "text-[#3d6049]",
          bg: "bg-[#e8f2ea]",
          border: "border-[#93b89d]",
          icon: CheckCircle,
          description: "Your optimized store is live and generating revenue",
        }
      default:
        return {
          label: "In Progress",
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: Clock,
          description: "We are processing your request",
        }
    }
  }

  const status = getStatusInfo()

  const mockPerformanceData = [
    { month: "Week 1", conversion: 0.5, revenue: 12000 },
    { month: "Week 2", conversion: 0.8, revenue: 18000 },
    { month: "Week 3", conversion: 1.2, revenue: 24000 },
    { month: "Week 4", conversion: 1.5, revenue: 32000 },
  ]

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "support", label: "Support", icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <img
                src={AVATAR_URL || "/placeholder.svg"}
                alt="The Shopify Guy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-sm font-semibold text-foreground">Client Portal</h1>
                <p className="text-xs text-muted-foreground">{lead.store_domain}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-xl bg-transparent" asChild>
                <Link href={`/report/${lead.id}`}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Report
                </Link>
              </Button>
              <Button size="sm" className="rounded-xl bg-foreground text-background hover:bg-foreground/90">
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`${status.bg} ${status.border} border rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${status.bg} flex items-center justify-center`}>
                <status.icon className={`w-6 h-6 ${status.color}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${status.color}`}>{status.label}</p>
                <p className="text-muted-foreground">{status.description}</p>
              </div>
            </div>
            {project?.status === "building" && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Estimated completion</p>
                <p className="text-lg font-semibold text-foreground">3-5 business days</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-xl ${
                activeTab === tab.id ? "bg-foreground text-background hover:bg-foreground/90" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Health Score */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Store Health Score</h3>
              <div className="flex justify-center">
                <HealthScoreDial score={healthScore} size={180} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {healthScore < 40
                    ? "Critical issues detected"
                    : healthScore < 70
                      ? "Room for improvement"
                      : "Looking good!"}
                </p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="bg-muted/30 border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Conversion Rate</span>
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {((metrics?.conversion_rate || 0) * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-[#2f4a3a] mt-1">Target: 2.50%</p>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Revenue Opportunity</span>
                </div>
                <p className="text-3xl font-bold text-red-500">
                  ${Math.round(metrics?.revenue_opportunity || 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Annual potential</p>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs">Total Sessions</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{(metrics?.total_sessions || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Average Order Value</span>
                </div>
                <p className="text-3xl font-bold text-foreground">${(metrics?.amount_per_customer || 0).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground mt-1">Per customer</p>
              </div>
            </div>

            {/* Issues Summary */}
            <div className="lg:col-span-3 bg-muted/30 border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">
                  Priority Issues ({lead.cro_issues?.length || 0})
                </h3>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent" asChild>
                  <Link href={`/report/${lead.id}`}>
                    View Full Report
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-3">
                {lead.cro_issues?.slice(0, 3).map((issue: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-background border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          issue.severity === "critical"
                            ? "text-red-500"
                            : issue.severity === "high"
                              ? "text-orange-500"
                              : "text-amber-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">{issue.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{issue.severity} priority</p>
                      </div>
                    </div>
                    <span className="text-red-500 font-medium">-${issue.estimated_impact?.toLocaleString()}</span>
                  </div>
                ))}
                {(!lead.cro_issues || lead.cro_issues.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-8">No issues identified yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Trend</h3>
              {project?.status === "live" ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockPerformanceData}>
                    <defs>
                      <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3d6049" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3d6049" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "12px" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="conversion"
                      stroke="#3d6049"
                      fillOpacity={1}
                      fill="url(#colorConv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Clock className="w-12 h-12 mb-4 opacity-30" />
                  <p>Performance data will appear once your store is live</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Your Plan</h3>
              <div className="flex items-center justify-between p-4 bg-[#e8f2ea] border border-[#93b89d] rounded-xl">
                <div>
                  <p className="text-[#253a2e] font-semibold capitalize">{quote?.package_tier || "Growth"} Package</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${quote?.monthly_retainer?.toLocaleString()}/month retainer
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#6a9976] text-[#253a2e] bg-transparent"
                >
                  Manage Plan
                </Button>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment History</h3>
              <div className="space-y-3">
                {quote?.proposal_paid && (
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#3d6049]" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Proposal Fee</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-foreground font-medium">$97.00</span>
                  </div>
                )}
                {quote?.status === "accepted" && (
                  <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#3d6049]" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Build Fee (50% Deposit)</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(quote.accepted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-foreground font-medium">
                      ${((quote.base_build_price || 0) / 2).toLocaleString()}
                    </span>
                  </div>
                )}
                {!quote?.proposal_paid && !quote?.status && (
                  <p className="text-sm text-muted-foreground text-center py-8">No payments yet</p>
                )}
              </div>
            </div>

            {/* Download Invoices */}
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-between rounded-xl bg-transparent">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Service Agreement
                  </span>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between rounded-xl bg-transparent">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Invoice - Proposal Fee
                  </span>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Get Support</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto py-6 flex-col rounded-xl bg-transparent" asChild>
                  <a href="https://calendly.com/theshopifyguy/support" target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-8 h-8 mb-2 text-foreground" />
                    <span className="font-medium text-foreground">Schedule a Call</span>
                    <span className="text-xs text-muted-foreground mt-1">Book a 30-min support session</span>
                  </a>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex-col rounded-xl bg-transparent" asChild>
                  <a href="mailto:support@theshopifyguy.com">
                    <MessageCircle className="w-8 h-8 mb-2 text-foreground" />
                    <span className="font-medium text-foreground">Email Support</span>
                    <span className="text-xs text-muted-foreground mt-1">support@theshopifyguy.com</span>
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">FAQ</h3>
              <div className="space-y-4">
                {[
                  {
                    q: "How long does the build take?",
                    a: "Typically 3-5 business days for Growth package, 5-7 for Scale.",
                  },
                  {
                    q: "Can I make changes after launch?",
                    a: "Your monthly retainer includes ongoing optimization and changes.",
                  },
                  {
                    q: "What if I want to cancel?",
                    a: "30-day notice required. You keep all custom code and assets created for you.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="p-4 bg-background border border-border rounded-xl">
                    <p className="font-medium text-foreground mb-1">{faq.q}</p>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
