import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        base: "rgb(var(--color-base) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-hover": "#83a8ff",
        "accent-soft": "#202b42",
        "on-accent": "#0c1730",
        warn: "#ebc078",
        "warn-soft": "#332b1e",
        success: "#76d9aa",
        "success-soft": "#1a302b",
        danger: "#f3a1ad",
        "danger-soft": "#37232d",
        info: "#b9acfa",
        "info-soft": "#29253d"
      }
    }
  },
  plugins: []
};

export default config;
