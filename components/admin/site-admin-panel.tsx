"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Music,
  Palette,
  Settings,
  BarChart3,
  Link2,
  Mail,
  Code,
  Save,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  MousePointer,
  Store,
  ImageIcon,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useDrawerGesture, springClose } from "@/hooks/use-drawer-gesture"

interface SiteAdminPanelProps {
  isOpen: boolean
  onClose: () => void
  siteId: number
  isFullscreen?: boolean
}

type TabType = "overview" | "branding" | "music" | "products" | "analytics" | "pixels" | "affiliates" | "settings"

interface SiteConfig {
  id: number
  site_name: string
  tagline: string
  logo_url: string
  avatar_url: string
  primary_color: string
  music_track_url: string
  music_artist: string
  music_title: string
  shopify_domain: string
  shopify_storefront_token: string
  shopify_connected: boolean
  referral_code: string
  owner_email: string
  status: string
  fb_pixel_id: string
  tiktok_pixel_id: string
  ga4_id: string
  klaviyo_id: string
}

interface Analytics {
  pageViews: number
  conversations: number
  leads: number
  messages: number
  conversionRate: number
  revenue: number
}

export function SiteAdminPanel({ isOpen, onClose, siteId }: SiteAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [site, setSite] = useState<SiteConfig | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const { controls, dragControls, handleDragEnd, close, isClosing, startDrag } = useDrawerGesture(onClose, isOpen)

  const [formData, setFormData] = useState({
    site_name: "",
    tagline: "",
    primary_color: "#253a2e",
    music_track_url: "",
    music_artist: "",
    music_title: "",
    shopify_domain: "",
    shopify_storefront_token: "",
    fb_pixel_id: "",
    tiktok_pixel_id: "",
    ga4_id: "",
    klaviyo_id: "",
  })

  const fetchSite = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from("sites").select("*").eq("id", siteId).single()
    if (data) {
      setSite(data)
      setFormData({
        site_name: data.site_name || "",
        tagline: data.tagline || "",
        primary_color: data.primary_color || "#253a2e",
        music_track_url: data.music_track_url || "",
        music_artist: data.music_artist || "",
        music_title: data.music_title || "",
        shopify_domain: data.shopify_domain || "",
        shopify_storefront_token: data.shopify_storefront_token || "",
        fb_pixel_id: data.fb_pixel_id || "",
        tiktok_pixel_id: data.tiktok_pixel_id || "",
        ga4_id: data.ga4_id || "",
        klaviyo_id: data.klaviyo_id || "",
      })
    }
    setLoading(false)
  }, [siteId])

  const fetchAnalytics = useCallback(async () => {
    setAnalytics({
      pageViews: 12847,
      conversations: 342,
      leads: 89,
      messages: 1247,
      conversionRate: 2.4,
      revenue: 34500,
    })
  }, [])

  useEffect(() => {
    if (isOpen && siteId) {
      fetchSite()
      fetchAnalytics()
    }
  }, [isOpen, siteId, fetchSite, fetchAnalytics])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from("sites").update(formData).eq("id", siteId)
    setSaving(false)
  }

  const copyReferralLink = () => {
    if (site?.referral_code) {
      navigator.clipboard.writeText(`https://theshopifyguy.dev?ref=${site.referral_code}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tabs: { id: TabType; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "music", label: "Music", icon: Music },
    { id: "products", label: "Products", icon: Store },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "pixels", label: "Pixels", icon: Code },
    { id: "affiliates", label: "Affiliates", icon: Link2 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
            {/* Drag handle - persistent grab area outside scroll container */}
            <div
              onPointerDown={startDrag}
              className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide overscroll-contain">
              {/* Tabs */}
              <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto scrollbar-hide items-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="ml-auto h-7 text-xs bg-primary hover:bg-primary/90 flex-shrink-0"
                >
                  {saving ? <RefreshCw className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />}
                  Save
                </Button>
              </div>

              {/* Content */}
              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {/* Overview Tab */}
                    {activeTab === "overview" && analytics && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Users className="w-4 h-4" />
                              <span className="text-xs">Visitors</span>
                            </div>
                            <p className="text-2xl font-semibold">{analytics.pageViews.toLocaleString()}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-xs">Conversations</span>
                            </div>
                            <p className="text-2xl font-semibold">{analytics.conversations}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Mail className="w-4 h-4" />
                              <span className="text-xs">Leads</span>
                            </div>
                            <p className="text-2xl font-semibold">{analytics.leads}</p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <MousePointer className="w-4 h-4" />
                              <span className="text-xs">Conv. Rate</span>
                            </div>
                            <p className="text-2xl font-semibold">{analytics.conversionRate}%</p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                          <div className="flex items-center gap-2 text-primary mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs font-medium">Revenue</span>
                          </div>
                          <p className="text-3xl font-bold text-foreground">${analytics.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                        </div>

                        <div className="bg-muted/30 rounded-xl p-4">
                          <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="justify-start bg-transparent">
                              <ExternalLink className="w-3 h-3 mr-2" />
                              View Site
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start bg-transparent"
                              onClick={copyReferralLink}
                            >
                              {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                              {copied ? "Copied!" : "Copy Link"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Branding Tab */}
                    {activeTab === "branding" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Site Name</label>
                          <Input
                            value={formData.site_name}
                            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                            placeholder="My Awesome Store"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tagline</label>
                          <Input
                            value={formData.tagline}
                            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                            placeholder="Your catchy subtitle"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Primary Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={formData.primary_color}
                              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                              value={formData.primary_color}
                              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Logo</label>
                          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                            <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-xs text-muted-foreground">Drop logo or click to upload</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Music Tab */}
                    {activeTab === "music" && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Music className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{formData.music_title || "No track set"}</p>
                              <p className="text-xs text-muted-foreground">
                                {formData.music_artist || "Add a song for visitors"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Track URL</label>
                          <Input
                            value={formData.music_track_url}
                            onChange={(e) => setFormData({ ...formData, music_track_url: e.target.value })}
                            placeholder="https://example.com/song.mp3"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Artist</label>
                            <Input
                              value={formData.music_artist}
                              onChange={(e) => setFormData({ ...formData, music_artist: e.target.value })}
                              placeholder="Artist name"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title</label>
                            <Input
                              value={formData.music_title}
                              onChange={(e) => setFormData({ ...formData, music_title: e.target.value })}
                              placeholder="Song title"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-xl p-4">
                          <h3 className="text-sm font-medium mb-2">Connect Shopify</h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            Link your store to auto-populate products in the action rail.
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Store Domain
                              </label>
                              <Input
                                value={formData.shopify_domain}
                                onChange={(e) => setFormData({ ...formData, shopify_domain: e.target.value })}
                                placeholder="your-store.myshopify.com"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Storefront API Token
                              </label>
                              <Input
                                type="password"
                                value={formData.shopify_storefront_token}
                                onChange={(e) => setFormData({ ...formData, shopify_storefront_token: e.target.value })}
                                placeholder="shpat_xxxxx..."
                              />
                            </div>
                          </div>
                        </div>
                        {site?.shopify_connected && (
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <Check className="w-4 h-4" />
                            Shopify connected
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pixels Tab */}
                    {activeTab === "pixels" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Facebook Pixel ID
                          </label>
                          <Input
                            value={formData.fb_pixel_id}
                            onChange={(e) => setFormData({ ...formData, fb_pixel_id: e.target.value })}
                            placeholder="123456789012345"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            TikTok Pixel ID
                          </label>
                          <Input
                            value={formData.tiktok_pixel_id}
                            onChange={(e) => setFormData({ ...formData, tiktok_pixel_id: e.target.value })}
                            placeholder="XXXXXXXXXXXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            GA4 Measurement ID
                          </label>
                          <Input
                            value={formData.ga4_id}
                            onChange={(e) => setFormData({ ...formData, ga4_id: e.target.value })}
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Klaviyo Site ID
                          </label>
                          <Input
                            value={formData.klaviyo_id}
                            onChange={(e) => setFormData({ ...formData, klaviyo_id: e.target.value })}
                            placeholder="XXXXXX"
                          />
                        </div>
                      </div>
                    )}

                    {/* Affiliates Tab */}
                    {activeTab === "affiliates" && site && (
                      <div className="space-y-4">
                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                          <h3 className="text-sm font-medium mb-2">Your Referral Link</h3>
                          <div className="flex gap-2">
                            <Input
                              value={`theshopifyguy.dev?ref=${site.referral_code}`}
                              readOnly
                              className="text-xs bg-background"
                            />
                            <Button size="sm" variant="outline" onClick={copyReferralLink}>
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Earn 10% of revenue from every card created through this link.
                          </p>
                        </div>
                        <div className="bg-muted/30 rounded-xl p-4">
                          <h3 className="text-sm font-medium mb-3">Referral Stats</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <p className="text-xl font-semibold">0</p>
                              <p className="text-[10px] text-muted-foreground">Cards Created</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-semibold">$0</p>
                              <p className="text-[10px] text-muted-foreground">Pending</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xl font-semibold">$0</p>
                              <p className="text-[10px] text-muted-foreground">Paid Out</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && site && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Owner Email</label>
                          <Input value={site.owner_email || ""} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Card Number</label>
                          <Input value={`#${site.id}`} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                site.status === "active" ? "bg-[#3d6049]" : "bg-amber-500"
                              }`}
                            />
                            <span className="text-sm capitalize">{site.status}</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <Button variant="destructive" size="sm" className="w-full">
                            Delete Site
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === "analytics" && (
                      <div className="space-y-4">
                        <div className="bg-muted/30 rounded-xl p-4 text-center">
                          <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                          <p className="text-sm font-medium">Heatmaps & Click Tracking</p>
                          <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium">Key Metrics</h3>
                          {[
                            { label: "Total Traffic", value: "12,847", change: "+12%" },
                            { label: "Conversion Rate", value: "2.4%", change: "+0.3%" },
                            { label: "Avg. Order Value", value: "$127", change: "+$8" },
                            { label: "Revenue Per Visitor", value: "$3.05", change: "+$0.42" },
                          ].map((metric, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                              <span className="text-sm text-muted-foreground">{metric.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{metric.value}</span>
                                <span className="text-xs text-[#3d6049]">{metric.change}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
