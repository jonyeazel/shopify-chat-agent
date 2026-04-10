import { siteConfig } from "./site-config"

export type SmsContext =
  | "general"
  | "interested"
  | "question"
  | "ready-to-buy"
  | "ready-to-start"
  | "post-pricing"
  | "post-examples"
  | "shopify-interest"
  | "error-fallback"
  | "icon-rail"

export interface SmsOptions {
  context?: SmsContext
  storeDomain?: string
  serviceName?: string
}

const BODY_TEMPLATES: Record<SmsContext, (opts: SmsOptions) => string> = {
  general: () => `Hey Jon, I was just on v0university.com and had a question`,
  interested: () => `Hey Jon, I saw v0 University. Quick question:`,
  question: () => `Hey Jon, question about v0 University:`,
  "ready-to-buy": () => `Hey Jon, I'm ready to get started`,
  "ready-to-start": () => `Hey Jon, I want to get started with v0 University. What's the first step?`,
  "post-pricing": () => `Hey Jon, I saw the $497 v0 Tutor. Quick question before I buy:`,
  "post-examples": () => `Hey Jon, I looked at your portfolio on v0university.com. Impressive. I want to build something similar`,
  "shopify-interest": () => `Hey Jon, I'm interested in building a Shopify store with v0. Can you help?`,
  "error-fallback": () => `Hey Jon, the chat on v0university.com had an issue. Can we talk directly?`,
  "icon-rail": () => `Hey Jon, I was on v0university.com. What's the best way to get started?`,
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
