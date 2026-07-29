import type { Metadata } from "next"
import Image from "next/image"
import { Check, ShieldCheck } from "lucide-react"
import { LandingHeader } from "./landing-header"
import { LandingFooter } from "./landing-footer"
import { Faq } from "./faq"
import { Industries } from "./industries"
import { QUOTE_URL } from "./links"
import { SERVICE_CITY } from "@/lib/junk-data"

export const metadata: Metadata = {
  title: `Junk Removal in ${SERVICE_CITY} | JunkStart Junk Removal`,
  description:
    "Junk removal and hauling across Charlotte, NC, priced by the pound on a certified onboard scale. Furniture, appliances, garage and estate cleanouts, construction debris and more. See your range in one tap.",
}

const SERVICES = [
  "Furniture & mattress removal",
  "Appliance haul-away and freon recovery",
  "Garage, attic & basement cleanouts",
  "Estate and property turnover cleanouts",
  "Construction & remodel debris",
  "Office, retail & storage unit cleanouts",
]

const WHY = [
  "Priced by the pound on a certified onboard scale",
  "We do the carrying. Stairs, basements and all",
  "Licensed, insured, background-checked crews",
  "Donation and recycling routing on every load",
  "Same-day and next-day slots most weeks",
]

const STEPS = [
  { n: "01", title: "Price it online", copy: "Pick what you're getting rid of and how much there is. Two minutes, no phone call, no email gate." },
  { n: "02", title: "Book your window", copy: "Choose a day and an arrival window. The crew texts you when they're 30 minutes out." },
  { n: "03", title: "We load and go", copy: "The crew confirms the price on site, loads everything, and sweeps up before they leave." },
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

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <LandingHeader />

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/images/truck-on-the-road.webp"
            alt="A JunkStart truck on the road"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand/85 via-brand/60 to-brand/25" />
        </div>

        <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Junk Removal in {SERVICE_CITY}, Priced Before We Show Up
            </h1>
            <p className="mt-6 text-[15px] leading-relaxed text-white/90 md:text-base">
              Tell us what you&apos;ve got and how much of it there is, and you&apos;ll see your
              all-in range online, with loading, hauling and disposal included. Your load is
              then weighed on a certified scale, so you pay for exactly what it weighs.
            </p>
            <a
              href={QUOTE_URL}
              className="mt-8 inline-flex rounded-btn bg-flame px-8 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-flame-glow transition-colors hover:bg-flame-deep"
            >
              Get My Price
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Services ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-lg">
            <Image
              src="/images/crew.webp"
              alt="A JunkStart crew loading a truck"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
            />
          </div>
          <div>
            <h2 className="text-3xl text-ink md:text-4xl">Junk Removal Services in {SERVICE_CITY}</h2>
            <ul className="mt-7 space-y-4">
              {SERVICES.map((s) => (
                <CheckItem key={s}>{s}</CheckItem>
              ))}
            </ul>
            <p className="mt-7 text-[15px] leading-relaxed text-body">
              Residential or commercial, one item or a whole property. The same by-the-pound
              pricing applies either way.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Why JunkStart ────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="max-w-md text-3xl text-ink md:text-4xl">
                Why {SERVICE_CITY} Books JunkStart
              </h2>
              <ul className="mt-7 space-y-4">
                {WHY.map((w) => (
                  <CheckItem key={w}>{w}</CheckItem>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/single-truck.webp"
                  alt="A JunkStart truck ready for pickup"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -top-4 right-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-brand">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight text-ink">
                  Licensed
                  <br />&amp; Insured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How it works ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
        <h2 className="text-3xl text-ink md:text-4xl">How It Works</h2>
        <div className="mt-9 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-lg border border-line bg-white p-6">
              <span className="disp text-[34px] leading-none text-flame">{step.n}</span>
              <h3 className="mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. What we take ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 md:px-6 md:pb-20">
        <Industries />
      </section>

      {/* ── 6. Long-form copy ───────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1400px] px-4 pb-16 md:px-6 md:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr] md:gap-14">
          <div>
            <h2 className="max-w-lg text-3xl text-ink md:text-4xl">
              Junk Removal &amp; Hauling in {SERVICE_CITY}
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-body">
              Most people put off a cleanout because they can&apos;t find out what it costs without
              scheduling someone to come look at it first. JunkStart flips that around: the
              estimator translates a one-tap description of your pile into a weight range and
              prices it the same way the certified scale on our truck will, so you see a real
              number before you commit to anything. From single-item furniture pickups in
              Plaza Midwood to full estate cleanouts in Ballantyne and construction debris hauls for
              contractors across Mecklenburg County, the crew handles the lifting, the loading and
              the disposal, and routes everything still usable to a local charity partner before
              anything heads to the landfill.{" "}
              <a href="#" className="font-semibold text-flame underline">
                Read more
              </a>
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <Image
              src="/images/cleanout.webp"
              alt="A property cleanout in progress"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/40">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-16 md:px-6 md:py-20">
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
            <div className="relative aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-lg">
              <Image
                src="/images/hero.webp"
                alt="JunkStart crew at work"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
            <div>
              <h2 className="text-3xl text-ink md:text-4xl">Frequently Asked Questions</h2>
              <div className="mt-6">
                <Faq />
              </div>
              <a
                href={QUOTE_URL}
                className="mt-8 inline-flex rounded-btn bg-flame px-7 py-3 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-flame-glow transition-colors hover:bg-flame-deep"
              >
                See My Price
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Closing quote band ───────────────────────────────────────── */}
      <section id="quote" className="bg-brand-band">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl text-ink md:text-5xl">
              Find Out What Your Pile Costs
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-body">
              Two minutes online and you&apos;ll have an all-in range, with loading, hauling and
              disposal included.
            </p>
            <a
              href={QUOTE_URL}
              className="mt-8 inline-flex rounded-btn bg-flame px-8 py-3.5 text-sm font-bold uppercase tracking-[0.04em] text-white shadow-flame-glow transition-colors hover:bg-flame-deep"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
