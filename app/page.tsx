"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Scale, Shield, Star } from "lucide-react"
import {
  SCENARIOS, getQuote, NO_FLAGS, PHONE, rangeStr,
  type Scenario, type ScenarioId,
} from "@/lib/junk-data"

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const [scenario, setScenario] = useState<ScenarioId | null>(null)

  // One question, one answer. Per-item surcharges and the aggregates check moved
  // off the page: the crew catches them on site, where the scale settles the
  // price anyway, so the estimator quotes the size and nothing else.
  const activeScenario = SCENARIOS.find((s) => s.id === scenario) ?? null
  const bounds = activeScenario
    ? { lowLbs: activeScenario.lowLbs, highLbs: activeScenario.highLbs }
    : null
  const quote = bounds ? getQuote(bounds.lowLbs, bounds.highLbs, NO_FLAGS) : null

  // Three states for the price panel and the mobile bar, which always render so
  // there is a CTA on screen from the first paint on both breakpoints:
  //   onSite   too big to price from a description
  //   quote    a size is picked and priced
  //   neither  nothing picked yet, so the panel prompts and points at the cards
  const onSite = Boolean(quote?.onSiteRequired)

  const activeLabel = activeScenario?.label ?? ""

  const scrollToSizes = () =>
    document.getElementById("pick-a-size")?.scrollIntoView({ behavior: "smooth", block: "start" })

  const handleCheckout = () => {
    if (!quote || !bounds) return
    const params = new URLSearchParams({
      scenario: scenario ?? "custom",
      lowLbs: bounds.lowLbs.toString(),
      highLbs: bounds.highLbs.toString(),
      low: quote.low.toString(),
      high: quote.high.toString(),
      minApplied: quote.minApplied ? "1" : "0",
      discountApplied: quote.discountApplied ? "1" : "0",
      surcharges: quote.surcharges.toString(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-band-soft border-b border-line-soft">
        <div className="container mx-auto px-4 pt-14 pb-14 md:pt-[60px] md:pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="disp text-ink mx-auto max-w-[20ch] text-[clamp(34px,5.2vw,56px)]">
              The Most Accurate Way to Price Junk Removal.
            </h1>
            <p className="mt-[18px] text-body text-lg max-w-[58ch] mx-auto">
              Most companies charge by how full the truck looks. We charge by the actual weight of
              your items, so you pay a precise, verified price every time.
            </p>
            <button
              type="button"
              onClick={() => router.push("/checkout?book=1")}
              className="mt-[22px] inline-flex items-center gap-2 text-base font-bold text-flame hover:text-flame-deep transition-colors"
            >
              Rather have us take a look first? Request a free visit
            </button>
          </div>
        </div>
      </section>

      {/* ── The one question ───────────────────────────────────────────── */}
      <section id="pick-a-size" className="border-t border-border bg-white scroll-mt-4">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl mx-auto">
            <StepHeader
              title="How big is the job?"
              subtitle="Pick the closest fit. Nobody measures junk, everybody recognizes it."
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
              {SCENARIOS.map((s) => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  selected={scenario === s.id}
                  onClick={() => setScenario(s.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────────
          Always on the page. Before a size is picked it prompts instead of
          pricing, so the section, and a CTA, are there from the first paint. */}
      <section className="border-t border-border bg-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <div className="max-w-4xl mx-auto">
              {!quote && !onSite ? (
                <div className="rounded-lg border border-line bg-brand-band p-8 shadow-brand-sm md:px-9">
                  <p className="eyebrow mb-2.5">Your price</p>
                  <h3 className="disp text-ink text-[clamp(22px,3vw,30px)]">
                    Pick a size and your price lands here
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-body">
                    Small, medium or large covers most jobs. Choose the closest one and you get an
                    all-in range, trip fee, labor and disposal included, before anyone is
                    dispatched. XL jobs skip the guessing and get a free visit instead.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button type="button" onClick={scrollToSizes} className="btn-flame shrink-0">
                      Pick Your Size
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/checkout?book=1")}
                      className="text-sm font-bold text-flame transition-colors hover:text-flame-deep sm:ml-2"
                    >
                      Or request a free visit
                    </button>
                  </div>
                </div>
              ) : onSite ? (
                <div className="rounded-lg border border-line bg-brand-band p-8 shadow-brand-sm md:px-9">
                  <p className="eyebrow mb-2.5">Free visit</p>
                  <h3 className="disp text-ink text-[clamp(22px,3vw,30px)]">
                    A job this size deserves a real walkthrough
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-body">
                    Loads at this scale vary too much to price from a description. Request a visit
                    and a crew lead walks it with you, weighs the plan against what is actually
                    there, and hands you a firm number before any work starts. Free, with no
                    obligation.
                  </p>
                  <button onClick={() => router.push("/checkout?book=1")} className="btn-flame mt-6">
                    Request a Visit
                  </button>
                </div>
              ) : quote && bounds ? (
                <div className="overflow-hidden rounded-lg border border-line bg-brand-band shadow-brand-sm">
                  <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:px-9">
                    <div>
                      <p className="eyebrow mb-2.5">
                        {activeLabel} &middot; ~{bounds.lowLbs.toLocaleString()} to{" "}
                        {bounds.highLbs.toLocaleString()} lbs
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        {/* rangeStr collapses to one figure when the bounds
                            match, which the market minimum makes common. */}
                        <span className="text-4xl font-extrabold leading-none tracking-[-0.02em] text-ink md:text-[46px]">
                          ${rangeStr(quote.low, quote.high)}
                        </span>
                        <span className="text-[15px] font-semibold text-body">all in</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        {quote.minApplied && (
                          <span className="text-[12px] font-semibold text-flame">
                            Includes our minimum pickup
                          </span>
                        )}
                        {quote.discountApplied && (
                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11.5px] font-bold text-green-800">
                            Volume rate applied
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={handleCheckout} className="btn-flame shrink-0">
                      Book This Pickup
                    </button>
                  </div>

                  <div className="border-t border-line-soft bg-white/60 px-8 py-5 md:px-9">
                    <p className="text-[13.5px] leading-relaxed text-body">
                      Your exact price comes off a certified scale before the crew starts. The
                      estimate sets expectations. The scale sets the price.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
      </section>

      {/* ── Trust Strip ────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <TrustItem icon={Shield} title="Licensed & Insured" text="Background-checked, uniformed crews" />
            <TrustItem icon={Star} title="Donate & Recycle First" text="We keep usable items out of the landfill" />
            <TrustItem icon={Scale} title="Weighed, Not Guessed" text={`Certified onboard scale. Call ${PHONE}`} />
          </div>
        </div>
      </section>

      {/* ── Mobile price bar ───────────────────────────────────────────
          Anchored to the bottom of the viewport for the whole flow on a phone,
          so the live price follows the customer down the page and toggling a
          flag in step 2 shows its effect without scrolling. The shared footer
          carries matching bottom padding on this route so the bar never covers
          it. Desktop keeps the inline result card instead. */}
      <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-6px_24px_rgba(21,38,68,0.14)] backdrop-blur lg:hidden"
        >
          {!quote && !onSite ? (
            <>
              <p className="mb-2 text-[13px] text-muted-foreground">
                Small, medium, large or XL.
                <span className="font-semibold text-ink"> Your price shows up here.</span>
              </p>
              <button type="button" onClick={scrollToSizes} className="btn-flame w-full text-base">
                Pick Your Size
              </button>
            </>
          ) : onSite ? (
            <>
              <p className="mb-2 text-[13px] text-muted-foreground">
                {activeLabel}
                <span className="font-semibold text-ink"> &middot; priced on site, free</span>
              </p>
              <button
                type="button"
                onClick={() => router.push("/checkout?book=1")}
                className="btn-flame w-full text-base"
              >
                Request a Visit
              </button>
            </>
          ) : quote && bounds ? (
            <>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="truncate text-[13px] text-muted-foreground">
                  {activeLabel} &middot; ~{bounds.lowLbs.toLocaleString()} to{" "}
                  {bounds.highLbs.toLocaleString()} lbs
                </span>
                <span className="shrink-0 text-[19px] font-extrabold leading-none text-ink">
                  ${rangeStr(quote.low, quote.high)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="btn-flame w-full text-base"
              >
                Book This Pickup
              </button>
            </>
          ) : null}
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-body mb-4">Bigger job, or not sure what it falls under?</p>
            <button className="btn-ghost-brand text-base" onClick={() => router.push("/contact")}>
              Get in touch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Two layouts from one card. On desktop the four sit side by side: size on top,
 * examples as the body, weight band alone in a footer under a hairline, all four
 * footers on one line because the card is h-full and the list is flex-1.
 *
 * On a phone they stack full width instead of squeezing into two columns, which
 * is what made the row ragged: at half a phone's width every second example
 * wrapped, so no two cards were the same height and the bands landed wherever.
 * Full width fits every example on one line, and the band moves up beside the
 * size, where it reads as that size's price of entry rather than a footnote.
 */
function ScenarioCard({ scenario, selected, onClick }: { scenario: Scenario; selected: boolean; onClick: () => void }) {
  const hint = scenario.onSiteOnly
    ? "We come look, free"
    : `~${scenario.lowLbs.toLocaleString()} to ${scenario.highLbs.toLocaleString()} lbs`
  const hintTone = selected ? "text-flame" : "text-muted-foreground"
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-150 md:p-5 md:hover:-translate-y-0.5 ${
        selected
          ? "border-flame bg-brand-select shadow-[0_10px_26px_rgba(241,93,42,0.18)]"
          : "border-line bg-white hover:border-[#c4c1bc] hover:shadow-brand-sm"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className={`disp text-[19px] leading-none ${selected ? "text-flame" : "text-ink"}`}>
          {scenario.label}
        </span>
        {/* Mobile only. Desktop keeps it in the footer so the four line up. */}
        <span className={`text-[12px] font-bold md:hidden ${hintTone}`}>{hint}</span>
      </div>

      {/* The examples are the card's real content: they are what a customer
          matches their own pile against, so they get the line height. */}
      <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-[13px] leading-snug text-body md:mt-3.5">
        {scenario.examples.map((ex) => (
          <li key={ex} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className={`mt-[6px] h-1 w-1 shrink-0 rounded-full ${selected ? "bg-flame" : "bg-brand"}`}
            />
            <span>{ex}</span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-4 hidden border-t pt-3 text-[12px] font-bold md:block ${
          selected ? "border-flame/25 text-flame" : "border-line-soft text-muted-foreground"
        }`}
      >
        {hint}
      </div>
    </button>
  )
}

/** The numeral is optional: with the flags step gone there is only one question
 *  on the page, and a lone "1" badge implies a step 2 that no longer exists. */
function StepHeader({ step, title, subtitle }: { step?: number; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-[34px]">
      <div className="inline-flex items-center gap-3">
        {step !== undefined && <span className="step-num">{step}</span>}
        <h2 className="disp text-ink text-[clamp(24px,3.5vw,38px)]">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-muted-foreground mt-2.5 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  )
}

function TrustItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="w-[26px] h-[26px] text-flame mb-1.5" />
      <p className="font-bold text-ink text-[15px]">{title}</p>
      <p className="text-[13px] text-muted-foreground">{text}</p>
    </div>
  )
}
