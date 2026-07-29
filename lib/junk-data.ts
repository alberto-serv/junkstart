import {
  Sofa,
  WashingMachine,
  Warehouse,
  Home,
  HardHat,
  Trees,
  Waves,
  Tv,
  Building2,
  Package as PackageIcon,
  Mountain,
  Bike,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"

// ─── Company constants ───────────────────────────────────────────────────────

export const PHONE = "(888) 586-5782"
export const PHONE_TEL = "tel:8885865782"
export const SERVICE_CITY = "Charlotte, NC"

// ─── Types ───────────────────────────────────────────────────────────────────

/** How often we come out. Most junk removal is one-time; recurring hauling is a
 *  real commercial product (property managers, retail, restaurants). */
export type FrequencyType = "one-time" | "monthly" | "2x-month" | "weekly"

/** Who does the loading. Curbside is cheaper — the crew never leaves the truck. */
export type ServiceLevelType = "full-service" | "curbside"

export const SERVICE_LEVEL_LABELS: Record<ServiceLevelType, string> = {
  "full-service": "Full-Service Loading",
  curbside: "Curbside Pickup",
}

/** How hard the haul-out is. Drives the labor side of the price. */
export type AccessType = "easy" | "standard" | "hard"

/**
 * Pricing archetypes. Every job type maps to one of these, which drives its
 * per-cubic-yard rate band, the copy on the access step, and what's included.
 * New job types reuse an existing profile (optionally scaled with
 * `priceMultiplier`) instead of requiring hand-written config for each one.
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
  /** Scales the profile's per-yard rate for this job type. Defaults to 1. */
  priceMultiplier?: number
  /** Featured types show in the grid by default; the rest sit behind "show more". */
  featured: boolean
  /** Routes to the consultation form instead of the instant-quote flow. */
  consultationOnly?: boolean
  tagline: string
}

// ─── Job types (single source of truth) ──────────────────────────────────────

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

export const FEATURED_JOBS: Job[] = JOBS.filter((j) => j.featured)
export const MORE_JOBS: Job[] = JOBS.filter((j) => !j.featured)

export function getJob(id: JobId): Job {
  return JOBS.find((j) => j.id === id) ?? JOBS[0]
}

export function isJobId(value: string | null | undefined): value is JobId {
  return !!value && JOBS.some((j) => j.id === value)
}

// ─── Load volume ─────────────────────────────────────────────────────────────
//
// Junk removal prices on volume, not weight or time: how much of the truck your
// pile fills. A JunkStart truck holds 16 cubic yards, so the customer dials in
// cubic yards and we present it back as the truck fraction they'd recognize
// ("about ½ a truck"). Anything past a full truck is a multi-load job and routes
// to a custom quote.

export const TRUCK_CAPACITY = 16 // cubic yards in one JunkStart truck
export const LOAD_MIN = 1
export const LOAD_MAX = TRUCK_CAPACITY
export const LOAD_STEP = 1

/** Truck-fill fractions, used for the slider ticks and the plain-English label. */
const TRUCK_FRACTIONS: { yards: number; label: string }[] = [
  { yards: 1, label: "1 item" },
  { yards: 2, label: "⅛ truck" },
  { yards: 4, label: "¼ truck" },
  { yards: 6, label: "⅜ truck" },
  { yards: 8, label: "½ truck" },
  { yards: 10, label: "⅝ truck" },
  { yards: 12, label: "¾ truck" },
  { yards: 14, label: "⅞ truck" },
  { yards: 16, label: "Full truck" },
]

export const LOAD_TICKS = [4, 8, 12, 16]

/** Nearest truck-fraction name for a cubic-yard value ("about ½ a truck"). */
export function truckFractionLabel(yards: number): string {
  if (yards > TRUCK_CAPACITY) return "More than a full truck"
  return TRUCK_FRACTIONS.reduce((best, f) =>
    Math.abs(f.yards - yards) < Math.abs(best.yards - yards) ? f : best,
  ).label
}

export function loadSizeLabel(yards: number): string {
  if (yards > TRUCK_CAPACITY) return `${TRUCK_CAPACITY}+ cu yd · multiple loads`
  return `${yards} cu yd · ${truckFractionLabel(yards)}`
}

// ─── Item volume reference ───────────────────────────────────────────────────
//
// Customers do not think in cubic yards. The "add your items" helper on the size
// step lets them tally what they actually have; we sum the volumes below and set
// the slider for them. Figures are typical displaced volume, rounded generously
// so the estimate errs high rather than low.

export interface ItemVolume {
  id: string
  name: string
  yards: number
}

export const ITEM_VOLUMES: ItemVolume[] = [
  { id: "sofa", name: "Sofa / couch", yards: 2.5 },
  { id: "chair", name: "Armchair / recliner", yards: 1.5 },
  { id: "mattress", name: "Mattress + box spring", yards: 1.5 },
  { id: "dresser", name: "Dresser / cabinet", yards: 1.5 },
  { id: "table", name: "Table & chairs", yards: 2.5 },
  { id: "appliance", name: "Large appliance", yards: 1.5 },
  { id: "tv", name: "TV / electronics", yards: 0.5 },
  { id: "exercise", name: "Exercise equipment", yards: 2 },
  { id: "carpet", name: "Carpet (one room)", yards: 1.5 },
  { id: "boxes", name: "Boxes / bags (each)", yards: 0.2 },
  { id: "yardbag", name: "Yard waste pile (per truck bed)", yards: 2.5 },
  { id: "hottub", name: "Hot tub", yards: 8 },
]

/** Sum an item tally into cubic yards, snapped to the slider's step and clamped
 *  one step past the cap so an oversized tally still routes to consultation. */
export function yardsFromItems(counts: Record<string, number>): number {
  const raw = ITEM_VOLUMES.reduce((sum, item) => sum + item.yards * (counts[item.id] ?? 0), 0)
  const snapped = Math.ceil(raw / LOAD_STEP) * LOAD_STEP
  return Math.min(Math.max(snapped, LOAD_MIN), LOAD_MAX + LOAD_STEP)
}

// ─── Pricing model ───────────────────────────────────────────────────────────
//
// The price is a dispatch fee plus volume:
//   per-pickup = BASE_FEE + (cubic yards × per-yard rate)
// scaled by how hard the haul-out is (access) and who does the loading (service
// level), then floored at the minimum pickup price. Each profile carries TWO
// per-yard rates — a clean, well-sorted load and a mixed, awkward one — which
// give the low and high ends of the range the UI shows.

/** Truck roll + two-person crew dispatch, before any volume. */
const BASE_FEE = 95

/** No job leaves the yard for less than this, whatever the volume works out to. */
const MINIMUM_PICKUP = 129

/** [clean/sorted load → low end, mixed/awkward load → high end], $ per cubic yard. */
const YARD_RATES: Record<ProfileId, [number, number]> = {
  // Household mixed junk — furniture, appliances, cleanouts. The default band.
  standard: [40, 52],
  // Bulky but light and single-stream: brush, sod, cardboard. Cheaper to tip.
  light: [26, 36],
  // Office and retail: standard material, but more staging, elevators and COIs.
  commercial: [44, 58],
  // Concrete, dirt, roofing. Landfill charges by weight here, not volume.
  heavy: [78, 105],
}

/** Labor multiplier for how hard it is to get the material to the truck. */
const ACCESS_MULTIPLIERS: Record<AccessType, number> = {
  easy: 0.9,
  standard: 1.0,
  hard: 1.3,
}

/** Curbside piles are already staged — the crew only loads and hauls. */
const SERVICE_LEVEL_MULTIPLIERS: Record<ServiceLevelType, number> = {
  "full-service": 1.0,
  curbside: 0.85,
}

// ─── Access (how hard the haul-out is) ───────────────────────────────────────

type AccessCopy = Record<AccessType, { label: string; copy: string; cues: string[] }>

/** Base copy per pricing profile. Job types that share a profile but read oddly
 *  with its generic wording get a tailored override in ACCESS_OVERRIDES below. */
const ACCESS_OPTIONS: Record<ProfileId, AccessCopy> = {
  standard: {
    easy: { label: "Curb or Driveway", copy: "It's already outside and ready to load", cues: ["Nothing to carry out", "Truck parks right at the pile"] },
    standard: { label: "Ground Floor", copy: "Inside, but a straight carry to the truck", cues: ["No stairs", "Doorways clear"] },
    hard: { label: "Stairs or Tight Access", copy: "Upper floor, basement, or a long carry", cues: ["Stairs or elevator", "Narrow halls or heavy pieces"] },
  },
  light: {
    easy: { label: "Piled at the Curb", copy: "Brush and debris already stacked roadside", cues: ["Ready to load on arrival"] },
    standard: { label: "Open Yard", copy: "Spread across an accessible yard", cues: ["Truck can back near the pile"] },
    hard: { label: "Back Yard or Slope", copy: "Behind a gate, uphill, or a long haul out", cues: ["Wheelbarrow distance", "Gates or grade changes"] },
  },
  heavy: {
    easy: { label: "Curb or Driveway", copy: "Debris staged where the truck parks", cues: ["Direct load, no carry"] },
    standard: { label: "Ground Level", copy: "Inside or out back, on one level", cues: ["Flat, short carry"] },
    hard: { label: "Stairs or Confined Space", copy: "Basement, upper floor, or tight jobsite", cues: ["Buckets and hand-carry", "Limited truck access"] },
  },
  commercial: {
    easy: { label: "Dock or Loading Zone", copy: "Staged at a dock or curbside dumpster pad", cues: ["Direct load from the pallet or pile"] },
    standard: { label: "Ground Floor Suite", copy: "Street-level space with a clear path out", cues: ["No elevator needed"] },
    hard: { label: "Upper Floor or Restricted", copy: "Elevator, freight schedule, or after-hours only", cues: ["COI and building rules", "Elevator or stair carry"] },
  },
}

/** Per-job copy for the types whose shared profile wording doesn't fit. */
const ACCESS_OVERRIDES: Partial<Record<JobId, AccessCopy>> = {
  appliances: {
    easy: { label: "Curb or Garage", copy: "Already disconnected and moved outside", cues: ["Unplugged and drained"] },
    standard: { label: "Kitchen or Laundry", copy: "In place on the ground floor, ready to pull", cues: ["Straight path to the door"] },
    hard: { label: "Basement or Upstairs", copy: "Down a flight, up a flight, or a tight galley", cues: ["Stair carry", "Doors narrower than the unit"] },
  },
  estate: {
    easy: { label: "Staged & Sorted", copy: "Everything's already pulled to the garage or curb", cues: ["Keep-items separated"] },
    standard: { label: "Room by Room", copy: "A single-level home we clear as we go", cues: ["Normal carry distance"] },
    hard: { label: "Multi-Level or Packed", copy: "Two-plus stories, attic, or heavily filled rooms", cues: ["Stairs on every trip", "Paths need clearing first"] },
  },
  hottub: {
    easy: { label: "Open Access", copy: "Wide gate or driveway right up to the tub", cues: ["Room to work around it"] },
    standard: { label: "Standard Back Yard", copy: "Through a gate with a normal carry out", cues: ["Standard 3-foot gate"] },
    hard: { label: "Deck or Enclosed", copy: "Built into a deck, or crane/fence removal needed", cues: ["Cut down in place", "No side-yard access"] },
  },
  storage: {
    easy: { label: "Drive-Up Unit", copy: "Roll-up door the truck can back to", cues: ["Load straight from the unit"] },
    standard: { label: "Interior Unit", copy: "Indoor hallway with cart access", cues: ["Short cart run"] },
    hard: { label: "Upper Floor Unit", copy: "Elevator run, or a packed floor-to-ceiling unit", cues: ["Elevator queue", "Unit packed tight"] },
  },
  office: {
    easy: { label: "Dock or Loading Zone", copy: "Staged at a dock we can back into", cues: ["Direct load"] },
    standard: { label: "Ground Floor Suite", copy: "Street-level office with a clear path out", cues: ["No elevator needed"] },
    hard: { label: "Upper Floor or After-Hours", copy: "Freight elevator, COI, or off-hours window", cues: ["Building rules apply", "Elevator scheduling"] },
  },
}

export function accessOptionsFor(id: JobId): AccessCopy {
  return ACCESS_OVERRIDES[id] ?? ACCESS_OPTIONS[getJob(id).profile]
}

// ─── What's included ─────────────────────────────────────────────────────────

export interface ServiceSpec {
  name: string
  subtitle: string
  features: string[]
}

const SERVICE_SPECS: Record<ProfileId, ServiceSpec> = {
  standard: {
    name: "Full-Service Junk Removal",
    subtitle: "We load it, haul it, and sweep up after",
    features: [
      "Two-person uniformed crew",
      "All lifting, carrying and loading",
      "Broom-clean sweep of the space",
      "Donation and recycling routing",
      "Disposal fees included in your price",
    ],
  },
  light: {
    name: "Yard Debris Hauling",
    subtitle: "Brush and green waste cleared and composted",
    features: [
      "Two-person uniformed crew",
      "Brush, branches, sod and clippings",
      "Rake-down of the work area",
      "Routed to green-waste composting",
      "Tipping fees included in your price",
    ],
  },
  heavy: {
    name: "Heavy Debris Hauling",
    subtitle: "Dense material handled with the right equipment",
    features: [
      "Crew sized to the material",
      "Concrete, brick, tile, soil and roofing",
      "Jobsite sweep on completion",
      "Routed to a C&D recycling facility",
      "Weight-based tipping fees included",
    ],
  },
  commercial: {
    name: "Commercial Cleanout",
    subtitle: "Scheduled around your business hours",
    features: [
      "Crew sized to the job",
      "Desks, cubicles, fixtures and e-waste",
      "Certificate of insurance on request",
      "After-hours and weekend windows",
      "Certified data-device destruction available",
    ],
  },
}

export function serviceSpecFor(id: JobId): ServiceSpec {
  return SERVICE_SPECS[getJob(id).profile]
}

// ─── Frequency ───────────────────────────────────────────────────────────────
//
// One-time is the default and by far the common case. Recurring hauling is for
// property managers, retail and restaurants; the per-pickup discount reflects the
// routed, predictable stop.

export const FREQUENCY_CONFIG: Record<
  FrequencyType,
  { label: string; short: string; pickupsPerMonth: number; discount: number; recurring: boolean }
> = {
  "one-time": { label: "One-Time Pickup", short: "Once", pickupsPerMonth: 1, discount: 1.0, recurring: false },
  monthly: { label: "Monthly", short: "1×/mo", pickupsPerMonth: 1, discount: 0.92, recurring: true },
  "2x-month": { label: "Twice a Month", short: "2×/mo", pickupsPerMonth: 2, discount: 0.88, recurring: true },
  weekly: { label: "Weekly", short: "Weekly", pickupsPerMonth: 4.33, discount: 0.82, recurring: true },
}

export const FREQUENCIES: FrequencyType[] = ["one-time", "monthly", "2x-month", "weekly"]
export const RECURRING_FREQUENCIES: FrequencyType[] = ["monthly", "2x-month", "weekly"]

// ─── Pricing helpers ─────────────────────────────────────────────────────────

export function roundNice(n: number): number {
  if (n <= 50) return Math.round(n / 5) * 5
  return Math.round(n / 5) * 5
}

export function rangeStr(low: number, high: number): string {
  if (low === high) return low.toLocaleString()
  return `${low.toLocaleString()} – $${high.toLocaleString()}`
}

export interface Quote {
  /** What a single pickup costs (the headline for one-time jobs). */
  perPickup: number
  perPickupLow: number
  perPickupHigh: number
  /** What the plan costs per month (only meaningful on recurring plans). */
  monthly: number
  monthlyLow: number
  monthlyHigh: number
  /** The minimum pickup price raised the low end above its computed value. */
  minApplied: boolean
  recurring: boolean
}

const ZERO_QUOTE: Quote = {
  perPickup: 0, perPickupLow: 0, perPickupHigh: 0,
  monthly: 0, monthlyLow: 0, monthlyHigh: 0,
  minApplied: false, recurring: false,
}

/**
 * Price a pickup from its volume. This is the one pricing entry point — the
 * estimator, the checkout summary and the confirmation receipt all read from it.
 */
export function getQuote(
  id: JobId,
  yards: number,
  access: AccessType,
  serviceLevel: ServiceLevelType,
  frequency: FrequencyType,
): Quote {
  if (!yards || yards <= 0) return ZERO_QUOTE

  const job = getJob(id)
  const [cleanRate, mixedRate] = YARD_RATES[job.profile]
  const freq = FREQUENCY_CONFIG[frequency]

  const multiplier =
    (job.priceMultiplier ?? 1) *
    ACCESS_MULTIPLIERS[access] *
    SERVICE_LEVEL_MULTIPLIERS[serviceLevel] *
    freq.discount

  const rawLow = (BASE_FEE + yards * cleanRate) * multiplier
  const rawHigh = (BASE_FEE + yards * mixedRate) * multiplier

  const perPickupLow = roundNice(Math.max(MINIMUM_PICKUP, rawLow))
  const perPickupHigh = roundNice(Math.max(MINIMUM_PICKUP, rawHigh))
  const perPickup = Math.round((perPickupLow + perPickupHigh) / 2)

  const p = freq.pickupsPerMonth
  return {
    perPickup,
    perPickupLow,
    perPickupHigh,
    monthly: Math.round(perPickup * p),
    monthlyLow: Math.round(perPickupLow * p),
    monthlyHigh: Math.round(perPickupHigh * p),
    // The floor bit: the computed low end came in under the minimum pickup price.
    minApplied: rawLow < MINIMUM_PICKUP,
    recurring: freq.recurring,
  }
}
