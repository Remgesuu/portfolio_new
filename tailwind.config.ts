import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        // Cuberto-inspired typographic scale: 90px base for hero headlines
        '10xl': ['90px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '9xl': ['72px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '8xl': ['56px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        '7xl': ['48px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        '6xl': ['36px', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        '5xl': ['28px', { lineHeight: '1.35' }],
        '4xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['18px', { lineHeight: '1.5' }],
        'xl': ['16px', { lineHeight: '1.5' }],
        'lg': ['15px', { lineHeight: '1.6' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'sm': ['12px', { lineHeight: '1.6' }],
        'xs': ['11px', { lineHeight: '1.5' }],
      },
      spacing: {
        // Cuberto-inspired spacing scale: 240px hero top section
        'hero': '240px',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        // Use CSS variables for radius tokens
        'xl': 'var(--radius-xl)',
        'lg': 'var(--radius-lg)',
        'md': 'var(--radius-md)',
        'sm': 'var(--radius-sm)',
      },
      colors: {
        // Design token semantic colors
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        muted: {
          DEFAULT: 'var(--text-secondary)',
          foreground: 'var(--text-disabled)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          subtle: 'var(--accent-primary-subtle)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
      },
      backgroundColor: {
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        glass: 'var(--bg-glass)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        disabled: 'var(--text-disabled)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        soft: 'var(--shadow-soft)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
        slower: 'var(--transition-slower)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-quint': 'var(--ease-out-quint)',
        'in-out-quad': 'var(--ease-in-out-quad)',
      },
      maxWidth: {
        page: 'var(--page-width)',
      },
      gap: {
        section: 'var(--section-gap)',
      },
      animation: {
        'fade': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.7s ease-out',
        'blur-crisp': 'blurCrisp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blurCrisp: {
          '0%': { opacity: '0', filter: 'blur(8px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
