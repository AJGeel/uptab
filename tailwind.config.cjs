module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", "sans-serif"],
      },
      colors: {
        sky: {
          400: "#25B1FF",
          500: "#138CD0",
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
          from: {
            opacity: 0,
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: {
            opacity: 1,
            transform: "translate(-50%, -50%) scale(1)",
          },
        },

        hotkey: {
          "0%": {
            opacity: 0,
            transform: "translateY(8px) scale(0.9)",
          },
          "15%": {
            opacity: 1,
            transform: "translateY(0) scale(1.05)",
          },
          "25%": {
            transform: "translateY(0) scale(1)",
          },
          "75%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(6px) scale(0.95)",
          },
        },
      },

      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        hotkey: "hotkey 1s ease-out forwards",
      },
    },
  },

  plugins: [require("@tailwindcss/typography")],
};