import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0284c7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f0f9ff",
          foreground: "#0284c7",
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
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff",
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
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        blob1: {
          "0%, 100%": {
            transform: "translate(var(--tx-1, 0), var(--ty-1, 0))",
          },
          "33%": {
            transform: "translate(var(--tx-2, 0), var(--ty-2, 0))",
          },
          "66%": {
            transform: "translate(var(--tx-3, 0), var(--ty-3, 0))",
          },
        },
        blob2: {
          "0%, 100%": {
            transform: "translate(var(--tx-2, 0), var(--ty-2, 0))",
          },
          "33%": {
            transform: "translate(var(--tx-3, 0), var(--ty-3, 0))",
          },
          "66%": {
            transform: "translate(var(--tx-4, 0), var(--ty-4, 0))",
          },
        },
        blob3: {
          "0%, 100%": {
            transform: "translate(var(--tx-3, 0), var(--ty-3, 0))",
          },
          "33%": {
            transform: "translate(var(--tx-4, 0), var(--ty-4, 0))",
          },
          "66%": {
            transform: "translate(var(--tx-1, 0), var(--ty-1, 0))",
          },
        },
        blob4: {
          "0%, 100%": {
            transform: "translate(var(--tx-4, 0), var(--ty-4, 0))",
          },
          "33%": {
            transform: "translate(var(--tx-1, 0), var(--ty-1, 0))",
          },
          "66%": {
            transform: "translate(var(--tx-2, 0), var(--ty-2, 0))",
          },
        },
        border: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-x": "gradient-x 15s ease infinite",
        "blob1": "blob1 20s infinite",
        "blob2": "blob2 20s infinite",
        "blob3": "blob3 20s infinite",
        "blob4": "blob4 20s infinite",
        "border": "border 4s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;