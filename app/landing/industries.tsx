"use client"

import { useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { JOBS } from "@/lib/junk-data"

export function Industries() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" })
  }

  const jobs = JOBS.filter((j) => !j.consultationOnly)

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-3xl text-ink md:text-4xl">What We Haul Away</h2>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-brand hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {jobs.map((job) => {
          const Icon = job.icon
          return (
            <div key={job.id} className="w-[220px] shrink-0 snap-start">
              <div className="flex h-[150px] items-center justify-center rounded-lg border border-line bg-sand-soft">
                <Icon className="h-12 w-12 text-brand" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-center text-sm font-semibold uppercase tracking-[0.03em] text-ink">
                {job.shortName}
              </p>
              <p className="mt-1 text-center text-[12px] leading-snug text-muted-foreground">
                {job.tagline}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
