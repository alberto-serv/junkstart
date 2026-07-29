"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight, Check, Shield, Star, Phone,
  Crown, Sparkles, Minus, Plus, Truck,
} from "lucide-react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import {
  JOBS, getJob, isJobId,
  accessOptionsFor, serviceSpecFor, getQuote,
  LOAD_MIN, LOAD_MAX, LOAD_STEP, LOAD_TICKS, TRUCK_CAPACITY,
  loadSizeLabel, truckFractionLabel,
  ITEM_VOLUMES, yardsFromItems,
  rangeStr, FREQUENCY_CONFIG, FREQUENCIES,
  PHONE, PHONE_TEL,
  type Job, type JobId, type FrequencyType, type AccessType, type ServiceLevelType,
} from "@/lib/junk-data"

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter()
  const [selectedJob, setSelectedJob] = useState<JobId>("garage")
  const [yards, setYards] = useState(8)
  const [frequency, setFrequency] = useState<FrequencyType>("one-time")
  const [access, setAccess] = useState<AccessType>("standard")
  const [serviceLevel, setServiceLevel] = useState<ServiceLevelType>("full-service")
  const [leadForm, setLeadForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", message: "" })
  const [leadSubmitted, setLeadSubmitted] = useState(false)

  // Service landing pages (e.g. /cleanouts) deep-link into the estimator with a
  // job type pre-selected via ?type=. Read it once on mount — window-based so we
  // don't pull in useSearchParams and force a Suspense boundary on this page.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type")
    if (isJobId(type)) setSelectedJob(type)
  }, [])

  const job = getJob(selectedJob)
  const spec = serviceSpecFor(selectedJob)

  // Past a full truck it's a multi-load job — those get priced on site, not by
  // the slider. "Something else" routes to the same custom-quote form.
  const overCap = yards > LOAD_MAX
  const showConsultation = job.consultationOnly || overCap
  const consultationContext = job.consultationOnly
    ? "your pickup"
    : "jobs bigger than a single truckload"

  const quote = getQuote(selectedJob, yards, access, serviceLevel, frequency)
  const freqConfig = FREQUENCY_CONFIG[frequency]

  const handleGetEstimate = () => {
    const params = new URLSearchParams({
      job: selectedJob,
      jobName: job.name,
      specName: spec.name,
      yards: yards.toString(),
      loadLabel: loadSizeLabel(yards),
      access,
      serviceLevel,
      frequency,
      perPickupPrice: quote.perPickup.toString(),
      perPickupLow: quote.perPickupLow.toString(),
      perPickupHigh: quote.perPickupHigh.toString(),
      monthlyTotal: quote.monthly.toString(),
      monthlyLow: quote.monthlyLow.toString(),
      monthlyHigh: quote.monthlyHigh.toString(),
      minApplied: quote.minApplied ? "1" : "0",
    })
    router.push(`/checkout?${params.toString()}`)
  }

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLeadSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-band-soft border-b border-line-soft">
        <div className="container mx-auto px-4 pt-14 pb-14 md:pt-[60px] md:pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="disp text-ink mx-auto max-w-[18ch] text-[clamp(36px,5.4vw,58px)]">
              Junk Removal With an Upfront Price
            </h1>
            <p className="mt-[18px] text-body text-lg max-w-[48ch] mx-auto">
              Tell us what you&apos;ve got and how much of it there is. You&apos;ll see your
              price before anyone shows up — loading, hauling and disposal included.
            </p>
            <button
              type="button"
              onClick={() => router.push("/checkout?book=1")}
              className="mt-[22px] inline-flex items-center gap-2 text-base font-bold text-flame hover:text-flame-deep transition-colors"
            >
              Rather have us take a look first? Book a free on-site quote
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Step 1 — What are we hauling? ──────────────────────────────── */}
      <section className="border-t border-border bg-white">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-5xl mx-auto">
            <StepHeader
              step={1}
              title="What are we hauling away?"
              subtitle="Pick the closest fit — mixed piles are normal, and the crew sorts it on site."
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {JOBS.filter((j) => j.id !== "other").map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  selected={selectedJob === j.id}
                  onClick={() => setSelectedJob(j.id)}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setSelectedJob("other")}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-flame hover:text-flame-deep transition-colors"
              >
                Don&apos;t see it on the list? Tell us what you&apos;ve got
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 2 — How much is there? ────────────────────────────────── */}
      {!job.consultationOnly && (
        <section className="border-t border-border bg-background">
          <div className="container mx-auto px-4 py-12 md:py-14">
            <div className="max-w-3xl mx-auto">
              <StepHeader
                step={2}
                title="How much is there?"
                subtitle={`Our truck holds ${TRUCK_CAPACITY} cubic yards. Drag to how full you think it'd be — or tally your items and we'll work it out.`}
              />
              <LoadSlider value={yards} onChange={setYards} />
              <ItemEstimator onEstimate={setYards} />
            </div>
          </div>
        </section>
      )}

      {showConsultation ? (
        /* ── Consultation — custom quote / lead form ──────────────────── */
        <section className="border-t border-border bg-gradient-to-b from-secondary/[0.18] to-background">
          <div className="container mx-auto px-4 py-14 md:py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-flame/15 mb-4">
                  <Crown className="w-7 h-7 text-flame" />
                </div>
                <h2 className="disp text-ink text-[clamp(26px,3.5vw,38px)]">
                  Let&apos;s Price This One In Person
                </h2>
                <p className="text-body mt-3 max-w-lg mx-auto">
                  For {consultationContext}, a crew lead walks the job, confirms how many
                  loads it takes, and gives you a written all-in price before any work starts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Sparkles, title: "Written Quote", desc: "An all-in price, on site, before we start" },
                  { icon: Shield, title: "No Obligation", desc: "Free to book and free to walk away" },
                  { icon: Phone, title: "Fast Turnaround", desc: "Most walkthroughs happen within 48 hours" },
                ].map((perk) => (
                  <div key={perk.title} className="bg-card border border-border rounded-lg p-4 text-center">
                    <perk.icon className="w-5 h-5 text-flame mx-auto mb-2" />
                    <p className="font-semibold text-sm text-foreground">{perk.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{perk.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-line rounded-lg shadow-brand overflow-hidden">
                <div className="bg-brand px-6 py-5">
                  <h3 className="disp text-white text-xl">Your Information</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Tell us how to reach you and we&apos;ll handle the rest.
                  </p>
                </div>

                <div className="p-6 md:p-8">
                  {!leadSubmitted ? (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lead-firstName">First Name *</Label>
                          <Input id="lead-firstName" required value={leadForm.firstName} onChange={(e) => setLeadForm(p => ({ ...p, firstName: e.target.value }))} placeholder="John" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lead-lastName">Last Name *</Label>
                          <Input id="lead-lastName" required value={leadForm.lastName} onChange={(e) => setLeadForm(p => ({ ...p, lastName: e.target.value }))} placeholder="Doe" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lead-email">Email Address *</Label>
                        <Input id="lead-email" type="email" required value={leadForm.email} onChange={(e) => setLeadForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lead-phone">Phone Number *</Label>
                        <Input id="lead-phone" type="tel" required value={leadForm.phone} onChange={(e) => setLeadForm(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lead-address">Pickup Address</Label>
                        <Input id="lead-address" value={leadForm.address} onChange={(e) => setLeadForm(p => ({ ...p, address: e.target.value }))} placeholder="Where should we come?" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lead-message">What are we picking up?</Label>
                        <Textarea id="lead-message" value={leadForm.message} onChange={(e) => setLeadForm(p => ({ ...p, message: e.target.value }))} rows={3} placeholder="Rough list of items, where they are, gate codes or access notes..." className="mt-1" />
                      </div>
                      <button type="submit" className="btn-flame w-full">
                        Request My Free Quote
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-xs text-muted-foreground text-center">
                        No obligation &middot; A crew lead will call you to set a time
                      </p>
                    </form>
                  ) : (
                    <div className="py-10 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-flame/10 mb-2">
                        <Check className="w-7 h-7 text-flame" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">We&apos;re on It</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        A crew lead will reach out to walk your job and put a written price
                        in your hands.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Need to talk sooner? Call{" "}
                        <a href={PHONE_TEL} className="text-flame hover:underline font-medium">{PHONE}</a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* ── Step 3 — Who does the loading? ───────────────────────────── */}
          <section className="border-t border-border bg-white">
            <div className="container mx-auto px-4 py-12 md:py-14">
              <div className="max-w-2xl mx-auto">
                <StepHeader
                  step={3}
                  title="Who's doing the loading?"
                  subtitle="If it's already at the curb, we skip the labor and you keep the difference."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { id: "full-service" as ServiceLevelType, label: "We Load It", copy: "The crew carries everything out for you", badge: "Most popular" },
                    { id: "curbside" as ServiceLevelType, label: "Curbside Pickup", copy: "It's already outside — we just haul it", badge: "Save 15%" },
                  ]).map((opt) => {
                    const selected = serviceLevel === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setServiceLevel(opt.id)}
                        className={`relative p-6 rounded-lg text-left transition-all duration-150 border-2 ${
                          selected
                            ? "border-flame bg-brand-select"
                            : "border-line bg-white hover:border-[#c4c1bc] hover:shadow-brand-sm"
                        }`}
                      >
                        <p className="font-semibold text-[17px] text-ink">{opt.label}</p>
                        <p className="text-[13.5px] text-muted-foreground mt-1">{opt.copy}</p>
                        {opt.badge && <span className="brand-badge mt-3">{opt.badge}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Step 4 — Access ─────────────────────────────────────────── */}
          <section className="border-t border-border bg-background">
            <div className="container mx-auto px-4 py-12 md:py-14">
              <div className="max-w-4xl mx-auto">
                <StepHeader
                  step={4}
                  title="Where is it right now?"
                  subtitle="Stairs and long carries take longer, so we price them honestly up front."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["easy", "standard", "hard"] as AccessType[]).map((a) => {
                    const opt = accessOptionsFor(selectedJob)[a]
                    const selected = access === a
                    return (
                      <button
                        key={a}
                        onClick={() => setAccess(a)}
                        className={`relative w-full text-left rounded-lg p-5 transition-all duration-150 border-2 bg-white ${
                          selected
                            ? "border-flame shadow-[0_12px_30px_rgba(241,93,42,0.18)]"
                            : "border-line hover:border-[#c4c1bc] hover:shadow-brand-sm"
                        }`}
                      >
                        <p className={`font-semibold text-base ${selected ? "text-flame" : "text-ink"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[13px] text-muted-foreground mt-1">{opt.copy}</p>
                        <ul className="mt-2 space-y-1">
                          {opt.cues.map((cue, i) => (
                            <li key={i} className="text-[13px] text-muted-foreground flex items-start gap-1">
                              <span className="text-muted-foreground/60">&middot;</span>
                              <span>{cue}</span>
                            </li>
                          ))}
                        </ul>
                        {a === "standard" && <span className="brand-badge mt-3">Most common</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Step 5 — How often? ─────────────────────────────────────── */}
          <section className="border-t border-border bg-white">
            <div className="container mx-auto px-4 py-12 md:py-14">
              <div className="max-w-2xl mx-auto">
                <StepHeader
                  step={5}
                  title="Just this once, or on a schedule?"
                  subtitle="Property managers, retailers and restaurants save on a routed pickup."
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {FREQUENCIES.map((key) => {
                    const cfg = FREQUENCY_CONFIG[key]
                    const selected = frequency === key
                    return (
                      <button
                        key={key}
                        onClick={() => setFrequency(key)}
                        className={`relative px-2 py-4 rounded-lg text-center transition-all duration-150 border-2 ${
                          selected
                            ? "border-brand bg-brand"
                            : "border-line bg-white hover:border-[#c4c1bc]"
                        }`}
                      >
                        <p className={`font-extrabold text-lg leading-none ${selected ? "text-white" : "text-ink"}`}>{cfg.short}</p>
                        <p className={`text-[11px] leading-tight mt-1 ${selected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                          {cfg.recurring ? `Save ${Math.round((1 - cfg.discount) * 100)}%` : "One and done"}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── Estimate ──────────────────────────────────────────────────── */}
          <section className="border-t border-border bg-white">
            <div className="container mx-auto px-4 py-12 md:py-14">
              <div className="max-w-4xl mx-auto">
                {(() => {
                  const low = quote.recurring ? quote.monthlyLow : quote.perPickupLow
                  const high = quote.recurring ? quote.monthlyHigh : quote.perPickupHigh
                  const priceText = low === high ? `$${low.toLocaleString()}` : `$${rangeStr(low, high)}`
                  return (
                    <div className="rounded-lg border border-line bg-brand-band shadow-brand-sm overflow-hidden">
                      <div className="p-8 md:px-9 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-4xl md:text-[46px] font-extrabold text-ink leading-none tracking-[-0.02em]">{priceText}</span>
                            <span className="text-body text-[15px] font-semibold">
                              {quote.recurring ? "/mo" : "all in"}
                            </span>
                          </div>
                          <p className="text-[13px] text-muted-foreground mt-2">
                            {truckFractionLabel(yards)} &middot; {freqConfig.label}
                            {quote.recurring && ` · $${quote.perPickupLow.toLocaleString()}–$${quote.perPickupHigh.toLocaleString()} per pickup`}
                          </p>
                          {quote.minApplied && (
                            <p className="text-[12px] font-semibold text-flame mt-1.5">
                              Minimum pickup price applies
                            </p>
                          )}
                        </div>
                        <button onClick={handleGetEstimate} className="btn-flame shrink-0">
                          Book This Pickup
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="border-t border-line-soft bg-white/60 px-8 py-5 md:px-9">
                        <p className="eyebrow mb-2.5">{spec.name} includes</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                          {spec.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-[13.5px] text-body">
                              <Check className="w-3.5 h-3.5 text-flame mt-1 shrink-0" strokeWidth={3} />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Trust Strip ────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <TrustItem icon={Shield} title="Licensed & Insured" text="Background-checked, uniformed crews" />
            <TrustItem icon={Star} title="Donate & Recycle First" text="We keep usable items out of the landfill" />
            <TrustItem icon={Phone} title="No Surprise Fees" text={`Questions? Call ${PHONE}`} />
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

function JobCard({ job, selected, onClick }: { job: Job; selected: boolean; onClick: () => void }) {
  const Icon = job.icon
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
        {job.shortName}
      </span>
      <span className="text-[12px] leading-snug text-muted-foreground">{job.tagline}</span>
    </button>
  )
}

// Load picker: a 1 → 16 cubic-yard slider with truck-fraction ticks and a
// free-text input. The track carries one extra stop past a full truck; landing
// there (or typing any value above the cap) routes the flow to consultation.
const SLIDER_MAX = LOAD_MAX + LOAD_STEP // the "more than a truckload" stop
const tickPct = (v: number) => ((v - LOAD_MIN) / (SLIDER_MAX - LOAD_MIN)) * 100

function LoadSlider({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const overCap = value > LOAD_MAX
  const sliderValue = overCap ? SLIDER_MAX : Math.min(Math.max(value || LOAD_MIN, LOAD_MIN), LOAD_MAX)
  // A simple fill gauge so the number means something at a glance.
  const fillPct = Math.min(100, (sliderValue / LOAD_MAX) * 100)

  return (
    <div className="max-w-xl mx-auto">
      {/* Truck fill gauge */}
      <div className="mx-auto mb-7 max-w-sm">
        <div className="relative h-16 overflow-hidden rounded-lg border-2 border-line bg-white">
          <div
            className="absolute inset-y-0 left-0 bg-flame/15 transition-all duration-200"
            style={{ width: `${fillPct}%` }}
          />
          <div className="relative flex h-full items-center justify-center gap-2.5">
            <Truck className="h-6 w-6 text-brand" strokeWidth={1.75} />
            <span className="disp text-lg text-ink">
              {overCap ? "More than a full truck" : truckFractionLabel(value)}
            </span>
          </div>
        </div>
      </div>

      {/* Editable value */}
      <div className="flex items-baseline justify-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={overCap ? `${LOAD_MAX}+` : value ? value.toString() : ""}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value.replace(/[^\d]/g, ""), 10)
            onChange(Number.isNaN(n) ? 0 : n)
          }}
          onBlur={() => { if (!value || value < LOAD_MIN) onChange(LOAD_MIN) }}
          aria-label="Load size in cubic yards"
          className="w-32 bg-transparent border-b-2 border-line text-center text-4xl font-extrabold text-ink tabular-nums focus:border-flame focus:outline-none transition-colors"
        />
        <span className="text-sm font-semibold text-muted-foreground">cu yd</span>
      </div>

      {/* Slider */}
      <SliderPrimitive.Root
        className="relative mt-9 flex w-full touch-none select-none items-center"
        min={LOAD_MIN}
        max={SLIDER_MAX}
        step={LOAD_STEP}
        value={[sliderValue]}
        onValueChange={([v]) => onChange(v)}
        aria-label="Load size"
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow rounded-full bg-line">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-flame" />
          {LOAD_TICKS.map((t) => (
            <span
              key={t}
              className="pointer-events-none absolute top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-[#c4c1bc]"
              style={{ left: `${tickPct(t)}%` }}
            />
          ))}
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="relative z-10 block h-6 w-6 cursor-grab rounded-full border-2 border-flame bg-white shadow-brand-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame/40 active:cursor-grabbing" />
      </SliderPrimitive.Root>

      {/* index labels */}
      <div className="relative mt-3 h-4 text-xs font-medium text-muted-foreground">
        <span className="absolute left-0">1 item</span>
        {[4, 8, 12].map((t) => (
          <span key={t} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${tickPct(t)}%` }}>
            {truckFractionLabel(t)}
          </span>
        ))}
        <span className="absolute right-0 font-semibold text-flame">Full+</span>
      </div>

      {overCap && (
        <p className="mt-6 text-center text-sm font-medium text-flame">
          More than one truckload — tell us about the job below and we&apos;ll build a custom quote.
        </p>
      )}
    </div>
  )
}

// "I'm not sure" path: rather than guess at the slider, the customer tallies the
// items they actually have. We sum the reference volumes in ITEM_VOLUMES, snap
// the total to the slider step, and apply it — the slider stays editable after.
function ItemEstimator({ onEstimate }: { onEstimate: (yards: number) => void }) {
  const [open, setOpen] = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})

  const total = yardsFromItems(counts)
  const anySelected = Object.values(counts).some((n) => n > 0)

  const bump = (id: string, delta: number) =>
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }))

  if (!open) {
    return (
      <div className="mt-7 text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-flame hover:text-flame-deep transition-colors"
        >
          Not sure how much you have? Add up your items
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="mt-7 max-w-xl mx-auto rounded-lg border border-line bg-white p-5 md:p-6">
      <p className="font-semibold text-ink">What are we picking up?</p>
      <p className="text-[13px] text-muted-foreground mt-1">
        Tap through what you&apos;ve got — we&apos;ll turn it into a load size and set the
        slider for you. You can still fine-tune it afterwards.
      </p>

      <div className="mt-4 divide-y divide-line-soft">
        {ITEM_VOLUMES.map((item) => {
          const n = counts[item.id] ?? 0
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className={`text-sm ${n > 0 ? "font-semibold text-ink" : "text-body"}`}>
                {item.name}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => bump(item.id, -1)}
                  disabled={n === 0}
                  aria-label={`Fewer ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-flame disabled:opacity-35 disabled:cursor-not-allowed"
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

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-body">
          {anySelected ? (
            <>
              That&apos;s about <span className="font-bold text-ink">{total} cu yd</span> —{" "}
              {truckFractionLabel(total).toLowerCase()}.
            </>
          ) : (
            "Add an item to see your load size."
          )}
        </p>
        <button
          type="button"
          onClick={() => { onEstimate(total); setOpen(false) }}
          disabled={!anySelected}
          className="btn-flame shrink-0 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Use this size
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
