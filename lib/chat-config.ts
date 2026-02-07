import type React from "react"
import {
  DollarSign,
  MessageCircle,
  Layers,
  Gift,
  Lightbulb,
  ExternalLink,
} from "lucide-react"
import { siteConfig } from "./site-config"
import { getSmsHref } from "./sms"

export const AVATAR_URL = siteConfig.brand.avatarUrl

export const CURRENT_TRACK = {
  title: "Shoppers Delight",
  artist: "Lil' Bird",
  src: "/images/shopify-20guy-20option-202.mp3",
}

export type ConversationPhase = "empty" | "chatting" | "metrics_shared" | "analyzed"
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
) {
  return [
    {
      icon: Layers,
      label: "See My Work",
      description: "100+ stores built",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Show me some stores you've built" })
      },
    },
    {
      icon: DollarSign,
      label: "Pricing",
      description: "See all packages",
      action: () => {
        setShowMenu(false)
        openDrawer?.("pricing")
      },
    },
    {
      icon: Lightbulb,
      label: "Free Quick Win",
      description: "Get actionable advice",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Give me a quick win I can implement today" })
      },
    },
    {
      icon: Gift,
      label: "Free Ad Templates",
      description: "Canva creative pack",
      action: () => {
        setShowMenu(false)
        window.open("https://www.canva.com/design/DAGU-3D9MdA/842omsxClUHEnVk4TQb-ig/edit", "_blank")
      },
    },
    {
      icon: ExternalLink,
      label: "Free Resources",
      description: "YouTube, tutorials",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "What free resources do you have?" })
      },
    },
    {
      icon: MessageCircle,
      label: "Text Me",
      description: "Opens your messages app",
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
    allText.includes("health score") ||
    allText.includes("opportunity") ||
    allText.includes("revenue gap") ||
    allText.includes("leaving on the table")
  ) {
    return "analyzed"
  }

  if (
    allText.includes("conversion") ||
    allText.includes("sessions") ||
    allText.includes("aov") ||
    allText.includes("average order") ||
    allText.includes(".csv")
  ) {
    return "metrics_shared"
  }

  return "chatting"
}
