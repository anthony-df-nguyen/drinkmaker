import type { Config } from "tailwindcss";
const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // ── Surfaces ──────────────────────────────────────────────────────────
        // Usage: bg-background, bg-surface, bg-surface-raised
        background:    "rgb(var(--color-background)    / <alpha-value>)",
        surface:       "rgb(var(--color-surface)       / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",

        // ── Borders ───────────────────────────────────────────────────────────
        // Usage: border-border, border-border-strong
        border:        "rgb(var(--color-border)        / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong) / <alpha-value>)",

        // ── Text ──────────────────────────────────────────────────────────────
        // Usage: text-foreground, text-muted, text-subtle
        foreground:    "rgb(var(--color-foreground)    / <alpha-value>)",
        muted:         "rgb(var(--color-muted)         / <alpha-value>)",
        subtle:        "rgb(var(--color-subtle)        / <alpha-value>)",

        // ── Accent (emerald) ──────────────────────────────────────────────────
        // Usage: bg-accent, hover:bg-accent-hover, text-accent-text
        //        bg-accent-subtle (tinted badge bg), text-accent-foreground (on filled btn)
        accent: {
          DEFAULT:    "rgb(var(--color-accent)            / <alpha-value>)",
          hover:      "rgb(var(--color-accent-hover)      / <alpha-value>)",
          foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
          subtle:     "rgb(var(--color-accent-subtle)     / <alpha-value>)",
          text:       "rgb(var(--color-accent-text)       / <alpha-value>)",
        },

        // ── Drink category tags ────────────────────────────────────────────────
        // Usage: bg-spirits-subtle text-spirits  (amber)
        //        bg-fruity-subtle  text-fruity   (rose)
        //        bg-refreshing-subtle text-refreshing (sky)
        spirits: {
          DEFAULT: "rgb(var(--color-spirits)        / <alpha-value>)",
          subtle:  "rgb(var(--color-spirits-subtle) / <alpha-value>)",
        },
        fruity: {
          DEFAULT: "rgb(var(--color-fruity)        / <alpha-value>)",
          subtle:  "rgb(var(--color-fruity-subtle) / <alpha-value>)",
        },
        refreshing: {
          DEFAULT: "rgb(var(--color-refreshing)        / <alpha-value>)",
          subtle:  "rgb(var(--color-refreshing-subtle) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
