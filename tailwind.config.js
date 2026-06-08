/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./libs/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          subtle: 'var(--color-primary-subtle)',
          muted: 'var(--color-primary-muted)',
          50: '#eef0f9',
          100: '#d4d9ef',
          200: '#aab3df',
          300: '#7f8dcf',
          400: '#5567bf',
          500: '#2b41af',
          600: '#1f3194',
          700: '#1b2b6e',
          800: '#142054',
          900: '#0d153a',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
          subtle: 'var(--color-accent-subtle)',
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffb400',
          600: '#e6a200',
          700: '#cc9000',
          800: '#996c00',
          900: '#664800',
        }
      }
    },
  },
  plugins: [],
}
