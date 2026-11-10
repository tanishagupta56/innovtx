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
          border: 'rgba(49, 94, 255, 0.15)',
        },
        'electric-blue': {
          DEFAULT: '#315EFF',
          light: '#537AFF',
          dark: '#1E44D6',
        },
        'lime-green': {
          DEFAULT: '#B8D94C',
          light: '#CEE86B',
          dark: '#9BB834',
        },
        'burnt-orange': {
          DEFAULT: '#D65A31',
          light: '#E6724B',
          dark: '#B8451E',
        },
        'soft-white': '#F2F4F8',
        'muted-text': '#969EAD',
        // Backward compatibility mappings
        'ice-cyan': {
          DEFAULT: '#537AFF', // Replaced bright cyan with electric blue tint
          glow: 'rgba(49, 94, 255, 0.4)',
        },
        'acid-lime': '#B8D94C',
        'electric-lime': '#B8D94C',
        lime: {
          DEFAULT: '#B8D94C',
          50: '#F8FFE0',
          100: '#F0FFC2',
          200: '#E4FF85',
          300: '#CEE86B',
          400: '#B8D94C',
          500: '#9BB834',
        },
        midnight: {
          DEFAULT: '#080B12',
          950: '#080B12',
          900: '#111722',
          800: '#151D2A',
        },
        cobalt: {
          DEFAULT: '#315EFF',
          bright: '#537AFF',
          50: '#E8F0FE',
          100: '#C5D9FC',
          200: '#8BB3F9',
          300: '#537AFF',
          400: '#4170FF',
          500: '#315EFF',
          600: '#1E44D6',
          700: '#1432A8',
          800: '#0E237A',
          900: '#08164D',
        },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-blue': 'linear-gradient(135deg, #315EFF 0%, #1E44D6 50%, #08164D 100%)',
        'gradient-lime': 'linear-gradient(135deg, #B8D94C 0%, #9BB834 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 30% 50%, rgba(49, 94, 255, 0.15) 0%, transparent 70%)',
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
          '0%': { boxShadow: '0 0 20px rgba(49, 94, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(49, 94, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
