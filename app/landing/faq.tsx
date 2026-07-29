"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQS = [
  {
    q: "How much does junk removal cost?",
    a: "Junk removal is priced by volume — how much of the truck your pile fills — plus how hard it is to get out. Our truck holds 16 cubic yards, and a typical half-truck household load runs a few hundred dollars all in. The online estimator gives you a real number in about two minutes, and loading, hauling and disposal are all included in it.",
  },
  {
    q: "Do I have to move everything outside first?",
    a: "No. Full-service is the default: the crew carries everything out of the garage, basement, or upstairs bedroom for you. If your pile is already at the curb, choose curbside pickup in the estimator and you'll save 15% — we just load and go.",
  },
  {
    q: "What won't you take?",
    a: "We can't accept hazardous material: paint, solvents, motor oil, pesticides, asbestos, propane tanks or medical waste. Almost everything else is fair game — furniture, appliances, electronics, construction debris, yard waste, hot tubs and whole-property cleanouts.",
  },
  {
    q: "What happens to my stuff after you haul it?",
    a: "Anything still usable goes to a local charity partner, and we'll send you the itemized donation receipt. Metal, electronics, cardboard and construction debris are routed to recyclers. Only what's genuinely spent goes to the landfill — across our loads that works out to roughly 40%.",
  },
  {
    q: "How soon can you come out?",
    a: "Most pickups are booked within two to three days, and same-day and next-day slots are often available when a route has room. Pick your date and arrival window when you book; the crew texts you when they're 30 minutes out.",
  },
  {
    q: "Is the estimate the price I actually pay?",
    a: "It's an honest estimate, not a bait number. The crew confirms the final all-in price on site before anything goes on the truck — and if the pile turns out smaller than you described, you pay less. Nothing is charged when you book.",
  },
]

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {FAQS.map((item, i) => (
        <AccordionItem key={item.q} value={`item-${i}`} className="border-line">
          <AccordionTrigger className="py-5 text-left hover:no-underline">
            <span className="flex items-center gap-3">
              <span className="font-semibold text-flame">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="text-[15px] font-semibold text-ink">{item.q}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pl-9 text-[15px] leading-relaxed text-body">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
