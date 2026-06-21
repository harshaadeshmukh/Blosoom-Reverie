/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:        '#FDFAF7',
        'ivory-soft': '#FDF5F0',
        blush:        '#F5EDE8',
        rose:         '#C4968A',
        'rose-muted': '#C4A090',
        charcoal:     '#2C1A1A',
        'charcoal-deep': '#1A0F0F',
        'charcoal-mid':  '#3C2A2A',
        'border-soft': '#EDE0D8',
        'text-muted':  '#5A3A34',
        'text-light':  '#7A5050',
        'text-dim':    '#8C6A64',
        'text-warm':   '#F0E0D4',
        'text-sand':   '#A08070',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter:    ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        floatA: {
          '0%, 100%': { transform: 'translateY(0) rotate(-4deg)' },
          '50%':      { transform: 'translateY(-14px) rotate(-2deg)' },
        },
        floatB: {
          '0%, 100%': { transform: 'translateY(0) rotate(3deg)' },
          '50%':      { transform: 'translateY(-20px) rotate(5deg)' },
        },
        floatC: {
          '0%, 100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%':      { transform: 'translateY(-10px) rotate(-4deg)' },
        },
        floatD: {
          '0%, 100%': { transform: 'translateY(0) rotate(5deg)' },
          '50%':      { transform: 'translateY(-16px) rotate(3deg)' },
        },
        driftRibbon: {
          '0%, 100%': { transform: 'translateX(-50%) rotate(-3deg)' },
          '50%':      { transform: 'translateX(-50%) rotate(3deg)' },
        },
        marqueeScroll: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        lineGrow: {
          from: { width: '0px' },
          to:   { width: '28px' },
        },
      },
      animation: {
        'float-a':      'floatA 6s ease-in-out infinite',
        'float-b':      'floatB 7s ease-in-out infinite',
        'float-c':      'floatC 6.5s ease-in-out infinite',
        'float-d':      'floatD 7.5s ease-in-out infinite',
        'drift-ribbon': 'driftRibbon 5s ease-in-out infinite',
        'marquee':      'marqueeScroll 120s linear infinite',
        'line-grow':    'lineGrow 1s ease 0.5s both',
        'fade-up':      'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fadeIn 1s ease forwards',
      },
    },
  },
  plugins: [],
}
