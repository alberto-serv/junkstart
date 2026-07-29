import type { Metadata } from "next"
import Image from "next/image"
import { Check, ShieldCheck, Truck, Recycle, Clock, Phone, Star } from "lucide-react"
import { LandingHeader } from "@/app/landing/landing-header"
import { LandingFooter } from "@/app/landing/landing-footer"
import { Faq } from "@/app/landing/faq"
import { ScheduleWidget } from "./schedule-widget"
import { JOBS, PHONE, PHONE_TEL, TRUCK_CAPACITY } from "@/lib/junk-data"

const CITY = "Omaha"
const STATE = "NE"

export const metadata: Metadata = {
  title: `Junk Removal in ${CITY}, ${STATE} | JunkStart Junk Removal`,
  description:
    "Same-week junk removal and hauling across Omaha and the metro. Furniture, appliances, garage and estate cleanouts, construction debris and more. Book your pickup window online in under two minutes.",
}

const NEIGHBORHOODS = [
  "Downtown & Old Market",
  "Dundee & Benson",
  "Aksarben & Elmwood Park",
  "Millard",
  "West Omaha & Elkhorn",
  "Papillion & La Vista",
  "Bellevue & Offutt",
  "Council Bluffs, IA",
]

const WHY = [
  { icon: Clock, title: "Same-week windows", copy: "Most Omaha pickups land within two to three days, with same-day slots when a route has room." },
  { icon: Truck, title: "We do the carrying", copy: "Basements, attics, second floors, tight stairwells — the crew brings it out. You don't move a thing." },
  { icon: ShieldCheck, title: "Licensed & insured", copy: "Background-checked, uniformed crews who text you when they're 30 minutes out." },
  { icon: Recycle, title: "Donate & recycle first", copy: "Usable goods go to Omaha-area charity partners, and you get the itemized receipt." },
]

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-flame text-white">
        <Check className="h-3 w-3" strokeWidth={3.5} />
      </span>
      <span className="text-[15px] leading-relaxed text-ink">{children}</span>
    </li>
  )
}

export default function OmahaJunkRemovalPage() {
  const jobs = JOBS.filter((j) => !j.consultationOnly)

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <LandingHeader />

      {/* ── Hero + scheduling module ──────────────────────────────────────
          The module is the page's single conversion point: it rides the right
          rail on desktop and stacks under the pitch on mobile. Sticky so it
          stays reachable while the marketing copy scrolls past it. */}
      <section className="relative border-b border-line-soft">
        <div className="absolute inset-0">
          <Image
            src="/images/truck-on-the-road.webp"
            alt="A JunkStart truck on the road"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/90 via-brand/75 to-brand/55" />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px] px-4 py-12 md:px-6 md:py-16">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_460px] lg:gap-14">
            {/* Pitch */}
            <div className="text-white lg:pt-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                <Star className="h-3.5 w-3.5" />
                Serving {CITY} &amp; the metro
              </span>

              <h1 className="mt-6 text-4xl leading-[1.05] sm:text-5xl md:text-[56px]">
                Junk Removal in {CITY}, Booked in Two Minutes
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 md:text-base">
                Furniture, appliances, garage and estate cleanouts, construction debris — one
                item or a whole property. Pick your day and window, tell us what to grab, and a
                crew handles the lifting, loading and disposal.
              </p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "No payment when you book",
                  "All-in price quoted on site",
                  "Loading & disposal included",
                  "Mon–Sat pickup windows",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-white/95">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" strokeWidth={3} />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={PHONE_TEL}
                className="mt-8 inline-flex items-center gap-2 text-base font-bold text-white transition-opacity hover:opacity-80"
              >
                <Phone className="h-4 w-4" />
                Prefer to talk? {PHONE}
              </a>
            </div>

            {/* Scheduling module */}
            <div className="lg:sticky lg:top-[86px]">
              <ScheduleWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ── Why JunkStart Omaha ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-ink md:text-4xl">Why {CITY} Books JunkStart</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-body">
            Every truck holds {TRUCK_CAPACITY} cubic yards, and you only pay for the space your
            pile actually takes up.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-lg border border-line bg-white p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-flame/10">
                <w.icon className="h-5 w-5 text-flame" />
              </span>
              <h3 className="mt-4 text-lg text-ink">{w.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">{w.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What we haul ─────────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image
                src="/images/crew.webp"
                alt="A JunkStart crew loading a truck"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
            <div>
              <h2 className="text-3xl text-ink md:text-4xl">What We Haul Away</h2>
              <div className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {jobs.map((job) => {
                  const Icon = job.icon
                  return (
                    <div key={job.id} className="flex items-start gap-2.5">
                      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand" strokeWidth={1.75} />
                      <div>
                        <p className="text-[14.5px] font-semibold leading-tight text-ink">{job.shortName}</p>
                        <p className="mt-0.5 text-[12.5px] leading-snug text-muted-foreground">{job.tagline}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-7 text-[14px] leading-relaxed text-muted-foreground">
                We can&apos;t take hazardous material — paint, solvents, motor oil, pesticides,
                asbestos, propane tanks or medical waste. Almost everything else is fair game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service area ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-3xl text-ink md:text-4xl">Where We Pick Up Around {CITY}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body">
              Crews run the metro Monday through Saturday, from the Old Market out to Elkhorn and
              across the river into Council Bluffs.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {NEIGHBORHOODS.map((n) => (
                <CheckItem key={n}>{n}</CheckItem>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[3/2] w-full self-center overflow-hidden rounded-lg">
            <Image
              src="/images/single-truck.webp"
              alt="A JunkStart truck ready for pickup"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl text-ink md:text-4xl">Frequently Asked Questions</h2>
            <div className="mt-6">
              <Faq />
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing band ─────────────────────────────────────────────────── */}
      <section className="bg-brand-band">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl text-ink md:text-4xl">Ready When You Are, {CITY}</h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-body">
              Scroll back up to grab a pickup window, or call and we&apos;ll book it for you.
            </p>
            <a
              href={PHONE_TEL}
              className="mt-8 inline-flex items-center gap-2 rounded-btn bg-flame px-8 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-flame-glow transition-colors hover:bg-flame-deep"
            >
              <Phone className="h-4 w-4" />
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
