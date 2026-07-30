# JunkStart Junk Removal

An instant-quote booking prototype for JunkStart Junk Removal, built with Next.js 14,
TypeScript and Tailwind CSS. Cloned from the Anago commercial-cleaning estimator and
rebuilt around JunkStart's real pricing model: weight, measured on a certified onboard
scale, at a rate the local franchise sets.

## The flow

Booking runs **calendar first, price second**. Availability is what a customer is shopping
for and the thing most likely to lose them, so the flow reserves the window before it
prices anything; pricing a job for someone who cannot get a truck this week is wasted work.

1. **Homepage** (`app/page.tsx`) — an availability banner at the very top, the pitch, how
   the price gets set, and **Book my pickup**. No estimator: the size question belongs to
   step 2, and asking it here too meant asking the same question twice, two pages apart,
   with the second answer being the one that counted. Every control on the page starts the
   same flow.
2. **`/checkout`** (step 1 of 2) — day and arrival window, then name, email, mobile,
   pickup address and access notes. No prices anywhere on this page.
3. **`/checkout/estimate`** (step 2 of 2) — the reserved window in a summary card, the four
   size cards (the only place the size is asked), the add-ons, and the running all-in
   total. **Book my pickup** commits.
4. **`/checkout/confirmation`** — a printable receipt.

| Size | Looks like | Weight band | Charlotte price |
| --- | --- | --- | --- |
| Small | Couch and recliner · mattress set · single closet cleanout | 50 to 400 lbs | $140 – $310 |
| Medium | Bedroom of furniture · small garage cleanout · appliance haul | 500 to 1,000 lbs | $365 – $540 |
| Large | Packed single-car garage · full living room · 10x10 storage unit | 1,000 to 1,400 lbs | $540 – $720 |
| XL | Whole-house cleanout · estate or downsizing job · post-construction site | 1,500 lbs and up | priced on site |

Those examples ship on the cards themselves, as `Scenario.examples`. "Medium" means nothing
on its own, and a customer left to interpret it rounds their own job down.

Large stops short of `ON_SITE_THRESHOLD_LBS` on purpose and XL sits past it, so XL never
quotes. Under the old order that meant a separate "request a visit" flow; under this one it
is just a booking whose price is settled on arrival, which is the same truck on the same
day either way.

The size cards are the whole estimator. The item tally and the mattress / tire / aggregates
step are gone: the crew catches per-item surcharges and heavy aggregate loads on site,
where the certified scale settles the price anyway. `getQuote()` still takes a `QuoteFlags`
argument and still applies the market's surcharges, and `ITEM_WEIGHTS` / `lbsFromItems()`
are still exported, so any of that can come back without touching the pricing math. Both
callers pass `NO_FLAGS`.

### What each step hands the next

State lives in the query string, so any step is linkable and refresh-safe.

| Hop | Carries |
| --- | --- |
| Home → `/checkout` | nothing. `/checkout` still reads `?scenario=` and passes it through, so a campaign link can preselect a size |
| `/checkout` → `/checkout/estimate` | `scenario`, `visitDate`, `visitTime`, `address`, `accessNotes`, `customerName`, `customerEmail`, `phone` |
| `/checkout/estimate` → `/checkout/confirmation` | all of the above plus `scenarioLabel`, `lowLbs`, `highLbs`, `low`, `high`, `minApplied`, `discountApplied`, `surcharges`, `addOns`, `addOnsTotal`, `totalLow`, `totalHigh` |

The receipt still reads `mattressCount` and `tireCount` when present and defaults both to
zero, so an old link still renders.

`lib/schedule.ts` owns every date: `TIME_SLOTS`, `getAvailableDates()` (Mon–Sat, starting
tomorrow), and `nextOpening()` for the banner and both **Book my pickup** buttons, which
carry "· next opening Tomorrow, 8AM" beside the label. Components read it through
`useNextOpening()`, never directly: nothing in `schedule.ts` may be called during render.
These routes are statically prerendered, so a date computed at render time is baked at
build time and would tell an August visitor about a July opening. The banner and the date
strip both resolve in an effect and render a placeholder until they do.

One marketing route ships alongside the estimator: `/lp/omaha/junk-removal`, a paid
landing page with an embedded three-step scheduling module that books a pickup window
without ever showing a price.

## Pricing model

All pricing lives in `lib/junk-data.ts` behind a single entry point, `getQuote()`:

```
price(lbs) = pickupFee + lbs × rate(lbs)
```

evaluated independently for the low and high bounds of the weight band, then floored at the
market minimum and topped up with per-item surcharges. `rate(lbs)` drops to the discounted
rate once a bound crosses `volumeDiscount.atLbs`, and that cheaper rate reprices the **whole
ticket**, not just the pounds above the threshold.

Three details worth knowing:

- The **market minimum** is a flat price, not a floor under the per-pound math. A job at or
  under `minimum.upToLbs` quotes `minimum.flatPrice` outright.
- Both bounds are rounded with `roundNice`, which snaps to the nearest $5. A $139 minimum
  therefore displays as $140.
- **Aggregates** never produce a price at all. They short-circuit to `onSiteRequired`.

### MarketConfig

`MarketConfig` is the whole pitch in one object, and it mirrors the fill-in-the-blank box on
the JunkStart franchise cheat sheet. An owner fills in their trip fee, per-pound rate,
minimum and surcharges, and the estimator prices their market correctly without a line of
code changing:

```ts
export const MARKET: MarketConfig = {
  marketName: "Charlotte, NC",
  pickupFee: 89,
  perLbRate: 0.55,
  minimum: { upToLbs: 150, flatPrice: 139 },
  volumeDiscount: { atLbs: 1000, perLbRate: 0.45 },
  mattressSurcharge: 20,
  tireSurcharge: 10,
}
```

In production this resolves from the customer's ZIP via **ServiceMinder**, which already
owns territory-to-franchise mapping, so a single deployment quotes every market from that
market's own card. The constant above is Charlotte, standing in until that lookup is wired
up. `getQuote()` takes the market as its last argument and defaults to `MARKET`, so swapping
in a resolved one is a one-line change at the call site.

### Cheat-sheet lineage

Every table in `lib/junk-data.ts` comes from the franchise cheat sheet, which is why the
weights are national and only the prices are local:

| Cheat sheet | Code | Used by |
| --- | --- | --- |
| "What the customer says → weight estimate" translation table | `SCENARIOS`, rolled up into three sizes | The one question on the homepage |
| Item weight table | `ITEM_WEIGHTS` + `lbsFromItems()` | Nothing on the page today, kept for the tally |
| Fill-in-the-blank market box | `MarketConfig` + `MARKET` | `getQuote()`, resolved by ZIP in production |
| "How to build a quote" steps | `getQuote()` | Homepage, /checkout/estimate, confirmation |

## Legacy exports

`app/lp/omaha/junk-removal/**` runs on the legacy exports at the bottom of
`lib/junk-data.ts` (`JOBS`, `Job`, `JobId`, `ProfileId`, `TRUCK_CAPACITY`), kept alive under
a clearly marked banner for that page and `/contact`'s job dropdown. Nothing in the
estimator may import from that block, and the pricing machinery that once consumed it is
gone. Treat that route as change-on-request only: it has been tuned by hand and does not
follow the weight flow.

## Branding

Brand tokens live in `tailwind.config.ts` and `app/globals.css`:

| Token   | Hex       | Role                                     |
| ------- | --------- | ---------------------------------------- |
| `brand` | `#1863DC` | JunkStart blue, primary CTA and selection |
| `flame` | `#F15D2A` | JunkStart orange, links, accents, CTAs   |
| `sand`  | `#E9E1CC` | Secondary wash                           |
| `ink`   | `#474747` | Headings and body text                   |

Poppins is the display face (headings, buttons, card titles); Open Sans is the text face.
Both load via `next/font` in `app/layout.tsx`.

Copy rule: no em dashes in customer-facing strings. Use commas, periods or middots.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run type-check
```
