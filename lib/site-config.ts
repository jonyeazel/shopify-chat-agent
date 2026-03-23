export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "Build sites with AI",
    tagline: "Type an idea. Watch it exist.",
    subtitle: "The methodology behind 25,000+ prompts.",
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
    title: "v0 University | Download the Skillset",
    description:
      "Private AI tutor teaching the exact prompting methodology from 25,000+ prompts. Build websites in seconds, not weeks.",
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
    ogTitle: "Type an idea. Watch it exist.",
    ogDescription:
      "Private AI tutor from the world's most experienced v0 user. 25,000+ prompts distilled into one system.",
    twitterDescription:
      "Download a skillset. Build websites with AI.",
  },
} as const

export type SiteConfig = typeof siteConfig
