"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft, Check, MapPin, AlertCircle, Loader2, LocateFixed,
  ChevronLeft, ChevronRight, CalendarDays,
} from "lucide-react"
import {
  TIME_SLOTS, getAvailableDates, isSameDay, formatVisitDate,
} from "@/lib/schedule"

/* ============================================================
   Step 1 of 2 — the window, then who you are.

   The flow used to price the load first and schedule last. It asks for the
   window first now, because availability is the thing a customer is actually
   shopping for and the thing most likely to lose them: no point pricing a job
   for someone who cannot get a truck this week. Nothing on this page knows what
   the load is or what it costs. That is /checkout/estimate, which this page
   hands off to with everything collected here in the query string.
   ============================================================ */

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Carried through untouched. The homepage sets it when a size was picked
  // there; the estimate step treats it as a prefill, not a commitment.
  const [scenario, setScenario] = useState("")

  const [serviceAddress, setServiceAddress] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [isLookingUpAddress, setIsLookingUpAddress] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [addressNotRecognized, setAddressNotRecognized] = useState(false)
  const [accessNotes, setAccessNotes] = useState("")
  const [customerInfo, setCustomerInfo] = useState({ firstName: "", lastName: "", email: "" })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const dateStripRef = useRef<HTMLDivElement>(null)

  // Dates come off the real clock, so they resolve after mount rather than at
  // render: this route is prerendered and would otherwise ship a build-time
  // calendar. Empty until then, which the date strip renders as skeletons.
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  useEffect(() => setAvailableDates(getAvailableDates()), [])

  const mockAddresses = useMemo(() => [
    "1420 Sardis Rd N, Charlotte, NC 28270",
    "8300 Providence Rd, Charlotte, NC 28277",
    "525 N Tryon St, Charlotte, NC 28202",
    "2210 Commonwealth Ave, Charlotte, NC 28205",
    "6401 Morrison Blvd, Charlotte, NC 28211",
  ], [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const sc = searchParams.get("scenario")
    if (sc) setScenario(sc)
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

  const canContinue = Boolean(
    customerInfo.firstName && customerInfo.lastName && customerInfo.email
    && phoneNumber.trim() && serviceAddress && selectedDate && selectedTimeSlot,
  )

  const handleContinue = useCallback(async () => {
    if (!canContinue) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const visitSlot = TIME_SLOTS.find(s => s.id === selectedTimeSlot)
    const params = new URLSearchParams({
      scenario,
      address: [serviceAddress, addressLine2.trim()].filter(Boolean).join(", "),
      accessNotes,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
      customerEmail: customerInfo.email,
      phone: phoneNumber,
      visitDate: selectedDate ? formatVisitDate(selectedDate) : "",
      visitTime: visitSlot ? visitSlot.time : "",
    })
    router.push(`/checkout/estimate?${params.toString()}`)
  }, [canContinue, scenario, serviceAddress, addressLine2, accessNotes, customerInfo, phoneNumber, selectedDate, selectedTimeSlot, router])

  const nudgeDates = (dir: 1 | -1) =>
    dateStripRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" })

  const cardTitle = "font-display font-bold tracking-[-0.015em] leading-[1.08] text-ink text-[22px]"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-flame hover:text-flame-deep mb-5 text-sm font-bold transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to home
          </Link>
          <p className="eyebrow text-center">Step 1 of 2</p>
          <h1 className="disp text-ink text-[clamp(30px,5vw,52px)] text-center mt-2">
            Schedule Your Pickup
          </h1>
          <p className="text-center text-body mt-3 max-w-[52ch] mx-auto">
            Reserve the day and window first. You size the load and see your price on the next
            step, and nothing is charged today.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-5">
          {/* Schedule */}
          <Card className="rounded-lg border-line shadow-brand-sm">
            <CardHeader className="pb-3">
              <CardTitle className={`${cardTitle} flex items-center gap-2.5`}>
                <CalendarDays className="h-5 w-5 text-flame" />
                Choose date and time
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a window and the crew confirms your exact arrival time the morning of.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* Date picker */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Choose a date</Label>
                  {/* The strip used to page five days at a time between two
                      arrows. Five fixed columns is a desktop measurement: on a
                      375px phone the card padding and the arrows leave ~199px
                      for the grid, so each tile came out ~33px wide — narrower
                      than the two-digit date inside it, and the day, number and
                      month all spilled their box.

                      Same control the /lp booking widget already ships: one
                      scrollable row of fixed-width tiles, swiped on a phone,
                      nudged by the arrows on a pointer. Nothing has to divide
                      evenly into the available width. */}
                  <div className="flex items-stretch gap-2">
                    <button type="button" aria-label="Earlier dates" onClick={() => nudgeDates(-1)}
                      className="hidden w-9 shrink-0 items-center justify-center self-stretch rounded-lg border-[1.5px] border-line text-muted-foreground transition-colors hover:border-[#c4c1bc] hover:text-ink sm:flex">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {/* `min-w-0 flex-1` is load-bearing: as a plain flex item the
                        strip takes its full max-content width as its flex base,
                        which widens the card instead of scrolling inside it.
                        Tiles carry an explicit width AND height so every one is
                        the same box no matter what is in it — a three-letter day
                        and a one-digit date must not size differently from a
                        two-digit one. */}
                    <div
                      ref={dateStripRef}
                      className="flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {availableDates.length === 0
                        // Pre-mount placeholder. Same tiles, same row, so the
                        // real dates drop in without the card changing height.
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-[84px] w-[62px] shrink-0 rounded-lg border-2 border-line-soft bg-muted/40" />
                          ))
                        : availableDates.map((date) => {
                        const isSelected = selectedDate && isSameDay(date, selectedDate)
                        return (
                          <button key={date.toISOString()} type="button" onClick={() => setSelectedDate(date)}
                            aria-pressed={Boolean(isSelected)}
                            className={`flex h-[84px] w-[62px] shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-lg border-2 px-1 text-center transition-colors ${
                              isSelected ? "border-brand bg-brand" : "border-line hover:border-[#c4c1bc]"
                            }`}>
                            <span className={`text-[11px] font-bold uppercase leading-none tracking-[0.08em] ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                              {date.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className={`text-[21px] font-extrabold leading-none ${isSelected ? "text-white" : "text-ink"}`}>
                              {date.getDate()}
                            </span>
                            <span className={`text-[11px] leading-none ${isSelected ? "text-[#c3d5f7]" : "text-muted-foreground"}`}>
                              {date.toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    <button type="button" aria-label="Later dates" onClick={() => nudgeDates(1)}
                      className="hidden w-9 shrink-0 items-center justify-center self-stretch rounded-lg border-[1.5px] border-line text-muted-foreground transition-colors hover:border-[#c4c1bc] hover:text-ink sm:flex">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11.5px] text-muted-foreground">
                    Crews run Monday through Saturday. Swipe or scroll for later dates.
                  </p>
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

          {/* Continue to the estimate */}
          <div className="pb-8">
            <button onClick={handleContinue} disabled={!canContinue || isLoading} className="btn-flame w-full text-lg">
              {isLoading ? "One moment..." : "Continue to my estimate"}
            </button>
            {!canContinue && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Please choose a date &amp; time, fill in your details, and confirm your pickup address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
