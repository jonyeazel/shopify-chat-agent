export const siteConfig = {
  brand: {
    name: "v0 University",
    tagline: "Build websites with AI.",
    subtitle: "No code. No design skills. Just describe what you want.",
    avatarUrl: "/images/jon-profile.png",
    headerLogoUrl: "/images/v0-university-logo.png",
    logoUrl: "/images/v0-university-logo.png",
    domain: "v0university.com",
  },

  contact: {
    phone: "+14078677201",
    smsBody: "Hey Jon, I found you on v0university.com",
    email: "support@v0university.com",
    adminEmail: "admin@v0university.com",
    calendlyUrl: "https://calendly.com/v0university/coaching",
    calendlySupportUrl: "https://calendly.com/v0university/support",
  },

  // Removed stats - they lacked context and felt salesy
  // The conversation will reveal value naturally

  pricing: {
    video: {
      name: "v0 University",
      price: 297,
      description: "One video. All templates. Build a site today.",
    },
  },

  meta: {
    title: "v0 University | Learn to Build Websites with AI",
    description:
      "Learn how to build real websites using AI. No code required. No design experience needed.",
    keywords: [
      "v0",
      "v0 tutorial",
      "AI website builder",
      "no-code",
      "Shopify design",
      "AI design",
      "Vercel v0",
      "build websites with AI",
    ],
    ogTitle: "v0 University | Learn to Build Websites with AI",
    ogDescription:
      "Learn how to build real websites using AI. No code required.",
    twitterDescription:
      "Learn to build real websites with AI. No code required.",
  },
} as const

export type SiteConfig = typeof siteConfig
