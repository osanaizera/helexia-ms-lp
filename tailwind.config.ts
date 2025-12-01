import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: 'var(--brand)',
        'brand-accent': 'var(--brand-accent)',
        blue: 'var(--blue)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        bg: 'var(--bg)'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0,0,0,0.08)'
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif']
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
      }
    },
  },
  plugins: [],
} satisfies Config
