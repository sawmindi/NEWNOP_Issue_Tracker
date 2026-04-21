/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#080d19",
          surface: "#0d1526",
          elevated: "#111e33",
          border: "#1a2540",
        },
        accent: {
          DEFAULT: "#4f8ef7",
          hover: "#6ba4ff",
          muted: "rgba(79,142,247,0.12)",
        },
        status: {
          open: "#4f8ef7",
          progress: "#f59e0b",
          resolved: "#10b981",
          closed: "#6b7280",
        },
        priority: {
          low: "#10b981",
          medium: "#4f8ef7",
          high: "#f59e0b",
          critical: "#ef4444",
        },
      },
      fontFamily: {
        mono: ['"DM Mono"', '"Fira Code"', "monospace"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
