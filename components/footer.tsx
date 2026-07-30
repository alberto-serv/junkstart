import Link from "next/link"
import Image from "next/image"
import { PHONE, PHONE_TEL, SERVICE_CITY } from "@/lib/junk-data"

/**
 * `bottomBarSpace` adds mobile bottom padding for routes that render a fixed
 * bottom bar. The padding has to live here rather than on the page, because the
 * footer sits outside the page's root and nothing inside it can push the end of
 * the document clear of a fixed element.
 *
 * Sized for the tallest of those bars: /checkout/estimate stacks a running-total
 * row above its button, and both bars' labels wrap to two lines on a narrow
 * phone. 104px cleared neither, so the last footer line sat under the bar.
 */
export function Footer({ bottomBarSpace = false }: { bottomBarSpace?: boolean }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bg-charcoal text-[#b4b4b6] ${bottomBarSpace ? "pb-[136px] lg:pb-0" : ""}`}>
      <div className="container mx-auto px-6 py-14 md:px-8">
        <div className="flex flex-wrap justify-between gap-10 border-b border-white/[0.16] pb-8">
          <div className="max-w-[420px]">
            <Link href="/" className="inline-block rounded-[6px]">
              <Image
                src="/images/logo-white.svg"
                alt="JunkStart Junk Removal"
                width={135}
                height={69}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-[18px] text-sm leading-relaxed text-[#b4b4b6]">
              Upfront pricing, uniformed crews, and same-week pickups. We haul furniture,
              appliances, construction debris, and whole-property cleanouts for homes and
              businesses across {SERVICE_CITY}, and we donate or recycle everything we can.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="eyebrow text-white">Contact</h5>
            <p className="text-sm text-[#d4d4d5]">{SERVICE_CITY}</p>
            <p className="text-sm">
              <a href={PHONE_TEL} className="font-semibold text-white hover:text-flame transition-colors">
                {PHONE}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-[22px] flex flex-col items-center justify-between gap-3 text-[12.5px] text-[#8e8e90] md:flex-row">
          <p>&copy; {currentYear} JunkStart Junk Removal. All rights reserved.</p>
          {/* Wraps: the three items are ~345px side by side, wider than a
              375px phone's content box, so on one line they pushed the whole
              document into a horizontal scroll. */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            <Link href="https://junkstart.com/privacy-policy/" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="https://junkstart.com/terms-of-use/" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://www.goserv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-80 transition-opacity hover:opacity-100"
            >
              <span>Powered by</span>
              <Image
                src="/serv-logo.png"
                alt="Serv"
                width={48}
                height={18}
                className="h-[14px] w-auto brightness-0 invert"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
