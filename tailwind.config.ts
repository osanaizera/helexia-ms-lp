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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} satisfies Config
