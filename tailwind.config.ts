import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#0D0D0D",
        ember: "#E8751A",
        burnt: "#B85A12",
        parchment: "#D9C7B8",
        linen: "#E7DDD2",
        denim: "#A9C4DA",
        steel: "#7FA1BE",
        pearl: "#F4F2EE"
      },
      fontFamily: {
        display: ["var(--font-space)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 38px rgba(232,117,26,0.32)",
        blueglow: "0 0 34px rgba(169,196,218,0.22)"
      },
      backgroundImage: {
        "radial-warm": "radial-gradient(circle at 50% 0%, rgba(232,117,26,0.22), transparent 42%)"
      }
    }
  },
  plugins: []
};

export default config;
