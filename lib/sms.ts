import { siteConfig } from "./site-config"

export type SmsContext =
  | "general"
  | "post-audit"
  | "post-pricing"
  | "post-report"
  | "error-fallback"
  | "thank-you"
  | "low-budget"
  | "ready-to-start"

export interface SmsOptions {
  context?: SmsContext
  storeDomain?: string
  serviceName?: string
}

const BODY_TEMPLATES: Record<SmsContext, (opts: SmsOptions) => string> = {
  general: () => `Hey Jon, your AI diagnosed my store and I'm ready to talk next steps.`,
  "post-audit": ({ storeDomain }) =>
    storeDomain
      ? `Hey Jon, your AI audited ${storeDomain}. I've added you to my store — ready to get started.`
      : `Hey Jon, just got my audit results from your AI. Ready to move forward.`,
  "post-pricing": ({ serviceName }) =>
    serviceName
      ? `Hey Jon, your AI recommended ${serviceName}. I've added you to my store — let's do it.`
      : `Hey Jon, your AI walked me through pricing. Ready to talk details.`,
  "post-report": ({ storeDomain }) =>
    storeDomain
      ? `Hey Jon, reviewed my CRO report for ${storeDomain}. I've added you to my store — ready for implementation.`
      : `Hey Jon, just reviewed my report. Ready to discuss next steps.`,
  "error-fallback": () =>
    `Hey Jon, the chat on your site wasn't loading so I'm texting instead.`,
  "thank-you": () =>
    `Hey Jon, just purchased my audit. Quick question:`,
  "low-budget": () =>
    `Hey Jon, want to work together but need to figure out budget. Can we talk?`,
  "ready-to-start": ({ serviceName }) =>
    serviceName
      ? `Hey Jon, your AI diagnosed my store and I'm ready to move forward with ${serviceName}. I've added you to my Shopify store.`
      : `Hey Jon, your AI diagnosed my store and I'm ready to get started. I've added you to my Shopify store.`,
}

export function getSmsBody(options: SmsOptions = {}): string {
  const { context = "general" } = options
  return BODY_TEMPLATES[context](options)
}

export function getSmsHref(options: SmsOptions = {}): string {
  const body = getSmsBody(options)
  return `sms:${siteConfig.contact.phone}?body=${encodeURIComponent(body)}`
}

export function getPhoneDisplay(): string {
  const raw = siteConfig.contact.phone
  // Format +14078677201 → (407) 867-7201
  const digits = raw.replace(/\D/g, "")
  const local = digits.slice(-10)
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false
  // Touch capability + narrow viewport = phone
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
  const isNarrow = window.innerWidth < 768
  return hasTouch && isNarrow
}

export function openSms(options: SmsOptions = {}): void {
  window.location.href = getSmsHref(options)
}
