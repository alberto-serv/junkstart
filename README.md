# JunkStart Junk Removal

An instant-quote booking prototype for JunkStart Junk Removal, built with Next.js 14,
TypeScript and Tailwind CSS. Cloned from the Anago commercial-cleaning estimator and
rebuilt around JunkStart's real pricing model: weight, measured on a certified onboard
scale, at a rate the local franchise sets.

## The flow

The homepage (`app/page.tsx`) asks **one question** and produces an honest price range
before anyone is dispatched.

1. **How big is the job?** Four size cards, Small through XL, each carrying a weight band
   rolled up from the cheat sheet's translation table. Nobody knows what their junk weighs,
   but everybody knows whether it is a carload or a garage.
2. **A live result.** The result panel and the mobile price bar are on the page from the
   first paint: before a size is picked they prompt and point back at the cards, so there
   is always a CTA on screen. Picking a size swaps the prompt for the range, alongside the
   scale promise: the estimate sets expectations, the scale sets the price.

| Size | Weight band | Charlotte price |
| --- | --- | --- |
| Small | 50 to 400 lbs | $140 – $310 |
| Medium | 500 to 1,000 lbs | $365 – $540 |
| Large | 1,000 to 1,400 lbs | $540 – $720 |
| XL | 1,500 lbs and up | no price, requests a visit |

Large stops short of `ON_SITE_THRESHOLD_LBS` on purpose, and XL sits past it: a whole
property cannot be priced from a description, so that card requests a free visit instead
of quoting. `/checkout?book=1` is that path end to end, from **Request a Visit** through
the confirmation receipt.

The size cards are the whole estimator. The item tally and the mattress / tire /
aggregates step are gone from the page: the crew catches per-item surcharges and heavy
aggregate loads on site, where the certified scale settles the price anyway. `getQuote()`
still takes a `QuoteFlags` argument and still applies the market's surcharges, and
`ITEM_WEIGHTS` / `lbsFromItems()` are still exported, so any of that can come back without
touching the pricing math. The homepage passes `NO_FLAGS`.

Anything at or above `ON_SITE_THRESHOLD_LBS` (1,500 lbs) stops quoting online and requests
a free visit, which is the XL card by definition.

From there: `/checkout` (add-ons, contact details, pickup address, date and arrival window)
and `/checkout/confirmation` (a printable receipt). Both read the same params the homepage
emits: `scenario`, `lowLbs`, `highLbs`, `low`, `high`, `minApplied`, `discountApplied`,
`surcharges`. They still read `mattressCount` and `tireCount` when present, and default
both to zero.

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
| "How to build a quote" steps | `getQuote()` | Homepage, checkout, confirmation |

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
