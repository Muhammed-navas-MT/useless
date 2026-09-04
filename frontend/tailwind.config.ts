import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#252421",
        paper: "#3A3731",
        ink: "#E8E3D8",
        investigation: "#8B1E1E",
        muted: "#89847A",
        line: "#5A554B",
        evidence: "#C6A85A",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["'Libre Baskerville'", "Georgia", "'Times New Roman'", "serif"],
      },
      backgroundImage: {
        paper: "radial-gradient(circle at 1px 1px, rgba(232,227,216,0.035) 1px, transparent 0)",
      },
      backgroundSize: {
        paper: "3px 3px",
      },
      boxShadow: {
        doc: "0 1px 2px rgba(0,0,0,0.25), 0 8px 24px -12px rgba(0,0,0,0.45)",
        stamp: "0 0 0 1px rgba(139,30,30,0.15)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal": {
          "0%": { opacity: "0", clipPath: "inset(0 0 100% 0)" },
          "100%": { opacity: "1", clipPath: "inset(0 0 0% 0)" },
        },
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(1.4) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.96) rotate(-8deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-8deg)" },
        },
        "blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "reveal": "reveal 0.6s ease-out both",
        "stamp-in": "stamp-in 0.4s cubic-bezier(0.2,0.8,0.2,1) both",
        "blink": "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
