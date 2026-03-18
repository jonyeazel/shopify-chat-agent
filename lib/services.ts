// Complete service catalog with tiers, FAQs, and portfolio
export interface ServiceTier {
  name: string
  price: number
  description: string
}

export interface Service {
  id: string
  name: string
  category: string
  description: string
  tiers: ServiceTier[]
  faqs: { question: string; answer: string }[]
  portfolioImages?: string[]
  portfolioSites?: { name: string; url: string; thumbnail?: string }[]
}

export const SERVICES: Service[] = [
  // CONSULTING
  {
    id: "quick-question",
    name: "Quick Question",
    category: "consulting",
    description: "One detailed answer to any Shopify question",
    tiers: [{ name: "Single Question", price: 100, description: "One detailed answer within 24 hours" }],
    faqs: [
      { question: "How fast will I get a response?", answer: "Within 24 hours, usually same day." },
      { question: "Can I ask follow-ups?", answer: "One follow-up is included. More questions need another purchase." },
      {
        question: "What kind of questions can I ask?",
        answer: "Anything Shopify related - tech, strategy, apps, design, CRO.",
      },
    ],
  },
  {
    id: "strategy-call",
    name: "Strategy Call",
    category: "consulting",
    description: "30-minute 1-on-1 call to solve your biggest problem",
    tiers: [{ name: "30-Minute Call", price: 1000, description: "Focused session on one specific challenge" }],
    faqs: [
      { question: "How do I book the call?", answer: "After payment you'll get a Calendly link to pick a time." },
      { question: "Can I record it?", answer: "Yeah, I'll send you the recording after." },
      { question: "What should I prepare?", answer: "Your biggest question and store access if needed." },
    ],
  },
  {
    id: "weekly-consulting",
    name: "Weekly Consulting",
    category: "consulting",
    description: "One call per week for ongoing strategic guidance",
    tiers: [
      { name: "Weekly (1 month)", price: 2500, description: "4 calls over one month" },
      { name: "Weekly (3 months)", price: 6000, description: "12 calls, save $1,500" },
      { name: "Weekly (6 months)", price: 10000, description: "24 calls, save $5,000" },
    ],
    faqs: [
      { question: "How long are the calls?", answer: "30 minutes each, but we go over if needed." },
      { question: "Can I reschedule?", answer: "Yeah, 24 hours notice and we'll move it." },
      { question: "Do unused calls roll over?", answer: "No, use em or lose em. Keeps us both accountable." },
    ],
  },

  // CREATIVE
  {
    id: "product-shots",
    name: "Product Shots",
    category: "creative",
    description: "8 professional product shots for any supplement bottle",
    tiers: [
      { name: "8-Shot Package", price: 397, description: "Hero, angles, bundles, lifestyle" },
      { name: "16-Shot Package", price: 697, description: "Full library with seasonal variants" },
      { name: "Unlimited (3mo)", price: 997, description: "All the shots you need for 3 months" },
    ],
    faqs: [
      {
        question: "What do I need to send you?",
        answer: "A photo of your bottle and your label file (AI, PSD, or PDF).",
      },
      { question: "How long does it take?", answer: "48 hours for the standard package." },
      {
        question: "Can you do non-supplement products?",
        answer: "I can do literally anything - bottles, jars, pouches, cans, boxes, books, cosmetics, you name it.",
      },
      { question: "Do I own the images?", answer: "100%. Full commercial rights, use em anywhere." },
    ],
    portfolioImages: [
      "/images/product-20shot.png",
      "/images/2pk-20pundle.png",
      "/images/3pk-20aov-20booster.png",
      "/images/label-20info.png",
      "/images/gravity-20shot.png",
      "/images/abstract-20graphic.png",
      "/images/50-50-20infographic.png",
      "/images/blank-20bottle.png",
      "/images/1.png",
      "/images/2.png",
      "/images/3.png",
      "/images/4.png",
      "/images/5.png",
      "/images/6.png",
      "/images/8.png",
      "/images/9.png",
      "/images/12.png",
      "/images/16.png",
    ],
  },
  {
    id: "label-redesign",
    name: "Label Redesign",
    category: "creative",
    description: "Complete label redesign for your supplement",
    tiers: [
      { name: "Single Label", price: 997, description: "One product, print-ready files" },
      { name: "Product Line (3)", price: 2497, description: "Three labels with cohesive branding" },
      { name: "Full Catalog (6+)", price: 4997, description: "Six or more, complete brand system" },
    ],
    faqs: [
      { question: "Do you handle printing?", answer: "I give you print-ready files. Happy to recommend printers." },
      { question: "How many revisions?", answer: "Two rounds included. Usually we nail it in one." },
      {
        question: "Can you match our existing branding?",
        answer: "Yeah, send your brand guidelines and I'll stay on brand.",
      },
    ],
  },
  {
    id: "ad-creatives",
    name: "Ad Creatives",
    category: "creative",
    description: "50 ad creatives per month for paid advertising",
    tiers: [
      { name: "Starter (25/mo)", price: 249, description: "Great for testing new angles" },
      { name: "Growth (50/mo)", price: 349, description: "Full creative rotation" },
      { name: "Scale (100/mo)", price: 549, description: "Aggressive testing at scale" },
    ],
    faqs: [
      { question: "What sizes do you deliver?", answer: "1080x1080, 1080x1920, and 1200x628 for each concept." },
      { question: "Can you do video?", answer: "Static and motion graphics. Full video is separate." },
      { question: "How do you know what works?", answer: "I've spent millions on ads. I know what converts." },
    ],
  },
  {
    id: "static-ad-creatives",
    name: "Static Ad Creatives",
    category: "creative",
    description: "Static ad creatives for paid advertising",
    tiers: [
      { name: "Single", price: 9, description: "Single static ad creative" },
      { name: "Bundle 30", price: 249, description: "30 static ad creatives" },
      { name: "Bundle 100", price: 749, description: "100 static ad creatives" },
    ],
    faqs: [
      { question: "What sizes do you deliver?", answer: "1080x1080, 1080x1920, and 1200x628 for each concept." },
      { question: "Can you do video?", answer: "No, this is for static ads only." },
      { question: "How do you know what works?", answer: "I've spent millions on ads. I know what converts." },
    ],
  },

  // PAGE BUILDS
  {
    id: "pdp-build",
    name: "Product Page (PDP)",
    category: "pages",
    description: "High-converting product detail page",
    tiers: [
      { name: "Single PDP", price: 1497, description: "One optimized product page" },
      { name: "3-Page Bundle", price: 3497, description: "Three PDPs, consistent system" },
      { name: "Full Catalog", price: 7497, description: "All products, templated system" },
    ],
    faqs: [
      { question: "Do you write the copy?", answer: "Basic copy included. Premium copywriting is extra." },
      { question: "Will it work with my theme?", answer: "I build custom sections that work with any theme." },
      { question: "How long does it take?", answer: "5-7 business days for a single PDP." },
    ],
    portfolioSites: [
      { name: "Goli Gummies", url: "https://v0-vcommercepdp-three.vercel.app" },
      { name: "BREZ", url: "https://v0-brez-product-page.vercel.app" },
      { name: "Seed Probiotics", url: "https://v0-vcommercepdp.vercel.app" },
      { name: "MUD\\WTR", url: "https://v0-mudwater.vercel.app" },
    ],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    category: "pages",
    description: "Conversion-focused landing page for campaigns",
    tiers: [
      { name: "Basic Landing", price: 2500, description: "Clean, focused, converts" },
      { name: "Advanced Landing", price: 4500, description: "Multiple sections, animations" },
      { name: "Funnel (3 pages)", price: 7500, description: "Full funnel with upsells" },
    ],
    faqs: [
      { question: "Can you integrate with my email tool?", answer: "Klaviyo, Mailchimp, whatever you use." },
      { question: "Do you do A/B testing?", answer: "I can set up the variants. You run the traffic." },
    ],
  },
  {
    id: "homepage",
    name: "Homepage Redesign",
    category: "pages",
    description: "Complete homepage redesign for better first impressions",
    tiers: [
      { name: "Refresh", price: 3500, description: "Update existing structure" },
      { name: "Redesign", price: 5500, description: "Complete new design" },
      { name: "Premium", price: 8500, description: "Custom animations, advanced features" },
    ],
    faqs: [
      { question: "Will it slow down my site?", answer: "No. I optimize for speed as I build." },
      { question: "Can I edit it after?", answer: "Everything is built in Shopify's native editor." },
    ],
  },

  // FULL STORE
  {
    id: "theme-customization",
    name: "Theme Customization",
    category: "store",
    description: "Make your theme work exactly how you want",
    tiers: [
      { name: "Light Touch", price: 7500, description: "Key pages and sections" },
      { name: "Full Custom", price: 12500, description: "Complete theme overhaul" },
      { name: "Premium", price: 17500, description: "Every detail perfected" },
    ],
    faqs: [
      { question: "Which themes do you work with?", answer: "All of them. Dawn, Prestige, Impulse, custom, whatever." },
      { question: "How long does it take?", answer: "2-4 weeks depending on scope." },
    ],
  },
  {
    id: "custom-theme",
    name: "Custom Theme Build",
    category: "store",
    description: "Built-from-scratch theme for your brand",
    tiers: [
      { name: "Standard", price: 25000, description: "Clean, fast, fully custom" },
      { name: "Advanced", price: 40000, description: "Complex features, integrations" },
      { name: "Enterprise", price: 75000, description: "Headless, multi-market, advanced" },
    ],
    faqs: [
      {
        question: "Why not just customize a theme?",
        answer: "Custom is faster, cleaner, and exactly what you need. No bloat.",
      },
      { question: "Do you do headless?", answer: "Yeah, Hydrogen, Next.js, whatever makes sense." },
    ],
  },
  {
    id: "store-migration",
    name: "Store Migration",
    category: "store",
    description: "Move from any platform to Shopify",
    tiers: [
      { name: "Basic Migration", price: 10000, description: "Products, customers, orders" },
      { name: "Full Migration", price: 17500, description: "Plus design recreation" },
      { name: "Premium Migration", price: 25000, description: "Plus optimizations and training" },
    ],
    faqs: [
      {
        question: "What platforms can you migrate from?",
        answer: "WooCommerce, Magento, BigCommerce, Squarespace, anywhere.",
      },
      { question: "Will I lose SEO?", answer: "No. I handle all redirects and preserve your rankings." },
    ],
  },
  {
    id: "full-redesign",
    name: "Full Store Redesign",
    category: "store",
    description: "Complete transformation of your Shopify store",
    tiers: [
      { name: "Essential", price: 25000, description: "New design, key pages" },
      { name: "Complete", price: 45000, description: "Every page, full optimization" },
      { name: "Premium", price: 75000, description: "Enterprise features, ongoing support" },
    ],
    faqs: [
      { question: "How long does a full redesign take?", answer: "4-8 weeks depending on complexity." },
      { question: "Do you do the copywriting?", answer: "I can, or work with your copy. Either way." },
    ],
  },

  // CRO
  {
    id: "cro-audit",
    name: "CRO Audit",
    category: "cro",
    description: "Detailed analysis of your conversion bottlenecks",
    tiers: [
      { name: "Quick Audit", price: 497, description: "Top 10 issues identified" },
      { name: "Full Audit", price: 997, description: "Complete analysis with prioritized fixes" },
      { name: "Audit + Roadmap", price: 1997, description: "Plus 90-day implementation plan" },
    ],
    faqs: [
      { question: "What do I get?", answer: "Video walkthrough, prioritized issue list, fix recommendations." },
      { question: "Does the audit cost go toward the build?", answer: "Yeah, 100% credit if you move forward." },
    ],
  },
  {
    id: "cro-build",
    name: "CRO Implementation",
    category: "cro",
    description: "We fix your conversion issues and optimize your store",
    tiers: [
      { name: "Starter", price: 5000, description: "Essential fixes + $500/mo maintenance" },
      { name: "Growth", price: 10000, description: "Full optimization + A/B domain + $1k/mo" },
      { name: "Scale", price: 15000, description: "Everything + priority support + $1.5k/mo" },
    ],
    faqs: [
      { question: "What's included in maintenance?", answer: "Ongoing tweaks, testing, and support." },
      {
        question: "What's the A/B domain?",
        answer: "A separate domain running your optimized version so we can measure real lift.",
      },
    ],
  },

  // ENTERPRISE
  {
    id: "enterprise-headless",
    name: "Headless Commerce",
    category: "enterprise",
    description: "Next-gen architecture for scale",
    tiers: [
      { name: "Hydrogen", price: 75000, description: "Shopify's native headless" },
      { name: "Next.js", price: 100000, description: "Full custom frontend" },
      { name: "Multi-storefront", price: 150000, description: "Multiple brands, one backend" },
    ],
    faqs: [
      { question: "Do I need headless?", answer: "Only if you're doing 8+ figures or have complex needs. Let's talk." },
    ],
  },
  {
    id: "enterprise-ecosystem",
    name: "Multi-Store Ecosystem",
    category: "enterprise",
    description: "Multiple stores, unified operations",
    tiers: [
      { name: "2-3 Stores", price: 100000, description: "Shared backend, unique fronts" },
      { name: "4-6 Stores", price: 175000, description: "Complex integrations" },
      { name: "7+ Stores", price: 250000, description: "Full enterprise architecture" },
    ],
    faqs: [
      {
        question: "Can you manage inventory across stores?",
        answer: "Yeah, unified inventory, split fulfillment, all of it.",
      },
    ],
  },
  {
    id: "enterprise-retainer",
    name: "Enterprise Retainer",
    category: "enterprise",
    description: "Dedicated Shopify partner for your team",
    tiers: [
      { name: "Part-time", price: 10000, description: "20 hours/month" },
      { name: "Half-time", price: 17500, description: "40 hours/month" },
      { name: "Full-time", price: 25000, description: "Dedicated resource" },
    ],
    faqs: [
      { question: "Is this just you or a team?", answer: "Me as your lead, with specialists I bring in as needed." },
    ],
  },

  // BRAND LAUNCH - Comprehensive new brand packages
  {
    id: "brand-launch",
    name: "Brand Launch Package",
    category: "launch",
    description: "Everything you need to launch a new brand from scratch",
    tiers: [
      { 
        name: "Pre-Launch", 
        price: 4997, 
        description: "Landing page + product shots + waitlist/pre-order setup" 
      },
      { 
        name: "Full Launch", 
        price: 12497, 
        description: "Full store + product shots + landing pages + 30 ad creatives" 
      },
      { 
        name: "Scale Launch", 
        price: 24997, 
        description: "Full store + unlimited shots + landing pages + 100 ad creatives + social branding + referral system" 
      },
    ],
    faqs: [
      { 
        question: "What's included in the Pre-Launch?", 
        answer: "High-converting landing page for pre-orders/waitlist, 8 product shots, email capture setup with Klaviyo, and mobile-optimized design. Perfect for validating before full build." 
      },
      { 
        question: "What's included in Full Launch?", 
        answer: "Complete Shopify store (homepage, collection, PDP, about, contact), 16 product shots, 2 landing pages, 30 ad creatives, newsletter signup, promo code system, and mobile-first design." 
      },
      { 
        question: "What's included in Scale Launch?", 
        answer: "Everything in Full Launch plus unlimited product shots for 3 months, 100 ad creatives, social media branding kit, influencer/affiliate referral system, upsell funnels, and priority support." 
      },
      { 
        question: "How long does a brand launch take?", 
        answer: "Pre-Launch: 1-2 weeks. Full Launch: 3-4 weeks. Scale Launch: 4-6 weeks. We move fast." 
      },
      { 
        question: "Do you help with branding/logo?", 
        answer: "Logo refinement is included. Full brand identity from scratch is a separate add-on starting at $2,500." 
      },
      { 
        question: "Can you work with my existing logo?", 
        answer: "Absolutely. Send me your files and I'll make sure everything is cohesive." 
      },
      { 
        question: "What about ongoing support after launch?", 
        answer: "30 days of launch support included. Ongoing retainers available starting at $500/mo." 
      },
    ],
    portfolioSites: [
      { name: "Grinds (Competitor Reference)", url: "https://www.getgrinds.com", thumbnail: "/images/sites/grinds-ref.jpg" },
      { name: "Stadics", url: "https://www.stadics.com" },
      { name: "The Shopify Guy", url: "https://www.theshopifyguy.dev" },
    ],
  },
  {
    id: "brand-assets",
    name: "Brand Asset Package",
    category: "launch",
    description: "Creative assets for your product launch",
    tiers: [
      { 
        name: "Essentials", 
        price: 997, 
        description: "8 product shots + 10 ad creatives" 
      },
      { 
        name: "Growth", 
        price: 2497, 
        description: "16 product shots + 30 ad creatives + social templates" 
      },
      { 
        name: "Scale", 
        price: 4997, 
        description: "Unlimited shots (3mo) + 100 ad creatives + animated ads + social branding kit" 
      },
    ],
    faqs: [
      { 
        question: "What do I need to provide?", 
        answer: "Product photo or sample, label file (AI, PSD, or PDF), and any brand guidelines you have." 
      },
      { 
        question: "What ad sizes do you deliver?", 
        answer: "1080x1080 (feed), 1080x1920 (story/reels), 1200x628 (Facebook feed). All formats for each concept." 
      },
      { 
        question: "Can you do animated/motion ads?", 
        answer: "Included in Scale tier. Static + motion for each concept." 
      },
      { 
        question: "Turnaround time?", 
        answer: "Essentials: 48 hours. Growth: 5 days. Scale: 7 days for initial batch, then ongoing." 
      },
    ],
    portfolioImages: [
      "/images/product-shot.png",
      "/images/gravity-shot.png",
      "/images/2pk-bundle.png",
      "/images/3pk-aov-booster.png",
    ],
  },

  // CUSTOM
  {
    id: "custom-project",
    name: "Custom Project",
    category: "custom",
    description: "Something else? Tell me what you need.",
    tiers: [
      { name: "Small", price: 2500, description: "A few days of work" },
      { name: "Medium", price: 7500, description: "A week or two" },
      { name: "Large", price: 15000, description: "Multi-week project" },
      { name: "Enterprise", price: 50000, description: "Major initiative" },
    ],
    faqs: [
      {
        question: "How do you price custom work?",
        answer: "Based on complexity and timeline. These tiers are starting points.",
      },
    ],
  },
]

export const SERVICE_CATEGORIES = [
  { id: "launch", name: "Brand Launch", icon: "Rocket" },
  { id: "consulting", name: "Consulting", icon: "MessageSquare" },
  { id: "creative", name: "Creative", icon: "Camera" },
  { id: "pages", name: "Page Builds", icon: "Layout" },
  { id: "store", name: "Full Store", icon: "Store" },
  { id: "cro", name: "CRO", icon: "TrendingUp" },
  { id: "enterprise", name: "Enterprise", icon: "Building" },
  { id: "custom", name: "Custom", icon: "Sparkles" },
]

export function getServiceById(id: string): Service | undefined {
  return SERVICES.find((s) => s.id === id)
}

export function getServicesByCategory(category: string): Service[] {
  return SERVICES.filter((s) => s.category === category)
}
