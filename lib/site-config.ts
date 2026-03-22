export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "Build sites with AI",
    tagline: "Build sites with AI. No code. No designers.",
    subtitle: "Learn the system in minutes. Build forever.",
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
    calendlyUrl: "https://calendly.com/v0university/live-build",
    calendlySupportUrl: "https://calendly.com/v0university/support",
  },

  links: {
    referral: "https://v0.link/jon",
    video: "https://youtu.be/i9na_W31rLg",
  },

  meta: {
    title: "v0 University | Build Sites with AI",
    description:
      "The v0 Playbook: 78 templates, 200+ prompt swipes, and the core method video. Build professional websites by describing what you want.",
    keywords: [
      "v0",
      "v0 tutorial",
      "AI website builder",
      "no-code",
      "build websites with AI",
      "AI design",
      "Vercel v0",
      "v0 university",
      "v0 playbook",
    ],
    ogTitle: "Build Sites with AI. No Code. No Designers.",
    ogDescription:
      "The v0 Playbook: Learn the prompting system that gets professional results. 78 templates. 200+ prompt swipes.",
    twitterDescription:
      "Build sites with AI. The v0 Playbook teaches you how.",
  },
} as const

export type SiteConfig = typeof siteConfig
