"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface VibeFrameProps {
  url?: string
  placeholder?: string
  className?: string
  onUrlChange?: (url: string) => void
  device?: "mobile" | "desktop"
  width?: number
  borderRadius?: number
}

export function VibeFrame({ url, placeholder, className, onUrlChange, device: deviceProp, width: widthProp, borderRadius: borderRadiusProp }: VibeFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [device, setDevice] = useState<"mobile" | "desktop">(deviceProp || "mobile")
  const [isInteractive, setIsInteractive] = useState(true)
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
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(motionQuery.matches)
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener("change", motionHandler)

    const checkMobile = () => setIsMobileViewport(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      motionQuery.removeEventListener("change", motionHandler)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (deviceProp) setDevice(deviceProp)
  }, [deviceProp])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Mobile: 393x673 viewport scaled to fit
  const mobileIframeWidth = 393
  const mobileIframeHeight = 673
  const targetMobileWidth = widthProp || 225

  // Desktop: 1920x1080 viewport scaled to fit
  const desktopIframeWidth = 1920
  const desktopIframeHeight = 1080
  const targetDesktopWidth = widthProp || 1100

  const transitionDuration = prefersReducedMotion ? 0 : 700
  const transitionEasing = "cubic-bezier(0.4, 0, 0.2, 1)"

  const effectiveDesktopWidth = isMobileViewport ? targetMobileWidth : targetDesktopWidth
  // On mobile viewport, keep phone-like visual styling regardless of device mode
  const visualDevice = isMobileViewport ? "mobile" : device

  const iframeWidth = displayedDevice === "mobile" ? mobileIframeWidth : desktopIframeWidth
  const iframeHeight = displayedDevice === "mobile" ? mobileIframeHeight : desktopIframeHeight

  const borderWidth = 4
  const frameTargetWidth = device === "mobile" ? targetMobileWidth : effectiveDesktopWidth
  const frameInnerWidth = frameTargetWidth - borderWidth * 2
  const frameIframeHeight = device === "mobile" ? mobileIframeHeight : desktopIframeHeight
  const frameIframeWidth = device === "mobile" ? mobileIframeWidth : desktopIframeWidth
  const frameScale = frameInnerWidth / frameIframeWidth
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
      setInputValue(url || "")
      setIsEditing(true)
    }
  }

  const handleSubmit = () => {
    let newUrl = inputValue.trim()
    if (newUrl && !newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
      newUrl = "https://" + newUrl
    }
    if (newUrl && onUrlChange) {
      onUrlChange(newUrl)
      setIsLoading(true)
      setHasError(false)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
    else if (e.key === "Escape") setIsEditing(false)
  }

  // Color palette (inlined for portability)
  const colors = {
    white50: "#ffffff",
    white100: "#efefef",
    white200: "#dcdcdc",
    white300: "#bdbdbd",
    white400: "#989898",
    white500: "#7c7c7c",
    white600: "#656565",
    white700: "#525252",
    white800: "#464646",
    white900: "#3d3d3d",
    white950: "#292929",
  }

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        {/* Bezel */}
        <div style={{
          position: "relative", overflow: "hidden",
          display: "flex", flexDirection: "column",
          width: frameTargetWidth,
          borderRadius: borderRadiusProp ?? (visualDevice === "mobile" ? 30 : 20),
          border: `4px solid ${colors.white950}`,
          transition: `all ${transitionDuration}ms ${transitionEasing}`,
        }}>
            {/* Header */}
            <div style={{
              height: 46, background: colors.white50, display: "flex", alignItems: "center",
              justifyContent: "center", padding: "0 16px", borderBottom: `1px solid ${colors.white200}`, flexShrink: 0,
            }}>
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter URL..."
                  style={{
                    background: colors.white100, borderRadius: 9999, padding: "4px 12px",
                    fontSize: 10, color: colors.white700, fontWeight: 500, textAlign: "center",
                    border: `1px solid ${colors.white200}`, outline: "none", WebkitAppearance: "none",
                    maxWidth: visualDevice === "mobile" ? 180 : 360, width: "100%",
                    transition: `max-width ${transitionDuration}ms ${transitionEasing}`,
                  }}
                />
              ) : (
                <div
                  onClick={handleAddressBarClick}
                  style={{
                    background: colors.white100, borderRadius: 9999, padding: "4px 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${colors.white200}`, gap: 6,
                    cursor: onUrlChange ? "text" : "default",
                    maxWidth: visualDevice === "mobile" ? 180 : 360, width: "100%",
                    transition: `max-width ${transitionDuration}ms ${transitionEasing}`,
                  }}
                >
                  <span style={{ fontSize: 10, color: colors.white500, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {url ? new URL(url).hostname : "Enter URL..."}
                  </span>
                  {hasUrl && (
                    <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: colors.white400, flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Screen */}
            <div style={{
              position: "relative", overflow: "hidden", background: colors.white900,
              height: frameHeight,
              transition: `all ${transitionDuration}ms ${transitionEasing}`,
            }}>
              {(isLoading || !hasUrl || hasError) && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(to bottom, ${colors.white100}, ${colors.white50})`, zIndex: 10, gap: 12,
                  opacity: isTransitioning ? 0 : 1, transition: `opacity ${transitionDuration}ms ${transitionEasing}`,
                }}>
                  {hasError ? (
                    <>
                      <div style={{ width: 48, height: 48, borderRadius: 16, background: colors.white200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: colors.white400, fontSize: 18 }}>✕</span>
                      </div>
                      <span style={{ fontSize: 11, color: colors.white500, fontWeight: 500, textAlign: "center", padding: "0 16px" }}>Cannot embed this site</span>
                      {hasUrl && <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: colors.white600, fontWeight: 500, textDecoration: "underline" }}>Visit site directly</a>}
                    </>
                  ) : hasUrl ? (
                    <>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${colors.white300}`, borderTopColor: colors.white500, animation: "spin 1s linear infinite" }} />
                      <span style={{ fontSize: 11, color: colors.white400, fontWeight: 500 }}>Loading</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(to bottom right, ${colors.white200}, ${colors.white100})`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.white200}` }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.white400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 13, color: colors.white600, fontWeight: 600, letterSpacing: "-0.01em" }}>{placeholder || "vibeframe"}</span>
                        <span style={{ fontSize: 10, color: colors.white400, fontWeight: 500 }}>Tap address bar to begin</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {hasUrl && isVisible && (
                <div style={{
                  position: "absolute", top: 0, left: 0, transformOrigin: "top left",
                  width: iframeWidth, height: iframeHeight, transform: `scale(${frameScale})`,
                  pointerEvents: isInteractive ? "auto" : "none",
                  transition: `transform ${transitionDuration}ms ${transitionEasing}`,
                }}>
                  <iframe
                    ref={iframeRef}
                    src={url}
                    title="Site Preview"
                    style={{ width: "100%", height: "100%", border: "none", background: colors.white50 }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => { setIsLoading(false); setHasError(true) }}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              height: 46, background: colors.white50, display: "flex", alignItems: "center",
              justifyContent: "center", borderTop: `1px solid ${colors.white200}`, flexShrink: 0,
            }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", background: colors.white100, borderRadius: 9999, padding: 2, border: `1px solid ${colors.white200}` }}>
                <div style={{
                  position: "absolute", top: 2, bottom: 2, background: colors.white900, borderRadius: 9999,
                  left: device === "mobile" ? 2 : "50%", width: "calc(50% - 2px)",
                  transition: `left ${transitionDuration}ms ${transitionEasing}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }} />
                <button
                  onClick={() => handleDeviceSwitch("mobile")}
                  style={{
                    position: "relative", zIndex: 10, width: 32, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "none", cursor: "pointer",
                    color: device === "mobile" ? colors.white50 : colors.white500,
                    transition: `color ${transitionDuration}ms ${transitionEasing}`,
                  }}
                  aria-label="Mobile view"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeviceSwitch("desktop")}
                  style={{
                    position: "relative", zIndex: 10, width: 32, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "none", cursor: "pointer",
                    color: device === "desktop" ? colors.white50 : colors.white500,
                    transition: `color ${transitionDuration}ms ${transitionEasing}`,
                  }}
                  aria-label="Desktop view"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </button>
              </div>
            </div>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
