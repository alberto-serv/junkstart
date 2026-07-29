import type { Metadata } from "next"
import Image from "next/image"
import {
  Check, Clock, ExternalLink, Recycle, ShieldCheck, Star, Truck,
} from "lucide-react"
import { LpHeader, LpFooter } from "./lp-chrome"
import { ScheduleWidget } from "./schedule-widget"
import { Faq } from "./faq"
import { HeroCta, StickyBookBar } from "./cta"
import {
  WRAP, BOOKING_ID, loc, brand, HERO_INCLUDES, REVIEWS,
} from "./config"
import { JOBS, PHONE, PHONE_TEL, TRUCK_CAPACITY } from "@/lib/junk-data"

export const metadata: Metadata = {
  title: `Junk Removal in ${loc.city}, ${loc.state} | JunkStart Junk Removal`,
  description:
    "Same-week junk removal and hauling across Omaha and the metro. Furniture, appliances, garage and estate cleanouts, construction debris and more. Book your pickup window online in under two minutes.",
}

/* ============================================================
   Omaha × Junk Removal — product-led landing page.

   Structure follows the Voda LP standard: micro-header → availability ribbon →
   compact hero with the booking module beside it → reviews → guarantee → local
   proof → FAQ → final CTA → NAP footer, with a mobile sticky bar as the single
   mobile CTA.

   Two rules this page is built around:

   1. ONE content column. Every band below uses WRAP, so the logo, the H1, the
      module, every section heading, the FAQ and the footer share one left and
      one right edge. Per-section widths produce a staircase of left edges.

   2. The hero is COMPACT on mobile. The booking module stacks directly under it
      and must peek above the fold — that peek is the scroll cue and the reason
      the page converts. Nothing decorative goes between the H1 and the module.
   ============================================================ */

const WHY = [
  { icon: Clock, title: "Same-week windows", copy: `Most ${loc.city} pickups land within two to three days, with same-day slots when a route has room.` },
  { icon: Truck, title: "We do the carrying", copy: "Basements, attics, second floors, tight stairwells — the crew brings it out. You don't move a thing." },
  { icon: ShieldCheck, title: "Licensed & insured", copy: "Background-checked, uniformed crews who text you when they're 30 minutes out." },
  { icon: Recycle, title: "Donate & recycle first", copy: `Usable goods go to ${loc.city}-area charity partners, and you get the itemized receipt.` },
]

function Stars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-[15px] w-[15px] fill-current" />
      ))}
    </span>
  )
}

function SectionHead({ kicker, title, sub, center }: { kicker: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-7 ${center ? "text-center" : ""}`}>
      <div className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-flame">{kicker}</div>
      <h2 className="text-[clamp(25px,3.4vw,34px)] font-extrabold text-ink">{title}</h2>
      {sub && <p className={`mt-2 max-w-[56ch] text-[16px] text-body ${center ? "mx-auto" : ""}`}>{sub}</p>}
    </div>
  )
}

export default function OmahaJunkRemovalPage() {
  const jobs = JOBS.filter((j) => !j.consultationOnly)

  return (
    // Bottom padding clears the fixed mobile bar; removed once it's hidden.
    <div className="min-h-screen overflow-x-hidden bg-white pb-[92px] lg:pb-0">
      <LpHeader />

      {/* ── Hero + booking module ────────────────────────────────────────
          Desktop: copy left, module in a sticky right rail.
          Mobile: a deliberately short navy band, then the module — so the
          module's header is visible above the fold without scrolling. */}
      <section id="hero" className="scroll-mt-[72px] bg-brand">
        {/* `min-w-0` on both columns: grid items default to a min-content
            minimum, so any wide descendant (the module's date strip) would
            stretch the track past the viewport instead of scrolling inside it. */}
        {/* `lg:items-center` matters: the module is much the taller column, so
            top-aligning the copy left a dead blue slab under it. Centring
            distributes that space above and below the copy instead. */}
        <div className={`${WRAP} grid grid-cols-1 items-start gap-8 pb-8 pt-7 md:pb-12 md:pt-10 lg:grid-cols-[minmax(0,1fr)_468px] lg:items-center lg:gap-12 lg:pb-14 lg:pt-12`}>
          <div className="min-w-0 text-white">
            {/* Capped well below the old 54px: at full width this headline ran
                to three lines, which pushed the module off a laptop fold. */}
            <h1 className="text-[clamp(27px,4.3vw,44px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
              Junk Removal in {loc.city}, Booked in Two Minutes
            </h1>

            {/* Bullets, not a paragraph: scannable at a glance on a phone. */}
            <ul className="mt-4 flex flex-col gap-2">
              {HERO_INCLUDES.map((inc) => (
                <li key={inc} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#dbe7fb] md:text-[15.5px]">
                  <span className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-flame/40 bg-flame/20 text-flame">
                    <Check className="h-[10px] w-[10px]" strokeWidth={3.5} />
                  </span>
                  {inc}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#dbe7fb] md:text-[13px]">
              <span className="inline-flex items-center gap-1.5">
                <Stars className="text-flame" />
                <span className="font-extrabold text-white">{loc.reviewRating}</span>
                Google ({loc.reviewCount})
              </span>
              <span className="hidden h-1 w-1 shrink-0 rounded-full bg-white/35 sm:block" />
              <span>{loc.licenseLine}</span>
            </div>

            <HeroCta />
          </div>

          {/* Module — untouched in content; sticky on desktop only. */}
          <div id={BOOKING_ID} className="min-w-0 scroll-mt-[72px] lg:sticky lg:top-[76px]">
            <ScheduleWidget />
          </div>
        </div>
      </section>

      {/* ── Why JunkStart ────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-[72px]">
        <div className={WRAP}>
          <SectionHead
            kicker={`Why ${loc.city} books us`}
            title="A crew that shows up, and a price that holds"
            sub={`Every truck holds ${TRUCK_CAPACITY} cubic yards, and you only pay for the space your pile actually takes up.`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-lg border border-line bg-white p-5 shadow-brand-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-flame/10">
                  <w.icon className="h-5 w-5 text-flame" />
                </span>
                <h3 className="mt-4 text-[17.5px] font-bold text-ink">{w.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-body">{w.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/50 py-14 md:py-[72px]">
        <div className={WRAP}>
          <SectionHead kicker={`Real pickups in ${loc.city}`} title="Neighbors who booked this service" />
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="rounded-lg border border-line bg-white p-5 shadow-brand-sm">
                <Stars n={r.stars} className="text-flame" />
                <blockquote className="mt-3 text-[15.5px] leading-relaxed text-ink">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[15px] font-bold text-white">
                    {r.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-bold text-ink">{r.name}</span>
                    <span className="block text-[13px] text-muted-foreground">{r.area}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee ────────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-[72px]">
        <div className={WRAP}>
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand via-brand-deep to-brand-ink px-7 py-9 text-center md:px-10">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(440px_220px_at_80%_-20%,rgba(241,93,42,0.28),transparent_65%)]" />
            <span className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border border-flame/35 bg-flame/15 text-flame">
              <ShieldCheck className="h-8 w-8" />
            </span>
            <h2 className="relative text-[clamp(23px,3vw,28px)] font-extrabold text-white">{brand.guarantee.title}</h2>
            <p className="relative mx-auto mt-3 max-w-[54ch] text-[16px] leading-relaxed text-[#dbe7fb]">
              {brand.guarantee.body}
            </p>
          </div>
        </div>
      </section>

      {/* ── What we haul ─────────────────────────────────────────────────── */}
      <section className="bg-muted/50 py-14 md:py-[72px]">
        <div className={`${WRAP} grid gap-9 md:grid-cols-[0.95fr_1.05fr] md:gap-12`}>
          <div className="relative aspect-[4/3] w-full self-start overflow-hidden rounded-lg">
            <Image
              src="/images/crew.webp"
              alt="A JunkStart crew loading a truck"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div>
            <SectionHead kicker="One item or a whole property" title="What we haul away" />
            <div className="grid gap-x-7 gap-y-3.5 sm:grid-cols-2">
              {jobs.map((job) => {
                const Icon = job.icon
                return (
                  <div key={job.id} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" strokeWidth={1.75} />
                    <div>
                      <p className="text-[14.5px] font-bold leading-tight text-ink">{job.shortName}</p>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{job.tagline}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-6 text-[14px] leading-relaxed text-muted-foreground">
              We can&apos;t take hazardous material — paint, solvents, motor oil, pesticides,
              asbestos, propane tanks or medical waste. Almost everything else is fair game.
            </p>
          </div>
        </div>
      </section>

      {/* ── Local proof ──────────────────────────────────────────────────── */}
      <section className="bg-white py-14 md:py-[72px]">
        <div className={`${WRAP} grid items-center gap-9 md:grid-cols-[1.1fr_1fr] md:gap-12`}>
          <div>
            <SectionHead
              kicker="Proudly local"
              title={`Serving ${loc.city} & the metro`}
              sub={`Locally staffed crews, background-checked and fully insured. Same-week availability across the area, ${loc.hours}:`}
            />
            <p className="text-[15.5px] leading-relaxed text-body">{loc.serviceArea.join(" · ")}</p>
            <a
              href={loc.gbpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-bold text-flame hover:text-flame-deep"
            >
              <ExternalLink className="h-[15px] w-[15px]" />
              See our Google Business Profile &amp; reviews
            </a>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
            <Image
              src="/images/single-truck.webp"
              alt={`A JunkStart truck parked at an ${loc.city} home`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-muted/50 py-14 md:py-[72px]">
        <div className={WRAP}>
          <SectionHead kicker="Good to know" title="Frequently asked questions" center />
          <Faq />
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="bg-brand py-14 md:py-[72px]">
        <div className={`${WRAP} text-center`}>
          <h2 className="text-[clamp(25px,3.4vw,32px)] font-extrabold text-white">
            Ready when you are, {loc.city}
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-[16.5px] text-[#dbe7fb]">
            Grab a pickup window in about two minutes. Nothing is charged today.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <HeroCta variant="light" />
            <a
              href={PHONE_TEL}
              className="text-[15px] font-bold text-white underline-offset-4 transition-opacity hover:opacity-80 hover:underline"
            >
              or call {PHONE}
            </a>
          </div>
        </div>
      </section>

      <LpFooter />
      <StickyBookBar />
    </div>
  )
}
