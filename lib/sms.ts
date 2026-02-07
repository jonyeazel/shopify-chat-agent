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
  general: () => siteConfig.contact.smsBody,
  "post-audit": ({ storeDomain }) =>
    storeDomain
      ? `Hey Jon, you just audited ${storeDomain}. Let's talk about fixing those issues.`
      : `Hey Jon, just got my audit results. Let's talk next steps.`,
  "post-pricing": ({ serviceName }) =>
    serviceName
      ? `Hey Jon, interested in ${serviceName}. What's the next step?`
      : `Hey Jon, looked at your pricing. Want to talk details.`,
  "post-report": ({ storeDomain }) =>
    storeDomain
      ? `Hey Jon, reviewed my CRO report for ${storeDomain}. Ready to talk implementation.`
      : `Hey Jon, just reviewed my report. Let's discuss.`,
  "error-fallback": () =>
    `Hey Jon, the chat on your site wasn't working so I'm texting instead.`,
  "thank-you": () =>
    `Hey Jon, just purchased my audit. Quick question:`,
  "low-budget": () =>
    `Hey Jon, want to work together but need to figure out budget. Can we talk?`,
  "ready-to-start": ({ serviceName }) =>
    serviceName
      ? `Hey Jon, ready to move forward with ${serviceName}.`
      : `Hey Jon, ready to get started. What do you need from me?`,
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
