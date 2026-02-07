"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ExternalLink, Key, Shield, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StorefrontApiGuideProps {
  storeDomain?: string
  onApiKeySubmit?: (key: string) => void
}

const STEPS = [
  {
    title: "Access Your Shopify Admin",
    description: "Log into your Shopify store's admin panel",
    detail: "Go to yourstore.myshopify.com/admin or click the 'Log in' button on your store and navigate to admin.",
  },
  {
    title: "Go to Settings",
    description: "Find the gear icon in the bottom left corner",
    detail: "Click on Settings (gear icon) at the bottom of the left sidebar.",
  },
  {
    title: "Open Apps and Sales Channels",
    description: "Navigate to app settings",
    detail: "In the Settings menu, click on 'Apps and sales channels'.",
  },
  {
    title: "Develop Apps",
    description: "Access the app development section",
    detail: "Click 'Develop apps' in the top right corner. You may need to enable developer mode first.",
  },
  {
    title: "Create New App",
    description: "Set up a new custom app",
    detail: "Click 'Create an app' and name it 'The Shopify Guy CRO' (or any name you prefer). Click 'Create app'.",
  },
  {
    title: "Configure Storefront API",
    description: "Set the necessary permissions",
    detail:
      "Click 'Configure Storefront API scopes'. Enable: unauthenticated_read_product_listings, unauthenticated_read_product_inventory. Click Save.",
  },
  {
    title: "Install and Get Token",
    description: "Copy your Storefront API access token",
    detail:
      "Click 'Install app', then go to 'API credentials' tab. Copy the Storefront API access token - this is what you'll paste below.",
  },
]

export function StorefrontApiGuide({ storeDomain, onApiKeySubmit }: StorefrontApiGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onApiKeySubmit?.(apiKey.trim())
    }
  }

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3d6049]/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-[#6a9976]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Storefront API Setup</h3>
            <p className="text-xs text-neutral-400">Required for building your optimized store</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
          className="text-neutral-400 hover:text-white"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Why we need this */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-300 mb-1">Why do we need this?</p>
                  <p className="text-neutral-400">
                    The Storefront API gives us <strong className="text-white">read-only</strong> access to display your
                    products beautifully on your new optimized store. We can NOT access orders, customers, or any
                    sensitive business data. It's the safest way to build your headless storefront.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Steps */}
      <div className="p-4">
        <div className="space-y-2">
          {STEPS.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentStep === index
                  ? "bg-[#3d6049]/10 border border-[#3d6049]/30"
                  : "bg-neutral-800/50 border border-transparent hover:bg-neutral-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === index ? "bg-[#3d6049] text-white" : "bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${currentStep === index ? "text-[#6a9976]" : "text-neutral-300"}`}
                  >
                    {step.title}
                  </p>
                  {currentStep === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-xs text-neutral-400 mt-1"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${currentStep === index ? "rotate-90 text-[#6a9976]" : "text-neutral-500"}`}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Quick link */}
        {storeDomain && (
          <a
            href={`https://${storeDomain}/admin/settings/apps/development`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#6a9976] hover:text-[#93b89d] mt-4 p-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open {storeDomain} Admin Settings
          </a>
        )}

        {/* API Key Input */}
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <label className="text-sm font-medium text-neutral-300 mb-2 block">Paste your Storefront API Token</label>
          <div className="flex gap-2">
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="shpat_xxxxxxxxxxxxx"
              className="bg-neutral-800 border-neutral-700 text-white font-mono text-sm"
            />
            <Button
              onClick={handleSubmit}
              disabled={!apiKey.trim()}
              className="bg-[#3d6049] hover:bg-[#2f4a3a] px-6"
            >
              Save
            </Button>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Your token is encrypted and stored securely. We never share your credentials.
          </p>
        </div>
      </div>
    </div>
  )
}
