"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ChevronDown, Phone, Menu, X } from "lucide-react"
import { QUOTE_URL } from "./links"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"

const LEFT_NAV = [
  { label: "Residential Junk Removal", hasMenu: true },
  { label: "Commercial Hauling", hasMenu: true },
  { label: "Service Areas", hasMenu: true },
]
const RIGHT_NAV = [
  { label: "Franchising", hasMenu: true },
  { label: "About Us", hasMenu: false },
]

function NavLink({ label, hasMenu }: { label: string; hasMenu: boolean }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 whitespace-nowrap text-[12.5px] font-bold uppercase tracking-[0.06em] text-ink transition-colors hover:text-flame"
    >
      {label}
      {hasMenu && <ChevronDown className="h-3 w-3 opacity-70" />}
    </button>
  )
}

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="bg-brand">
        <div className="mx-auto flex h-8 w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
          <Link
            href="#"
            className="text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-80"
          >
            Own a JunkStart — Franchise Opportunities
          </Link>
          <a
            href={PHONE_TEL}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-80"
          >
            <Phone className="h-3 w-3" />
            {PHONE}
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-line-soft bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="mx-auto flex h-[70px] w-full max-w-[1400px] items-center justify-between gap-4 px-4 md:px-6">
          {/* Left nav (desktop) */}
          <nav className="hidden flex-1 items-center gap-6 lg:flex">
            {LEFT_NAV.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/landing" className="shrink-0 transition-opacity hover:opacity-80">
            <Image
              src="/images/logo.svg"
              alt="JunkStart Junk Removal"
              width={135}
              height={69}
              priority
              className="h-[44px] w-auto"
            />
          </Link>

          {/* Right nav + CTAs (desktop) */}
          <div className="hidden flex-1 items-center justify-end gap-5 lg:flex">
            {RIGHT_NAV.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
            <a
              href={PHONE_TEL}
              className="flex items-center gap-1.5 rounded-btn bg-brand px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-brand-deep"
            >
              <Phone className="h-3.5 w-3.5" />
              {PHONE}
            </a>
            <a
              href={QUOTE_URL}
              className="rounded-btn bg-flame px-4 py-[9px] text-[12px] font-bold uppercase tracking-[0.04em] text-white shadow-flame-glow transition-colors hover:bg-flame-deep"
            >
              Get My Price
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-ink lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-line-soft bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {[...LEFT_NAV, ...RIGHT_NAV].map((item) => (
                <NavLink key={item.label} {...item} />
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={PHONE_TEL}
                className="flex items-center justify-center gap-1.5 rounded-btn bg-brand px-4 py-2.5 text-sm font-bold text-white"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>
              <a
                href={QUOTE_URL}
                className="rounded-btn bg-flame px-4 py-2.5 text-center text-sm font-bold uppercase text-white"
              >
                Get My Price
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
