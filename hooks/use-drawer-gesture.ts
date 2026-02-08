"use client"

import { useEffect, useCallback, useState } from "react"
import { useAnimation, useDragControls, type PanInfo } from "framer-motion"

const VELOCITY_DISMISS = 500
const OFFSET_DISMISS_RATIO = 0.3

// iOS sheet springs — slightly underdamped for characteristic settle
export const springOpen = { type: "spring" as const, stiffness: 380, damping: 32 }
export const springClose = { type: "spring" as const, stiffness: 300, damping: 30 }
const springSnap = { type: "spring" as const, stiffness: 500, damping: 34 }

export function useDrawerGesture(onClose: () => void, isOpen = true) {
  const controls = useAnimation()
  const dragControls = useDragControls()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false)
      // Defer one frame so the motion element has registered with controls
      const frame = requestAnimationFrame(() => {
        controls.start({ y: 0 }, springOpen)
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [controls, isOpen])

  const close = useCallback(() => {
    setIsClosing(true)
    controls.start({ y: "100%" }, springOpen).then(onClose)
  }, [controls, onClose])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const shouldDismiss =
      info.velocity.y > VELOCITY_DISMISS ||
      (info.offset.y > 0 && info.offset.y / (window.innerHeight * 0.85) > OFFSET_DISMISS_RATIO)

    if (shouldDismiss) {
      setIsClosing(true)
      controls.start({ y: "100%" }, springClose).then(onClose)
    } else {
      controls.start({ y: 0 }, springSnap)
    }
  }

  return {
    controls,
    dragControls,
    handleDragEnd,
    close,
    isClosing,
    startDrag: (e: React.PointerEvent) => dragControls.start(e),
  }
}
