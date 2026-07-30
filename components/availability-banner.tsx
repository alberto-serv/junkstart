"use client"

import { useEffect, useState } from "react"
import { CalendarClock } from "lucide-react"
import { nextOpening } from "@/lib/schedule"

/**
 * The availability line above the hero. Booking now opens on the calendar, so
 * the first thing the page says is when a truck can actually be here.
 *
 * The slot resolves in an effect, not during render. This route is statically
 * prerendered, so a date computed at render time would be baked at build time
 * and would tell a customer in August about an opening in July. Until it
 * resolves the banner shows the claim without the date, which is true on any
 * day and does not reflow when the real slot lands.
 */
export function AvailabilityBanner({ onBook }: { onBook: () => void }) {
  const [slot, setSlot] = useState<{ day: string; window: string } | null>(null)

  useEffect(() => setSlot(nextOpening()), [])

  return (
    <div className="border-b border-line-soft bg-ink text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-4 py-2.5 text-center">
        <CalendarClock className="h-4 w-4 shrink-0 text-flame" aria-hidden="true" />
        <span className="text-[13.5px]">
          <span className="font-semibold">Next available appointment:</span>{" "}
          {slot ? `${slot.day}, ${slot.window}` : "booking this week"}
        </span>
        <button
          type="button"
          onClick={onBook}
          className="text-[13.5px] font-bold text-flame underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Book my pickup
        </button>
      </div>
    </div>
  )
}
