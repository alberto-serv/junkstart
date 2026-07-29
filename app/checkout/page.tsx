"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft, Check, MapPin, AlertCircle, Loader2, LocateFixed,
  ChevronLeft, ChevronRight, CalendarDays,
} from "lucide-react"
import { SCENARIOS, rangeStr } from "@/lib/junk-data"

// ─── Add-ons ─────────────────────────────────────────────────────────────────
//
// Junk removal add-ons are either a per-item disposal fee the landfill charges us
// (mattresses, freon appliances, e-waste) or extra labor beyond loading
// (dismantling, demolition, sweeping). Flat fees, independent of the load weight.

interface AddOn { id: string; name: string; price: number; description: string }

function buildAddOns(): AddOn[] {
  return [
    { id: "freon", name: "Freon Appliance Recovery", price: 45, description: "Refrigerators, freezers and window AC units need certified refrigerant recovery before they can be scrapped. Includes the EPA-compliant recovery and documentation." },
    { id: "ewaste", name: "Certified E-Waste Recycling", price: 30, description: "TVs, monitors and computers routed to a certified R2 electronics recycler, with hard drives physically destroyed on request." },
    { id: "dismantle", name: "On-Site Dismantling", price: 120, description: "Sheds, playsets, hot tubs, workbenches and anything else that has to come apart before it fits through the door or onto the truck." },
    { id: "demo", name: "Light Demolition", price: 250, description: "Small-scale interior demolition. Deck boards, non-structural walls, fencing, cabinetry and flooring, removed and hauled in the same visit." },
    { id: "sweep", name: "Broom-Clean Finish", price: 60, description: "A full sweep, wipe-down and debris check of the cleared space, so a garage or unit is ready to hand off, list, or re-rent the same day." },
    { id: "donation", name: "Donation Drop-Off & Receipt", price: 0, description: "We route anything still usable to a local charity partner and send you the itemized donation receipt for your taxes. Always free." },
    { id: "priority", name: "Same-Day / Next-Day Priority", price: 75, description: "Jumps your pickup to the front of the route when you need it gone now. Subject to same-day crew availability." },
  ]
}

/** Resolve the ?scenario= param back to the card label the customer picked. */
function scenarioLabelFor(id: string | null): string {
  if (!id) return "Your pickup"
  if (id === "custom") return "Your item tally"
  return SCENARIOS.find((s) => s.id === id)?.label ?? "Your pickup"
}

// ─── Scheduling helpers ─────────────────────────────────────────────────────

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 – 11:00 AM" },
  { id: "mid-day", label: "Mid-Day", time: "11:00 AM – 2:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "2:00 – 5:00 PM" },
  { id: "evening", label: "Late Afternoon", time: "5:00 – 7:00 PM" },
]

function getAvailableDates(): Date[] {
  const dates: Date[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() + 1) // start tomorrow
  while (dates.length < 18) {
    // Junk crews run Saturdays; only Sunday is off.
    if (cursor.getDay() !== 0) dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const [scenario, setScenario] = useState("")
  const [scenarioLabel, setScenarioLabel] = useState("Your pickup")
  const [lowLbs, setLowLbs] = useState(0)
  const [highLbs, setHighLbs] = useState(0)
  const [mattressCount, setMattressCount] = useState(0)
  const [tireCount, setTireCount] = useState(0)
  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(0)
  const [minApplied, setMinApplied] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [surcharges, setSurcharges] = useState(0)
  const [serviceAddress, setServiceAddress] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [addressNotRecognized, setAddressNotRecognized] = useState(false)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [accessNotes, setAccessNotes] = useState("")
  const [customerInfo, setCustomerInfo] = useState({ firstName: "", lastName: "", email: "" })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [calendarWeekStart, setCalendarWeekStart] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const hasInit = useRef(false)

  const availableDates = useMemo(() => getAvailableDates(), [])

  const mockAddresses = useMemo(() => [
    "1420 Sardis Rd N, Charlotte, NC 28270",
    "8300 Providence Rd, Charlotte, NC 28277",
    "525 N Tryon St, Charlotte, NC 28202",
    "2210 Commonwealth Ave, Charlotte, NC 28205",
    "6401 Morrison Blvd, Charlotte, NC 28211",
  ], [])

  const availableAddOns = useMemo(() => buildAddOns(), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (hasInit.current) return
    hasInit.current = true
    const num = (key: string) => {
      const raw = searchParams.get(key)
      if (!raw) return null
      const n = parseInt(raw, 10)
      return Number.isNaN(n) ? null : n
    }

    // book=1 is the on-site path: no weights, no price, so every field below
    // stays at zero and the page renders its walkthrough variant.
    const sc = searchParams.get("scenario")
    if (sc) { setScenario(sc); setScenarioLabel(scenarioLabelFor(sc)) }

    const lbsLow = num("lowLbs"); if (lbsLow !== null) setLowLbs(lbsLow)
    const lbsHigh = num("highLbs"); if (lbsHigh !== null) setHighLbs(lbsHigh)
    const mc = num("mattressCount"); if (mc !== null) setMattressCount(mc)
    const tc = num("tireCount"); if (tc !== null) setTireCount(tc)
    const lo = num("low"); if (lo !== null) setLow(lo)
    const hi = num("high"); if (hi !== null) setHigh(hi)
    const sur = num("surcharges"); if (sur !== null) setSurcharges(sur)
    setMinApplied(searchParams.get("minApplied") === "1")
    setDiscountApplied(searchParams.get("discountApplied") === "1")
  }, [searchParams])

  // Address suggestions
  useEffect(() => {
    const exact = mockAddresses.some(a => a.toLowerCase() === addressInput.toLowerCase())
    if (addressInput.length >= 3 && !exact) {
      const filtered = mockAddresses.filter(a => a.toLowerCase().includes(addressInput.toLowerCase()))
      setAddressSuggestions(filtered.length > 0 ? filtered : mockAddresses.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setAddressSuggestions([])
      setShowSuggestions(false)
    }
  }, [addressInput, mockAddresses])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleAddressLookup = useCallback(async (address: string) => {
    if (!address.trim()) return
    setIsLookingUpAddress(true); setAddressNotRecognized(false)
    await new Promise(r => setTimeout(r, 1200))
    const recognized = mockAddresses.some(s => s.toLowerCase() === address.toLowerCase())
    setServiceAddress(address)
    setAddressNotRecognized(!recognized)
    setIsLookingUpAddress(false)
  }, [mockAddresses])

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return }
    setIsGeolocating(true)
    try { await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 })) } catch {}
    await new Promise(r => setTimeout(r, 600))
    const addr = mockAddresses[0]
    setAddressInput(addr); setShowSuggestions(false); handleAddressLookup(addr)
    setIsGeolocating(false)
  }, [handleAddressLookup, mockAddresses])

  const handleSelectSuggestion = useCallback((s: string) => {
    setShowSuggestions(false); setAddressSuggestions([]); setAddressInput(s); handleAddressLookup(s)
  }, [handleAddressLookup])

  const handleAddOnToggle = useCallback((addOn: AddOn) => {
    setSelectedAddOns(prev => prev.find(a => a.id === addOn.id) ? prev.filter(a => a.id !== addOn.id) : [...prev, addOn])
  }, [])

  // When the customer skips the estimator, no price comes through and we render
  // the on-site-quote booking flow instead of the priced pickup.
  const hasQuote = high > 0

  // Add-on fees land on top of the weighed haul price.
  const addOnsTotal = useMemo(() => selectedAddOns.reduce((s, a) => s + a.price, 0), [selectedAddOns])

  const totalLow = low + addOnsTotal
  const totalHigh = high + addOnsTotal

  const priceText = (a: number, b: number) => `$${rangeStr(a, b)}`
  const weightText = `~${lowLbs.toLocaleString()} to ${highLbs.toLocaleString()} lbs estimated`

  const canBook = customerInfo.firstName && customerInfo.lastName && customerInfo.email
    && phoneNumber.trim() && serviceAddress && selectedDate && selectedTimeSlot

  const formatVisitDate = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  const handleBookService = useCallback(async () => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const visitSlot = TIME_SLOTS.find(s => s.id === selectedTimeSlot)
    const params = new URLSearchParams({
      scenario,
      scenarioLabel,
      lowLbs: lowLbs.toString(),
      highLbs: highLbs.toString(),
      mattressCount: mattressCount.toString(),
      tireCount: tireCount.toString(),
      low: low.toString(),
      high: high.toString(),
      minApplied: minApplied ? "1" : "0",
      discountApplied: discountApplied ? "1" : "0",
      surcharges: surcharges.toString(),
      address: [serviceAddress, addressLine2.trim()].filter(Boolean).join(", "),
      accessNotes,
      addOns: selectedAddOns.map(a => `${a.name}:${a.price}`).join(","),
      addOnsTotal: addOnsTotal.toString(),
      totalLow: totalLow.toString(),
      totalHigh: totalHigh.toString(),
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      customerEmail: customerInfo.email,
      phone: phoneNumber,
      visitDate: selectedDate ? formatVisitDate(selectedDate) : "",
      visitTime: visitSlot ? visitSlot.time : "",
    })
    window.location.href = `/checkout/confirmation?${params.toString()}`
    setIsLoading(false)
  }, [scenario, scenarioLabel, lowLbs, highLbs, mattressCount, tireCount, low, high, minApplied, discountApplied, surcharges, serviceAddress, addressLine2, accessNotes, selectedAddOns, addOnsTotal, totalLow, totalHigh, customerInfo, phoneNumber, selectedDate, selectedTimeSlot])

  // Calendar pagination: show 5 days at a time
  const visibleDates = availableDates.slice(calendarWeekStart, calendarWeekStart + 5)
  const canGoBack = calendarWeekStart > 0
  const canGoForward = calendarWeekStart + 5 < availableDates.length

  const cardTitle = "font-display font-bold tracking-[-0.015em] leading-[1.08] text-ink text-[22px]"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-flame hover:text-flame-deep mb-5 text-sm font-bold transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to your estimate
          </Link>
          <h1 className="disp text-ink text-[clamp(30px,5vw,52px)] text-center">
            {hasQuote ? "Schedule Your Pickup" : "Book a Free On-Site Quote"}
          </h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-5">
          {/* Pickup Summary */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={cardTitle}>{hasQuote ? "Your Pickup" : "Free On-Site Quote"}</CardTitle>
            </CardHeader>
            <CardContent>
              {hasQuote ? (
                <div className="bg-brand-band border border-[#E4DBC2] p-6 rounded-lg">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-1">
                    <h3 className="text-[19px] font-semibold text-ink">{scenarioLabel}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-flame">{priceText(low, high)}</span>
                      <span className="text-body text-[13px] font-semibold">all in</span>
                    </div>
                  </div>
                  <p className="text-[13.5px] text-body">{weightText}</p>
                  {surcharges > 0 && (
                    <p className="text-[13.5px] text-body mt-0.5">
                      Includes ${surcharges.toLocaleString()} in disposal surcharges
                      {mattressCount > 0 && ` · ${mattressCount} mattress${mattressCount === 1 ? "" : "es"}`}
                      {tireCount > 0 && ` · ${tireCount} tire${tireCount === 1 ? "" : "s"}`}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    {minApplied && (
                      <span className="text-[12px] font-semibold text-flame">Includes our minimum pickup</span>
                    )}
                    {discountApplied && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11.5px] font-bold text-green-800">
                        Volume rate applied
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-brand-band border border-[#E4DBC2] p-6 rounded-lg">
                  <p className="text-sm text-ink">
                    No estimate needed. Pick a time below and a crew lead will come out, look at
                    the pile, and hand you a written all-in price. Free, with no obligation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add-Ons, only with a quote */}
          {hasQuote && (
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
                  {availableAddOns.map((addOn) => {
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
          )}

          {/* Personal Info + Pickup Address */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={cardTitle}>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={customerInfo.firstName} onChange={(e) => setCustomerInfo(p => ({ ...p, firstName: e.target.value }))} placeholder="John" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={customerInfo.lastName} onChange={(e) => setCustomerInfo(p => ({ ...p, lastName: e.target.value }))} placeholder="Doe" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile Number *</Label>
                  <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="(555) 123-4567" className="mt-1" />
                  <p className="text-[12px] text-muted-foreground mt-1">
                    The crew texts you a heads-up when they&apos;re 30 minutes out.
                  </p>
                </div>

                {/* Pickup Address */}
                <div>
                  <Label>Pickup Address *</Label>
                  <div className="flex gap-3 mt-1" ref={suggestionRef}>
                    <div className="relative flex-1">
                      <div className="relative">
                        <button type="button" onClick={handleGeolocation} disabled={isGeolocating}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-flame transition-colors disabled:opacity-50">
                          {isGeolocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                        </button>
                        <Input value={addressInput} onChange={(e) => setAddressInput(e.target.value)} placeholder="Where are we picking up?" className="pl-10"
                          onKeyDown={(e) => { if (e.key === "Enter") { setShowSuggestions(false); handleAddressLookup(addressInput) } }} />
                      </div>
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {addressSuggestions.map((s, i) => (
                            <button key={i} type="button" onClick={() => handleSelectSuggestion(s)}
                              className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-center gap-2 text-sm border-b last:border-b-0">
                              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />{s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Input value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Apt, unit, or suite (optional)" className="mt-2" />
                  {isLookingUpAddress && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-flame"><Loader2 className="h-4 w-4 animate-spin" />Checking your address...</div>
                  )}
                  {addressNotRecognized && !isLookingUpAddress && (
                    <div className="mt-2 p-3 bg-flame/5 border border-flame/20 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-flame shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground">Couldn&apos;t verify this address. We&apos;ll confirm it&apos;s in our service area when we call.</p>
                    </div>
                  )}
                  {serviceAddress && !isLookingUpAddress && !addressNotRecognized && (
                    <div className="mt-2 p-3 bg-flame/5 border border-flame/20 rounded-lg flex items-center gap-2">
                      <Check className="h-4 w-4 text-flame shrink-0" /><p className="text-sm text-foreground">In our service area.</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="access-notes">Access notes (optional)</Label>
                  <Textarea
                    id="access-notes"
                    value={accessNotes}
                    onChange={(e) => setAccessNotes(e.target.value)}
                    rows={3}
                    placeholder="Gate code, where the pile is, parking limits, dogs on site, anything the crew should know before they roll up."
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Pickup */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={`${cardTitle} flex items-center gap-2.5`}>
                <CalendarDays className="h-5 w-5 text-flame" />
                {hasQuote ? "Pick Your Pickup Day" : "Pick a Walkthrough Day"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {hasQuote
                  ? "Choose a window and the crew confirms your exact arrival time the morning of."
                  : "A crew lead comes out, sizes up the job, and gives you a written price."}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* Date picker */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Choose a date</Label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setCalendarWeekStart(Math.max(0, calendarWeekStart - 5))} disabled={!canGoBack}
                      className="flex items-center justify-center w-10 h-10 shrink-0 rounded-md border-[1.5px] border-line text-ink hover:border-[#c4c1bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {visibleDates.map((date) => {
                        const isSelected = selectedDate && isSameDay(date, selectedDate)
                        return (
                          <button key={date.toISOString()} type="button" onClick={() => setSelectedDate(date)}
                            className={`flex flex-col items-center py-3 px-1 rounded-lg border-2 text-center transition-all ${
                              isSelected ? "border-brand bg-brand" : "border-line hover:border-[#c4c1bc]"
                            }`}>
                            <span className={`text-[11px] font-bold uppercase tracking-[0.08em] ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className={`text-[22px] font-extrabold my-0.5 ${isSelected ? "text-white" : "text-ink"}`}>
                              {date.getDate()}
                            </span>
                            <span className={`text-[11px] ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                              {date.toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <button type="button" onClick={() => setCalendarWeekStart(Math.min(availableDates.length - 5, calendarWeekStart + 5))} disabled={!canGoForward}
                      className="flex items-center justify-center w-10 h-10 shrink-0 rounded-md border-[1.5px] border-line text-ink hover:border-[#c4c1bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Time slots */}
                {selectedDate && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Arrival window for {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.id
                        return (
                          <button key={slot.id} type="button" onClick={() => setSelectedTimeSlot(slot.id)}
                            className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                              isSelected ? "border-flame bg-brand-select" : "border-line hover:border-[#c4c1bc]"
                            }`}>
                            <p className={`text-sm font-semibold ${isSelected ? "text-flame" : "text-ink"}`}>{slot.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{slot.time}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary, only with a quote */}
          {hasQuote && (
            <Card className="rounded-lg border-line shadow-brand-sm">
              <CardHeader className="pb-3">
                <CardTitle className={cardTitle}>Price Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{scenarioLabel}</span>
                    <span className="font-medium text-right whitespace-nowrap">{priceText(low, high)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">{weightText}</span>
                  </div>
                  {surcharges > 0 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        Disposal surcharges
                        {mattressCount > 0 && ` · ${mattressCount} mattress${mattressCount === 1 ? "" : "es"}`}
                        {tireCount > 0 && ` · ${tireCount} tire${tireCount === 1 ? "" : "s"}`}
                      </span>
                      <span className="font-medium text-right whitespace-nowrap">
                        included
                      </span>
                    </div>
                  )}
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
              </CardContent>
            </Card>
          )}

          {/* Confirm & Schedule */}
          <div className="pb-8">
            <button onClick={handleBookService} disabled={!canBook || isLoading} className="btn-flame w-full text-lg">
              {isLoading ? "Booking..." : hasQuote ? "Confirm & Book Pickup" : "Confirm & Book Walkthrough"}
            </button>
            {!canBook && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Please fill in your details, confirm your pickup address, and choose a date &amp; time
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
