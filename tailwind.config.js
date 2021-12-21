// eslint-disable-next-line @typescript-eslint/no-var-requires
const withAnimations = require('animated-tailwindcss')

module.exports = withAnimations(
  {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {}
    },
    variants: {
      extend: {}
    },
    plugins: [require('@tailwindcss/forms')]
  },
  { experimental: true }
)
