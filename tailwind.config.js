/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B3D',
          50:  '#E8EAEF',
          100: '#C6CBDA',
          200: '#9FA8C1',
          300: '#7886A9',
          400: '#5A6B96',
          500: '#3D5183',
          600: '#2E3E6F',
          700: '#1E2D59',
          800: '#0D1B3D',
          900: '#070E22',
        },
        gold: {
          DEFAULT: '#D9A017',
          50:  '#FDF8E7',
          100: '#FBEFC4',
          200: '#F7E09E',
          300: '#F3D178',
          400: '#EFC353',
          500: '#EBB42D',
          600: '#D9A017',
          700: '#B07F0F',
          800: '#885E08',
          900: '#603E00',
        },
        magenta: {
          DEFAULT: '#E91E63',
          50:  '#FDE8EF',
          100: '#FAC6D9',
          200: '#F696B9',
          300: '#F26698',
          400: '#EF3D7C',
          500: '#E91E63',
          600: '#C91555',
          700: '#A00D45',
          800: '#780635',
          900: '#500026',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        black: '900',
      },
      fontSize: {
        'display-2xl': ['4.5rem',  { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'display-xl':  ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '900' }],
        'display-lg':  ['3rem',    { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '800' }],
        'display-md':  ['2.25rem', { lineHeight: '1.1',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm':  ['1.875rem',{ lineHeight: '1.2',  fontWeight: '700' }],
      },
      spacing: {
        section: '6rem',
        'section-sm': '4rem',
      },
      borderRadius: {
        card: '0.75rem',
        pill: '9999px',
      },
      boxShadow: {
        'card-navy': '0 4px 24px rgba(13, 27, 61, 0.15)',
        'card-gold':  '0 4px 24px rgba(217, 160, 23, 0.20)',
        'glow-gold':  '0 0 40px rgba(217, 160, 23, 0.35)',
        'glow-magenta': '0 0 40px rgba(233, 30, 99, 0.30)',
      },
      backgroundImage: {
        'road-stripe': 'repeating-linear-gradient(135deg, transparent, transparent 28px, rgba(217,160,23,0.07) 28px, rgba(217,160,23,0.07) 32px)',
        'hero-gradient': 'linear-gradient(160deg, #0D1B3D 0%, #0D1B3D 60%, #12244E 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #D9A017 0%, #EFC353 50%, #D9A017 100%)',
      },
      keyframes: {
        'count-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
      animation: {
        'count-up':   'count-up 0.6s ease-out both',
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'fade-in':    'fade-in 0.5s ease-out both',
        shimmer:      'shimmer 2.5s linear infinite',
      },
      transitionTimingFunction: {
        'ease-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}