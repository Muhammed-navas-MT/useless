import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#D7E635",
        surface: "#FFFFFF",
        ink: "#14140D",
        muted: "#5C5C4E",
        alert: "#E13B2E",
        amber: "#F5A623",
        blue: "#3B5FE2",
        green: "#2F9E44",
      },
      fontFamily: {
        sans: ["'Space Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        mono: ["'Space Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        pixel: ["'Press Start 2P'", "'Space Mono'", "monospace"],
      },
      boxShadow: {
        pixel: "4px 4px 0 0 #14140D",
        "pixel-sm": "2px 2px 0 0 #14140D",
        "pixel-lg": "7px 7px 0 0 #14140D",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pixel-pop": {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        scan: {
          "0%, 100%": { transform: "translate(-3px, -2px) rotate(-8deg)" },
          "50%": { transform: "translate(3px, 2px) rotate(8deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        "pixel-pop": "pixel-pop 0.2s steps(4) both",
        blink: "blink 1s step-end infinite",
        scan: "scan 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
