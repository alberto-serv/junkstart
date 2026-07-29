# JunkStart Junk Removal

An instant-quote booking prototype for JunkStart Junk Removal, built with Next.js 14,
TypeScript and Tailwind CSS. Cloned from the Anago commercial-cleaning estimator and
rebuilt around junk removal's volume-based pricing reality.

## The flow

The homepage (`app/page.tsx`) is a five-step estimator that produces a real, all-in price
before anyone is dispatched:

1. **What are we hauling away?** — 12 job types (furniture, appliances, cleanouts,
   construction debris, yard waste, e-waste, commercial, heavy debris…), plus an
   "something else" path that routes to a custom quote.
2. **How much is there?** — a 1 → 16 cubic-yard slider against a 16 cu yd truck, labelled
   in truck fractions ("about ½ a truck") with a live fill gauge. Customers who don't
   think in cubic yards can tally their items instead and we compute the volume for them.
3. **Who's doing the loading?** — full-service vs. curbside (15% off; the crew never
   leaves the truck).
4. **Where is it right now?** — curb / ground floor / stairs-and-tight-access, with copy
   tailored per job type.
5. **Just this once, or on a schedule?** — one-time, monthly, twice-monthly or weekly, for
   commercial routed pickups.

From there: `/checkout` (add-ons, contact details, pickup address, date + arrival window)
and `/checkout/confirmation` (a printable receipt).

Two marketing routes ship alongside it: `/landing` — a standalone local-market page with
its own nav and footer — and `/cleanouts`, a service landing for estate and property
cleanouts that deep-links back into the estimator with the job type pre-selected.

## Pricing model

All pricing lives in `lib/junk-data.ts` behind a single entry point, `getQuote()`. Junk
removal prices on volume, not time:

```
per-pickup = (BASE_FEE + cubic yards × per-yard rate)
           × job multiplier × access × service level × frequency discount
```

floored at a minimum pickup price. Each material profile (`standard`, `light`, `heavy`,
`commercial`) carries **two** per-yard rates — a clean, well-sorted load and a mixed,
awkward one — which produce the low and high ends of the range shown throughout the UI.

Job types map to a profile rather than carrying hand-written config, so adding a new one
is a single row in `JOBS`.

## Branding

Brand tokens live in `tailwind.config.ts` and `app/globals.css`:

| Token   | Hex       | Role                                    |
| ------- | --------- | --------------------------------------- |
| `brand` | `#1863DC` | JunkStart blue — primary CTA, selection |
| `flame` | `#F15D2A` | JunkStart orange — links, accents, CTAs |
| `sand`  | `#E9E1CC` | Secondary wash                          |
| `ink`   | `#474747` | Headings and body text                  |

Poppins is the display face (headings, buttons, card titles); Open Sans is the text face.
Both load via `next/font` in `app/layout.tsx`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run type-check
```
