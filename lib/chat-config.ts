import type React from "react"
import {
  PlayCircle,
  MessageCircle,
  Layers,
  HelpCircle,
  DollarSign,
  ShoppingCart,
} from "lucide-react"
import { siteConfig } from "./site-config"
import { getSmsHref } from "./sms"

export const AVATAR_URL = siteConfig.brand.avatarUrl

export const CURRENT_TRACK = {
  title: "Building Mode",
  artist: "v0 University",
  src: "/images/shopify-20guy-20option-202.mp3",
}

export type ConversationPhase = "empty" | "exploring" | "interested" | "ready_to_buy" | "objection"
export type AvailabilityStatus = "online" | "away" | "offline"
export type DrawerType = "portfolio" | "photos" | "pricing" | null

export const STATUS_COLORS: Record<AvailabilityStatus, { ring: string; dot: string; label: string }> = {
  online: { ring: "ring-[#3d6049]", dot: "bg-[#3d6049]", label: "Available now" },
  away: { ring: "ring-amber-500", dot: "bg-amber-500", label: "Away" },
  offline: { ring: "ring-muted-foreground/30", dot: "bg-muted-foreground/50", label: "Offline" },
}

export function getMenuItems(
  sendMessage: (opts: { text: string }) => void,
  setShowMenu: (show: boolean) => void,
  fileInputRef: React.RefObject<HTMLInputElement | null>,
  backgroundInputRef: React.RefObject<HTMLInputElement | null>,
  setShowSiteCreator?: (show: boolean) => void,
  openDrawer?: (type: DrawerType) => void,
  openCheckout?: () => void,
) {
  return [
    {
      icon: PlayCircle,
      label: "The Video",
      description: "57 seconds",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Show me the video" })
      },
    },
    {
      icon: Layers,
      label: "Examples",
      description: "Sites built with AI",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Show me examples" })
      },
    },
    {
      icon: HelpCircle,
      label: "More Info",
      description: "How it works",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Tell me more about v0 University" })
      },
    },
    {
      icon: DollarSign,
      label: "FAQ",
      description: "Common questions",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "What are the most common questions?" })
      },
    },
    {
      icon: ShoppingCart,
      label: "Buy It",
      description: "$297 lifetime",
      action: () => {
        setShowMenu(false)
        if (openCheckout) {
          openCheckout()
        } else {
          sendMessage({ text: "I want to buy" })
        }
      },
    },
    {
      icon: MessageCircle,
      label: "Text Jon",
      description: "Direct message",
      action: () => {
        setShowMenu(false)
        window.location.href = getSmsHref()
      },
    },
  ]
}

export function determineConversationPhase(messages: any[]): ConversationPhase {
  if (messages.length === 0) return "empty"

  const allText = messages
    .map((m) => m.parts?.map((p: any) => (p.type === "text" ? p.text : "")).join(" ") || "")
    .join(" ")
    .toLowerCase()

  if (
    allText.includes("too expensive") ||
    allText.includes("can't afford") ||
    allText.includes("not sure") ||
    allText.includes("think about it") ||
    allText.includes("maybe later")
  ) {
    return "objection"
  }

  if (
    allText.includes("how do i buy") ||
    allText.includes("ready to start") ||
    allText.includes("sign me up") ||
    allText.includes("enroll") ||
    allText.includes("checkout") ||
    allText.includes("purchase")
  ) {
    return "ready_to_buy"
  }

  if (
    allText.includes("what's included") ||
    allText.includes("curriculum") ||
    allText.includes("pricing") ||
    allText.includes("how long") ||
    allText.includes("guarantee") ||
    allText.includes("results")
  ) {
    return "interested"
  }

  return "exploring"
}
