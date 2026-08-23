/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Sampled directly from the supplied RMR Realty logo file.
        navy: {
          50: "#eef2f6",
          100: "#d5dee8",
          200: "#aabdd0",
          300: "#7f9bb8",
          400: "#3f5e88",
          500: "#0d2c56",
          600: "#062043",
          700: "#001838",
          800: "#001030",
          900: "#000820",
        },
        gold: {
          50: "#fbf5ea",
          100: "#f3e3c4",
          200: "#e8cd94",
          300: "#dcb768",
          400: "#d0a24a",
          500: "#c89038",
          600: "#a8752c",
          700: "#835b23",
          800: "#5e4119",
          900: "#3a280f",
        },
      },
      fontFamily: {
        // Per-character fallback: Playfair Display has no Telugu/Kannada/
        // Tamil glyphs, so the browser already renders those scripts in
        // the next font in this stack automatically (even mid-line) —
        // this just makes that fallback a matching serif face instead of
        // an arbitrary system default with unpredictable glyph metrics.
        display: [
          "'Playfair Display'",
          "'Noto Serif Telugu'",
          "'Noto Serif Kannada'",
          "'Noto Serif Tamil'",
          "serif",
        ],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
};
