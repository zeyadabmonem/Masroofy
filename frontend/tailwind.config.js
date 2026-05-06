/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fintech Dark Theme
        bg: {
          primary: '#0A0E1A',
          secondary: '#111827',
          elevated: '#1C2333',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        border: '#1F2937',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '17': '68px',
        '18': '72px',
        '21': '84px',
        '22': '88px',
        '25': '100px',
        '30': '120px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
