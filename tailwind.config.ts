import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
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
        'urbanist': ['Urbanist', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
        'roboto-flex': ['Roboto Flex', 'sans-serif'],
        'sans': ['Urbanist', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'flex': ['Roboto Flex', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['48px', { lineHeight: '160%', fontWeight: '700' }],
        'heading-2': ['40px', { lineHeight: '160%', fontWeight: '700' }],
        'heading-3': ['32px', { lineHeight: '160%', fontWeight: '700' }],
        'heading-4': ['24px', { lineHeight: '160%', fontWeight: '700' }],
        'heading-5': ['20px', { lineHeight: '160%', fontWeight: '700' }],
        'heading-6': ['18px', { lineHeight: '160%', fontWeight: '700' }],
        'body-xlarge': ['18px', { lineHeight: '160%', letterSpacing: '0.2px' }],
        'body-large': ['16px', { lineHeight: '160%', letterSpacing: '0.2px' }],
        'body-medium': ['14px', { lineHeight: '160%', letterSpacing: '0.2px' }],
        'body-small': ['12px', { lineHeight: '160%', letterSpacing: '0.2px' }],
        'body-xsmall': ['10px', { lineHeight: '160%', letterSpacing: '0.2px' }],
      },
      spacing: {
        "15": "3.75rem",
        "17": "4.25rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "25": "6.25rem",
      },
      borderRadius: {
        "0": "0",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "3.5": "0.875rem",
      },
      colors: {
        // Design System Primary Colors
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Design System Secondary Colors
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Alert & Status Colors
        alert: {
          info: 'var(--alert-info)',
          success: 'var(--alert-success)',
          warning: 'var(--alert-warning)',
          error: 'var(--alert-error)',
          'light-disabled': 'var(--alert-light-disabled)',
          'dark-disabled': 'var(--alert-dark-disabled)',
          'button-disabled': 'var(--alert-button-disabled)',
        },
        // Greyscale Colors
        greyscale: {
          50: 'var(--greyscale-50)',
          100: 'var(--greyscale-100)',
          200: 'var(--greyscale-200)',
          300: 'var(--greyscale-300)',
          400: 'var(--greyscale-400)',
          500: 'var(--greyscale-500)',
          600: 'var(--greyscale-600)',
          700: 'var(--greyscale-700)',
          800: 'var(--greyscale-800)',
          900: 'var(--greyscale-900)',
        },
        // Dark Colors
        dark: {
          1: 'var(--dark-1)',
          2: 'var(--dark-2)',
          3: 'var(--dark-3)',
          4: 'var(--dark-4)',
          5: 'var(--dark-5)',
        },
        // Other Colors
        'ds-white': 'var(--color-white)',
        'ds-black': 'var(--color-black)',
        'ds-red': 'var(--color-red)',
        'ds-pink': 'var(--color-pink)',
        'ds-purple': 'var(--color-purple)',
        'ds-deep-purple': 'var(--color-deep-purple)',
        'ds-indigo': 'var(--color-indigo)',
        'ds-blue': 'var(--color-blue)',
        'ds-light-blue': 'var(--color-light-blue)',
        'ds-cyan': 'var(--color-cyan)',
        'ds-teal': 'var(--color-teal)',
        'ds-green': 'var(--color-green)',
        'ds-light-green': 'var(--color-light-green)',
        'ds-lime': 'var(--color-lime)',
        'ds-yellow': 'var(--color-yellow)',
        'ds-amber': 'var(--color-amber)',
        'ds-orange': 'var(--color-orange)',
        'ds-deep-orange': 'var(--color-deep-orange)',
        'ds-brown': 'var(--color-brown)',
        'ds-blue-grey': 'var(--color-blue-grey)',
        // Background Colors
        'bg-purple': 'var(--bg-purple)',
        'bg-green': 'var(--bg-green)',
        'bg-blue': 'var(--bg-blue)',
        'bg-red': 'var(--bg-red)',
        'bg-teal': 'var(--bg-teal)',
        'bg-brown': 'var(--bg-brown)',
        'bg-yellow': 'var(--bg-yellow)',
        'bg-orange': 'var(--bg-orange)',
        // Transparent Colors
        'transparent-purple': 'var(--transparent-purple)',
        'transparent-green': 'var(--transparent-green)',
        'transparent-blue': 'var(--transparent-blue)',
        'transparent-red': 'var(--transparent-red)',
        'transparent-teal': 'var(--transparent-teal)',
        'transparent-brown': 'var(--transparent-brown)',
        'transparent-yellow': 'var(--transparent-yellow)',
        'transparent-orange': 'var(--transparent-orange)',
        // Faith Colors
        'faith-primary': 'var(--faith-primary)',
        'faith-secondary': 'var(--faith-secondary)',
        'faith-accent': 'var(--faith-accent)',
        'faith-surface': 'var(--faith-surface)',
        'faith-text': 'var(--faith-text)',
        // Shadcn Colors (keeping existing)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      },
      backgroundImage: {
        'gradient-purple': 'var(--gradient-purple)',
        'gradient-green': 'var(--gradient-green)',
        'gradient-blue': 'var(--gradient-blue)',
        'gradient-red': 'var(--gradient-red)',
        'gradient-teal': 'linear-gradient(286deg, var(--gradient-teal) 0%, var(--gradient-teal) 100%)',
        'gradient-brown': 'var(--gradient-brown)',
        'gradient-yellow': 'var(--gradient-yellow)',
        'gradient-orange': 'var(--gradient-orange)',
      },
      boxShadow: {
        'elevation-1': '0 4px 60px 0 rgba(4, 6, 15, 0.08)',
        'elevation-2': '0 8px 80px 0 rgba(4, 6, 15, 0.12)',
        'elevation-3': '0 12px 100px 0 rgba(4, 6, 15, 0.16)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "divine-pulse": {
          "0%, 100%": {
            opacity: "0.05",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.15",
            transform: "scale(1.05)",
          },
        },
        "gentle-float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "50%": {
            transform: "translateY(-8px) rotate(2deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "divine-pulse": "divine-pulse 4s ease-in-out infinite",
        "gentle-float": "gentle-float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
