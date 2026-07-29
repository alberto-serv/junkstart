"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle, Minus, Plus, Scale, Shield, Star, X,
} from "lucide-react"
import {
  SCENARIOS, getQuote, lbsFromItems,
  ITEM_WEIGHTS, AGGREGATES_WARNING, PHONE, rangeStr,
  type Scenario, type ScenarioId, type QuoteFlags,
} from "@/lib/junk-data"

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const [scenario, setScenario] = useState<ScenarioId | null>(null)
  const [flags, setFlags] = useState<QuoteFlags>({ mattressCount: 0, tireCount: 0, hasAggregates: false })
  // Set by the item tally. When present it overrides the scenario card.
  const [customLbs, setCustomLbs] = useState<{ lowLbs: number; highLbs: number } | null>(null)
  const [tallyOpen, setTallyOpen] = useState(false)

  const activeScenario = SCENARIOS.find((s) => s.id === scenario) ?? null
  const bounds =
    customLbs ?? (activeScenario ? { lowLbs: activeScenario.lowLbs, highLbs: activeScenario.highLbs } : null)
  const quote = bounds ? getQuote(bounds.lowLbs, bounds.highLbs, flags) : null

  // Aggregates get their own callout with their own routes, so the price panel
  // stands down rather than showing a number we would have to walk back.
  const showResult = Boolean(quote) && !flags.hasAggregates

  const pickScenario = (id: ScenarioId) => {
    setScenario(id)
    setCustomLbs(null)
    setTallyOpen(false)
  }

  const applyTally = (next: { lowLbs: number; highLbs: number }) => {
    setCustomLbs(next)
    setScenario(null)
    setTallyOpen(false)
  }

  const handleCheckout = () => {
    if (!quote || !bounds) return
    const params = new URLSearchParams({
      scenario: customLbs ? "custom" : scenario ?? "custom",
      lowLbs: bounds.lowLbs.toString(),
      highLbs: bounds.highLbs.toString(),
      mattressCount: flags.mattressCount.toString(),
      tireCount: flags.tireCount.toString(),
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
            <h1 className="disp text-ink mx-auto max-w-[16ch] text-[clamp(36px,5.4vw,58px)]">
              Pay-By-Weight Junk Removal
            </h1>
            <p className="mt-[18px] text-body text-lg max-w-[54ch] mx-auto">
              Garages fill up slowly. A few boxes here. Old furniture there. Before long, the
              space that was supposed to hold your car is holding everything else.
            </p>
            <p className="mt-3 text-body text-lg max-w-[54ch] mx-auto">
              That&apos;s where JunkStart comes in.
            </p>
            <button
              type="button"
              onClick={() => router.push("/checkout?book=1")}
              className="mt-[22px] inline-flex items-center gap-2 text-base font-bold text-flame hover:text-flame-deep transition-colors"
            >
              Rather have us take a look first? Book a free on-site quote
            </button>
          </div>
        </div>
      </section>

      {/* ── Step 1: what are we hauling ────────────────────────────────── */}
      <section className="border-t border-border bg-white">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-5xl mx-auto">
            <StepHeader
              step={1}
              title="What do you need us to haul away?"
              subtitle="Pick the closest fit. Nobody measures junk, everybody recognizes it."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SCENARIOS.map((s) => (
                <ScenarioCard
                  key={s.id}
                  scenario={s}
                  selected={scenario === s.id}
                  onClick={() => pickScenario(s.id)}
                />
              ))}
            </div>

            {/* The tally sits directly under the cards as the alternative to
                picking one, rather than buried in a later step. */}
            {/* Centred under the card grid. The open estimator keeps its own
                left-aligned layout, so only the two collapsed states centre. */}
            <div className="mt-5">
              {customLbs ? (
                <div className="text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border-2 border-flame bg-brand-select px-4 py-2 text-[13.5px] font-semibold text-ink">
                    Your tally: ~{customLbs.lowLbs.toLocaleString()} to {customLbs.highLbs.toLocaleString()} lbs
                    <button
                      type="button"
                      aria-label="Clear tally and pick a card instead"
                      onClick={() => setCustomLbs(null)}
                      className="text-flame transition-colors hover:text-flame-deep"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                </div>
              ) : tallyOpen ? (
                <ItemEstimator onApply={applyTally} onCancel={() => setTallyOpen(false)} />
              ) : (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setTallyOpen(true)}
                    className="text-sm font-bold text-flame transition-colors hover:text-flame-deep"
                  >
                    Know exactly what you&apos;ve got? Tally your items instead.
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 2: flags, the last thing we ask ───────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-3xl mx-auto">
            <StepHeader
              step={2}
              title="Any of these in the pile?"
              subtitle="These carry their own disposal fees, so we add them up front rather than on the day."
            />

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <CountChip
                label="Mattresses"
                value={flags.mattressCount}
                max={4}
                onChange={(n) => setFlags((f) => ({ ...f, mattressCount: n }))}
              />
              <CountChip
                label="Tires"
                value={flags.tireCount}
                max={8}
                onChange={(n) => setFlags((f) => ({ ...f, tireCount: n }))}
              />
              <button
                type="button"
                aria-pressed={flags.hasAggregates}
                onClick={() => setFlags((f) => ({ ...f, hasAggregates: !f.hasAggregates }))}
                className={`rounded-full border-2 px-4 py-2 text-[13.5px] font-semibold transition-colors ${
                  flags.hasAggregates
                    ? "border-flame bg-flame text-white"
                    : "border-line bg-white text-ink hover:border-flame"
                }`}
              >
                Dirt, concrete, brick or tile
              </button>
            </div>

            {flags.hasAggregates && (
              <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-[13.5px] leading-relaxed text-amber-900">{AGGREGATES_WARNING}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Result ─────────────────────────────────────────────────────── */}
      {showResult && quote && bounds && (
        <section className="border-t border-border bg-white">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <div className="max-w-4xl mx-auto">
              {quote.onSiteRequired ? (
                <div className="rounded-lg border border-line bg-brand-band p-8 shadow-brand-sm md:px-9">
                  <p className="eyebrow mb-2.5">Free on-site estimate</p>
                  <h3 className="disp text-ink text-[clamp(22px,3vw,30px)]">
                    A job this size deserves a real walkthrough
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-body">
                    Loads at this scale vary too much to price from a description. A crew lead
                    walks it with you, weighs the plan against what is actually there, and gives
                    you a firm number before any work starts. Free, with no obligation.
                  </p>
                  <button onClick={() => router.push("/checkout?book=1")} className="btn-flame mt-6">
                    Book a Free On-Site Estimate
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-line bg-brand-band shadow-brand-sm">
                  <div className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:px-9">
                    <div>
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
              )}
            </div>
          </div>
        </section>
      )}

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

function ScenarioCard({ scenario, selected, onClick }: { scenario: Scenario; selected: boolean; onClick: () => void }) {
  const Icon = scenario.icon
  const hint = scenario.onSiteOnly
    ? "On-site estimate"
    : `~${scenario.lowLbs.toLocaleString()} to ${scenario.highLbs.toLocaleString()} lbs`
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex flex-col items-start gap-2 overflow-hidden rounded-lg border-2 p-4 text-left transition-all duration-150 hover:-translate-y-0.5 ${
        selected
          ? "border-flame bg-brand-select shadow-[0_10px_26px_rgba(241,93,42,0.18)]"
          : "border-line bg-white hover:border-[#c4c1bc] hover:shadow-brand-sm"
      }`}
    >
      <Icon className={`h-7 w-7 ${selected ? "text-flame" : "text-brand"}`} strokeWidth={1.75} />
      <span className={`text-[14.5px] font-semibold leading-tight ${selected ? "text-flame" : "text-ink"}`}>
        {scenario.label}
      </span>
      <span className="text-[12px] leading-snug text-muted-foreground">{scenario.detail}</span>
      <span className={`mt-0.5 text-[11.5px] font-bold ${selected ? "text-flame" : "text-muted-foreground"}`}>
        {hint}
      </span>
    </button>
  )
}

/** Collapsed to a single chip until tapped, then a stepper. Keeps the flag row
 *  to one line for the majority of jobs that have neither. */
function CountChip({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  if (value === 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className="rounded-full border-2 border-line bg-white px-4 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:border-flame"
      >
        {label}
      </button>
    )
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border-2 border-flame bg-brand-select py-1 pl-4 pr-1.5">
      <span className="text-[13.5px] font-semibold text-ink">{label}</span>
      <button
        type="button"
        aria-label={`Fewer ${label.toLowerCase()}`}
        onClick={() => onChange(value - 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition-colors hover:text-flame"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-4 text-center text-[14px] font-bold tabular-nums text-ink">{value}</span>
      <button
        type="button"
        aria-label={`More ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition-colors hover:text-flame disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

/**
 * The "I know exactly what I have" path. Sums the reference bands in
 * ITEM_WEIGHTS into a low/high pound range and hands it up, where it overrides
 * whichever scenario card was selected.
 */
function ItemEstimator({
  onApply,
  onCancel,
}: {
  onApply: (bounds: { lowLbs: number; highLbs: number }) => void
  onCancel: () => void
}) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  const total = lbsFromItems(counts)
  const anySelected = Object.values(counts).some((n) => n > 0)

  const bump = (id: string, delta: number) =>
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))

  return (
    <div className="mt-4 rounded-lg border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">What are we picking up?</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Tap through what you have. We turn it into a weight range using the same table our
            crews use.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close item tally"
          onClick={onCancel}
          className="shrink-0 text-muted-foreground transition-colors hover:text-flame"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 max-h-[320px] divide-y divide-line-soft overflow-y-auto">
        {ITEM_WEIGHTS.map((item) => {
          const n = counts[item.id] ?? 0
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className={`text-sm ${n > 0 ? "font-semibold text-ink" : "text-body"}`}>
                {item.name}
                <span className="ml-1.5 text-[12px] text-muted-foreground">
                  {item.lowLbs === item.highLbs ? `${item.lowLbs} lbs` : `${item.lowLbs} to ${item.highLbs} lbs`}
                </span>
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => bump(item.id, -1)}
                  disabled={n === 0}
                  aria-label={`Fewer ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-flame disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-bold tabular-nums text-ink">{n}</span>
                <button
                  type="button"
                  onClick={() => bump(item.id, 1)}
                  aria-label={`More ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-flame"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-body">
          {anySelected ? (
            <>
              That is about{" "}
              <span className="font-bold text-ink">
                {total.lowLbs.toLocaleString()} to {total.highLbs.toLocaleString()} lbs
              </span>
              .
            </>
          ) : (
            "Add an item to see your weight range."
          )}
        </p>
        <button
          type="button"
          onClick={() => onApply(total)}
          disabled={!anySelected}
          className="btn-flame shrink-0 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Use this weight
        </button>
      </div>
    </div>
  )
}

function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-[34px]">
      <div className="inline-flex items-center gap-3">
        <span className="step-num">{step}</span>
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
