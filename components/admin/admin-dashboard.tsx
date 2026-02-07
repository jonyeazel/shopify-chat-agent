"use client"

import { useState } from "react"
import {
  Users,
  DollarSign,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  MoreHorizontal,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LeadActions } from "./lead-actions"

interface Lead {
  id: string
  email: string
  store_domain: string
  store_name?: string
  contact_name?: string
  status: string
  created_at: string
  quotes: any[]
  store_metrics: any
  cro_issues: any[]
}

interface AdminDashboardProps {
  leads: Lead[]
  stats?: {
    totalLeads: number
    newLeadsThisWeek: number
    conversionRate: number
    proposalRevenue: number
    buildRevenue: number
    totalRevenue: number
    activeProjects: number
    mrr: number
    arr: number
  }
}

export function AdminDashboard({ leads: initialLeads, stats }: AdminDashboardProps) {
  const [leads, setLeads] = useState(initialLeads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.store_domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const needsAttention = leads.filter(
    (lead) => lead.status === "paid" && lead.quotes?.[0]?.proposal_paid && !lead.quotes?.[0]?.accepted_at,
  ).length

  const refreshLeads = async () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      qualified: "bg-amber-50 text-amber-700 border-amber-200",
      proposal_sent: "bg-purple-50 text-purple-700 border-purple-200",
      paid: "bg-[#e8f2ea] text-[#253a2e] border-[#93b89d]",
      building: "bg-cyan-50 text-cyan-700 border-cyan-200",
      completed: "bg-green-50 text-green-700 border-green-200",
      churned: "bg-red-50 text-red-700 border-red-200",
    }
    const labels: Record<string, string> = {
      new: "New",
      qualified: "Qualified",
      proposal_sent: "Proposal Sent",
      paid: "Paid",
      building: "Building",
      completed: "Completed",
      churned: "Churned",
    }
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full border ${styles[status] || "bg-muted text-muted-foreground border-border"}`}
      >
        {labels[status] || status}
      </span>
    )
  }

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm sm:text-base font-semibold tracking-tight">The Shopify Guy</span>
            <span className="text-muted-foreground hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Admin</span>
          </div>
          {needsAttention > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
              <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600" />
              <span className="text-xs sm:text-sm text-amber-700">{needsAttention} awaiting</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Total Leads</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{stats.totalLeads}</p>
              {stats.newLeadsThisWeek > 0 && (
                <p className="text-xs text-[#2f4a3a] flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {stats.newLeadsThisWeek} this week
                </p>
              )}
            </div>
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Revenue</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(stats.proposalRevenue)} from proposals
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Conversion</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{stats.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Lead to paid</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">MRR</span>
              </div>
              <p className="text-2xl font-semibold text-foreground">{formatCurrency(stats.mrr)}</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeProjects} active projects</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by domain, email, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-border"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background border-border">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshLeads}
              disabled={isRefreshing}
              className="border-border bg-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Lead table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Store</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Health</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Opportunity</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Date</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-t border-border hover:bg-muted/30 cursor-pointer transition-colors ${
                      selectedLead?.id === lead.id ? "bg-muted/50" : ""
                    }`}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                          {lead.store_domain.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{lead.store_domain}</p>
                          <a
                            href={`https://${lead.store_domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground">{lead.contact_name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(lead.status)}
                        {lead.quotes?.[0]?.proposal_paid && !lead.quotes?.[0]?.accepted_at && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Needs review" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.store_metrics ? (
                        <span
                          className={`text-sm font-medium ${
                            lead.store_metrics.health_score < 40
                              ? "text-red-600"
                              : lead.store_metrics.health_score < 70
                                ? "text-amber-600"
                                : "text-[#2f4a3a]"
                          }`}
                        >
                          {lead.store_metrics.health_score}/100
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.store_metrics?.revenue_opportunity ? (
                        <span className="text-sm text-foreground">
                          {formatCurrency(lead.store_metrics.revenue_opportunity)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedLead(lead)}>View details</DropdownMenuItem>
                          <DropdownMenuItem>
                            <a href={`/report/${lead.id}`} target="_blank" rel="noopener noreferrer">
                              View report
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Copy email</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lead detail panel */}
        {selectedLead && (
          <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-background border-l border-border shadow-lg z-50 overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">{selectedLead.store_domain}</h2>
                <p className="text-sm text-muted-foreground">{selectedLead.contact_name}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                Close
              </Button>
            </div>
            <div className="p-6">
              <LeadActions lead={selectedLead} onUpdate={() => refreshLeads()} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
