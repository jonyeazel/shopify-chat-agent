"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Loader2, Store, Check, ExternalLink, Briefcase, Palette, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

interface InstantSiteCreatorProps {
  isOpen: boolean
  onClose: () => void
  isFullscreen?: boolean
}

interface ScrapedService {
  id: string
  title: string
  description: string
  price: string | null
}

interface ScrapedSite {
  type: "shopify" | "ecommerce" | "service" | "portfolio" | "restaurant" | "creator" | "other"
  name: string
  tagline: string | null
  logo: string | null
  primaryColor: string
  products: Array<{
    title: string
    price: string
    image: string
    handle: string
  }>
  services: ScrapedService[]
  socialLinks: Record<string, string>
  contactInfo: Record<string, string>
}

const SITE_TYPE_CONFIG = {
  shopify: { label: "Shopify Store", icon: Store, color: "text-[#3d6049]" },
  ecommerce: { label: "Ecommerce Site", icon: Store, color: "text-blue-500" },
  service: { label: "Service Business", icon: Briefcase, color: "text-purple-500" },
  portfolio: { label: "Portfolio", icon: Palette, color: "text-pink-500" },
  restaurant: { label: "Restaurant", icon: Store, color: "text-orange-500" },
  creator: { label: "Creator", icon: User, color: "text-cyan-500" },
  other: { label: "Website", icon: Store, color: "text-[#737373]" },
}

export function InstantSiteCreator({ isOpen, onClose }: InstantSiteCreatorProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"input" | "preview" | "success">("input")
  const [scrapedData, setScrapedData] = useState<ScrapedSite | null>(null)
  const [error, setError] = useState("")
  const [newSiteUrl, setNewSiteUrl] = useState("")

  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, isOpen)

  const handleScrape = async () => {
    if (!url) return

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setScrapedData(data)
        setStep("preview")
      }
    } catch {
      setError("Failed to analyze site. Try again.")
    }

    setLoading(false)
  }

  const handleCreate = async () => {
    setLoading(true)

    try {
      const res = await fetch("/api/sites/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl: url,
          scrapedData,
        }),
      })

      const data = await res.json()

      if (data.id) {
        setNewSiteUrl(data.subdomain ? `https://${data.subdomain}.theshopifyguy.dev` : "")
        setStep("success")
      }
    } catch {
      setError("Failed to create site. Try again.")
    }

    setLoading(false)
  }

  const reset = () => {
    setUrl("")
    setStep("input")
    setScrapedData(null)
    setError("")
    setNewSiteUrl("")
  }

  const siteConfig = scrapedData ? SITE_TYPE_CONFIG[scrapedData.type] : null
  const SiteIcon = siteConfig?.icon || Store

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="drawer-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-50"
        >
          <div
            className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ease-out ${isClosing ? "opacity-0" : ""}`}
            onClick={close}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={controls}
            exit={{ y: "100%" }}
            transition={springClose}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="absolute bottom-[2px] left-[2px] right-[2px] bg-card rounded-[20px] overflow-hidden flex flex-col"
            style={{ height: "85vh", maxHeight: "100%" }}
          >
            {/* Drag handle */}
            <div
              onPointerDown={startDrag}
              className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                <div>
                  <h2 className="font-semibold text-sm text-foreground">Create Your Card</h2>
                  <p className="text-[10px] text-muted-foreground">Works with any website</p>
                </div>
                <button
                  onClick={() => {
                    reset()
                    close()
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Step 1: Input URL */}
                {step === "input" && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Transform Any Site</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Paste any URL - Shopify store, service business, portfolio, or personal site.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://your-site.com"
                        className="h-12 text-base"
                        onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                      />

                      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                      <Button
                        onClick={handleScrape}
                        disabled={!url || loading}
                        className="w-full h-12 bg-primary hover:bg-primary/90"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {loading ? "Analyzing..." : "Create My Card"}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4">
                      {[
                        { icon: Store, label: "Ecommerce" },
                        { icon: Briefcase, label: "Services" },
                        { icon: Palette, label: "Portfolios" },
                        { icon: User, label: "Creators" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-muted/30">
                          <Icon className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Preview */}
                {step === "preview" && scrapedData && (
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        {scrapedData.logo ? (
                          <img
                            src={scrapedData.logo || "/placeholder.svg"}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <SiteIcon className={`w-6 h-6 ${siteConfig?.color || "text-primary"}`} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{scrapedData.name}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-muted ${siteConfig?.color}`}>
                              {siteConfig?.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{scrapedData.tagline}</p>
                        </div>
                      </div>
                    </div>

                    {scrapedData.products.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          Products ({scrapedData.products.length})
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {scrapedData.products.slice(0, 6).map((product, i) => (
                            <div key={i} className="rounded-xl bg-muted/30 overflow-hidden">
                              <div className="aspect-square bg-muted">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-2">
                                <p className="text-[10px] font-medium truncate">{product.title}</p>
                                <p className="text-[10px] text-primary">{product.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {scrapedData.services.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-2">
                          Services ({scrapedData.services.length})
                        </h4>
                        <div className="space-y-2">
                          {scrapedData.services.slice(0, 4).map((service, i) => (
                            <div key={i} className="rounded-xl bg-muted/30 p-3 flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{service.title}</p>
                                {service.description && (
                                  <p className="text-[10px] text-muted-foreground truncate">{service.description}</p>
                                )}
                              </div>
                              {service.price && <span className="text-xs font-medium text-primary">{service.price}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(scrapedData.socialLinks).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(scrapedData.socialLinks).map(([platform]) => (
                          <span key={platform} className="text-[10px] px-2 py-1 rounded-full bg-muted capitalize">
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
                        Start Over
                      </Button>
                      <Button onClick={handleCreate} disabled={loading} className="flex-1 bg-primary">
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <ArrowRight className="w-4 h-4 mr-2" />
                        )}
                        Make It Live
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Success */}
                {step === "success" && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#3d6049]/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-[#3d6049]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your Card is Live!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                      Share your new AI-powered {scrapedData?.type === "shopify" ? "storefront" : "site"} with the world.
                    </p>
                    {newSiteUrl && (
                      <p className="text-xs text-muted-foreground mb-4 bg-muted/30 px-3 py-2 rounded-lg">
                        {newSiteUrl}
                      </p>
                    )}
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-primary"
                        onClick={() => newSiteUrl && window.open(newSiteUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Your Card
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          reset()
                          close()
                        }}
                        className="w-full"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
