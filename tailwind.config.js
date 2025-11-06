/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Blue AFL Theme
        'afl-navy': '#001F3F',
        'afl-blue': '#003366',
        'afl-blue-light': '#0051A5',
        'afl-blue-lighter': '#1E6FBA',
        'afl-accent': '#E21837',
        'afl-gold': '#FFB81C',
        'grass-green': '#2C7A3D',
        'dark-bg': '#0A1929',
        'dark-card': '#132F4C',
        'dark-border': '#1E3A5F',
        
        // Modern Theme Colors (Inspired by Notion, Linear, Stripe)
        'modern': {
          'bg': {
            'primary': '#FAFAFA',
            'secondary': '#FFFFFF',
            'tertiary': '#F5F5F5',
            'dark': '#1A1A1A',
            'card': '#FFFFFF',
          },
          'text': {
            'primary': '#171717',
            'secondary': '#737373',
            'tertiary': '#A3A3A3',
            'inverse': '#FAFAFA',
          },
          'accent': {
            'primary': '#6366F1',
            'secondary': '#8B5CF6',
            'success': '#10B981',
            'warning': '#F59E0B',
            'error': '#EF4444',
            'info': '#3B82F6',
          },
          'border': {
            'light': '#E5E5E5',
            'medium': '#D4D4D4',
            'dark': '#A3A3A3',
          },
        },
      },
      boxShadow: {
        'modern-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'modern': '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 4px 8px 0 rgba(0, 0, 0, 0.06)',
        'modern-md': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 8px 16px -2px rgba(0, 0, 0, 0.08)',
        'modern-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'modern-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'modern-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'modern': '12px',
        'modern-lg': '16px',
        'modern-xl': '20px',
      },
      fontFamily: {
        'modern': [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'modern-xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'modern-sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        'modern-base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'modern-lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'modern-xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
        'modern-2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        'modern-3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        'modern-4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
      },
      animation: {
        'modern-fade-in': 'fadeIn 0.3s ease-in-out',
        'modern-slide-up': 'slideUp 0.4s ease-out',
        'modern-scale': 'scale 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scale: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
