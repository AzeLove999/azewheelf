/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        glass: {
          white: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.25)',
          highlight: 'rgba(255, 255, 255, 0.4)',
          dark: 'rgba(0, 0, 0, 0.15)',
        }
      },
      backdropBlur: {
        glass: '40px',
      },
      borderRadius: {
        glass: '24px',
        'glass-lg': '32px',
        'glass-xl': '48px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'glass-hover': '0 12px 48px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'glass-inset': 'inset 0 2px 12px rgba(255, 255, 255, 0.15), inset 0 -2px 8px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'modal-in': 'modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-out': 'modalOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'bg-shift': 'bgShift 20s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.5', transform: 'translateX(-100%)' },
          '50%': { opacity: '1', transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
        },
        modalOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)', filter: 'blur(0)' },
          '100%': { opacity: '0', transform: 'scale(0.9) translateY(20px)', filter: 'blur(8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(120, 180, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(120, 180, 255, 0.6)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bgShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
