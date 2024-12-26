/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "[1440px]": "1440px",
      },
      spacing: {
        "[72px]": "72px",
      },
    },
  },
  plugins: [],
};
