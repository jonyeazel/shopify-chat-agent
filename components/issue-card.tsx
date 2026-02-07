"use client"

import { motion } from "framer-motion"
import type { CROIssue } from "@/lib/pricing"

interface IssueCardProps {
  issue: CROIssue
  index: number
}

export function IssueCard({ issue, index }: IssueCardProps) {
  const getSeverityLabel = () => {
    switch (issue.severity) {
      case "critical":
        return { text: "Critical", className: "text-red-600" }
      case "high":
        return { text: "High", className: "text-amber-600" }
      case "medium":
        return { text: "Medium", className: "text-muted-foreground" }
      default:
        return { text: "Low", className: "text-muted-foreground" }
    }
  }

  const severity = getSeverityLabel()

  return (
    <motion.div
      className="border border-border rounded-lg p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-foreground">{issue.title}</h4>
            <span className={`text-xs font-medium ${severity.className}`}>{severity.text}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{issue.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium text-foreground tabular-nums">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(issue.estimatedImpact)}
          </p>
          <p className="text-xs text-muted-foreground">potential impact</p>
        </div>
      </div>
    </motion.div>
  )
}
