export const siteConfig = {
  brand: {
    name: "v0 University",
    headerSubtitle: "By Jon Yeazel",
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
    title: "v0 University | Prompt Engineering",
    description:
      "For the people who build, buy & sell websites. The Cook Method - build sites in hours, not weeks.",
    keywords: [
      "v0",
      "prompt engineering",
      "AI website builder",
      "the cook method",
      "build websites with AI",
      "AI prompting",
      "Vercel v0",
      "v0 university",
      "Jon Yeazel",
    ],
    ogTitle: "Prompt Engineering for Website Builders",
    ogDescription:
      "For the people who build, buy & sell websites. The Cook Method - build sites in hours, not weeks.",
    twitterDescription:
      "Prompt engineering for the people who build, buy & sell websites.",
  },
} as const

export type SiteConfig = typeof siteConfig
