import type React from "react"
import {
  PlayCircle,
  MessageCircle,
  Layers,
  Gift,
  Lightbulb,
  GraduationCap,
  Store,
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
) {
  return [
    {
      icon: PlayCircle,
      label: "Watch Preview",
      description: "See what you'll build",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Show me what I'll be able to build after this course" })
      },
    },
    {
      icon: Layers,
      label: "Student Sites",
      description: "Built by beginners",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Show me sites built by students with zero experience" })
      },
    },
    {
      icon: Store,
      label: "For Shopify Founders",
      description: "Never hire again",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "How does this help me as a Shopify store owner?" })
      },
    },
    {
      icon: GraduationCap,
      label: "What's Included",
      description: "Full curriculum",
      action: () => {
        setShowMenu(false)
        openDrawer?.("pricing")
      },
    },
    {
      icon: Lightbulb,
      label: "Free Sample",
      description: "Try before you buy",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "Can I see a free sample of the course?" })
      },
    },
    {
      icon: Gift,
      label: "Free Prompt Pack",
      description: "10 prompts that work",
      action: () => {
        setShowMenu(false)
        sendMessage({ text: "I want the free prompt pack" })
      },
    },
    {
      icon: MessageCircle,
      label: "Text Jon",
      description: "Opens your messages",
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

  // Check for objection signals
  if (
    allText.includes("too expensive") ||
    allText.includes("can't afford") ||
    allText.includes("not sure") ||
    allText.includes("think about it") ||
    allText.includes("maybe later")
  ) {
    return "objection"
  }

  // Check for buying signals
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

  // Check for interest signals
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
