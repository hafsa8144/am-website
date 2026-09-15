/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        paper: "#fffbf8",
        card: "#ffffff",
        line: "#f0dde6",

        pink: "#ffa3c1",
        "pink-deep": "#f58ab5",
        magenta: "#ffa3f0",
        peach: "#ffb2a3",

        mint: "#a3f0e8",
        lime: "#a3ffb2",
        sky: "#a3f0ff",
        violet: "#d9a3ff",

        ink: "#2a2438",
        "ink-soft": "#6b6478",

        discount: "#e23a5d",
        whatsapp: "#a3f0ff",
      },

      fontFamily: {
        sans: ["var(--font-nunito)", "Arial Rounded MT Bold", "sans-serif"],
      },

      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "26px",
      },

      boxShadow: {
        soft: "0 12px 26px rgba(236,90,150,0.14)",
        lift: "0 10px 20px rgba(236,90,150,0.18)",
      },

      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      animation: {
        "scroll-left": "scroll-left 18s linear infinite",
        "scroll-left-fast": "scroll-left 11s linear infinite",
      },
    },
  },

  plugins: [],
};