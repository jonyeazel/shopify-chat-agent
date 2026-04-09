export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "Download the skillset",
    tagline: "Stop hiring. Start building.",
    subtitle: "25,000 prompts distilled into one system.",
    avatarUrl: "/images/jon-profile.png",
    headerLogoUrl: "/images/v0-university-logo.png",
    logoUrl: "/images/v0-university-logo.png",
    domain: "v0university.com",
  },

  contact: {
    phone: "+14078677201",
    smsBody: "Hey Jon, I was just on v0university.com",
    email: "support@v0university.com",
    adminEmail: "admin@v0university.com",
    calendlyUrl: "https://calendly.com/v0university/discovery",
    calendlySupportUrl: "https://calendly.com/v0university/support",
  },

  links: {
    referral: "https://v0.link/jon",
    tutor: "/tutor",
  },

  meta: {
    title: "v0 University | Stop Hiring. Start Building.",
    description:
      "AI tutor trained on 25,000+ prompts. Learn the system that builds production sites in seconds. Pay once, keep forever.",
    keywords: [
      "v0",
      "v0 tutorial",
      "AI website builder",
      "no-code",
      "build websites with AI",
      "AI prompting",
      "Vercel v0",
      "v0 university",
      "v0 tutor",
    ],
    ogTitle: "Stop hiring. Start building.",
    ogDescription:
      "The world's most experienced v0 builder (25,000+ prompts) shares the exact system. Websites in seconds.",
    twitterDescription:
      "Stop hiring designers. Download the skillset instead.",
  },
} as const

export type SiteConfig = typeof siteConfig
