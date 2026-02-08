"use client"

import React, { useState, useCallback, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
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
  const [copied, setCopied] = useState(false)

  const copyPhone = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.contact.phone.replace("+1", ""))
    } catch {
      const el = document.createElement("textarea")
      el.value = siteConfig.contact.phone.replace("+1", "")
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[380px] p-0 gap-0 overflow-hidden border-0 text-white [&_[data-slot=dialog-close]]:text-white/60 [&_[data-slot=dialog-close]]:hover:text-white"
        style={{ backgroundColor: "#1a1a1a", borderRadius: 20 }}
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Text Jon</DialogTitle>
        <DialogDescription className="sr-only">
          Scan the QR code with your phone to open a text message to Jon, or use the phone number below.
        </DialogDescription>

        {/* QR code area */}
        <div className="flex flex-col items-center px-10 pt-10 pb-6">
          <div className="rounded-2xl bg-white p-5" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
            <QRCodeSVG
              value={href}
              size={180}
              level="M"
              bgColor="#ffffff"
              fgColor="#1a1a1a"
            />
          </div>

          <p className="mt-6 text-[13px] text-[#888] text-center leading-snug">
            Scan with your phone camera
          </p>
        </div>

        {/* Divider */}
        <div className="mx-10 border-t border-[#333]" />

        {/* Phone number + fallback */}
        <div className="px-10 pt-6 pb-8 flex flex-col items-center gap-5">
          <button
            onClick={copyPhone}
            className="text-center group cursor-pointer"
          >
            <p className="text-[11px] text-[#666] uppercase tracking-[0.08em] font-medium mb-1.5">
              {copied ? "Copied" : "Or text directly"}
            </p>
            <p className="text-[20px] font-semibold text-white tracking-tight group-hover:text-[#ccc] transition-colors duration-150">
              {phone}
            </p>
          </button>

          {/* Pre-filled message preview */}
          <div className="w-full rounded-xl px-4 py-3" style={{ backgroundColor: "#252525" }}>
            <p className="text-[11px] text-[#555] mb-1">
              Message
            </p>
            <p className="text-[13px] text-[#999] leading-snug">
              {body}
            </p>
          </div>

          {/* Open in Messages fallback for Mac iMessage users */}
          <a
            href={href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-white transition-all duration-150 hover:opacity-80 active:scale-[0.96]"
            style={{ backgroundColor: "#333" }}
          >
            <MessageCircle className="w-4 h-4" />
            Open in Messages
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
