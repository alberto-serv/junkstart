import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Reveal } from "./reveal"
import {
  ArrowRight, Check, ShieldCheck, ClipboardCheck, Phone, Star, Sparkles,
  Scale, Recycle, KeyRound, CalendarClock, HeartHandshake, Boxes,
} from "lucide-react"
import { PHONE, PHONE_TEL, SERVICE_CITY, ON_SITE_THRESHOLD_LBS } from "@/lib/junk-data"

export const metadata: Metadata = {
  title: "Estate & Property Cleanouts | JunkStart Junk Removal",
  description:
    "Whole-property cleanouts for estates, probate sales, evictions and listing prep. Donation routing with itemized receipts, a broom-clean finish, and a firm price from a free on-site walkthrough.",
}

// Cleanouts sit squarely in the on-site tier: a whole property is past the
// 1,500 lb line where the online estimator stops quoting, so the primary CTA
// books the free walkthrough. The estimator is the secondary route, for the
// smaller single-room jobs that also land on this page.
const BOOK_HREF = "/checkout?book=1"
const ESTIMATE_HREF = "/"

const CREDENTIALS = [
  "Licensed, bonded & insured",
  "Background-checked crews",
  "Itemized donation receipts",
  "Photo documentation on request",
  "Executor & agent friendly scheduling",
  "Broom-clean finish included",
]

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "A crew lead walks it with you",
    copy: "A whole property is too variable to price from a description, so we look at it first and hand you a written all-in number. You know the price before anything moves.",
  },
  {
    icon: Boxes,
    title: "You mark what stays",
    copy: "Tag the keep-items with anything you like. Painter's tape works. The crew clears everything else, room by room, and checks in before touching anything ambiguous.",
  },
  {
    icon: HeartHandshake,
    title: "Usable goods get donated",
    copy: "Furniture, housewares and clothing in good shape go to a local charity partner, and you get the itemized receipt for the estate's tax filing.",
  },
  {
    icon: KeyRound,
    title: "Broom-clean handoff",
    copy: "We sweep, do a final walk, and text you photos when it's empty, so the property is ready to list, show or hand back the same day.",
  },
]

const SITUATIONS = [
  { title: "Estate & probate", copy: "Clearing a family home on the executor's timeline, with the paperwork the estate needs." },
  { title: "Listing prep", copy: "Getting a property show-ready before photos, often inside an agent's one-week window." },
  { title: "Tenant turnover", copy: "Post-eviction and end-of-lease clearouts so the unit can be re-rented without a lost month." },
  { title: "Downsizing & moves", copy: "Everything the movers won't take, cleared the same week you need it gone." },
  { title: "Hoarding recovery", copy: "Heavy-volume, multi-load clears handled without judgment and at a pace that works." },
  { title: "Foreclosure & REO", copy: "Bank-owned and trustee-sale properties cleared to broom-clean with photo documentation." },
]

export default function CleanoutsLandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background pb-24 md:pb-0">

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-line-soft bg-brand-band-soft">
        <div className="container relative mx-auto px-4 pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-flame">
                <Sparkles className="h-3.5 w-3.5" />
                Whole-Property Cleanouts
              </span>

              <h1 className="mt-6 text-balance text-ink text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
                An entire property cleared,{" "}
                <span className="text-flame">without a single trip</span> to the dump.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">
                Estates, probate sales, evictions and listing prep. We clear it room by room,
                donate what&apos;s still good, and leave it broom-clean. A crew lead walks the
                property and gives you a firm all-in number before any work starts.
              </p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link href={BOOK_HREF} className="btn-flame text-base">
                  Book a Free On-Site Estimate
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2 text-base font-bold text-ink transition-colors hover:text-flame"
                >
                  <Phone className="h-4 w-4 text-flame" />
                  {PHONE}
                </a>
              </div>

              <div className="mt-4">
                <Link
                  href={ESTIMATE_HREF}
                  className="text-[14.5px] font-bold text-flame transition-colors hover:text-flame-deep"
                >
                  Smaller job? Get an instant range
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-flame" /> Serving {SERVICE_CITY}
                </span>
                <span className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-flame" /> Priced by weight on a certified scale
                </span>
                <span className="flex items-center gap-1.5">
                  <Recycle className="h-4 w-4 text-flame" /> ~60% diverted from landfill
                </span>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-brand">
                <Image
                  src="/images/cleanout.webp"
                  alt="A property cleanout in progress"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 46vw"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 2. Credentials band ──────────────────────────────────────────── */}
      <section className="border-b border-line bg-brand-band">
        <div className="container mx-auto px-4 py-10">
          <Reveal>
            <p className="eyebrow mb-5 text-center">What comes standard</p>
            <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
              {CREDENTIALS.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[14.5px] text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── 3. How a cleanout runs ───────────────────────────────────────── */}
      <section className="border-b border-line-soft bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="disp text-ink text-[clamp(26px,3.6vw,40px)]">
                How a Cleanout Actually Runs
              </h2>
              <p className="mt-4 text-body">
                Most cleanouts are one long day. Here&apos;s what that day looks like from your
                side of it.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="h-full rounded-lg border border-line bg-white p-6 shadow-brand-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-flame/10">
                    <step.icon className="h-5 w-5 text-flame" />
                  </span>
                  <h3 className="mt-4 text-lg text-ink">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Situations we handle ──────────────────────────────────────── */}
      <section className="border-b border-line-soft bg-background">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="disp text-ink text-[clamp(26px,3.6vw,40px)]">
                Cleanouts We Do Every Week
              </h2>
              <p className="mt-4 text-body">
                Different reasons, same job: an empty property by the end of the day.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SITUATIONS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="h-full rounded-lg border border-line bg-white p-5">
                  <div className="flex items-start gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-flame" strokeWidth={3} />
                    <div>
                      <p className="font-semibold text-ink">{s.title}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-body">{s.copy}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Timing / scheduling ───────────────────────────────────────── */}
      <section className="border-b border-line-soft bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg shadow-brand">
                <Image
                  src="/images/crew.webp"
                  alt="A JunkStart crew loading a truck"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 46vw"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand">
                <CalendarClock className="h-3.5 w-3.5" />
                Working to a deadline
              </span>
              <h2 className="mt-5 disp text-ink text-[clamp(24px,3.2vw,34px)]">
                Closings and listing dates don&apos;t move. We work backwards from yours.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-body">
                Tell us the date the property has to be empty and we&apos;ll size the crew and the
                number of loads to hit it, including weekends and multi-day clears when the job
                calls for it. Anything past {ON_SITE_THRESHOLD_LBS.toLocaleString()} lbs gets a
                written, fixed price after the walkthrough, so a second load never turns into a
                second invoice you didn&apos;t expect.
              </p>
              <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link href={BOOK_HREF} className="btn-flame text-base">
                  Book a Free On-Site Estimate
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/contact" className="btn-ghost-brand text-base">
                  Talk to a crew lead
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. Closing CTA ───────────────────────────────────────────────── */}
      <section className="bg-brand-band">
        <div className="container mx-auto px-4 py-20 md:py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="disp text-ink text-[clamp(28px,4vw,46px)]">
                Get Your Cleanout Priced Today
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-body">
                A crew lead walks the property, weighs up what is actually there, and leaves you
                with a firm number. Free, with no obligation.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href={BOOK_HREF} className="btn-flame text-base">
                  Book a Free On-Site Estimate
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href={PHONE_TEL}
                  className="inline-flex items-center gap-2 text-base font-bold text-ink transition-colors hover:text-flame"
                >
                  <Phone className="h-4 w-4 text-flame" />
                  {PHONE}
                </a>
              </div>

              <div className="mt-4">
                <Link
                  href={ESTIMATE_HREF}
                  className="text-[14.5px] font-bold text-flame transition-colors hover:text-flame-deep"
                >
                  Smaller job? Get an instant range
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sticky mobile CTA ────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur md:hidden">
        <Link href={BOOK_HREF} className="btn-flame w-full text-base">
          Book a Free On-Site Estimate
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
