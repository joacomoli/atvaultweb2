import { Options } from "$fresh/plugins/twind.ts";

export default {
  selfURL: import.meta.url,
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7FBC06',
          50: '#E4F7A1',
          100: '#DEF58D',
          200: '#D1F165',
          300: '#C4ED3D',
          400: '#B7E915',
          500: '#7FBC06',
          600: '#5C8804',
          700: '#395403',
          800: '#162001',
          900: '#000000'
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  preflight: {
    '@import': [
      `url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')`,
    ],
  },
} as Options; 