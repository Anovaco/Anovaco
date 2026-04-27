import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        green: {
          DEFAULT: "#1B2B21",
          mid: "#2A4232",
          deep: "#0D1610",
        },
        gold: {
          DEFAULT: "#D4AF37",
          lt: "#E8D07A",
        },
        canvas: {
          DEFAULT: "#F4F1ED",
          2: "#F0EDE8",
        },
        ink: "#333333",
        muted: {
          DEFAULT: "#888880",
          foreground: "#888880",
        },
        border: "rgba(51,51,51,0.08)",
        input: "rgba(51,51,51,0.12)",
        ring: "#1B2B21",
        background: "#F4F1ED",
        foreground: "#333333",
        primary: {
          DEFAULT: "#1B2B21",
          foreground: "#F4F1ED",
        },
        secondary: {
          DEFAULT: "#D4AF37",
          foreground: "#1B2B21",
        },
        destructive: {
          DEFAULT: "#c0392b",
          foreground: "#F4F1ED",
        },
        accent: {
          DEFAULT: "#D4AF37",
          foreground: "#1B2B21",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#333333",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
