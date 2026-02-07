"use client"

import React, { useState, useCallback, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { getSmsHref, getSmsBody, getPhoneDisplay, isMobileDevice, type SmsOptions } from "@/lib/sms"
import { siteConfig } from "@/lib/site-config"

interface SmsTriggerProps {
  children: React.ReactElement<{ onClick?: (...args: any[]) => void }>
  context?: SmsOptions["context"]
  storeDomain?: string
  serviceName?: string
}

/**
 * Wraps any clickable element to handle SMS deep linking.
 * - Mobile: opens native SMS app directly
 * - Desktop: opens a dialog with QR code to scan from phone
 */
export function SmsTrigger({
  children,
  context = "general",
  storeDomain,
  serviceName,
}: SmsTriggerProps) {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)

  const options: SmsOptions = { context, storeDomain, serviceName }
  const href = getSmsHref(options)

  useEffect(() => {
    setMobile(isMobileDevice())
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (mobile) {
        window.location.href = href
      } else {
        setOpen(true)
      }
    },
    [mobile, href],
  )

  const child = React.cloneElement(children, {
    onClick: handleClick,
  })

  return (
    <>
      {child}
      <SmsQrDialog
        open={open}
        onOpenChange={setOpen}
        options={options}
        href={href}
      />
    </>
  )
}

// --- QR Dialog ---

function SmsQrDialog({
  open,
  onOpenChange,
  options,
  href,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: SmsOptions
  href: string
}) {
  const phone = getPhoneDisplay()
  const body = getSmsBody(options)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[360px] p-0 gap-0 overflow-hidden bg-card border-border"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Text Jon</DialogTitle>

        {/* QR code area */}
        <div className="flex flex-col items-center px-8 pt-10 pb-6">
          <div className="rounded-xl bg-white p-4">
            <QRCodeSVG
              value={href}
              size={180}
              level="M"
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </div>

          <p className="mt-6 text-[13px] text-muted-foreground text-center leading-snug">
            Scan with your phone camera to open a text to Jon
          </p>
        </div>

        {/* Divider */}
        <div className="mx-8 border-t border-border" />

        {/* Phone number + fallback */}
        <div className="px-8 pt-5 pb-8 flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider font-medium mb-1">
              Or text directly
            </p>
            <p className="text-[18px] font-semibold text-foreground tracking-tight">
              {phone}
            </p>
          </div>

          {/* Pre-filled message preview */}
          <div className="w-full rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground/60 mb-0.5">
              Pre-filled message
            </p>
            <p className="text-[12px] text-muted-foreground leading-snug">
              {body}
            </p>
          </div>

          {/* Open in Messages fallback for Mac iMessage users */}
          <a
            href={href}
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Open in Messages
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
