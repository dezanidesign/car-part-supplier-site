import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      // ========================================================================
      // COLORS (Brand Palette)
      // ========================================================================
      colors: {
        brand: {
          orange: "#FF4D00",
          "orange-hover": "#ff6b2b",
        },
        dark: {
          bg: "#050505",
          card: "#0F0F0F",
          elevated: "#111111",
        },
        muted: "#666666",
        subtle: "#888888",
      },

      // ========================================================================
      // FONTS
      // ========================================================================
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      // ========================================================================
      // ANIMATIONS
      // ========================================================================
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        "slide-down": "slideDown 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards",
        marquee: "marquee 80s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },

      // ========================================================================
      // TRANSITIONS
      // ========================================================================
      transitionTimingFunction: {
        brand: "cubic-bezier(0.25, 1, 0.5, 1)",
      },

      // ========================================================================
      // SPACING & SIZING
      // ========================================================================
      maxWidth: {
        "8xl": "1920px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },

      // ========================================================================
      // TYPOGRAPHY
      // ========================================================================
      letterSpacing: {
        widest: "0.2em",
        "super-wide": "0.3em",
        "ultra-wide": "0.4em",
      },
      lineHeight: {
        tighter: "0.85",
      },

      // ========================================================================
      // BORDERS
      // ========================================================================
      borderColor: {
        DEFAULT: "rgba(255, 255, 255, 0.08)",
      },

      // ========================================================================
      // BACKDROP BLUR
      // ========================================================================
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".text-stroke": {
          color: "transparent",
          "-webkit-text-stroke": "1px rgba(255,255,255,0.3)",
        },
        ".text-stroke-strong": {
          color: "transparent",
          "-webkit-text-stroke": "1px rgba(255,255,255,0.8)",
        },
        ".text-stroke-orange": {
          color: "transparent",
          "-webkit-text-stroke": "1px #FF4D00",
        },
      });
    }),
  ],
};

export default config;
