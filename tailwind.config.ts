import { type Config } from "tailwindcss";

export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./islands/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./layouts/**/*.{ts,tsx}",
  ],
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
  plugins: [],
} satisfies Config;
