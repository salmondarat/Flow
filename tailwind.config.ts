import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Override defaults or add new ones
        'sm': '640px',      // default
        'md': '810px',      // changed from 768px
        'lg': '1024px',     // default
        'xl': '1280px',     // default
        '2xl': '1536px',    // default
        // Add custom breakpoints
        'tablet': '810px',
        'desktop': '1200px',
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        display: ["Geist", "sans-serif"],
      },
    },
  },
};

export default config;
