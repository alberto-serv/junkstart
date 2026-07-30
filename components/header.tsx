"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone } from "lucide-react"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line-soft bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-[78px] w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="transition-opacity hover:opacity-80" aria-label="JunkStart Junk Removal home">
          <Image
            src="/images/logo.svg"
            alt="JunkStart Junk Removal"
            width={135}
            height={69}
            priority
            className="h-[48px] w-auto"
          />
        </Link>
        <a
          href={PHONE_TEL}
          className="inline-flex items-center gap-2 text-sm font-bold text-ink transition-colors hover:text-flame"
        >
          <Phone className="h-4 w-4 shrink-0 text-flame" />
          {/* Shown at every width. Hiding it on a phone left a lone orange icon
              floating opposite the logo, and the phone number is the one thing
              on this bar a mobile visitor is most likely to want. */}
          <span className="whitespace-nowrap">{PHONE}</span>
        </a>
      </div>
    </header>
  )
}
