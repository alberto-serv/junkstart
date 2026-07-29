"use client"

import { useEffect, useState } from "react"
import { CalendarDays } from "lucide-react"
import { BOOKING_ID, brand, loc, scrollToBooking } from "./config"

/* ── Final-band CTA ───────────────────────────────────────────────────────────
   The page's only CTA button outside the module itself. The hero deliberately
   has none: the module sits right beside the hero copy and IS the call to
   action there, so a button pointing at it would be pointing at itself. */
export function BookCta() {
  return (
    <button type="button" onClick={scrollToBooking} className="btn-flame text-base">
      {brand.ctaLabel}
      <span className="text-[13.5px] font-semibold opacity-75">· {loc.nextSlot}</span>
    </button>
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
      <div className="flex items-center">
        <button
          type="button"
          onClick={scrollToBooking}
          tabIndex={show ? 0 : -1}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-lg bg-flame font-display text-[15.5px] font-bold text-white shadow-flame-glow"
        >
          <CalendarDays className="h-[18px] w-[18px]" />
          {brand.ctaLabel}
        </button>
      </div>
    </div>
  )
}
