"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CalendarDays, Check, Clock, MapPin } from "lucide-react"
import { ScenarioCard } from "@/components/scenario-card"
import {
  SCENARIOS, getQuote, NO_FLAGS, rangeStr, type ScenarioId,
} from "@/lib/junk-data"

/* ============================================================
   Step 2 of 2 — what the load is, what it costs, and book it.

   The window and the customer's details are already settled, and arrive in the
   query string. This page owns the whole priced half of the flow: size, add-ons,
   the running total, and the hand-off to the receipt. It is also the only place
   a price is calculated in the booking flow, so the homepage estimator and this
   page cannot drift: both call getQuote() on the same size bands.
   ============================================================ */

// ─── Add-ons ─────────────────────────────────────────────────────────────────
//
// Junk removal add-ons are either a per-item disposal fee the landfill charges us
// (mattresses, freon appliances, e-waste) or extra labor beyond loading
// (dismantling, demolition, sweeping). Flat fees, independent of the load weight.

interface AddOn { id: string; name: string; price: number; description: string }

const ADD_ONS: AddOn[] = [
  { id: "donation", name: "Donation Drop-Off & Receipt", price: 0, description: "We route anything still usable to a local charity partner and send you the itemized donation receipt for your taxes. Always free." },
  { id: "hauling", name: "Full-Service Hauling", price: 45, description: "The crew carries everything out from wherever it sits, upstairs, basement, attic or back yard, instead of you staging it at the curb first." },
  { id: "sweep", name: "Broom-Clean Finish", price: 60, description: "A full sweep, wipe-down and debris check of the cleared space, so a garage or unit is ready to hand off, list, or re-rent the same day." },
  { id: "priority", name: "Same-Day / Next-Day Priority", price: 75, description: "Jumps your pickup to the front of the route when you need it gone now. Subject to same-day crew availability." },
]

export default function EstimatePage() {
  const searchParams = useSearchParams()

  const [scenario, setScenario] = useState<ScenarioId | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Everything step 1 collected, carried as-is.
  const [booking, setBooking] = useState({
    address: "", accessNotes: "", customerName: "", customerEmail: "",
    phone: "", visitDate: "", visitTime: "",
  })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    setBooking({
      address: searchParams.get("address") ?? "",
      accessNotes: searchParams.get("accessNotes") ?? "",
      customerName: searchParams.get("customerName") ?? "",
      customerEmail: searchParams.get("customerEmail") ?? "",
      phone: searchParams.get("phone") ?? "",
      visitDate: searchParams.get("visitDate") ?? "",
      visitTime: searchParams.get("visitTime") ?? "",
    })
    // A size picked on the homepage arrives as a prefill. Anything unrecognised
    // is dropped rather than trusted: the id drives the price.
    const sc = searchParams.get("scenario")
    if (sc && SCENARIOS.some((s) => s.id === sc)) setScenario(sc as ScenarioId)
  }, [searchParams])

  const activeScenario = SCENARIOS.find((s) => s.id === scenario) ?? null
  const quote = activeScenario
    ? getQuote(activeScenario.lowLbs, activeScenario.highLbs, NO_FLAGS)
    : null
  const onSite = Boolean(quote?.onSiteRequired)
  const priced = Boolean(quote) && !onSite

  const addOnsTotal = useMemo(() => selectedAddOns.reduce((s, a) => s + a.price, 0), [selectedAddOns])
  const totalLow = (quote?.low ?? 0) + addOnsTotal
  const totalHigh = (quote?.high ?? 0) + addOnsTotal

  const handleAddOnToggle = useCallback((addOn: AddOn) => {
    setSelectedAddOns(prev => prev.find(a => a.id === addOn.id) ? prev.filter(a => a.id !== addOn.id) : [...prev, addOn])
  }, [])

  const handleBook = useCallback(async () => {
    if (!activeScenario || !quote) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const params = new URLSearchParams({
      ...booking,
      scenario: activeScenario.id,
      scenarioLabel: `${activeScenario.label} pickup`,
      lowLbs: activeScenario.lowLbs.toString(),
      highLbs: activeScenario.highLbs.toString(),
      low: quote.low.toString(),
      high: quote.high.toString(),
      minApplied: quote.minApplied ? "1" : "0",
      discountApplied: quote.discountApplied ? "1" : "0",
      surcharges: quote.surcharges.toString(),
      addOns: selectedAddOns.map(a => `${a.name}:${a.price}`).join(","),
      addOnsTotal: addOnsTotal.toString(),
      totalLow: totalLow.toString(),
      totalHigh: totalHigh.toString(),
    })
    window.location.href = `/checkout/confirmation?${params.toString()}`
  }, [activeScenario, quote, booking, selectedAddOns, addOnsTotal, totalLow, totalHigh])

  const priceText = (a: number, b: number) => `$${rangeStr(a, b)}`
  const cardTitle = "font-display font-bold tracking-[-0.015em] leading-[1.08] text-ink text-[22px]"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/checkout" className="inline-flex items-center text-flame hover:text-flame-deep mb-5 text-sm font-bold transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to your window
          </Link>
          <p className="eyebrow text-center">Step 2 of 2</p>
          <h1 className="disp text-ink text-[clamp(30px,5vw,52px)] text-center mt-2">
            What Size Is Your Load?
          </h1>
          <p className="text-center text-body mt-3 max-w-[52ch] mx-auto">
            Your window is held. Pick the closest size and your all-in price lands below.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-5">
          {/* The window they already reserved, so it stays visible while they
              price the load and they are never guessing what they booked. */}
          {booking.visitDate && (
            <Card className="rounded-lg border-line shadow-brand-sm">
              <CardHeader className="pb-3">
                <CardTitle className={`${cardTitle} flex items-center gap-2.5`}>
                  <CalendarDays className="h-5 w-5 text-flame" />
                  Your Window
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-brand-band border border-line p-5 rounded-lg space-y-2">
                  <p className="flex items-start gap-2.5 text-sm font-semibold text-ink">
                    <CalendarDays className="h-4 w-4 shrink-0 text-flame mt-0.5" />
                    {booking.visitDate}
                  </p>
                  {booking.visitTime && (
                    <p className="flex items-start gap-2.5 text-sm text-body">
                      <Clock className="h-4 w-4 shrink-0 text-flame mt-0.5" />
                      {booking.visitTime}
                    </p>
                  )}
                  {booking.address && (
                    <p className="flex items-start gap-2.5 text-sm text-body">
                      <MapPin className="h-4 w-4 shrink-0 text-flame mt-0.5" />
                      {booking.address}
                    </p>
                  )}
                </div>
                <Link href="/checkout" className="mt-3 inline-block text-[13px] font-bold text-flame transition-colors hover:text-flame-deep">
                  Change my window or details
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Size */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={cardTitle}>Pick Your Size</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Pick the closest fit. Nobody measures junk, everybody recognizes it.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SCENARIOS.map((s) => (
                  <ScenarioCard
                    key={s.id}
                    scenario={s}
                    selected={scenario === s.id}
                    onClick={() => setScenario(s.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-Ons */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={cardTitle}>Add-On Services (Optional)</CardTitle>
              <p className="text-[13px] text-muted-foreground mt-2">
                These sit on top of your weighed haul price. Anything the facility charges us
                is passed through at cost.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ADD_ONS.map((addOn) => {
                  const checked = selectedAddOns.some(a => a.id === addOn.id)
                  return (
                    <div
                      key={addOn.id}
                      className={`p-[18px] border-2 rounded-lg transition-all duration-150 ${
                        checked ? "border-flame bg-brand-select" : "border-line hover:border-[#c4c1bc]"
                      }`}
                    >
                      <div className="flex items-start">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => handleAddOnToggle(addOn)}
                          className="mt-1 data-[state=checked]:bg-flame data-[state=checked]:border-flame data-[state=checked]:text-white"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                            <h4 className="font-semibold text-ink text-[15.5px]">{addOn.name}</h4>
                            <span className="text-sm font-bold text-flame shrink-0">
                              {addOn.price === 0 ? "Free" : `+$${addOn.price}`}
                            </span>
                          </div>
                          <p className="text-[13px] text-muted-foreground mt-1">{addOn.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Estimate */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={cardTitle}>Your Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              {!activeScenario ? (
                <p className="text-sm text-muted-foreground">
                  Pick a size above and your all-in range lands here, trip fee, labor and disposal
                  included.
                </p>
              ) : onSite ? (
                <div className="bg-brand-band border border-line p-5 rounded-lg">
                  <p className="text-[19px] font-semibold text-ink">{activeScenario.label} pickup</p>
                  <p className="text-sm text-body mt-1.5">
                    A load this size is priced on site. The crew lead walks it with you when they
                    arrive, weighs the plan against what is actually there, and hands you a firm
                    all-in number before anything goes on the truck. No obligation.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{activeScenario.label} pickup</span>
                    <span className="font-medium text-right whitespace-nowrap">
                      {priceText(quote!.low, quote!.high)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      ~{activeScenario.lowLbs.toLocaleString()} to {activeScenario.highLbs.toLocaleString()} lbs estimated
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {quote!.minApplied && (
                      <span className="text-[12px] font-semibold text-flame">Includes our minimum pickup</span>
                    )}
                    {quote!.discountApplied && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11.5px] font-bold text-green-800">
                        Volume rate applied
                      </span>
                    )}
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="border-t border-border pt-2 mt-2">
                      <p className="text-muted-foreground mb-1.5">Add-ons</p>
                      <ul className="space-y-1">
                        {selectedAddOns.map(a => (
                          <li key={a.id} className="flex justify-between gap-3">
                            <span className="text-foreground flex items-start gap-1.5">
                              <Check className="h-3.5 w-3.5 text-flame mt-0.5 shrink-0" />
                              <span>{a.name}</span>
                            </span>
                            <span className="font-medium whitespace-nowrap">
                              {a.price === 0 ? "Free" : `+$${a.price}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between gap-3 font-semibold text-foreground">
                    <span>Total, all in</span>
                    <span className="whitespace-nowrap">{priceText(totalLow, totalHigh)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Nothing is charged today. Final price is weighed on our certified scale before
                    work starts.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirm */}
          <div className="pb-8">
            <button onClick={handleBook} disabled={!activeScenario || isLoading} className="btn-flame w-full text-lg">
              {isLoading ? "Booking..." : "Book my pickup"}
            </button>
            {!activeScenario && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Pick the size that looks closest to your load
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile price bar. Same job as the homepage's: the running total follows
          the customer down a page where every control changes it. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-6px_24px_rgba(21,38,68,0.14)] backdrop-blur lg:hidden">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="truncate text-[13px] text-muted-foreground">
            {activeScenario ? `${activeScenario.label} pickup` : "Pick a size"}
          </span>
          <span className="shrink-0 text-[19px] font-extrabold leading-none text-ink">
            {priced ? priceText(totalLow, totalHigh) : onSite ? "On site" : "--"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleBook}
          disabled={!activeScenario || isLoading}
          className="btn-flame w-full text-base disabled:opacity-50"
        >
          {isLoading ? "Booking..." : "Book my pickup"}
        </button>
      </div>
    </div>
  )
}
