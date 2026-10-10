import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["var(--font-display)", "sans-serif"], mono: ["var(--font-mono)", "monospace"] },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        "scan-reveal": {
          "0%, 8%": { clipPath: "inset(0 0 100% 0)", opacity: "1" },
          "65%": { clipPath: "inset(0 0 0% 0)", opacity: "1" },
          "82%": { clipPath: "inset(0 0 0% 0)", opacity: "1" },
          "94%": { clipPath: "inset(0 0 0% 0)", opacity: "0.2" },
          "100%": { clipPath: "inset(0 0 100% 0)", opacity: "0.2" },
        },
        "scan-beam": {
          "0%, 8%": { top: "-4%", opacity: "0" },
          "12%": { opacity: "1" },
          "65%": { top: "102%", opacity: "1" },
          "70%": { top: "106%", opacity: "0" },
          "100%": { top: "106%", opacity: "0" },
        },
        "ecg-heartbeat": {
          "0%": { strokeDasharray: "0 100", strokeDashoffset: "20", opacity: "0" },
          "5%": { opacity: "1" },
          "38%": { strokeDasharray: "25 100", strokeDashoffset: "-25", opacity: "1" },
          "62%": { strokeDasharray: "25 100", strokeDashoffset: "-75", opacity: "1" },
          "68%": { strokeDasharray: "0 100", strokeDashoffset: "-82", opacity: "0" },
          "100%": { strokeDasharray: "0 100", strokeDashoffset: "-82", opacity: "0" },
        },
      },
      animation: {
        ticker: "ticker 42s linear infinite",
        "scan-reveal": "scan-reveal 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "scan-beam": "scan-beam 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "ecg-heartbeat": "ecg-heartbeat 1.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
