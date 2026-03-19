export const siteConfig = {
  brand: {
    name: "v0 University",
    tagline: "Build real websites with AI.",
    subtitle: "No code required.",
    avatarUrl: "/images/jon-profile.png",
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
    { value: "2hrs", label: "to launch" },
    { value: "$0", label: "dev costs" },
    { value: "100%", label: "ownership" },
  ],

  pricing: {
    course: {
      name: "The v0 Masterclass",
      price: 297,
      description: "Everything you need to build professional websites with v0",
    },
    coaching: [
      {
        name: "Accelerator",
        price: 1497,
        description: "Course + 4 weeks of 1:1 coaching calls",
      },
      {
        name: "Done-With-You",
        price: 3497,
        description: "Course + 8 weeks coaching + we build your first site together",
      },
    ],
  },

  meta: {
    title: "v0 University | Learn to Build Websites with AI",
    description:
      "Learn how to build professional websites using v0. Perfect for Shopify founders and anyone who wants to ship real projects without writing code.",
    keywords: [
      "v0",
      "v0 tutorial",
      "AI website builder",
      "no-code",
      "Shopify design",
      "website course",
      "AI design",
      "Vercel v0",
      "build websites with AI",
      "Shopify founders",
    ],
    ogTitle: "v0 University | Build Real Websites with AI",
    ogDescription:
      "Learn how to build professional websites using v0. No code required.",
    twitterDescription:
      "Learn to build real websites with v0. No code required.",
  },
} as const

export type SiteConfig = typeof siteConfig
