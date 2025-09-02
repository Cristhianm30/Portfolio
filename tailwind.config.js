/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        heikoh: {
          beige: 'var(--color-beige-heikoh)',
          light: 'var(--color-blue-light-heikoh)',
          dark: 'var(--color-blue-dark-heikoh)',
        },
      },
    },
  },
  plugins: [],
};
