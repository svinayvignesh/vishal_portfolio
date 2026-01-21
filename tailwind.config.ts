import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom manufacturing theme colors
        steel: {
          DEFAULT: "hsl(var(--steel))",
          light: "hsl(var(--steel-light))",
        },
        copper: {
          DEFAULT: "hsl(var(--copper))",
          dark: "hsl(var(--copper-dark))",
        },
        forge: "hsl(var(--forge))",
        chrome: "hsl(var(--chrome))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
            opacity: "1"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--primary) / 0.6)",
            opacity: "0.8"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 8s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-steel": "linear-gradient(135deg, hsl(210 25% 35%), hsl(210 30% 25%))",
        "gradient-copper": "linear-gradient(135deg, hsl(25 80% 55%), hsl(20 75% 40%))",
        "gradient-hero": "linear-gradient(180deg, hsl(220 20% 8%) 0%, hsl(220 25% 5%) 100%)",
        "gradient-card": "linear-gradient(145deg, hsl(220 18% 14%), hsl(220 18% 10%))",
        "gradient-radial": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      boxShadow: {
        steel: "0 4px 20px -4px hsl(210 60% 50% / 0.25)",
        copper: "0 4px 20px -4px hsl(25 80% 55% / 0.3)",
        glow: "0 0 40px hsl(210 60% 50% / 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
