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
        // Brand washes — sand (secondary) into a cool blue tint
        "brand-band": "linear-gradient(100deg,#F6F1E2 0%,#FFFFFF 52%,#E4EDFB 100%)",
        "brand-band-soft": "linear-gradient(100deg,#FBF8EF 0%,#FFFFFF 50%,#F0F5FD 100%)",
        "brand-select": "linear-gradient(180deg,#FFF7F3,#FFF1EA)",
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
