# JunkStart Junk Removal

An instant-quote booking prototype for JunkStart Junk Removal, built with Next.js 14,
TypeScript and Tailwind CSS. Cloned from the Anago commercial-cleaning estimator and
rebuilt around JunkStart's real pricing model: weight, measured on a certified onboard
scale, at a rate the local franchise sets.

## The flow

The homepage (`app/page.tsx`) asks **one question** and produces an honest price range
before anyone is dispatched.

1. **What does it look like?** Eight scenario cards, from "a few items" to "a whole house
   or worse", each carrying a weight band. Nobody knows what their junk weighs, but
   everybody recognises the pile that looks like theirs.
2. **A single flag row.** Mattress and tire steppers, which apply the market's per-item
   disposal surcharges, and an aggregates toggle for dirt, concrete, brick and tile.
3. **A live result.** The range appears as soon as a card is picked, alongside the scale
   promise: the estimate sets expectations, the scale sets the price.

Two escape hatches sit inside the same step. Customers who would rather list exactly what
they have can **tally their items**, which sums `ITEM_WEIGHTS` into a weight band and
overrides the card. Customers with **aggregates** get a callout instead of a number,
routing to photos or a free on-site look, because a pickup bed of dirt alone runs 2,000 lbs
and would make every household estimate on the page wrong.

Anything at or above `ON_SITE_THRESHOLD_LBS` (1,500 lbs) stops quoting online and books a
free walkthrough. That covers the XL card by definition, and the packed-garage and
storage-unit cards on their high bound.

From there: `/checkout` (add-ons, contact details, pickup address, date and arrival window)
and `/checkout/confirmation` (a printable receipt). Both read the same params the homepage
emits: `scenario`, `lowLbs`, `highLbs`, `mattressCount`, `tireCount`, `low`, `high`,
`minApplied`, `discountApplied`, `surcharges`.

Marketing routes: `/landing`, a standalone local-market page with its own nav and footer;
`/cleanouts`, a service landing for estate and property cleanouts whose primary CTA books
the on-site estimate, since a whole property is past the online-quote threshold by
definition; and `/lp/omaha/junk-removal`, a paid landing page with an embedded three-step
scheduling module (see **Frozen routes** below).

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
| "What the customer says → weight estimate" translation table | `SCENARIOS` | The one question on the homepage |
| Item weight table | `ITEM_WEIGHTS` + `lbsFromItems()` | The "tally your items" fallback |
| Fill-in-the-blank market box | `MarketConfig` + `MARKET` | `getQuote()`, resolved by ZIP in production |
| "How to build a quote" steps | `getQuote()` | Homepage, checkout, confirmation |

## Frozen routes

`app/lp/omaha/junk-removal/**` is **intentionally frozen** and must not be edited. It runs
on the legacy exports at the bottom of `lib/junk-data.ts` (`JOBS`, `Job`, `JobId`,
`ProfileId`), kept alive under a clearly marked banner for that page, `/contact`'s job
dropdown and `/landing/industries`. Nothing in the estimator may import from that block, and
the pricing machinery that once consumed it is gone.

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
