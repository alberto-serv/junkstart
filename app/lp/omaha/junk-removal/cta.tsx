"use client"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarDays, Phone } from "lucide-react"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"
import { BOOKING_ID, brand, loc, scrollToBooking } from "./config"

/* ── Hero / final-band CTA ────────────────────────────────────────────────────
   Desktop only in the hero: on mobile the module sits directly below the fold
   and the sticky bar handles commitment, so a third button would just be noise
   pushing the module further down. */
export function HeroCta({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <div className={variant === "dark" ? "mt-7 hidden lg:block" : "inline-block"}>
      <button
        type="button"
        onClick={scrollToBooking}
        className="btn-flame text-base"
      >
        {brand.ctaLabel}
        <span className="text-[13.5px] font-semibold opacity-75">· {loc.nextSlot}</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

/* ── Mobile sticky bar ────────────────────────────────────────────────────────
   The single mobile CTA. It hides while the module is on screen — a button that
   scrolls you to something you're already looking at is worse than no button,
   and it would cover the module's own Continue control at the bottom of the
   viewport. An IntersectionObserver on the module drives it. */
export function StickyBookBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = document.getElementById(BOOKING_ID)
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { rootMargin: "-72px 0px -140px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white/97 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-6px_24px_rgba(21,38,68,0.14)] backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-[130%]"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2.5">
        <a
          href={PHONE_TEL}
          aria-label={`Call ${PHONE}`}
          className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg border-[1.5px] border-line text-ink transition-colors hover:border-flame hover:text-flame"
        >
          <Phone className="h-5 w-5" />
        </a>
        <button
          type="button"
          onClick={scrollToBooking}
          tabIndex={show ? 0 : -1}
          className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-lg bg-flame font-display text-[15.5px] font-bold text-white shadow-flame-glow"
        >
          <CalendarDays className="h-[18px] w-[18px]" />
          {brand.ctaLabel}
        </button>
      </div>
    </div>
  )
}
