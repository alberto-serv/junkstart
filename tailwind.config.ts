import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-open-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // ── JunkStart brand palette (raw hexes from the brand guidelines) ──
        // brand = JunkStart Blue #1863DC · flame = JunkStart Orange #F15D2A
        brand: { DEFAULT: "#1863DC", deep: "#124CAB", ink: "#0E357A" },
        flame: { DEFAULT: "#F15D2A", deep: "#D14A1B" },
        sand: { DEFAULT: "#E9E1CC", soft: "#F4EFE2" },
        ink: "#474747",
        body: "#5A5A5A",
        line: { DEFAULT: "#E3E1DE", soft: "#EDEBE8" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // The brand's primary button is a near-square 2px corner.
        btn: "2px",
        pill: "999px",
      },
      backgroundImage: {
        // Brand washes.
        //
        // Deliberately NOT the inherited three-stop diagonal cross-fade
        // (warm -> white -> cool on a 100deg axis). That soft pastel sweep reads
        // as the brand it came from no matter which hexes are plugged into it.
        //
        // JunkStart is high contrast and two-colour: bold blue, hot orange, on a
        // #F7F6F6 page. So these are corner glows of the two brand hues over the
        // brand page colour, which puts both on screen and keeps the middle of
        // the band clean for text.
        "brand-band":
          "radial-gradient(560px 260px at 100% 0%, rgba(241,93,42,0.22), transparent 64%), radial-gradient(480px 250px at 0% 100%, rgba(24,99,220,0.15), transparent 62%), linear-gradient(135deg,#FFFFFF 0%,#F3F6FC 100%)",
        "brand-band-soft":
          "radial-gradient(1150px 500px at 8% -18%, rgba(24,99,220,0.20), transparent 64%), radial-gradient(880px 460px at 96% -12%, rgba(241,93,42,0.18), transparent 66%), linear-gradient(180deg,#FFFFFF 0%,#F5F4F4 100%)",
        // Selected state: a flame tint with enough saturation to read as chosen
        // next to the 2px flame border, rather than an off-white.
        "brand-select": "linear-gradient(180deg,#FFF3EC 0%,#FFE6D9 100%)",
      },
      boxShadow: {
        "brand-sm": "0 6px 20px rgba(24,99,220,.07)",
        brand: "0 18px 50px rgba(24,99,220,.10)",
        "flame-glow": "0 8px 22px rgba(241,93,42,.28)",
        // Brand secondary button — a 4px inset flame ring, no drop shadow.
        "flame-inset": "inset 0 0 0 4px #F15D2A",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
