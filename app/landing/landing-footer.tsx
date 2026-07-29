import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Phone } from "lucide-react"
import { PHONE, PHONE_TEL } from "@/lib/junk-data"

const COL_ONE = ["Home", "Residential Junk Removal", "Commercial Hauling", "Contact Us"]
const COL_TWO = ["Franchising", "Our Blog", "About Us"]

export function LandingFooter() {
  return (
    <footer className="bg-brand text-[#c3d5f7]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-14 md:px-8">
        <div className="grid gap-10 border-b border-white/[0.16] pb-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="max-w-[320px]">
            <Image
              src="/images/logo-white.svg"
              alt="JunkStart Junk Removal"
              width={135}
              height={69}
              className="h-12 w-auto"
            />
          </div>

          {/* Link columns */}
          <ul className="space-y-3 text-sm">
            {COL_ONE.map((l) => (
              <li key={l}>
                <Link href="#" className="uppercase tracking-[0.03em] transition-colors hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-3 text-sm">
            {COL_TWO.map((l) => (
              <li key={l}>
                <Link href="#" className="uppercase tracking-[0.03em] transition-colors hover:text-white">
                  {l}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={PHONE_TEL}
                className="flex items-center gap-2 font-semibold text-white transition-colors hover:text-[#dfeaFB]"
              >
                <Phone className="h-4 w-4" />
                {PHONE}
              </a>
            </li>
            <li className="flex items-center gap-3 pt-1">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-flame"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </li>
          </ul>

          {/* Diversion mark */}
          <div className="flex items-start justify-start md:justify-end">
            <div className="text-center">
              <div className="disp text-[64px] leading-none text-white">60%</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#dfeaFB]">
                Of Every Load
                <br />
                Donated or Recycled
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-8 text-[11px] leading-relaxed text-[#9fbcee]">
          Disclaimer: JunkStart locations are independently owned and operated. Pricing shown by the
          online estimator is a good-faith estimate based on the volume, access and material you
          describe; the crew confirms the final all-in price on site before any items are loaded.
          Service availability, disposal surcharges and scheduling windows vary by market. All
          information on this website is subject to change.
        </p>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/[0.16] pt-6 text-[12px] text-[#9fbcee] md:flex-row">
          <p>&copy; {new Date().getFullYear()} All Rights Reserved JunkStart Junk Removal &reg;</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {["Privacy Policy", "Terms & Conditions", "Accessibility", "Sitemap"].map((l) => (
              <Link key={l} href="#" className="transition-colors hover:text-[#dfeaFB]">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
