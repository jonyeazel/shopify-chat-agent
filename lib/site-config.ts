export const siteConfig = {
  brand: {
    name: "The Shopify Guy",
    tagline: "Everything you need.",
    subtitle: "Ecom Since 2012",
    avatarUrl: "/images/gemini-generated-image-d9bdhjd9bdhjd9bd.jpeg",
    domain: "theshopifyguy.dev",
  },

  contact: {
    phone: "+14078677201",
    smsBody: "Hey Jon, I found you on theshopifyguy.dev",
    email: "support@theshopifyguy.com",
    adminEmail: "admin@theshopifyguy.com",
    calendlyUrl: "https://calendly.com/theshopifyguy/cro-strategy",
    calendlySupportUrl: "https://calendly.com/theshopifyguy/support",
  },

  stats: [
    { value: "14", label: "years" },
    { value: "50+", label: "stores" },
    { value: "48hr", label: "delivery" },
  ],

  meta: {
    title: "the shopify guy - ai chat",
    description:
      "I build Shopify stores that convert. 14 years experience, 100+ stores built, $50M+ GMV generated. Get a free store audit or start your project today.",
    keywords: [
      "Shopify",
      "Shopify expert",
      "Shopify developer",
      "ecommerce",
      "store design",
      "CRO",
      "conversion optimization",
      "Shopify plus",
      "DTC brands",
    ],
    ogTitle: "The Shopify Guy | Stores That Convert",
    ogDescription:
      "14 years experience. 100+ stores. $50M+ GMV. Free store audits. Let's build something that converts.",
    twitterDescription:
      "I build Shopify stores that convert. 14 years, 100+ stores. Free audits available.",
  },
} as const

export type SiteConfig = typeof siteConfig
