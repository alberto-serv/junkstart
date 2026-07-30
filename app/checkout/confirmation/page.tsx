"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { CalendarDays, Clock, MapPin, Scale } from "lucide-react"
import { PHONE, PHONE_TEL, SERVICE_CITY } from "@/lib/junk-data"

function fmt(n: number | string): string {
  const num = typeof n === "string" ? parseFloat(n) : n
  if (isNaN(num)) return "0"
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const receiptRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState({
    scenario: "",
    scenarioLabel: "",
    lowLbs: "0",
    highLbs: "0",
    mattressCount: "0",
    tireCount: "0",
    low: "0",
    high: "0",
    minApplied: "0",
    discountApplied: "0",
    surcharges: "0",
    address: "",
    accessNotes: "",
    addOns: "",
    addOnsTotal: "0",
    totalLow: "0",
    totalHigh: "0",
    customerName: "",
    customerEmail: "",
    phone: "",
    visitDate: "",
    visitTime: "",
  })

  useEffect(() => {
    const d: Record<string, string> = {}
    for (const key of Object.keys(data)) {
      d[key] = searchParams.get(key) || (data as Record<string, string>)[key]
    }
    setData(d as typeof data)
    // `data` is the shape template only. Re-reading on every state change would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const addOns = data.addOns
    ? data.addOns.split(",").filter(Boolean).map((a) => {
        const [name, price] = a.split(":")
        return { name, price }
      })
    : []

  const scenarioLabel = data.scenarioLabel || "Your pickup"
  const mattressCount = parseInt(data.mattressCount, 10) || 0
  const tireCount = parseInt(data.tireCount, 10) || 0
  const surcharges = parseFloat(data.surcharges) || 0
  const weightText = `~${fmt(data.lowLbs)} to ${fmt(data.highLbs)} lbs`

  // A request-a-visit booking arrives with no price, so the
  // receipt drops the quote and pickup-detail sections.
  const quoted = parseFloat(data.high) > 0
  const receiptDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  const totalLow = parseFloat(data.totalLow) || 0
  const totalHigh = parseFloat(data.totalHigh) || 0
  const totalText = totalLow === totalHigh ? `$${fmt(totalLow)}` : `$${fmt(totalLow)} – $${fmt(totalHigh)}`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 md:py-14">

        {/* Page header (hidden in print) */}
        <div className="text-center mb-10 print:hidden">
          <h1 className="disp text-ink text-[clamp(30px,5vw,52px)] mb-2">You&apos;re on the Schedule</h1>
          <p className="text-muted-foreground text-base">
            {quoted ? "Your price and pickup window are confirmed below" : "Your free visit is confirmed below"}
          </p>
        </div>

        {/* Receipt Card */}
        <div ref={receiptRef} className="max-w-[760px] mx-auto bg-white border border-line rounded-lg shadow-brand-sm overflow-hidden print:shadow-none print:border-0">

          {/* Receipt header, color logo on white */}
          <div className="px-6 py-5 md:px-8 md:py-6 flex items-center justify-between border-b border-line-soft">
            <div>
              <Image src="/images/logo.svg" alt="JunkStart Junk Removal" width={135} height={69} className="h-10 w-auto" />
              <p className="text-muted-foreground text-xs mt-2">{SERVICE_CITY} &middot; {PHONE}</p>
            </div>
            <p className="text-xs text-muted-foreground">{receiptDate}</p>
          </div>

          <div className="px-6 py-6 md:px-8 md:py-8 space-y-6">

            {/* Customer */}
            {data.customerName && (
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">Prepared For</h3>
                <p className="text-foreground font-semibold">{data.customerName}</p>
                {data.customerEmail && <p className="text-sm text-muted-foreground">{data.customerEmail}</p>}
                {data.phone && <p className="text-sm text-muted-foreground">{data.phone}</p>}
              </div>
            )}

            {/* Pickup window */}
            {data.visitDate && (
              <div className="border-t border-line-soft pt-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                  {quoted ? "Your Pickup" : "Your Visit"}
                </h3>
                <div className="bg-[#F2F0EC] border border-line-soft rounded-lg p-4">
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="w-4 h-4 text-flame mt-0.5 shrink-0" />
                      <p className="text-sm font-semibold text-foreground">{data.visitDate}</p>
                    </div>
                    {data.visitTime && (
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-flame mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">{data.visitTime}</p>
                      </div>
                    )}
                    {data.address && (
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-flame mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">{data.address}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {quoted
                      ? "The crew texts you when they're 30 minutes out and confirms the final price on site before anything goes on the truck."
                      : "A crew lead will walk the job with you and hand you a written all-in price."}
                  </p>
                </div>
              </div>
            )}

            {/* Pickup details */}
            {quoted && (
              <div className="border-t border-line-soft pt-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Pickup Details</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">What we&apos;re hauling</p>
                    <p className="font-medium text-foreground mt-0.5">{scenarioLabel}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated weight</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <Scale className="w-4 h-4 text-flame" />
                      {weightText}
                    </p>
                  </div>
                  {surcharges > 0 && (
                    <div>
                      <p className="text-muted-foreground">Disposal surcharges</p>
                      <p className="font-medium text-foreground mt-0.5">
                        ${fmt(surcharges)}
                        {mattressCount > 0 && ` · ${mattressCount} mattress${mattressCount === 1 ? "" : "es"}`}
                        {tireCount > 0 && ` · ${tireCount} tire${tireCount === 1 ? "" : "s"}`}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Final price</p>
                    <p className="font-medium text-foreground mt-0.5">By certified scale at pickup</p>
                  </div>
                  {data.address && (
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground mt-0.5">{data.address}</p>
                    </div>
                  )}
                </div>
                {data.accessNotes && (
                  <div className="mt-4">
                    <p className="text-muted-foreground text-sm">Access notes</p>
                    <p className="text-sm text-foreground mt-0.5">{data.accessNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Service */}
            {quoted && (
              <div className="border-t border-line-soft pt-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Service</h3>
                <div className="bg-[#F2F0EC] border border-line-soft rounded-lg p-4">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-[19px] font-semibold text-ink">{scenarioLabel}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-flame">
                        ${fmt(data.low)} &ndash; ${fmt(data.high)}
                      </span>
                      <span className="text-sm text-body font-semibold">all in</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {weightText} estimated
                    {data.minApplied === "1" && " · includes our minimum pickup"}
                    {data.discountApplied === "1" && " · volume rate applied"}
                  </p>
                </div>
              </div>
            )}

            {/* Add-Ons */}
            {addOns.length > 0 && (
              <div className="border-t border-line-soft pt-5">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">Add-On Services</h3>
                <ul className="space-y-1.5 text-sm">
                  {addOns.map((addon, i) => (
                    <li key={i} className="flex justify-between gap-3 text-foreground">
                      <span>&middot; {addon.name}</span>
                      <span className="font-medium whitespace-nowrap">
                        {parseFloat(addon.price) === 0 ? "Free" : `+$${fmt(addon.price)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="border-t border-line-soft pt-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-3">
                {quoted ? "Your Price" : "Pricing"}
              </h3>
              {quoted ? (
                <>
                  <div className="flex justify-between gap-3 font-bold">
                    <span className="text-ink">Total, all in</span>
                    <span className="text-ink text-base whitespace-nowrap">{totalText}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-3">
                    Loading, hauling and disposal are included. Final price by certified scale at
                    pickup, so if the load weighs less than estimated, you pay less.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  A crew lead will size up the job during the visit and hand you a written
                  all-in price, no obligation.
                </p>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-line-soft px-6 py-5 md:px-8 bg-[#F2F0EC] print:bg-transparent">
            <p className="text-[11px] text-muted-foreground">
              &copy; {new Date().getFullYear()} JunkStart Junk Removal. All rights reserved.
            </p>
            {data.visitDate && (
              <p className="text-[11px] text-muted-foreground mt-2 print:hidden">
                Need to reschedule? Call{" "}
                <a href={PHONE_TEL} className="font-semibold text-flame hover:text-flame-deep transition-colors">{PHONE}</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
