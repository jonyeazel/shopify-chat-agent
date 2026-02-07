"use client"

import type React from "react"
import { useState, useRef, useEffect, memo } from "react"

interface VibeFrameProps {
  url?: string
  placeholder?: string
  className?: string
  width?: number
  interactive?: boolean
  device?: "mobile" | "desktop"
  borderRadius?: number
  onUrlChange?: (url: string) => void
  fillHeight?: boolean
}

export const VibeFrame = memo(function VibeFrame({ url, placeholder, className, width, interactive = false, device = "mobile", borderRadius, onUrlChange, fillHeight = false }: VibeFrameProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInteractive, setIsInteractive] = useState(interactive)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [displayedDevice, setDisplayedDevice] = useState(device)
  const [iframeFade, setIframeFade] = useState(1)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasUrl = Boolean(url)

  // Measure parent for fillHeight mode
  useEffect(() => {
    if (!fillHeight || !containerRef.current?.parentElement) return
    const parent = containerRef.current.parentElement
    const measure = () => setContainerHeight(parent.clientHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [fillHeight])

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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Device transition: shell morphs immediately, iframe crossfades at midpoint
  useEffect(() => {
    if (device === displayedDevice) return
    setIframeFade(0)
    const timer = setTimeout(() => {
      setDisplayedDevice(device)
      setIframeFade(1)
    }, 200)
    return () => clearTimeout(timer)
  }, [device, displayedDevice])

  const isMobile = device === "mobile"

  // Iframe native dimensions
  const isMobileDisplayed = displayedDevice === "mobile"
  const iframeWidth = isMobileDisplayed ? 393 : 1440
  const iframeHeight = isMobileDisplayed ? 673 : 900
  const chromeHeight = 32 + 24 // address bar + footer
  const framePadding = 6 // 3px padding * 2

  // In fillHeight mode, derive width from available height
  let computedWidth: number
  if (fillHeight && containerHeight > 0) {
    const availableForViewport = containerHeight - chromeHeight - framePadding
    const scaleFromHeight = availableForViewport / iframeHeight
    computedWidth = Math.round(iframeWidth * scaleFromHeight)
    // Clamp: don't exceed parent width minus some padding
    const maxWidth = isMobileDisplayed ? 340 : 600
    computedWidth = Math.min(computedWidth, maxWidth)
  } else {
    computedWidth = width || (isMobileDisplayed ? 200 : 640)
  }

  const shellWidth = computedWidth
  const shellRadius = borderRadius ?? (isMobile ? 28 : 12)
  const innerRadius = Math.max(0, shellRadius - 3)

  const displayWidth = computedWidth
  const scale = displayWidth / iframeWidth
  const frameHeight = Math.round(iframeHeight * scale)

  const transition = "all 400ms cubic-bezier(0.4, 0, 0.2, 1)"

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

  const colors = {
    white50: "#ffffff",
    white100: "#efefef",
    white200: "#dcdcdc",
    white300: "#bdbdbd",
    white400: "#989898",
    white500: "#7c7c7c",
    white600: "#656565",
    white700: "#525765",
    white800: "#464646",
    white900: "#3d3d3d",
    white950: "#292929",
  }

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative" }}>
        {/* Shadow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          borderRadius: shellRadius,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.03)",
          transition,
        }} />

        {/* Device frame */}
        <div style={{
          position: "relative", background: colors.white950, padding: 3,
          width: shellWidth + 6, borderRadius: shellRadius,
          transition,
        }}>
          <div style={{
            position: "relative", background: colors.white900, overflow: "hidden",
            display: "flex", flexDirection: "column", borderRadius: innerRadius,
            transition,
          }}>
            {/* Address bar */}
            <div style={{
              height: 32, background: colors.white50, display: "flex", alignItems: "center",
              justifyContent: "center", padding: "0 10px", borderBottom: `1px solid ${colors.white200}`, flexShrink: 0,
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
                    background: colors.white100, borderRadius: 9999, padding: "4px 10px",
                    fontSize: 9, color: colors.white700, fontWeight: 500, textAlign: "center",
                    border: `1px solid ${colors.white200}`, outline: "none",
                    maxWidth: isMobile ? 160 : 320, width: "100%",
                  }}
                />
              ) : (
                <div
                  onClick={handleAddressBarClick}
                  style={{
                    background: colors.white100, borderRadius: 9999, padding: "4px 10px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${colors.white200}`, gap: 5,
                    cursor: onUrlChange ? "text" : "default",
                    maxWidth: isMobile ? 160 : 320, width: "100%",
                  }}
                >
                  <span style={{ fontSize: 9, color: colors.white500, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {url ? (() => { try { return new URL(url).hostname } catch { return url } })() : "Enter URL..."}
                  </span>
                  {hasUrl && (
                    <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: colors.white400, flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Viewport */}
            <div style={{
              position: "relative", overflow: "hidden", background: colors.white900,
              width: shellWidth, height: frameHeight,
              transition,
            }}>
              {/* Click to interact overlay */}
              {hasUrl && !isInteractive && !isLoading && !hasError && (
                <button
                  onClick={() => setIsInteractive(true)}
                  style={{
                    position: "absolute", inset: 0, zIndex: 30, display: "flex", alignItems: "flex-end", justifyContent: "center",
                    cursor: "pointer", background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)", border: "none",
                    paddingBottom: 16,
                  }}
                >
                  <span style={{ 
                    fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.9)", 
                    background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                    padding: "6px 12px", borderRadius: 9999,
                  }}>
                    Tap to interact
                  </span>
                </button>
              )}

              {/* Loading / Error / Empty states */}
              {(isLoading || !hasUrl || hasError) && (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: `linear-gradient(to bottom, ${colors.white100}, ${colors.white50})`, zIndex: 10, gap: 10,
                }}>
                  {hasError ? (
                    <>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: colors.white200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: colors.white400, fontSize: 16 }}>✕</span>
                      </div>
                      <span style={{ fontSize: 10, color: colors.white500, fontWeight: 500, textAlign: "center", padding: "0 12px" }}>Cannot embed this site</span>
                      {hasUrl && <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: colors.white600, fontWeight: 500, textDecoration: "underline" }}>Visit site directly</a>}
                    </>
                  ) : hasUrl ? (
                    <>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${colors.white300}`, borderTopColor: colors.white500, animation: "spin 1s linear infinite" }} />
                      <span style={{ fontSize: 10, color: colors.white400, fontWeight: 500 }}>Loading</span>
                    </>
                  ) : (
                    <>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(to bottom right, ${colors.white200}, ${colors.white100})`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.white200}` }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.white400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 12, color: colors.white600, fontWeight: 600, letterSpacing: "-0.01em" }}>{placeholder || "vibeframe"}</span>
                        <span style={{ fontSize: 9, color: colors.white400, fontWeight: 500 }}>Tap address bar to begin</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Iframe */}
              {hasUrl && isVisible && (
                <div style={{
                  position: "absolute", top: 0, left: 0, transformOrigin: "top left",
                  width: iframeWidth, height: iframeHeight, transform: `scale(${scale})`,
                  pointerEvents: isInteractive ? "auto" : "none",
                  opacity: iframeFade,
                  transition: "opacity 200ms ease",
                }}>
                  <iframe
                    ref={iframeRef}
                    src={url}
                    title="Site Preview"
                    style={{ width: "100%", height: "100%", border: "none", background: colors.white50 }}
                    onLoad={() => {
                      setIsLoading(false)
                      setHasError(false)
                    }}
                    onError={() => { 
                      setIsLoading(false)
                      setHasError(true) 
                    }}
                    loading="eager"
                  />
                </div>
              )}
            </div>

            {/* Footer chrome */}
            <div style={{
              height: 24, background: colors.white50, flexShrink: 0,
              borderTop: `1px solid ${colors.white200}`,
            }} />
          </div>
        </div>

        {/* Bottom shadow */}
        <div style={{
          position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)",
          height: 16, background: "rgba(41,41,41,0.06)", filter: "blur(10px)", borderRadius: 9999, width: "60%",
        }} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
})
