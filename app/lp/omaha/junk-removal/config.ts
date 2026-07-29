/* ============================================================
   Omaha × Junk Removal landing page — market config and page constants.

   Everything market-specific lives here so spinning up the next city is a copy
   of this file plus a route folder, not a rewrite of the page.
   ============================================================ */

/**
 * ONE content column for the whole page.
 *
 * The header, ribbon, hero, booking module, every section heading, the FAQ and
 * the footer all derive their width from this single constant, so they share one
 * left and one right edge. Mixing per-section container widths is what produces
 * the staircase of left edges that reads as sloppy on a wide viewport.
 */
export const WRAP = "mx-auto w-full max-w-[1160px] px-5 md:px-6"

/** Anchor id on the booking module; the sticky bar and every CTA target it. */
export const BOOKING_ID = "book"

export function scrollToBooking() {
  const el = document.getElementById(BOOKING_ID)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" })
}

/* ---- Location (NAP + market proof) ---- */
export const loc = {
  slug: "omaha",
  city: "Omaha",
  state: "NE",
  email: "omaha@junkstart.com",
  hours: "Mon–Sat, 7AM–6PM",
  nextSlot: "Next opening: tomorrow, 8AM",
  // LAUNCH-GATE: rating, review count, start year and license number are
  // placeholders. Confirm each with the franchisee before sending paid traffic.
  reviewRating: 4.9,
  reviewCount: 412,
  sinceYear: 2018,
  licenseLine: "Licensed & insured · NE #JR-XXXXX",
  gbpUrl: "https://www.google.com/maps/search/junk+removal+omaha",
  serviceArea: [
    "Downtown & Old Market",
    "Dundee & Benson",
    "Aksarben & Elmwood Park",
    "Millard",
    "West Omaha & Elkhorn",
    "Papillion & La Vista",
    "Bellevue & Offutt",
    "Council Bluffs, IA",
  ],
}

export const brand = {
  ctaLabel: "Book my pickup",
  // LAUNCH-GATE: this guarantee is drafted copy, not a confirmed JunkStart
  // policy. Confirm the real terms before launch — do not run an unverified
  // guarantee in a paid ad.
  guarantee: {
    title: "The JunkStart Price Promise",
    body: "The crew quotes your all-in price on site before a single item goes on the truck. If the pile turns out smaller than you described, you pay less. If you don't like the number, we drive away and you owe nothing.",
  },
}

/* ---- Hero "what's included" bullets (replace a paragraph subhead) ---- */
export const HERO_INCLUDES = [
  "We carry it out — stairs, basements, attics and all",
  "Loading, hauling and disposal in one price",
  "Donated or recycled first, landfill last",
]

/* ---- Reviews. LAUNCH-GATE: curated placeholders, not real customer quotes. --- */
export const REVIEWS = [
  {
    quote: "Booked a window at 9pm and had a crew here the next morning. Two guys cleared the whole basement in under an hour and swept up after.",
    name: "Marcus D.",
    area: "Benson",
    stars: 5,
  },
  {
    quote: "They quoted me on site, it came in under what I expected, and they took the old fridge and the treadmill nobody else would touch.",
    name: "Angela R.",
    area: "Papillion",
    stars: 5,
  },
  {
    quote: "Cleared my mom's house for the estate sale in one day. They sorted the donations and got me the receipt without me asking.",
    name: "Tom K.",
    area: "West Omaha",
    stars: 5,
  },
]

/* ---- FAQ. Local to this page and deliberately price-free: a paid landing page
   whose module never shows a number shouldn't discuss dollar amounts either. --- */
export const FAQS = [
  {
    q: "How does pricing work if I don't see a price here?",
    a: "Junk removal is priced by volume — how much of the truck your pile actually fills — and there's no honest way to know that until someone sees it. So the crew looks at the pile, quotes you an all-in number on the spot, and waits for your yes before anything is loaded. Booking here costs nothing and commits you to nothing.",
  },
  {
    q: "Do I have to move everything outside first?",
    a: "No. Full-service is the default: the crew carries everything out of the garage, basement, attic or upstairs bedroom for you. If your pile is already at the curb, mention it in the item list — curbside jobs are cheaper and we'll reflect that in the on-site quote.",
  },
  {
    q: "What won't you take?",
    a: "We can't accept hazardous material: paint, solvents, motor oil, pesticides, asbestos, propane tanks or medical waste. Almost everything else is fair game — furniture, appliances, electronics, construction debris, yard waste, hot tubs and whole-property cleanouts.",
  },
  {
    q: "How soon can you come out?",
    a: "Most Omaha pickups land within two to three days, and same-day slots open up regularly when a route has room. Crews run Monday through Saturday. Pick your day and window when you book and dispatch will call to confirm.",
  },
  {
    q: "Do I need to be there?",
    a: "Only if the items are inside. For curbside or garage pickups you can leave instructions in the item list and we'll text you photos when the job is done. For anything inside the home, we ask that an adult be on site to point at what goes.",
  },
  {
    q: "What happens to my stuff after you haul it?",
    a: "Anything still usable goes to an Omaha-area charity partner, and we'll send the itemized donation receipt. Metal, electronics, cardboard and construction debris are routed to recyclers. Only what's genuinely spent goes to the landfill.",
  },
]
