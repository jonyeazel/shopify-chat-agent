"use client"

import { useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause } from "lucide-react"

interface FlipAvatarProps {
  avatarUrl: string
  size?: "sm" | "lg"
  isFlipped: boolean
  isPlaying: boolean
  availabilityStatus: "online" | "away" | "offline"
  onFlip: () => void
  onTogglePlay: () => void
  track: { title: string; artist: string }
}

interface StaticAvatarProps {
  avatarUrl: string
  availabilityStatus: "online" | "away" | "offline"
  onLongPress?: () => void
}

export function FlipAvatar({
  avatarUrl,
  size = "sm",
  isFlipped,
  isPlaying,
  onFlip,
  onTogglePlay,
  track,
}: FlipAvatarProps) {
  const isLarge = size === "lg"
  const sizeClasses = isLarge ? "w-20 h-20" : "w-10 h-10"

  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <motion.div
        className={`relative ${sizeClasses} cursor-pointer`}
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        onClick={onFlip}
      >
        {/* Front - Profile avatar */}
        <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: "hidden" }}>
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="Profile"
            className={`${sizeClasses} rounded-full object-cover ring-2 ring-border ${isLarge ? "ring-offset-2 ring-offset-background" : ""} transition-all duration-150`}
          />
          {/* Audio wave badge */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
            }}
            className="absolute -bottom-0.5 -right-0.5 w-[15px] h-[15px] rounded-full ring-[2px] ring-card flex items-center justify-center gap-[1px] shadow-sm transition-all duration-150 hover:scale-110 bg-primary"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-[1.5px] bg-primary-foreground rounded-full"
                animate={{ height: ["2px", "6px", "3px", "5px", "2px"] }}
                transition={{
                  duration: isPlaying ? 0.8 : 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </button>
        </div>

        {/* Back - Play/Pause button */}
        <div
          className="absolute inset-0 backface-hidden flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
            }}
            className={`${sizeClasses} rounded-full flex items-center justify-center bg-primary ring-2 ring-border hover:bg-primary/90 transition-colors`}
          >
            {isPlaying ? (
              <Pause className={`${isLarge ? "w-8 h-8" : "w-4 h-4"} text-primary-foreground`} fill="currentColor" />
            ) : (
              <Play
                className={`${isLarge ? "w-8 h-8" : "w-4 h-4"} text-primary-foreground ml-0.5`}
                fill="currentColor"
              />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function StaticAvatar({ avatarUrl, onLongPress }: Omit<StaticAvatarProps, 'availabilityStatus'>) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const firedRef = useRef(false)

  const handlePressStart = useCallback(() => {
    if (!onLongPress) return
    firedRef.current = false
    timerRef.current = setTimeout(() => {
      firedRef.current = true
      onLongPress()
    }, 3000)
  }, [onLongPress])

  const handlePressEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return (
    <div
      className="relative select-none"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      style={{ cursor: onLongPress ? "pointer" : undefined }}
    >
      <img
        src={avatarUrl || "/placeholder.svg"}
        alt="Profile"
        className="relative w-[84px] h-[84px] rounded-full object-cover ring-2 ring-border/60 ring-offset-2 ring-offset-card"
        draggable={false}
      />
    </div>
  )
}

// Header avatar with subtle online indicator
export function HeaderAvatar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <div className="relative">
      <img
        src={avatarUrl || "/placeholder.svg"}
        alt="Profile"
        className="w-9 h-9 rounded-full object-cover ring-1 ring-border/50"
      />
    </div>
  )
}

export function MusicMarquee({
  isPlaying,
  track,
  width = "w-28",
}: {
  isPlaying: boolean
  track: { title: string; artist: string }
  width?: string
}) {
  if (!isPlaying) return null

  return (
    <div className={`relative ${width} overflow-hidden`}>
      <motion.div
        className="flex whitespace-nowrap text-[10px] text-muted-foreground"
        animate={{ x: [0, -100] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <span className="flex items-center gap-1">
          <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          {track.title} • {track.artist}
          <span className="mx-4">•</span>
          <svg className="w-2.5 h-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          {track.title} • {track.artist}
        </span>
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-card to-transparent" />
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-card to-transparent" />
    </div>
  )
}

export function LandingMusicMarquee({
  isPlaying,
  track,
}: {
  isPlaying: boolean
  track: { title: string; artist: string }
}) {
  if (!isPlaying) return null

  return (
    <div className="relative w-48 mx-auto overflow-hidden">
      <motion.p
        className="text-sm text-muted-foreground whitespace-nowrap flex items-center justify-center gap-1"
        animate={{ x: [0, -120] }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <span>
          {track.title} • {track.artist}
        </span>
        <span className="mx-3">•</span>
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <span>
          {track.title} • {track.artist}
        </span>
      </motion.p>
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent" />
    </div>
  )
}
