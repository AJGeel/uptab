module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          400: "#25B1FF",
          800: "#085884",
        },
        black: "#020E2C",
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
