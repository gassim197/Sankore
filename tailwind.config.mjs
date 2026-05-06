/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F4EDE0',
          2: '#FBF7EE',
          3: '#EDE3D2',
          4: '#E2D5BD',
        },
        ink: {
          DEFAULT: '#1B1F2A',
          soft: '#4A5165',
          mute: '#8A8275',
        },
        terracotta: {
          DEFAULT: '#C4502E',
          deep: '#A33F22',
          soft: '#E07555',
        },
        gold: {
          DEFAULT: '#B8943B',
          soft: '#D4B566',
        },
        ochre: '#A6896E',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        container: '1180px',
        narrow: '720px',
      },
    },
  },
  plugins: [],
};
