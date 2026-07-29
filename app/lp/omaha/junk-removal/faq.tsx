"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { FAQS } from "./config"

/**
 * Single-open accordion, first item open on load so the section never reads as
 * an empty stack of headings. Answers keep a 64ch measure — the section fills
 * the page column, but a full-width line of body copy is unreadable.
 */
export function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <div>
      {FAQS.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 py-5 text-left font-display text-[16.5px] font-bold text-ink"
            >
              {item.q}
              <ChevronDown
                className={`ml-auto h-5 w-5 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-flame" : "text-muted-foreground"
                }`}
              />
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: isOpen ? 420 : 0 }}
            >
              <p className="max-w-[64ch] pb-5 text-[15px] leading-relaxed text-body">{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
