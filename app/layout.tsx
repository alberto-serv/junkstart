import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Poppins } from "next/font/google"
import "@/app/globals.css"
import { SiteChrome } from "@/components/site-chrome"
import { cn } from "@/lib/utils"

// Open Sans — the brand text face (body, subheads, forms, UI).
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-open-sans",
})

// Poppins — the brand display face (h1–h6, buttons, card titles).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "JunkStart Junk Removal — Instant Junk Removal Quotes",
  description:
    "Full-service junk removal and hauling for homes and businesses. Furniture, appliances, garage and estate cleanouts, construction debris and more. Get an upfront price in under two minutes.",
  icons: {
    icon: "/favicon.ico",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          openSans.variable,
          poppins.variable,
        )}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
