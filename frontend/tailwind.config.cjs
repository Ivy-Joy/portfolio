// tailwind.config.cjs
//Using .cjs avoids CommonJS/ESM weirdness in some setups (Vite, Node versions).
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,vue,svelte}"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ]
};
