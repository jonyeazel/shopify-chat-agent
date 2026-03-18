export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  recurring?: boolean
}

export const PRODUCTS: Product[] = [
  // Brand Launch Packages
  {
    id: "brand-launch-prelaunch",
    name: "Pre-Launch Package",
    description: "Landing page + product shots + waitlist/pre-order setup",
    priceInCents: 499700, // $4,997
  },
  {
    id: "brand-launch-full",
    name: "Full Launch Package",
    description: "Full store + product shots + landing pages + 30 ad creatives",
    priceInCents: 1249700, // $12,497
  },
  {
    id: "brand-launch-scale",
    name: "Scale Launch Package",
    description: "Full store + unlimited shots + landing pages + 100 ad creatives + social branding + referral system",
    priceInCents: 2499700, // $24,997
  },
  // Brand Asset Packages
  {
    id: "brand-assets-essentials",
    name: "Brand Assets Essentials",
    description: "8 product shots + 10 ad creatives",
    priceInCents: 99700, // $997
  },
  {
    id: "brand-assets-growth",
    name: "Brand Assets Growth",
    description: "16 product shots + 30 ad creatives + social templates",
    priceInCents: 249700, // $2,497
  },
  {
    id: "brand-assets-scale",
    name: "Brand Assets Scale",
    description: "Unlimited shots (3mo) + 100 ad creatives + animated ads + social branding kit",
    priceInCents: 499700, // $4,997
  },
  // CRO Packages
  {
    id: "cro-audit-proposal",
    name: "CRO Audit & Proposal",
    description: "Complete store analysis with personalized CRO recommendations and pricing",
    priceInCents: 9700, // $97
  },
  {
    id: "starter-build",
    name: "Starter CRO Build",
    description: "Essential conversion optimization package",
    priceInCents: 499700, // $4,997
  },
  {
    id: "growth-build",
    name: "Growth CRO Build",
    description: "Advanced CRO with A/B testing domain",
    priceInCents: 997700, // $9,977
  },
  {
    id: "scale-build",
    name: "Scale CRO Build",
    description: "Enterprise CRO with full automation",
    priceInCents: 1497700, // $14,977
  },
  // Creative Services
  {
    id: "product-shots",
    name: "Product Shots (8 Pack)",
    description: "8 professional product shots for any supplement bottle",
    priceInCents: 39700, // $397
  },
  {
    id: "full-pdp",
    name: "Full PDP Build",
    description: "Complete product detail page design and development",
    priceInCents: 149700, // $1,497
  },
  {
    id: "ad-creatives",
    name: "Ad Creatives (50/mo)",
    description: "50 ad creatives per month for paid advertising",
    priceInCents: 34900, // $349/mo
    recurring: true,
  },
  {
    id: "label-redesign",
    name: "Label Redesign",
    description: "Complete label redesign for your supplement product",
    priceInCents: 99700, // $997
  },
]
