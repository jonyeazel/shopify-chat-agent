"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface VibeFrameProps {
  url?: string
  placeholder?: string
  className?: string
  onUrlChange?: (url: string) => void
}

export function VibeFrame({ url, placeholder, className, onUrlChange }: VibeFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile")
  const [isInteractive, setIsInteractive] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [displayedDevice, setDisplayedDevice] = useState<"mobile" | "desktop">("mobile")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasUrl = Boolean(url)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    if (url) {
      setIsLoading(true)
      setHasError(false)
    }
  }, [url])

  // Mobile: 375x667 viewport scaled to fit container
  const mobileIframeWidth = 375
  const mobileIframeHeight = 667
  const targetMobileWidth = 220 // Smaller for mobile screens

  // Desktop: 1440x900 viewport scaled down
  const desktopIframeWidth = 1440
  const desktopIframeHeight = 900
  const targetDesktopWidth = 600

  const transitionDuration = prefersReducedMotion ? 0 : 500
  const transitionEasing = "cubic-bezier(0.4, 0, 0.2, 1)"

  const iframeWidth = displayedDevice === "mobile" ? mobileIframeWidth : desktopIframeWidth
  const iframeHeight = displayedDevice === "mobile" ? mobileIframeHeight : desktopIframeHeight
  const targetWidth = displayedDevice === "mobile" ? targetMobileWidth : targetDesktopWidth
  const scale = targetWidth / iframeWidth

  const frameTargetWidth = device === "mobile" ? targetMobileWidth : targetDesktopWidth
  const frameIframeHeight = device === "mobile" ? mobileIframeHeight : desktopIframeHeight
  const frameIframeWidth = device === "mobile" ? mobileIframeWidth : desktopIframeWidth
  const frameScale = frameTargetWidth / frameIframeWidth
  const frameHeight = Math.round(frameIframeHeight * frameScale)

  const handleDeviceSwitch = (newDevice: "mobile" | "desktop") => {
    if (newDevice === device || isTransitioning) return
    setIsTransitioning(true)
    setDevice(newDevice)
    setTimeout(() => setDisplayedDevice(newDevice), prefersReducedMotion ? 0 : transitionDuration * 0.5)
    setTimeout(() => setIsTransitioning(false), prefersReducedMotion ? 0 : transitionDuration)
  }

  const handleAddressBarClick = () => {
    if (onUrlChange) {
      setInputValue(url?.replace(/^https?:\/\//, "") || "")
      setIsEditing(true)
    }
  }

  const handleAddressSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newUrl = inputValue.startsWith("http") ? inputValue : `https://${inputValue}`
      onUrlChange?.(newUrl)
      setIsEditing(false)
    } else if (e.key === "Escape") {
      setIsEditing(false)
    }
  }

  const displayUrl = url?.replace(/^https?:\/\//, "").replace(/\/$/, "") || ""

  return (
    <div ref={containerRef} className={`flex flex-col items-center ${className || ""}`}>
      {/* Device frame */}
      <div
        className="relative bg-neutral-900 overflow-hidden transition-all"
        style={{
          width: frameTargetWidth + 16,
          height: frameHeight + 80,
          borderRadius: device === "mobile" ? 32 : 12,
          transitionDuration: `${transitionDuration}ms`,
          transitionTimingFunction: transitionEasing,
        }}
      >
        {/* Address bar */}
        <div className="h-10 bg-neutral-800 flex items-center justify-center px-3 gap-2">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddressSubmit}
              onBlur={() => setIsEditing(false)}
              className="flex-1 h-6 bg-neutral-700 rounded-md px-2 text-xs text-white outline-none"
              placeholder="Enter URL"
            />
          ) : (
            <button
              onClick={handleAddressBarClick}
              className="flex-1 h-6 bg-neutral-700 rounded-md px-2 flex items-center justify-center gap-1.5 hover:bg-neutral-600 transition-colors"
            >
              <span className="text-xs text-neutral-300 truncate max-w-[160px]">
                {displayUrl || placeholder || "Enter URL"}
              </span>
              {hasUrl && (
                <svg
                  className="w-3 h-3 text-neutral-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Content area */}
        <div
          className="relative bg-white overflow-hidden mx-2"
          style={{
            height: frameHeight,
            borderRadius: device === "mobile" ? 0 : 4,
            transitionDuration: `${transitionDuration}ms`,
            transitionTimingFunction: transitionEasing,
          }}
        >
          {hasUrl && isVisible ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                </div>
              )}

              {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <p className="text-xs text-neutral-500">Unable to load</p>
                </div>
              ) : (
                <div
                  className="origin-top-left"
                  style={{
                    width: iframeWidth,
                    height: iframeHeight,
                    transform: `scale(${scale})`,
                    transitionProperty: "transform, width, height",
                    transitionDuration: `${transitionDuration}ms`,
                    transitionTimingFunction: transitionEasing,
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src={url}
                    title="Site preview"
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setIsLoading(false)
                      setHasError(true)
                    }}
                    style={{ pointerEvents: isInteractive ? "auto" : "none" }}
                  />
                </div>
              )}

              {/* Interaction overlay */}
              {!isInteractive && !isLoading && !hasError && (
                <button
                  onClick={() => setIsInteractive(true)}
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 transition-opacity hover:bg-black/50"
                >
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-4 h-4 text-neutral-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-white/90 tracking-wider uppercase">
                    Click to interact
                  </span>
                </button>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <p className="text-xs text-neutral-400">Enter URL above</p>
              </div>
            </div>
          )}
        </div>

        {/* Device toggle footer */}
        <div className="h-8 flex items-center justify-center gap-1">
          <button
            onClick={() => handleDeviceSwitch("mobile")}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
              device === "mobile" ? "bg-neutral-700" : "hover:bg-neutral-800"
            }`}
            aria-label="Mobile view"
          >
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDeviceSwitch("desktop")}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
              device === "desktop" ? "bg-neutral-700" : "hover:bg-neutral-800"
            }`}
            aria-label="Desktop view"
          >
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
