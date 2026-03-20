// v0 University component data - no fake testimonials or metrics
// Testimonials will be collected from real users (first 20)

// Speed options removed - we only sell one thing: the 3-minute video for $297
// No consulting tiers, no complex pricing

// Empty placeholder - testimonials will be added as they come in
export interface Testimonial {
  name: string
  quote: string // max 12 words
}

export const TESTIMONIALS: Testimonial[] = []
// We'll add real testimonials here as we collect them from the first 20 buyers

// Deliverables for what's included
export const WHATS_INCLUDED = [
  "3-minute video tutorial",
  "All smart templates",
  "Build a site the same day",
]
