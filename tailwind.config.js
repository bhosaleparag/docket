/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAF9F6",
        ink: "#161C17",
        forest: {
          DEFAULT: "#24503F",
          dark: "#173327",
        },
        amber: "#E2A33D",
        line: "#E4E0D6",
        muted: "#6B6F68",
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
