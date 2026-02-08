import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/site-config"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: siteConfig.meta.title,
  description: siteConfig.meta.description,
  generator: "v0.dev",
  keywords: siteConfig.meta.keywords,
  authors: [{ name: siteConfig.brand.name, url: `https://${siteConfig.brand.domain}` }],
  creator: siteConfig.brand.name,
  publisher: siteConfig.brand.name,
  robots: "index, follow",
  openGraph: {
    title: siteConfig.meta.ogTitle,
    description: siteConfig.meta.ogDescription,
    type: "website",
    siteName: siteConfig.brand.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.brand.name,
    description: siteConfig.meta.twitterDescription,
  },
}

export const viewport: Viewport = {
  themeColor: "#e4e4e4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
