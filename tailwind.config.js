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
    },
  },
  plugins: [],
};
