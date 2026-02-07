"use client"

import { useMemo } from "react"
import {
  DollarSign,
  Users,
  TrendingUp,
  Rocket,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Target,
  Percent,
  Activity,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AnalyticsDashboardProps {
  leads: any[]
  projects: any[]
  payments: any[]
}

export function AnalyticsDashboard({ leads, projects, payments }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const leadsThisMonth = leads.filter((l) => new Date(l.created_at) >= thirtyDaysAgo).length
    const leadsLastMonth = leads.filter(
      (l) => new Date(l.created_at) >= sixtyDaysAgo && new Date(l.created_at) < thirtyDaysAgo,
    ).length

    const proposalsPaid = leads.filter((l) => l.quotes?.[0]?.proposal_paid).length
    const contractsSigned = leads.filter((l) => l.quotes?.[0]?.status === "accepted").length

    const proposalRevenue = proposalsPaid * 97
    const buildRevenue = leads
      .filter((l) => l.quotes?.[0]?.status === "accepted")
      .reduce((sum, l) => sum + (l.quotes?.[0]?.base_build_price || 0), 0)

    const activeProjects = projects.filter((p) => p.status === "live").length
    const mrr = activeProjects * 997

    const conversionRate = leads.length > 0 ? (proposalsPaid / leads.length) * 100 : 0
    const closeRate = proposalsPaid > 0 ? (contractsSigned / proposalsPaid) * 100 : 0

    return {
      totalLeads: leads.length,
      leadsThisMonth,
      leadsLastMonth,
      leadGrowth: leadsLastMonth > 0 ? ((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100 : 0,
      proposalsPaid,
      contractsSigned,
      proposalRevenue,
      buildRevenue,
      totalRevenue: proposalRevenue + buildRevenue,
      activeProjects,
      mrr,
      arr: mrr * 12,
      conversionRate,
      closeRate,
    }
  }, [leads, projects])

  const revenueByMonth = useMemo(() => {
    const monthlyData: Record<string, { proposals: number; builds: number; retainers: number }> = {}

    leads.forEach((lead) => {
      if (lead.quotes?.[0]?.proposal_paid_at) {
        const date = new Date(lead.quotes[0].proposal_paid_at)
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { proposals: 0, builds: 0, retainers: 0 }
        monthlyData[monthKey].proposals += 97
      }
      if (lead.quotes?.[0]?.accepted_at) {
        const date = new Date(lead.quotes[0].accepted_at)
        const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { proposals: 0, builds: 0, retainers: 0 }
        monthlyData[monthKey].builds += lead.quotes[0].base_build_price || 0
      }
    })

    return Object.entries(monthlyData)
      .slice(-6)
      .map(([month, data]) => ({
        month,
        ...data,
        total: data.proposals + data.builds + data.retainers,
      }))
  }, [leads])

  const leadsByStatus = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    leads.forEach((lead) => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1
    })
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [leads])

  const COLORS = ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your business metrics and growth</p>
          </div>
          <Button variant="outline" className="border-border bg-transparent" asChild>
            <Link href="/admin">Back to Leads</Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#c4dbc9] flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#2f4a3a]" />
              </div>
              {stats.totalRevenue > 0 && (
                <span className="text-xs text-[#2f4a3a] flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-sky-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-sky-600">{formatCurrency(stats.mrr)}</p>
            <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              {stats.leadGrowth !== 0 && (
                <span
                  className={`text-xs flex items-center gap-1 ${stats.leadGrowth > 0 ? "text-[#2f4a3a]" : "text-red-500"}`}
                >
                  {stats.leadGrowth > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(stats.leadGrowth).toFixed(0)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground">{stats.totalLeads}</p>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </div>

          <div className="bg-muted/30 border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground">{stats.activeProjects}</p>
            <p className="text-sm text-muted-foreground">Active Projects</p>
          </div>
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Lead → Proposal</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{stats.conversionRate.toFixed(1)}%</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Percent className="w-4 h-4" />
              <span className="text-xs">Proposal → Contract</span>
            </div>
            <p className="text-xl font-semibold text-foreground">{stats.closeRate.toFixed(1)}%</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Proposals Paid</span>
            </div>
            <p className="text-xl font-semibold text-[#2f4a3a]">{stats.proposalsPaid}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">ARR Projection</span>
            </div>
            <p className="text-xl font-semibold text-sky-600">{formatCurrency(stats.arr)}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue over time */}
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Over Time</h3>
            {revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueByMonth}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} />
                  <YAxis stroke="#a3a3a3" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">No revenue data yet</div>
            )}
          </div>

          {/* Revenue breakdown */}
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Breakdown</h3>
            {revenueByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueByMonth}>
                  <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} />
                  <YAxis stroke="#a3a3a3" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="proposals" stackId="a" fill="#10b981" name="Proposals" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="builds" stackId="a" fill="#0ea5e9" name="Build Fees" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="retainers" stackId="a" fill="#8b5cf6" name="Retainers" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">No revenue data yet</div>
            )}
          </div>
        </div>

        {/* Lead funnel & status */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lead status distribution */}
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Lead Status Distribution</h3>
            {leadsByStatus.length > 0 ? (
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie
                      data={leadsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {leadsByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e5e5", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {leadsByStatus.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-muted-foreground capitalize">{item.name.replace("_", " ")}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No leads yet</div>
            )}
          </div>

          {/* Recent payments */}
          <div className="bg-muted/30 border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Payments</h3>
            {payments.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {payments.slice(0, 10).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-background border border-border rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground capitalize">
                        {payment.payment_type?.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : "Pending"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2f4a3a]">{formatCurrency(payment.amount / 100)}</p>
                      <p
                        className={`text-xs capitalize ${payment.status === "completed" ? "text-[#2f4a3a]" : "text-amber-500"}`}
                      >
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No payments yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
