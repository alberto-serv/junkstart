"use client"

import type { Scenario } from "@/lib/junk-data"

/**
 * Two layouts from one card. On desktop the four sit side by side: size on top,
 * examples as the body, weight band alone in a footer under a hairline, all four
 * footers on one line because the card is h-full and the list is flex-1.
 *
 * On a phone they stack full width instead of squeezing into two columns, which
 * is what made the row ragged: at half a phone's width every second example
 * wrapped, so no two cards were the same height and the bands landed wherever.
 * Full width fits every example on one line, and the band moves up beside the
 * size, where it reads as that size's price of entry rather than a footnote.
 */
export function ScenarioCard({ scenario, selected, onClick }: { scenario: Scenario; selected: boolean; onClick: () => void }) {
  const hint = scenario.onSiteOnly
    ? "We come look, free"
    : `~${scenario.lowLbs.toLocaleString()} to ${scenario.highLbs.toLocaleString()} lbs`
  const hintTone = selected ? "text-flame" : "text-muted-foreground"
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border-2 p-4 text-left transition-all duration-150 md:p-5 md:hover:-translate-y-0.5 ${
        selected
          ? "border-flame bg-brand-select shadow-[0_10px_26px_rgba(241,93,42,0.18)]"
          : "border-line bg-white hover:border-[#c4c1bc] hover:shadow-brand-sm"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className={`disp text-[19px] leading-none ${selected ? "text-flame" : "text-ink"}`}>
          {scenario.label}
        </span>
        {/* Mobile only. Desktop keeps it in the footer so the four line up. */}
        <span className={`text-[12px] font-bold md:hidden ${hintTone}`}>{hint}</span>
      </div>

      {/* The examples are the card's real content: they are what a customer
          matches their own pile against, so they get the line height. */}
      <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-[13px] leading-snug text-body md:mt-3.5">
        {scenario.examples.map((ex) => (
          <li key={ex} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className={`mt-[6px] h-1 w-1 shrink-0 rounded-full ${selected ? "bg-flame" : "bg-brand"}`}
            />
            <span>{ex}</span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-4 hidden border-t pt-3 text-[12px] font-bold md:block ${
          selected ? "border-flame/25 text-flame" : "border-line-soft text-muted-foreground"
        }`}
      >
        {hint}
      </div>
    </button>
  )
}
