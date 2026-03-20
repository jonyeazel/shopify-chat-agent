import { siteConfig } from "./site-config"

export type SmsContext =
  | "general"
  | "interested"
  | "question"
  | "ready-to-buy"

export interface SmsOptions {
  context?: SmsContext
  storeDomain?: string
  serviceName?: string
}

const BODY_TEMPLATES: Record<SmsContext, (opts: SmsOptions) => string> = {
  general: () => `Hey Jon, I'm interested in v0 University`,
  interested: () => `Hey Jon, I saw your AI website builder course. Quick question:`,
  question: () => `Hey Jon, I have a question about v0 University`,
  "ready-to-buy": () => `Hey Jon, I'm ready to get started with v0 University`,
}

export function getSmsBody(options: SmsOptions = {}): string {
  const { context = "general" } = options
  const template = BODY_TEMPLATES[context] || BODY_TEMPLATES.general
  return template(options)
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
