"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight,
  Home, Building2, MapPin, Tag, Loader2,
} from "lucide-react"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"

// ─── Scheduling data ─────────────────────────────────────────────────────────

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 – 11:00 AM" },
  { id: "mid-day", label: "Mid-Day", time: "11:00 AM – 2:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "2:00 – 5:00 PM" },
  { id: "evening", label: "Late Afternoon", time: "5:00 – 7:00 PM" },
]

/** Next 18 service days. Crews run Monday–Saturday; only Sunday is off. */
function getAvailableDates(): Date[] {
  const dates: Date[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() + 1) // first bookable day is tomorrow
  while (dates.length < 18) {
    if (cursor.getDay() !== 0) dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Promo codes the Omaha market is running. Recognized here only so the customer
// gets immediate feedback — this module never shows or computes a price, so the
// discount itself is applied by the crew when they quote on site.
const PROMO_CODES: Record<string, string> = {
  OMAHA25: "Omaha launch offer — applied to your on-site quote.",
  NEWNEIGHBOR: "First-time customer offer — applied to your on-site quote.",
  CURBSIDE: "Curbside pickup offer — applied to your on-site quote.",
}

type PropertyType = "home" | "business"

const STEPS = [
  { n: 1, label: "Date & Time" },
  { n: 2, label: "Pickup Details" },
  { n: 3, label: "Confirm" },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function ScheduleWidget() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Step 1
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState("")
  const [weekStart, setWeekStart] = useState(0)

  // Step 2
  const [propertyType, setPropertyType] = useState<PropertyType>("home")
  const [address, setAddress] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [items, setItems] = useState("")

  // Step 3
  const [promo, setPromo] = useState("")
  const [promoApplied, setPromoApplied] = useState<string | null>(null)
  const [promoError, setPromoError] = useState(false)

  const availableDates = useMemo(() => getAvailableDates(), [])
  const visibleDates = availableDates.slice(weekStart, weekStart + 5)
  const canGoBack = weekStart > 0
  const canGoForward = weekStart + 5 < availableDates.length

  const slot = TIME_SLOTS.find((s) => s.id === selectedSlot)

  const step1Complete = Boolean(selectedDate && selectedSlot)
  const step2Complete = Boolean(
    address.trim() && firstName.trim() && lastName.trim() && email.trim() && phone.trim() && items.trim(),
  )

  const applyPromo = () => {
    const code = promo.trim().toUpperCase()
    if (!code) return
    const match = PROMO_CODES[code]
    if (match) {
      setPromoApplied(match)
      setPromoError(false)
    } else {
      setPromoApplied(null)
      setPromoError(true)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1400))
    setSubmitting(false)
    setSubmitted(true)
  }

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-brand">
        <div className="bg-brand px-6 py-5">
          <h2 className="disp text-xl text-white">You&apos;re on the Schedule</h2>
        </div>
        <div className="space-y-5 p-6 text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-flame/10">
            <Check className="h-7 w-7 text-flame" strokeWidth={3} />
          </div>
          <div>
            <p className="font-semibold text-ink">
              {selectedDate ? formatDate(selectedDate) : ""}
            </p>
            <p className="text-sm text-muted-foreground">{slot?.time}</p>
          </div>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-body">
            A JunkStart dispatcher will call {phone} to confirm your window and answer any
            questions. The crew quotes your all-in price on site before anything goes on the
            truck — nothing is charged today.
          </p>
          <p className="text-sm text-muted-foreground">
            Need to change something? Call{" "}
            <a href={PHONE_TEL} className="font-semibold text-flame hover:underline">{PHONE}</a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-brand">
      {/* Header */}
      <div className="bg-brand px-6 py-5">
        <h2 className="disp text-xl text-white">Book Your Omaha Pickup</h2>
        <p className="mt-1 text-sm text-white/80">
          Three quick steps. No payment today — the crew prices it on site.
        </p>
      </div>

      {/* Step rail */}
      <div className="flex items-center gap-2 border-b border-line-soft bg-sand-soft px-4 py-3">
        {STEPS.map((s, i) => {
          const active = step === s.n
          const done = step > s.n
          return (
            <div key={s.n} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-colors ${
                  done ? "bg-flame text-white" : active ? "bg-brand text-white" : "bg-white text-muted-foreground ring-1 ring-line"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : s.n}
              </span>
              <span
                className={`hidden text-[12px] font-bold leading-tight sm:block ${
                  active ? "text-ink" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-line" />}
            </div>
          )
        })}
      </div>

      <div className="p-6">
        {/* ── Step 1 — Date & time ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <CalendarDays className="h-4 w-4 text-flame" />
                Pick a day
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeekStart(Math.max(0, weekStart - 5))}
                  disabled={!canGoBack}
                  aria-label="Earlier dates"
                  className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-line text-ink transition-colors hover:border-[#c4c1bc] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="grid flex-1 grid-cols-5 gap-1.5">
                  {visibleDates.map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center rounded-lg border-2 px-1 py-2.5 text-center transition-all ${
                          isSelected ? "border-brand bg-brand" : "border-line hover:border-[#c4c1bc]"
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                          {date.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className={`my-0.5 text-[19px] font-extrabold ${isSelected ? "text-white" : "text-ink"}`}>
                          {date.getDate()}
                        </span>
                        <span className={`text-[10px] ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setWeekStart(Math.min(availableDates.length - 5, weekStart + 5))}
                  disabled={!canGoForward}
                  aria-label="Later dates"
                  className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-line text-ink transition-colors hover:border-[#c4c1bc] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-ink">
                {selectedDate
                  ? `Arrival window for ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}`
                  : "Arrival window"}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((s) => {
                  const isSelected = selectedSlot === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!selectedDate}
                      onClick={() => setSelectedSlot(s.id)}
                      className={`rounded-lg border-2 p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                        isSelected ? "border-flame bg-brand-select" : "border-line hover:border-[#c4c1bc]"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${isSelected ? "text-flame" : "text-ink"}`}>{s.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.time}</p>
                    </button>
                  )
                })}
              </div>
              {!selectedDate && (
                <p className="mt-2 text-xs text-muted-foreground">Choose a day to see available windows.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2 — Pickup details ───────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block text-sm font-semibold text-ink">Is this pickup for a home or a business?</Label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "home" as PropertyType, label: "Home", icon: Home },
                  { id: "business" as PropertyType, label: "Business", icon: Building2 },
                ]).map((opt) => {
                  const isSelected = propertyType === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPropertyType(opt.id)}
                      className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 transition-all ${
                        isSelected ? "border-flame bg-brand-select" : "border-line hover:border-[#c4c1bc]"
                      }`}
                    >
                      <opt.icon className={`h-4 w-4 ${isSelected ? "text-flame" : "text-brand"}`} />
                      <span className={`text-sm font-semibold ${isSelected ? "text-flame" : "text-ink"}`}>{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="lp-address" className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <MapPin className="h-4 w-4 text-flame" />
                Pickup address *
              </Label>
              <Input
                id="lp-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="4120 Farnam St, Omaha, NE 68131"
              />
              <Input
                id="lp-address-2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apt, unit, or suite (optional)"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="lp-first" className="text-sm font-semibold text-ink">First name *</Label>
                <Input id="lp-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lp-last" className="text-sm font-semibold text-ink">Last name *</Label>
                <Input id="lp-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="mt-1" />
              </div>
            </div>

            {propertyType === "business" && (
              <div>
                <Label htmlFor="lp-company" className="text-sm font-semibold text-ink">Business name</Label>
                <Input id="lp-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your company" className="mt-1" />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="lp-email" className="text-sm font-semibold text-ink">Email *</Label>
                <Input id="lp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="lp-phone" className="text-sm font-semibold text-ink">Mobile number *</Label>
                <Input id="lp-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(402) 555-0142" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="lp-items" className="text-sm font-semibold text-ink">What are we removing? *</Label>
              <Textarea
                id="lp-items"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                rows={4}
                placeholder="Sectional sofa, two mattresses, a fridge, and roughly ten boxes from the basement. Stairs up to the driveway, gate code 4412."
                className="mt-1"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                A rough list is plenty — it helps us send the right size crew and truck.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3 — Promo code + confirm ─────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-lg border border-line bg-sand-soft p-4">
              <p className="eyebrow mb-2.5">Your booking</p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">When</dt>
                  <dd className="text-right font-medium text-ink">
                    {selectedDate ? formatDate(selectedDate) : "—"}
                    {slot ? `, ${slot.time}` : ""}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Property</dt>
                  <dd className="text-right font-medium text-ink capitalize">{propertyType}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Where</dt>
                  <dd className="text-right font-medium text-ink">
                    {[address, addressLine2].filter(Boolean).join(", ") || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="text-right font-medium text-ink">
                    {`${firstName} ${lastName}`.trim() || "—"}
                    {phone ? ` · ${phone}` : ""}
                  </dd>
                </div>
                <div className="pt-1">
                  <dt className="text-muted-foreground">Items</dt>
                  <dd className="mt-0.5 text-ink">{items}</dd>
                </div>
              </dl>
            </div>

            <div>
              <Label htmlFor="lp-promo" className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink">
                <Tag className="h-4 w-4 text-flame" />
                Promo code
              </Label>
              <div className="flex gap-2">
                <Input
                  id="lp-promo"
                  value={promo}
                  onChange={(e) => { setPromo(e.target.value); setPromoError(false) }}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyPromo() } }}
                  placeholder="OMAHA25"
                  className="flex-1 uppercase"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={!promo.trim()}
                  className="btn-ghost-brand shrink-0 px-5 py-2.5 text-sm disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <p className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-flame">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                  {promoApplied}
                </p>
              )}
              {promoError && (
                <p className="mt-2 text-[13px] text-muted-foreground">
                  We don&apos;t recognize that code. You can book without one — the crew will still
                  honor any offer you were sent.
                </p>
              )}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Booking is free and nothing is charged today. Your crew confirms the all-in price on
              site before a single item goes on the truck.
            </p>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="mt-6 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-ink transition-colors hover:text-flame"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !step1Complete : !step2Complete}
              className="btn-flame ml-auto text-base disabled:opacity-50"
            >
              Continue
              <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-flame ml-auto text-base disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  Confirm My Pickup
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          )}
        </div>

        {step === 1 && !step1Complete && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Choose a day and an arrival window to continue.
          </p>
        )}
        {step === 2 && !step2Complete && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Fill in your address, contact details, and what we&apos;re removing.
          </p>
        )}
      </div>
    </div>
  )
}
