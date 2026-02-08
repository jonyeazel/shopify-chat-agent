"use client"

import { useState, useCallback } from "react"
import { Check, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SmsTrigger } from "@/components/sms-trigger"

interface PaymentMethod {
  name: string
  handle: string
  hint?: string
  deepLink?: string
  color: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: "Cash App",
    handle: "$jonyeazel",
    deepLink: "https://cash.app/$jonyeazel",
    color: "#00D632",
  },
  {
    name: "Venmo",
    handle: "@jon-yeazel",
    deepLink: "https://venmo.com/jon-yeazel",
    color: "#008CFF",
  },
  {
    name: "Zelle",
    handle: "jon@theshopifyguy.com",
    color: "#6D1ED4",
  },
  {
    name: "Apple Cash",
    handle: "(407) 867-7201",
    hint: "iMessage payment request",
    color: "#191919",
  },
]

function CopyableHandle({
  method,
  onDone,
}: {
  method: PaymentMethod
  onDone: () => void
}) {
  const [copied, setCopied] = useState(false)
  const isAppleCash = method.name === "Apple Cash"

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(method.handle)
    } catch {
      const el = document.createElement("textarea")
      el.value = method.handle
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      onDone()
    }, 1400)
  }, [method.handle, onDone])

  // For deep-linkable methods on mobile, open the app
  const handleTap = useCallback(() => {
    if (method.deepLink && window.innerWidth < 768) {
      window.open(method.deepLink, "_blank")
      return
    }
    handleCopy()
  }, [method.deepLink, handleCopy])

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer active:opacity-70 transition-opacity duration-100 min-h-[36px]"
      style={{ backgroundColor: "#f5f5f4", border: "1px solid #e5e5e3" }}
      onClick={isAppleCash ? undefined : handleTap}
    >
      <span className="text-[13px] text-[#191919] font-medium flex-1 min-w-0 break-all leading-snug">
        {method.handle}
      </span>
      {!isAppleCash && (
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-3 h-3 flex-shrink-0" style={{ color: method.color }} />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Copy className="w-3 h-3 text-[#bbb] flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )

  if (isAppleCash) {
    return (
      <SmsTrigger context="ready-to-start">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer active:opacity-70 transition-opacity duration-100 min-h-[36px]"
            style={{ backgroundColor: "#f5f5f4", border: "1px solid #e5e5e3" }}
          >
            <span className="text-[13px] text-[#191919] font-medium flex-1 min-w-0">
              Send via iMessage
            </span>
            <span className="text-[10px] text-[#999] flex-shrink-0">opens Messages</span>
          </motion.div>
        </div>
      </SmsTrigger>
    )
  }

  return inner
}

function PaymentPills({
  activeMethod,
  onSelect,
}: {
  activeMethod: string | null
  onSelect: (name: string | null) => void
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
      {PAYMENT_METHODS.map((method) => (
        <button
          key={method.name}
          onClick={() => onSelect(activeMethod === method.name ? null : method.name)}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.96]"
          style={{
            backgroundColor: activeMethod === method.name ? method.color : `${method.color}08`,
            color: activeMethod === method.name ? "#fff" : method.color,
            border: `1px solid ${activeMethod === method.name ? method.color : `${method.color}30`}`,
          }}
        >
          {method.name}
        </button>
      ))}
    </div>
  )
}

export function PaymentOptions({
  serviceName,
  onPaid,
}: {
  serviceName?: string
  onPaid?: () => void
}) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      className="my-4"
    >
      <PaymentPills activeMethod={activeMethod} onSelect={setActiveMethod} />

      <AnimatePresence mode="wait">
        {activeMethod && (
          <div className="mt-2">
            <CopyableHandle
              method={PAYMENT_METHODS.find((m) => m.name === activeMethod)!}
              onDone={() => {}}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function MicroConsultation({
  onSelect,
}: {
  onSelect?: () => void
}) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 450, damping: 30 }}
      className="my-4"
    >
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[13px] text-[#191919]">
          <span className="font-medium">Micro Consultation</span>
          <span className="text-[#999] ml-1.5">1 question, direct answer</span>
        </p>
        <span className="text-[13px] font-semibold text-[#191919]">$97</span>
      </div>

      <PaymentPills activeMethod={activeMethod} onSelect={setActiveMethod} />

      <AnimatePresence mode="wait">
        {activeMethod && (
          <div className="mt-2">
            <CopyableHandle
              method={PAYMENT_METHODS.find((m) => m.name === activeMethod)!}
              onDone={() => {}}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
