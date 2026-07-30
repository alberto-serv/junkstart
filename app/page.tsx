"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Scale, Shield, Star } from "lucide-react"
import { AvailabilityBanner } from "@/components/availability-banner"
import { useNextOpening } from "@/hooks/use-next-opening"
import { PHONE } from "@/lib/junk-data"

/* ============================================================
   Homepage.

   No estimator. The size question lives in the booking flow now
   (/checkout/estimate), and asking it here too meant asking the same question
   twice, two pages apart, with the second answer being the one that counted.
   It also pushed the CTA below a selector and a price panel, on a flow whose
   whole premise is that the calendar comes first.

   So this page has one job: say what JunkStart does differently, say when a
   truck can be here, and start the booking. Every control on it is the same
   control.
   ============================================================ */

export default function HomePage() {
  const router = useRouter()
  const slot = useNextOpening()

  const startBooking = () => router.push("/checkout")

  return (
    <div className="min-h-screen bg-background">

      <AvailabilityBanner onBook={startBooking} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-band-soft border-b border-line-soft">
        <div className="container mx-auto px-4 pt-14 pb-14 md:pt-[60px] md:pb-14">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="disp text-ink mx-auto max-w-[20ch] text-[clamp(34px,5.2vw,56px)]">
              The Most Accurate Way to Price Junk Removal.
            </h1>
            <p className="mt-[18px] text-body text-lg max-w-[58ch] mx-auto">
              Most companies charge by how full the truck looks. We charge by the actual weight of
              your items, so you pay a precise, verified price every time.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              {/* The soonest slot rides on the button, not just the banner at the
                  top of the page: by the time a customer has read the pitch the
                  banner is off screen, and "when can you come" is the question
                  standing between them and the click. */}
              <button
                type="button"
                onClick={startBooking}
                className="btn-flame flex-wrap justify-center text-base"
              >
                Book my pickup
                {slot && (
                  <span className="text-[13.5px] font-semibold opacity-75">
                    &middot; next opening {slot.short}
                  </span>
                )}
              </button>
              <p className="text-[13px] text-muted-foreground">
                Takes about two minutes. Nothing is charged today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How the price is set ───────────────────────────────────────
          The page's one explanatory section, and the closest thing left to the
          old estimator: it answers "how much" with the method rather than a
          number, because the number needs a size and the size is step 2. */}
      <section className="border-t border-border bg-white">
        <div className="container mx-auto px-4 py-12 md:py-14">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-[34px]">
              <h2 className="disp text-ink text-[clamp(24px,3.5vw,38px)]">
                How your price gets set
              </h2>
              <p className="text-sm text-muted-foreground mt-2.5 max-w-xl mx-auto">
                Three steps, no guessing, and no number you have to take our word for.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <HowStep
                step={1}
                title="Book your window"
                copy="Pick the day and arrival window that works. The crew confirms your exact time the morning of."
              />
              <HowStep
                step={2}
                title="Size your load"
                copy="Small through XL, with the examples right on the card. You see your all-in range before you commit."
              />
              <HowStep
                step={3}
                title="We weigh it on site"
                copy="Every truck carries a certified onboard scale. You see the same number it does, before anything is loaded."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <TrustItem icon={Shield} title="Licensed & Insured" text="Background-checked, uniformed crews" />
            <TrustItem icon={Star} title="Donate & Recycle First" text="We keep usable items out of the landfill" />
            <TrustItem icon={Scale} title="Weighed, Not Guessed" text={`Certified onboard scale. Call ${PHONE}`} />
          </div>
        </div>
      </section>

      {/* ── Mobile CTA bar ─────────────────────────────────────────────
          Anchored for the whole page on a phone. The shared footer carries
          matching bottom padding on this route so the bar never covers it. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-6px_24px_rgba(21,38,68,0.14)] backdrop-blur lg:hidden">
        <button type="button" onClick={startBooking} className="btn-flame w-full flex-wrap justify-center text-base">
          Book my pickup
          {slot && (
            <span className="text-[13px] font-semibold opacity-75">
              &middot; next opening {slot.short}
            </span>
          )}
        </button>
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-body mb-4">Bigger job, or not sure what it falls under?</p>
            <button className="btn-ghost-brand text-base" onClick={() => router.push("/contact")}>
              Get in touch
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HowStep({ step, title, copy }: { step: number; title: string; copy: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <span className="step-num">{step}</span>
      <p className="disp text-ink text-[19px] mt-3.5">{title}</p>
      <p className="text-[13.5px] leading-relaxed text-body mt-2">{copy}</p>
    </div>
  )
}

function TrustItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon className="w-[26px] h-[26px] text-flame mb-1.5" />
      <p className="font-bold text-ink text-[15px]">{title}</p>
      <p className="text-[13px] text-muted-foreground">{text}</p>
    </div>
  )
}
