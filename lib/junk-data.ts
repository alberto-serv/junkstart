import {
  Bike,
  Building2,
  HardHat,
  HelpCircle,
  Home,
  Mountain,
  Package as PackageIcon,
  Sofa,
  Trees,
  Tv,
  Warehouse,
  WashingMachine,
  Waves,
  type LucideIcon,
} from "lucide-react"

// ─── Company constants ───────────────────────────────────────────────────────

export const PHONE = "(888) 586-5782"
export const PHONE_TEL = "tel:8885865782"
export const SERVICE_CITY = "Charlotte, NC"

// ─── 1. Market configuration ─────────────────────────────────────────────────

/**
 * Per-market pricing. This is the whole pitch in one object.
 *
 * It mirrors the fill-in-the-blank box on the JunkStart franchise cheat sheet:
 * an owner fills in their trip fee, their per-pound rate, their minimum and any
 * surcharges, and the estimator prices their market correctly without a line of
 * code changing. Weights are national, prices are local.
 *
 * In production this resolves from the customer's ZIP via ServiceMinder, which
 * owns territory-to-franchise mapping, so a single deployment quotes every
 * market from that market's own numbers. The constant below is the Charlotte
 * card, standing in until that lookup is wired up.
 *
 * JunkStart prices by weight, not volume: every truck carries a certified
 * onboard scale, the load is weighed on site, and the customer sees the same
 * number the scale does.
 */
export interface MarketConfig {
  /** Display name for the market, e.g. "Charlotte, NC". */
  marketName: string
  /** Flat trip fee, added to every job. */
  pickupFee: number
  /** Dollars per pound. */
  perLbRate: number
  /** Jobs at or under `upToLbs` quote `flatPrice`, replacing the per-pound math. */
  minimum?: { upToLbs: number; flatPrice: number }
  /** At or above `atLbs`, the discounted rate applies to the WHOLE ticket. */
  volumeDiscount?: { atLbs: number; perLbRate: number }
  /** Per mattress, if this market charges one. */
  mattressSurcharge?: number
  /** Per tire, if this market charges one. */
  tireSurcharge?: number
}

export const MARKET: MarketConfig = {
  marketName: "Charlotte, NC",
  pickupFee: 89,
  perLbRate: 0.55,
  minimum: { upToLbs: 150, flatPrice: 139 },
  volumeDiscount: { atLbs: 1000, perLbRate: 0.45 },
  mattressSurcharge: 20,
  tireSurcharge: 10,
}

// ─── 2. On-site threshold ────────────────────────────────────────────────────

/**
 * At or above this estimated weight we stop quoting online. Loads this size
 * vary too much to price from a description, so the flow routes to a free
 * on-site estimate instead of guessing high and losing the job.
 */
export const ON_SITE_THRESHOLD_LBS = 1500

// ─── 3. Scenario cards ───────────────────────────────────────────────────────

/**
 * The one question the estimator asks, collapsed to three sizes.
 *
 * The bands are rolled up from the cheat sheet's "what the customer says, what
 * it weighs" translation table, so the same national weights still drive the
 * price, but the customer chooses between three answers instead of eight:
 *
 *   Small   a few items (50 to 150) through a pickup bed (200 to 400)
 *   Medium  half a garage (500 to 900) through a furnished room (600 to 1,000)
 *   Large   a packed garage or storage unit (1,000 up)
 *   XL      a whole property, which has no price at any weight
 *
 * Each band's low bound is the low of its smallest sheet row and its high bound
 * is the high of its largest, stopping short of ON_SITE_THRESHOLD_LBS on the
 * large card. XL carries a low bound and no high bound, which is its way of
 * saying "unbounded": it never quotes, it requests a visit.
 *
 * The weights are national. Only the prices in MarketConfig vary by market.
 */
export type ScenarioId = "small" | "medium" | "large" | "xl"

export interface Scenario {
  id: ScenarioId
  /** Customer language, not ours. */
  label: string
  detail: string
  icon: LucideIcon
  lowLbs: number
  highLbs: number
  /** No instant quote at any price. Requests a visit instead. */
  onSiteOnly?: boolean
}

export const SCENARIOS: Scenario[] = [
  { id: "small", label: "Small", detail: "A few items, up to a pickup bed's worth", icon: PackageIcon, lowLbs: 50, highLbs: 400 },
  { id: "medium", label: "Medium", detail: "A furnished room, or half a garage", icon: Sofa, lowLbs: 500, highLbs: 1000 },
  { id: "large", label: "Large", detail: "A packed garage, or a storage unit", icon: Warehouse, lowLbs: 1000, highLbs: 1400 },
  { id: "xl", label: "XL", detail: "A whole house, estate or hoarding cleanout", icon: Home, lowLbs: 1500, highLbs: 0, onSiteOnly: true },
]

// ─── 4. Flags ────────────────────────────────────────────────────────────────

/**
 * The checkbox row under the scenario picker. Two jobs: apply the per-item
 * surcharges this market charges, and catch the aggregates trap before it
 * produces a quote that is wrong by a factor of five.
 */
export interface QuoteFlags {
  /** 0 to 4 in the UI. */
  mattressCount: number
  /** 0 to 8 in the UI. */
  tireCount: number
  /** Dirt, concrete, rock, tile, brick. */
  hasAggregates: boolean
}

export const NO_FLAGS: QuoteFlags = { mattressCount: 0, tireCount: 0, hasAggregates: false }

/**
 * Shown the moment the aggregates box is ticked. Aggregates break every
 * household weight estimate on the page, so we say so plainly rather than
 * quoting a number we would have to walk back on site.
 */
export const AGGREGATES_WARNING =
  "Dirt, concrete, rock, tile and brick weigh far more than household junk. One pickup bed of dirt alone runs 2,000 lbs or more, and concrete 2,500 to 3,500 lbs, so the estimates above do not apply. Loads like this are quoted on site."

// ─── 5. Item weights ─────────────────────────────────────────────────────────

/**
 * The fallback for customers who would rather list exactly what they have than
 * pick the pile that looks closest. Bands are from the cheat sheet's item
 * weight table.
 */
export interface ItemWeight {
  id: string
  name: string
  lowLbs: number
  highLbs: number
}

export const ITEM_WEIGHTS: ItemWeight[] = [
  { id: "sofa", name: "Sofa or couch", lowLbs: 100, highLbs: 150 },
  { id: "sectional-per-piece", name: "Sectional, per piece", lowLbs: 50, highLbs: 50 },
  { id: "recliner", name: "Recliner or armchair", lowLbs: 60, highLbs: 80 },
  { id: "mattress-set", name: "Mattress and box spring", lowLbs: 100, highLbs: 175 },
  { id: "dresser", name: "Dresser or cabinet", lowLbs: 60, highLbs: 100 },
  { id: "dining-table-chairs", name: "Dining table and chairs", lowLbs: 130, highLbs: 150 },
  { id: "desk", name: "Desk", lowLbs: 100, highLbs: 200 },
  { id: "bookcase", name: "Bookcase or shelving", lowLbs: 60, highLbs: 100 },
  { id: "fridge-stove-dw", name: "Fridge, stove or dishwasher", lowLbs: 150, highLbs: 200 },
  { id: "washer-or-dryer", name: "Washer or dryer", lowLbs: 100, highLbs: 200 },
  { id: "tv", name: "TV or monitor", lowLbs: 50, highLbs: 100 },
  { id: "treadmill", name: "Treadmill", lowLbs: 150, highLbs: 300 },
  { id: "exercise-machine", name: "Exercise machine or weight set", lowLbs: 200, highLbs: 500 },
  { id: "carpet-per-room", name: "Carpet, one room", lowLbs: 60, highLbs: 120 },
  { id: "contractor-bag", name: "Contractor bag", lowLbs: 60, highLbs: 100 },
  { id: "kitchen-bag", name: "Kitchen trash bag", lowLbs: 20, highLbs: 30 },
]

/** Sum an item tally into a low/high pound band. */
export function lbsFromItems(counts: Record<string, number>): { lowLbs: number; highLbs: number } {
  return ITEM_WEIGHTS.reduce(
    (sum, item) => {
      const n = counts[item.id] ?? 0
      if (n <= 0) return sum
      return {
        lowLbs: sum.lowLbs + item.lowLbs * n,
        highLbs: sum.highLbs + item.highLbs * n,
      }
    },
    { lowLbs: 0, highLbs: 0 },
  )
}

// ─── Pricing helpers ─────────────────────────────────────────────────────────

export function roundNice(n: number): number {
  if (n <= 50) return Math.round(n / 5) * 5
  return Math.round(n / 5) * 5
}

export function rangeStr(low: number, high: number): string {
  if (low === high) return low.toLocaleString()
  return `${low.toLocaleString()} – $${high.toLocaleString()}`
}

// ─── 6. The pricing entry point ──────────────────────────────────────────────

export interface Quote {
  lowLbs: number
  highLbs: number
  low: number
  high: number
  /** Mattress and tire total. Already included in `low` and `high`. */
  surcharges: number
  /** The market minimum set the low end instead of the per-pound math. */
  minApplied: boolean
  /** The volume discount rate was used, on the whole ticket. */
  discountApplied: boolean
  /** Too big, or too unpredictable, to quote online. */
  onSiteRequired: boolean
}

/**
 * The single pricing entry point. The estimator, the checkout summary and the
 * confirmation receipt all read from this, so a market's numbers are applied in
 * exactly one place.
 *
 * Follows the cheat sheet's "how to build a quote" steps in order.
 */
export function getQuote(
  lowLbs: number,
  highLbs: number,
  flags: QuoteFlags,
  market: MarketConfig = MARKET,
): Quote {
  // (a) Anything we cannot honestly price from a description goes on site.
  // Aggregates break the weight bands outright; the XL scenario carries a low
  // bound and no high bound, which is its way of saying "unbounded".
  const onSiteRequired =
    flags.hasAggregates ||
    highLbs >= ON_SITE_THRESHOLD_LBS ||
    (lowLbs >= ON_SITE_THRESHOLD_LBS && highLbs === 0)

  if (onSiteRequired) {
    return {
      lowLbs,
      highLbs,
      low: 0,
      high: 0,
      surcharges: 0,
      minApplied: false,
      discountApplied: false,
      onSiteRequired: true,
    }
  }

  // (b) The discount rate is not marginal. Cross the threshold and the cheaper
  // rate reprices the whole ticket. Each bound is evaluated on its own weight,
  // so a band can straddle the threshold.
  const rateFor = (lbs: number) =>
    market.volumeDiscount && lbs >= market.volumeDiscount.atLbs
      ? market.volumeDiscount.perLbRate
      : market.perLbRate

  // (c) + (d) Trip fee plus weight, unless the job is small enough to fall
  // under the market minimum, in which case the flat minimum IS the price. Note
  // that it replaces the per-pound math rather than acting as a floor under it.
  const priceFor = (lbs: number) => {
    if (market.minimum && lbs <= market.minimum.upToLbs) {
      return { price: market.minimum.flatPrice, floored: true, discounted: false }
    }
    const rate = rateFor(lbs)
    return {
      price: market.pickupFee + lbs * rate,
      floored: false,
      discounted: Boolean(market.volumeDiscount) && rate !== market.perLbRate,
    }
  }

  const lowSide = priceFor(lowLbs)
  const highSide = priceFor(highLbs)

  // (e) Surcharges ride on top of both bounds.
  const surcharges =
    flags.mattressCount * (market.mattressSurcharge ?? 0) +
    flags.tireCount * (market.tireSurcharge ?? 0)

  // (f)
  return {
    lowLbs,
    highLbs,
    low: roundNice(lowSide.price + surcharges),
    high: roundNice(highSide.price + surcharges),
    surcharges,
    minApplied: lowSide.floored,
    discountApplied: lowSide.discounted || highSide.discounted,
    onSiteRequired: false,
  }
}

// ─── Legacy (Omaha LP + contact form only, do not use in the estimator) ──────
//
// `app/lp/omaha/junk-removal/page.tsx` still reads JOBS (filtering on
// consultationOnly, rendering name/tagline/icon) and TRUCK_CAPACITY, and
// `app/contact/page.tsx` reads JOBS for its job-type dropdown. Everything that
// priced off these types is gone; what remains is a label set. Nothing in the
// estimator may import from this block.

/**
 * Pricing archetypes. Every job type maps to one of these, which drove its
 * size buckets and rates under the old volume model. Retained only because
 * `Job` declares the field.
 */
export type ProfileId = "standard" | "light" | "heavy" | "commercial"

export type JobId =
  | "furniture"
  | "appliances"
  | "garage"
  | "estate"
  | "construction"
  | "yard"
  | "hottub"
  | "electronics"
  | "office"
  | "storage"
  | "heavy"
  | "exercise"
  | "other"

export interface Job {
  id: JobId
  name: string
  shortName: string
  icon: LucideIcon
  image?: string
  profile: ProfileId
  /** Scaled the profile's per-yard rate under the old volume model. Unused. */
  priceMultiplier?: number
  /** Featured types show in the grid by default; the rest sit behind "show more". */
  featured: boolean
  /** Routes to the consultation form instead of the instant-quote flow. */
  consultationOnly?: boolean
  tagline: string
}

export const JOBS: Job[] = [
  // ── Featured (shown by default) ──
  { id: "furniture", name: "Furniture & Mattresses", shortName: "Furniture", icon: Sofa, profile: "standard", featured: true, tagline: "Couches, beds, dressers & tables" },
  { id: "appliances", name: "Appliances", shortName: "Appliances", icon: WashingMachine, profile: "standard", priceMultiplier: 1.1, featured: true, tagline: "Fridges, washers, dryers & ranges" },
  { id: "garage", name: "Garage, Attic & Basement Cleanout", shortName: "Cleanout", icon: Warehouse, profile: "standard", featured: true, tagline: "Years of accumulation, cleared out" },
  { id: "estate", name: "Estate & Property Cleanout", shortName: "Estate", icon: Home, image: "/images/cleanout.webp", profile: "standard", priceMultiplier: 1.05, featured: true, tagline: "Whole-home and turnover cleanouts" },
  { id: "construction", name: "Construction & Remodel Debris", shortName: "Construction", icon: HardHat, profile: "heavy", featured: true, tagline: "Drywall, lumber, tile & fixtures" },
  { id: "yard", name: "Yard Waste & Landscaping Debris", shortName: "Yard Waste", icon: Trees, profile: "light", featured: true, tagline: "Branches, brush, sod & clippings" },
  { id: "electronics", name: "TVs & Electronics", shortName: "Electronics", icon: Tv, profile: "standard", priceMultiplier: 1.1, featured: true, tagline: "Responsibly recycled e-waste" },
  { id: "office", name: "Office & Commercial Cleanout", shortName: "Office", icon: Building2, profile: "commercial", featured: true, tagline: "Cubicles, desks & retail fixtures" },

  // ── Behind "show more" ──
  { id: "hottub", name: "Hot Tub & Playset Removal", shortName: "Hot Tub", icon: Waves, profile: "standard", priceMultiplier: 1.35, featured: false, tagline: "Dismantled and hauled in one visit" },
  { id: "storage", name: "Storage Unit Cleanout", shortName: "Storage Unit", icon: PackageIcon, profile: "commercial", featured: false, tagline: "Emptied and swept, ready to close" },
  { id: "heavy", name: "Dirt, Concrete & Heavy Debris", shortName: "Heavy Debris", icon: Mountain, profile: "heavy", priceMultiplier: 1.25, featured: false, tagline: "Concrete, brick, soil & roofing" },
  { id: "exercise", name: "Exercise & Recreation Equipment", shortName: "Exercise Gear", icon: Bike, profile: "standard", priceMultiplier: 1.15, featured: false, tagline: "Treadmills, weights & pool tables" },
  { id: "other", name: "Something Else", shortName: "Other", icon: HelpCircle, profile: "standard", featured: false, consultationOnly: true, tagline: "Tell us what you've got" },
]

/** Cubic yards in one JunkStart truck. Read by the Omaha LP only. */
export const TRUCK_CAPACITY = 16
