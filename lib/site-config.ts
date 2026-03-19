export const siteConfig = {
  brand: {
    name: "v0 University",
    tagline: "Build websites with AI.",
    subtitle: "3 minutes. No code.",
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

  stats: [
    { value: "3min", label: "video" },
    { value: "$297", label: "once" },
    { value: "20", label: "spots" },
  ],

  pricing: {
    video: {
      name: "v0 University",
      price: 297,
      description: "One video. All templates. Build a site today.",
    },
  },

  meta: {
    title: "v0 University | Build Websites in 3 Minutes",
    description:
      "A 3-minute video that teaches you how to build a website. No code. No fluff. No 40-hour course.",
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
    ogTitle: "v0 University | 3 Minutes to Build Websites",
    ogDescription:
      "One video. Under 3 minutes. You watch it, you can build websites.",
    twitterDescription:
      "A 3-minute video that teaches you to build websites. No code. No fluff.",
  },
} as const

export type SiteConfig = typeof siteConfig
