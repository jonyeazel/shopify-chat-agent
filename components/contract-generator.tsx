"use client"
import { FileText, Shield, AlertTriangle, CheckCircle, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContractGeneratorProps {
  lead: any
  quote: any
  onSign?: () => void
}

export function ContractGenerator({ lead, quote, onSign }: ContractGeneratorProps) {
  const today = new Date()
  const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="bg-background text-foreground rounded-xl overflow-hidden border border-border max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-foreground text-background p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center font-bold text-xl text-foreground">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold">The Shopify Guy</h1>
            <p className="text-sm opacity-60">CRO Services Agreement</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm opacity-60">
          <FileText className="w-4 h-4" />
          <span>Contract #{lead.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Parties */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Parties</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Service Provider</p>
            <p className="font-medium">The Shopify Guy LLC</p>
            <p className="text-sm text-muted-foreground">CRO & E-commerce Optimization</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-sm text-muted-foreground mb-1">Client</p>
            <p className="font-medium">{lead.contact_name}</p>
            <p className="text-sm text-muted-foreground">{lead.store_domain}</p>
            <p className="text-sm text-muted-foreground">{lead.email}</p>
          </div>
        </div>
      </div>

      {/* Services & Pricing */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">Services & Investment</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">CRO Build Package ({quote.package_tier || "Growth"})</p>
              <p className="text-sm text-muted-foreground">Complete store optimization & implementation</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(quote.base_build_price)}</p>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Monthly Retainer</p>
              <p className="text-sm text-muted-foreground">Ongoing optimization, support & monitoring</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(quote.monthly_retainer)}/mo</p>
          </div>

          {quote.rev_share_percentage > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">Revenue Share</p>
                <p className="text-sm text-muted-foreground">Performance-based compensation on incremental revenue</p>
              </div>
              <p className="text-xl font-bold">{quote.rev_share_percentage}%</p>
            </div>
          )}

          {quote.ab_domain_upsell && quote.package_tier === "starter" && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">A/B Testing Domain</p>
                <p className="text-sm text-muted-foreground">Side-by-side comparison domain</p>
              </div>
              <p className="text-xl font-bold">{formatCurrency(quote.ab_domain_upsell)}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-[#e8f2ea] border border-[#93b89d] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#253a2e]">Total Investment</p>
              <p className="text-sm text-[#3d6049]">One-time build + first month retainer</p>
            </div>
            <p className="text-2xl font-bold text-[#2f4a3a]">
              {formatCurrency(quote.base_build_price + quote.monthly_retainer)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#3d6049]" />
          Payment Terms
        </h2>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#3d6049] mt-0.5" />
            <div>
              <p className="font-medium">Build Fee: 50% upfront, 50% on delivery</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(quote.base_build_price / 2)} due upon signing, remaining upon project completion
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#3d6049] mt-0.5" />
            <div>
              <p className="font-medium">Monthly Retainer: Net 7</p>
              <p className="text-sm text-muted-foreground">Payment due within 7 days of invoice date</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">Project Start Date</p>
              <p className="text-sm text-muted-foreground">
                {startDate.toLocaleDateString("en-US", { dateStyle: "long" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Control Clause */}
      <div className="p-6 border-b border-border bg-amber-50">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-600" />
          Service Control Clause
        </h2>

        <div className="bg-background border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 mb-2">Important: Service Continuity Terms</p>
              <p className="text-foreground mb-2">
                The optimized storefront and associated services are hosted on infrastructure controlled by The Shopify
                Guy. In the event of:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Payment not received within 14 days of due date</li>
                <li>Breach of agreement terms</li>
                <li>Termination without proper notice</li>
              </ul>
              <p className="text-foreground mt-2">
                The Service Provider reserves the right to temporarily suspend or redirect the optimized storefront
                until payment is received or terms are resolved. A 7-day grace period and notification will be provided
                before any service interruption.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">General Terms</h2>

        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. Scope of Work</p>
            <p>
              Services include but are not limited to: conversion rate optimization, theme customization, checkout
              optimization, analytics setup, and ongoing performance monitoring as detailed in the project proposal.
            </p>
          </div>

          <div>
            <p className="font-medium text-foreground">2. Client Responsibilities</p>
            <p>
              Client agrees to provide timely access to Shopify admin, Storefront API credentials, brand assets, and
              respond to communication within 48 business hours.
            </p>
          </div>

          <div>
            <p className="font-medium text-foreground">3. Intellectual Property</p>
            <p>
              Upon full payment, Client receives full ownership of all custom code, designs, and assets created
              specifically for their project.
            </p>
          </div>

          <div>
            <p className="font-medium text-foreground">4. Termination</p>
            <p>
              Either party may terminate with 30 days written notice. Client remains responsible for payment of work
              completed through termination date.
            </p>
          </div>

          <div>
            <p className="font-medium text-foreground">5. Guarantee</p>
            <p>
              We guarantee measurable improvement in conversion rate within 90 days or we will continue optimization at
              no additional retainer cost until achieved.
            </p>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Agreement</h2>

        <div className="bg-muted rounded-xl p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            By signing below, you agree to the terms and conditions outlined in this agreement. This constitutes a
            legally binding contract between the parties.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-t-2 border-border pt-2">
              <p className="text-sm text-muted-foreground">Client Signature</p>
              <p className="font-medium">{lead.contact_name}</p>
              <p className="text-sm text-muted-foreground">Date: {today.toLocaleDateString()}</p>
            </div>
            <div className="border-t-2 border-border pt-2">
              <p className="text-sm text-muted-foreground">Service Provider</p>
              <p className="font-medium">The Shopify Guy LLC</p>
              <p className="text-sm text-muted-foreground">Date: {today.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {onSign && (
          <Button
            onClick={onSign}
            className="w-full bg-foreground hover:bg-foreground/90 text-background py-6 text-lg rounded-xl"
          >
            Sign & Proceed to Payment
          </Button>
        )}
      </div>
    </div>
  )
}
