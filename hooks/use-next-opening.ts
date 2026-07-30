"use client"

import { useEffect, useState } from "react"
import { nextOpening, type NextOpening } from "@/lib/schedule"

/**
 * The next bookable slot, resolved after mount.
 *
 * Never during render: these routes are statically prerendered, so a date
 * computed at render time is baked at build time and would promise an August
 * visitor an opening in July. Callers get `null` on the first paint and are
 * expected to render something true without a date until it lands.
 */
export function useNextOpening(): NextOpening | null {
  const [slot, setSlot] = useState<NextOpening | null>(null)
  useEffect(() => setSlot(nextOpening()), [])
  return slot
}
