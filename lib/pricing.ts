// The Shopify Guy - CRO Pricing Engine
// Executive decisions made here

export interface StoreMetrics {
  totalSessions: number
  conversionRate: number
  avgSessionDuration: number
  totalVisitors: number
  sessionsCompletedCheckout: number
  sessionsWithCartAdds: number
  sessionsReachedCheckout: number
  totalCustomers: number
  returningCustomerRate: number
  ordersPerCustomer: number
  amountPerCustomer: number
}

export interface MonthlyMetric {
  month: string
  sessions: number
  sessionsCompletedCheckout: number
  conversionRate: number
  avgSessionDuration: number
  visitors: number
  sessionsWithCartAdds: number
}

export interface CROIssue {
  type: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  estimatedImpact: number
  fixPrice: number
}

export interface HealthScore {
  overall: number
  conversion: number
  retention: number
  engagement: number
  trend: number
}

export interface PricingQuote {
  baseBuildPrice: number
  monthlyRetainer: number
  revSharePercentage: number
  abDomainUpsell: number
  totalUpfront: number
  proposalFee: number
  estimatedMonthlyRevenue: number
  revenueOpportunity: number
}

// Industry benchmarks
const BENCHMARKS = {
  conversionRate: 0.025, // 2.5% is healthy
  returningCustomerRate: 0.25, // 25% is healthy
  cartAbandonmentRate: 0.7, // 70% is average, lower is better
  checkoutAbandonmentRate: 0.2, // 20% is average
  avgSessionDuration: 180, // 3 minutes
  ordersPerCustomer: 1.8,
}

export function calculateHealthScore(metrics: StoreMetrics, monthlyData: MonthlyMetric[]): HealthScore {
  // Conversion score (0-100)
  const conversionScore = Math.min(100, (metrics.conversionRate / BENCHMARKS.conversionRate) * 100)

  // Retention score (0-100)
  const retentionScore = Math.min(100, (metrics.returningCustomerRate / BENCHMARKS.returningCustomerRate) * 100)

  // Engagement score based on session duration
  const engagementScore = Math.min(100, (metrics.avgSessionDuration / BENCHMARKS.avgSessionDuration) * 100)

  // Trend score - compare recent months to earlier months
  let trendScore = 50 // neutral
  if (monthlyData.length >= 2) {
    const recentConversion = monthlyData[monthlyData.length - 1]?.conversionRate || 0
    const earlierConversion = monthlyData[0]?.conversionRate || 0
    if (earlierConversion > 0) {
      const change = ((recentConversion - earlierConversion) / earlierConversion) * 100
      trendScore = Math.max(0, Math.min(100, 50 + change))
    }
  }

  // Overall weighted score
  const overall = Math.round(conversionScore * 0.4 + retentionScore * 0.25 + engagementScore * 0.15 + trendScore * 0.2)

  return {
    overall,
    conversion: Math.round(conversionScore),
    retention: Math.round(retentionScore),
    engagement: Math.round(engagementScore),
    trend: Math.round(trendScore),
  }
}

export function calculateRevenueOpportunity(metrics: StoreMetrics): number {
  // What they could make at benchmark conversion rate
  const potentialCheckouts = metrics.totalSessions * BENCHMARKS.conversionRate
  const currentCheckouts = metrics.sessionsCompletedCheckout
  const missedCheckouts = potentialCheckouts - currentCheckouts
  const revenueOpportunity = missedCheckouts * metrics.amountPerCustomer
  return Math.max(0, revenueOpportunity)
}

export function identifyCROIssues(metrics: StoreMetrics, monthlyData: MonthlyMetric[]): CROIssue[] {
  const issues: CROIssue[] = []
  const aov = metrics.amountPerCustomer

  // Cart abandonment analysis
  const cartToCheckout = metrics.sessionsReachedCheckout / metrics.sessionsWithCartAdds
  const cartAbandonmentRate = 1 - cartToCheckout
  if (cartAbandonmentRate > 0.75) {
    const lostOrders = metrics.sessionsWithCartAdds * (cartAbandonmentRate - 0.7)
    issues.push({
      type: "cart_abandonment",
      severity: "critical",
      title: "Severe Cart Abandonment",
      description: `${(cartAbandonmentRate * 100).toFixed(1)}% of carts are abandoned before checkout. Industry average is 70%.`,
      estimatedImpact: lostOrders * aov,
      fixPrice: 1500,
    })
  }

  // Checkout abandonment
  const checkoutCompletionRate = metrics.sessionsCompletedCheckout / metrics.sessionsReachedCheckout
  const checkoutAbandonmentRate = 1 - checkoutCompletionRate
  if (checkoutAbandonmentRate > 0.25) {
    const lostOrders = metrics.sessionsReachedCheckout * (checkoutAbandonmentRate - 0.2)
    issues.push({
      type: "checkout_abandonment",
      severity: "critical",
      title: "Checkout Flow Friction",
      description: `${(checkoutAbandonmentRate * 100).toFixed(1)}% of shoppers abandon at checkout. You're losing orders at the finish line.`,
      estimatedImpact: lostOrders * aov,
      fixPrice: 2000,
    })
  }

  // Low conversion rate
  if (metrics.conversionRate < 0.01) {
    issues.push({
      type: "low_conversion",
      severity: "critical",
      title: "Critically Low Conversion Rate",
      description: `Your ${(metrics.conversionRate * 100).toFixed(2)}% conversion rate is well below the 2.5% industry standard.`,
      estimatedImpact: metrics.totalSessions * (0.025 - metrics.conversionRate) * aov,
      fixPrice: 3000,
    })
  } else if (metrics.conversionRate < 0.02) {
    issues.push({
      type: "low_conversion",
      severity: "high",
      title: "Below Average Conversion Rate",
      description: `Your ${(metrics.conversionRate * 100).toFixed(2)}% conversion rate has room to grow to the 2.5% benchmark.`,
      estimatedImpact: metrics.totalSessions * (0.025 - metrics.conversionRate) * aov,
      fixPrice: 2500,
    })
  }

  // Poor retention
  if (metrics.returningCustomerRate < 0.15) {
    issues.push({
      type: "low_retention",
      severity: "high",
      title: "Customer Retention Problem",
      description: `Only ${(metrics.returningCustomerRate * 100).toFixed(1)}% of customers return. Industry average is 25%.`,
      estimatedImpact: metrics.totalCustomers * (0.25 - metrics.returningCustomerRate) * aov,
      fixPrice: 1800,
    })
  }

  // Declining trend
  if (monthlyData.length >= 2) {
    const recentConversion = monthlyData[monthlyData.length - 1]?.conversionRate || 0
    const earlierConversion = monthlyData[0]?.conversionRate || 0
    if (recentConversion < earlierConversion * 0.7) {
      issues.push({
        type: "declining_trend",
        severity: "critical",
        title: "Conversion Rate Declining",
        description: `Your conversion rate dropped from ${(earlierConversion * 100).toFixed(2)}% to ${(recentConversion * 100).toFixed(2)}%. Immediate action needed.`,
        estimatedImpact: (metrics.totalSessions * (earlierConversion - recentConversion) * aov) / 12,
        fixPrice: 2500,
      })
    }
  }

  // Low session duration
  if (metrics.avgSessionDuration < 60) {
    issues.push({
      type: "low_engagement",
      severity: "medium",
      title: "Poor Site Engagement",
      description: `Average session is only ${metrics.avgSessionDuration.toFixed(0)} seconds. Visitors aren't exploring your store.`,
      estimatedImpact: metrics.totalSessions * 0.01 * aov,
      fixPrice: 1200,
    })
  }

  // Low orders per customer
  if (metrics.ordersPerCustomer < 1.3) {
    issues.push({
      type: "low_repeat_orders",
      severity: "medium",
      title: "Low Repeat Purchase Rate",
      description: `Customers order only ${metrics.ordersPerCustomer.toFixed(1)}x on average. Opportunity for upsells and retention.`,
      estimatedImpact: metrics.totalCustomers * (1.8 - metrics.ordersPerCustomer) * aov,
      fixPrice: 1500,
    })
  }

  return issues.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
}

export function calculatePricing(metrics: StoreMetrics, issues: CROIssue[]): PricingQuote {
  const revenueOpportunity = calculateRevenueOpportunity(metrics)
  const aov = metrics.amountPerCustomer
  const monthlyRevenue = (metrics.sessionsCompletedCheckout / 12) * aov

  // Base price calculation based on store size and opportunity
  let baseBuildPrice = 4997 // Starter floor

  // Scale based on revenue opportunity
  if (revenueOpportunity > 500000) {
    baseBuildPrice = 14977 // Scale tier
  } else if (revenueOpportunity > 100000) {
    baseBuildPrice = 9977 // Growth tier
  }

  // Add fix prices for critical issues
  const criticalIssuesCost = issues.filter((i) => i.severity === "critical").reduce((sum, i) => sum + i.fixPrice, 0)

  baseBuildPrice = Math.max(baseBuildPrice, 4997 + criticalIssuesCost)

  // Monthly retainer based on store size
  let monthlyRetainer = 497 // Starter
  if (monthlyRevenue > 50000) {
    monthlyRetainer = 1497
  } else if (monthlyRevenue > 20000) {
    monthlyRetainer = 997
  }

  // Rev share percentage (higher for bigger opportunity)
  let revSharePercentage = 5
  if (revenueOpportunity > 500000) {
    revSharePercentage = 10
  } else if (revenueOpportunity > 200000) {
    revSharePercentage = 7.5
  }

  // A/B domain upsell - premium for instant value demonstration
  const abDomainUpsell = 2997

  // Estimated monthly revenue after optimization (conservative 50% of opportunity realized over 12 months)
  const estimatedMonthlyRevenue = monthlyRevenue + (revenueOpportunity * 0.5) / 12

  return {
    baseBuildPrice,
    monthlyRetainer,
    revSharePercentage,
    abDomainUpsell,
    totalUpfront: baseBuildPrice,
    proposalFee: 97,
    estimatedMonthlyRevenue,
    revenueOpportunity,
  }
}

export function parseLifetimeMetricsCSV(csvContent: string): Partial<StoreMetrics> {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) return {}

  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
  const values = lines[1].split(",").map((v) => v.replace(/"/g, "").trim())

  const data: Record<string, string> = {}
  headers.forEach((h, i) => {
    data[h] = values[i]
  })

  return {
    totalSessions: Number.parseInt(data["Sessions"]) || 0,
    conversionRate: Number.parseFloat(data["Conversion rate"]) || 0,
    avgSessionDuration: Number.parseFloat(data["Average session duration"]) || 0,
    totalVisitors: Number.parseInt(data["Online store visitors"]) || 0,
    sessionsCompletedCheckout: Number.parseInt(data["Sessions that completed checkout"]) || 0,
    sessionsWithCartAdds: Number.parseInt(data["Sessions with cart additions"]) || 0,
    sessionsReachedCheckout: Number.parseInt(data["Sessions that reached checkout"]) || 0,
  }
}

export function parseMonthlyMetricsCSV(csvContent: string): MonthlyMetric[] {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.replace(/"/g, "").trim())
    const data: Record<string, string> = {}
    headers.forEach((h, i) => {
      data[h] = values[i]
    })

    return {
      month: data["Month"] || "",
      sessions: Number.parseInt(data["Sessions"]) || 0,
      sessionsCompletedCheckout: Number.parseInt(data["Sessions that completed checkout"]) || 0,
      conversionRate: Number.parseFloat(data["Conversion rate"]) || 0,
      avgSessionDuration: Number.parseFloat(data["Average session duration"]) || 0,
      visitors: Number.parseInt(data["Online store visitors"]) || 0,
      sessionsWithCartAdds: Number.parseInt(data["Sessions with cart additions"]) || 0,
    }
  })
}

export function parseLTVMetricsCSV(csvContent: string): Partial<StoreMetrics> {
  const lines = csvContent.trim().split("\n")
  if (lines.length < 2) return {}

  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())
  const values = lines[1].split(",").map((v) => v.replace(/"/g, "").trim())

  const data: Record<string, string> = {}
  headers.forEach((h, i) => {
    data[h] = values[i]
  })

  return {
    totalCustomers: Number.parseInt(data["Customers"]) || 0,
    returningCustomerRate: Number.parseFloat(data["Returning customer rate"]) || 0,
    ordersPerCustomer: Number.parseFloat(data["Number of orders per customer"]) || 0,
    amountPerCustomer: Number.parseFloat(data["Amount spent per customer"]) || 0,
  }
}
