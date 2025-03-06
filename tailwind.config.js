/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        fit: 'fit-content',
      },
      // add color palette here
      colors: {
        text: {
          normal: '#0E1116',
          title: '#34403A',
          subtitle: '#70A288',
        },
        background: {
          primary: '#F7F9F7',
          secondary: '#F3F6F3',
        },
        emphasis: {
          primary: '#70A288',
          secondary: '#34403A',
          interactive: '#3590F3',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10%)',
          },
          '50%': {
            opacity: 1,
            transform: 'rotateZ(5deg)',
          },
          '75%': {
            transform: 'translateY(5%) rotateZ(-5deg)',
            opacity: 1,
          },
        },
        'clip-down': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10%)',
            clipPath: 'inset(0% 0% 100% 0%)',
          },
          '50%': {
            opacity: 1,
            transform: 'rotateZ(2deg)',
            clipPath: 'inset(0% 0% 0% 0%)',
          },
          '75%': {
            transform: 'translateY(5%) rotateZ(-2deg)',
          },
        },
      },
    },
  },
  plugins: [],
};
