export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "Build websites with AI",
    tagline: "Build your first real website with AI.",
    subtitle: "A 57-second lesson showing you exactly how. No experience needed.",
    avatarUrl: "/images/jon-profile.png",
    headerLogoUrl: "/images/v0-university-logo.png",
    logoUrl: "/images/v0-university-logo.png",
    domain: "v0university.com",
  },

  contact: {
    phone: "+14078677201",
    smsBody: "Hey Jon, I'm interested in v0 University",
    email: "support@v0university.com",
    adminEmail: "admin@v0university.com",
    calendlyUrl: "https://calendly.com/v0university/coaching",
    calendlySupportUrl: "https://calendly.com/v0university/support",
  },

  links: {
    referral: "https://v0.link/jon",
    video: "https://youtu.be/i9na_W31rLg",
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
    title: "v0 University | Build Websites with AI in 57 Seconds",
    description:
      "A 57-second video that teaches you how to build real websites with AI. No code. No design skills. Just describe what you want.",
    keywords: [
      "v0",
      "v0 tutorial",
      "AI website builder",
      "no-code",
      "build websites with AI",
      "AI design",
      "Vercel v0",
      "website AI",
      "v0 university",
    ],
    ogTitle: "Build Websites with AI in 57 Seconds",
    ogDescription:
      "A 57-second video that teaches you how to build real websites with AI. No experience needed.",
    twitterDescription:
      "Build your first real website with AI. 57-second lesson. No experience needed.",
  },
} as const

export type SiteConfig = typeof siteConfig
