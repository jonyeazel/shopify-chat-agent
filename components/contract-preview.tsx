"use client"

import { motion } from "framer-motion"
import { FileText, AlertTriangle, CheckCircle } from "lucide-react"

interface ContractPreviewProps {
  storeDomain: string
  packageTier: string
  buildPrice: number
  monthlyRetainer: number
  revSharePercentage?: number
}

export function ContractPreview({
  storeDomain,
  packageTier,
  buildPrice,
  monthlyRetainer,
  revSharePercentage,
}: ContractPreviewProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden"
    >
      <div className="bg-neutral-800/50 px-6 py-4 flex items-center gap-3 border-b border-neutral-800">
        <FileText className="w-5 h-5 text-[#6a9976]" />
        <h3 className="font-semibold text-white">Contract Preview</h3>
      </div>

      <div className="p-6 space-y-6 text-sm">
        {/* Service Agreement */}
        <div>
          <h4 className="font-semibold text-white mb-3">1. Service Agreement</h4>
          <p className="text-neutral-400 leading-relaxed">
            The Shopify Guy (&quot;Provider&quot;) agrees to deliver CRO optimization services for{" "}
            <span className="text-white font-medium">{storeDomain}</span> (&quot;Client&quot;) under the{" "}
            <span className="text-[#6a9976] font-medium capitalize">{packageTier}</span> package terms.
          </p>
        </div>

        {/* Payment Terms */}
        <div>
          <h4 className="font-semibold text-white mb-3">2. Payment Terms</h4>
          <ul className="text-neutral-400 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#6a9976] mt-0.5 flex-shrink-0" />
              <span>
                One-time build fee: <span className="text-white font-medium">{formatCurrency(buildPrice)}</span> due
                upon contract signing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#6a9976] mt-0.5 flex-shrink-0" />
              <span>
                Monthly retainer: <span className="text-white font-medium">{formatCurrency(monthlyRetainer)}</span>{" "}
                billed on the 1st of each month
              </span>
            </li>
            {revSharePercentage && revSharePercentage > 0 && (
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#6a9976] mt-0.5 flex-shrink-0" />
                <span>
                  Revenue share: <span className="text-white font-medium">{revSharePercentage}%</span> of incremental
                  revenue above baseline
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Service Continuity */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-300 mb-1">3. Service Continuity Clause</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                In the event of non-payment, Provider reserves the right to suspend or terminate services after a 7-day
                grace period. For headless/custom builds hosted on Provider infrastructure, access may be revoked until
                payment is resolved. Client retains ownership of all custom code upon full payment of all outstanding
                invoices.
              </p>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <h4 className="font-semibold text-white mb-3">4. Deliverables</h4>
          <ul className="text-neutral-400 space-y-1 text-xs">
            <li>- Complete CRO audit and recommendations report</li>
            <li>- Conversion-optimized store theme/template</li>
            <li>- Mobile optimization implementation</li>
            <li>- Analytics and tracking configuration</li>
            <li>- Monthly performance reports</li>
            <li>- Dedicated support channel access</li>
          </ul>
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-semibold text-white mb-3">5. Timeline</h4>
          <p className="text-neutral-400 text-xs">
            Initial build delivery within 14-21 business days of contract signing and receipt of store access
            credentials. Ongoing optimization begins immediately upon store deployment.
          </p>
        </div>
      </div>

      <div className="bg-neutral-800/30 px-6 py-4 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 text-center">
          Full contract will be provided for digital signature upon package selection
        </p>
      </div>
    </motion.div>
  )
}
