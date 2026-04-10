export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "Ai Consulting",
    tagline: "Prompt Engineering",
    subtitle: "For the people who build, buy & sell websites",
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
    title: "v0 University | For anybody who's ever built, sold or bought a website",
    description:
      "For anybody who's ever built, sold or bought a website. Learn The Cook Method - the AI prompting system from 25,000+ generations.",
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
    ogTitle: "For anybody who's ever built, sold or bought a website",
    ogDescription:
      "Learn The Cook Method - the AI prompting system from 25,000+ generations. Build sites in hours, not weeks.",
    twitterDescription:
      "For anybody who's ever built, sold or bought a website.",
  },
} as const

export type SiteConfig = typeof siteConfig
