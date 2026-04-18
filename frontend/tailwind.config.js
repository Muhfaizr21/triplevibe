/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
        // Essential Shadcn UI color mappings
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },

        // Monolith brand colors - prefixed to mn-* to prevent collisions
        "mn-inverse-primary": "#afc8f0",
        "mn-tertiary": "#110200",
        "mn-tertiary-fixed-dim": "#fdb69a",
        "mn-on-secondary-container": "#616363",
        "mn-primary-container": "#001f3f",
        "mn-on-error-container": "#93000a",
        "mn-outline-variant": "#c4c6cf",
        "mn-outline": "#74777f",
        "mn-tertiary-container": "#391303",
        "mn-surface-container-highest": "#e1e3e4",
        "mn-on-surface": "#191c1d",
        "mn-on-tertiary-fixed": "#351002",
        "mn-surface-container-lowest": "#ffffff",
        "mn-on-tertiary-container": "#b5785f",
        "mn-inverse-surface": "#2e3132",
        "mn-secondary-container": "#dfe0e0",
        "mn-surface": "#f8f9fa",
        "mn-surface-variant": "#e1e3e4",
        "mn-on-secondary-fixed-variant": "#454747",
        "mn-primary-fixed": "#d4e3ff",
        "mn-on-tertiary-fixed-variant": "#6b3a25",
        "mn-surface-tint": "#476083",
        "mn-primary": "#000613",
        "mn-on-surface-variant": "#43474e",
        "mn-on-primary-fixed": "#001c3a",
        "mn-on-secondary-fixed": "#1a1c1c",
        "mn-on-background": "#191c1d",
        "mn-inverse-on-surface": "#f0f1f2",
        "mn-surface-container-high": "#e7e8e9",
        "mn-secondary-fixed": "#e2e2e2",
        "mn-tertiary-fixed": "#ffdbce",
        "mn-surface-container-low": "#f3f4f5",
        "mn-secondary": "#5d5f5f",
        "mn-on-primary-fixed-variant": "#2f486a",
        "mn-surface-container": "#edeeef",
        "mn-on-secondary": "#ffffff",
        "mn-on-primary-container": "#6f88ad",
        "mn-on-error": "#ffffff",
        "mn-surface-bright": "#f8f9fa",
        "mn-on-tertiary": "#ffffff",
        "mn-error-container": "#ffdad6",
        "mn-secondary-fixed-dim": "#c6c6c7",
        "mn-background": "#f8f9fa",
        "mn-on-primary": "#ffffff",
        "mn-error": "#ba1a1a",
        "mn-surface-dim": "#d9dadb",
        "mn-primary-fixed-dim": "#afc8f0"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      fontFamily: {
        "headline": ["Manrope"],
        "body": ["Manrope"],
        "label": ["Manrope"],
        "manrope": ["Manrope"]
      }
    },
  },
  plugins: [],
}
