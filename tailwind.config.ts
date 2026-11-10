import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-ink': '#080B12',
        charcoal: {
          DEFAULT: '#111722',
          surface: '#151D2A',
          border: '#1E2838',
        },
        'electric-blue': {
          DEFAULT: '#315EFF',
          light: '#537AFF',
          dark: '#1E44D6',
        },
        'ice-cyan': {
          DEFAULT: '#75E6FF',
          glow: 'rgba(117, 230, 255, 0.4)',
        },
        'soft-white': '#F2F4F8',
        'acid-lime': '#D4FF24',
        // Backward compatibility mappings
        midnight: {
          DEFAULT: '#080B12',
          950: '#080B12',
          900: '#111722',
          800: '#151D2A',
        },
        'electric-lime': '#D4FF24',
        'electric-cobalt': '#315EFF',
        'electric-cobalt-light': '#75E6FF',
        'cobalt-bright': '#315EFF',
        cobalt: {
          DEFAULT: '#315EFF',
          bright: '#537AFF',
          50: '#E8F0FE',
          100: '#C5D9FC',
          200: '#8BB3F9',
          300: '#75E6FF',
          400: '#537AFF',
          500: '#315EFF',
          600: '#1E44D6',
          700: '#1432A8',
          800: '#0E237A',
          900: '#08164D',
        },
        lime: {
          DEFAULT: '#D4FF24',
          50: '#F8FFE0',
          100: '#F0FFC2',
          200: '#E4FF85',
          300: '#D4FF24',
          400: '#C0E800',
          500: '#A8CC00',
        },
        'burnt-orange': '#C75B12',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cobalt': 'linear-gradient(135deg, #1558C9 0%, #0C3887 50%, #041845 100%)',
        'gradient-lime': 'linear-gradient(135deg, #D4FF24 0%, #A8CC00 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 30% 50%, rgba(21,88,201,0.15) 0%, transparent 70%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(21,88,201,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(21,88,201,0.6)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
