import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:   "#162570",
        navy2:  "#0f1c5a",
        mbcblue:  "#00AEEF",
        mbcblue2: "#0090c9",
        gold:   "#E8A020",
        off:    "#F4F5F7",
        silver: "#E2E5EC",
        muted:  "#6B7280",
        dark:   "#1A1A2E",
        text:   "#111827",
        border: "#D1D5DB",
      },
      fontFamily: {
        sans:  ["DM Sans", "sans-serif"],
        syne:  ["Syne", "sans-serif"],
        mono:  ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
