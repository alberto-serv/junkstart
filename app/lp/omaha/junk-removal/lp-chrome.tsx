"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Clock, Mail, MapPin, Phone, Truck } from "lucide-react"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"
import { WRAP, loc, brand, scrollToBooking } from "./config"

/* ============================================================
   Landing-page chrome — a micro-header, an availability ribbon and a NAP
   footer, all sitting on the page's ONE content column (see WRAP in config).

   Deliberately NOT the site's marketing nav: a paid landing page wants a single
   conversion target, so the header carries no navigation links — just the logo,
   the market, a call link, and a CTA that reveals itself once the hero (and with
   it the booking module) has scrolled out of view.
   ============================================================ */

/* ── Micro-header ─────────────────────────────────────────────────────────── */

export function LpHeader() {
  // Desktop scroll CTA appears only once the hero has left the viewport, so it
  // never competes with the module while the module is still on screen.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("hero")
      if (!hero) return
      setScrolled(hero.getBoundingClientRect().bottom < 60)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className={`${WRAP} flex h-[60px] items-center gap-3`}>
        <Image
          src="/images/logo.svg"
          alt="JunkStart Junk Removal"
          width={135}
          height={69}
          priority
          className="h-[38px] w-auto"
        />

        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-muted px-3 py-1.5 text-[13px] font-semibold text-ink">
          <MapPin className="h-3.5 w-3.5 text-flame" />
          {loc.city}, {loc.state}
        </span>

        {/* Collapses to zero width when hidden so it never nudges the row. */}
        <button
          type="button"
          onClick={scrollToBooking}
          className={`hidden overflow-hidden whitespace-nowrap rounded-btn bg-flame font-display text-[13.5px] font-bold text-white shadow-flame-glow transition-all duration-300 lg:inline-flex lg:items-center ${
            scrolled ? "ml-3 max-w-[280px] px-4 py-2.5 opacity-100" : "ml-0 max-w-0 px-0 py-2.5 opacity-0"
          }`}
          tabIndex={scrolled ? 0 : -1}
          aria-hidden={!scrolled}
        >
          {brand.ctaLabel}
        </button>
      </div>
    </header>
  )
}

/* ── Footer ───────────────────────────────────────────────────────────────── */

export function LpFooter() {
  return (
    <footer className="bg-brand text-[#c3d5f7]">
      <div className={`${WRAP} grid gap-9 py-11 md:grid-cols-[1.6fr_1fr_1fr]`}>
        <div>
          <Image
            src="/images/logo-white.svg"
            alt="JunkStart Junk Removal"
            width={135}
            height={69}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-[#c3d5f7]">
            Upfront-priced junk removal and hauling for homes and businesses across {loc.city} and
            the metro. We donate or recycle everything we can before anything sees a landfill.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">Contact</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <a href={PHONE_TEL} className="hover:text-white">{PHONE}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <a href={`mailto:${loc.email}`} className="hover:text-white">{loc.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {loc.hours}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold text-white">JunkStart {loc.city}</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <span>
                {loc.city}, {loc.state}
                <br />
                <span className="text-[13px] text-[#9fbcee]">{loc.licenseLine}</span>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <span>Serving the metro since {loc.sinceYear}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.16]">
        <div className={`${WRAP} flex flex-wrap items-center justify-between gap-2.5 py-4 text-[12.5px] text-[#9fbcee]`}>
          <span>&copy; {new Date().getFullYear()} JunkStart Junk Removal. All rights reserved.</span>
          <span className="flex gap-5">
            <a href="#" className="hover:text-[#dfeaFB]">Privacy</a>
            <a href="#" className="hover:text-[#dfeaFB]">Terms</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
