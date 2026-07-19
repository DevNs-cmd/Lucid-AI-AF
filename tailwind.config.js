/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        ink: "var(--text-primary)",
        muted: "var(--text-muted)",
        glow: {
          primary: "var(--glow-primary)",
          accent: "var(--glow-accent)",
          danger: "var(--glow-danger)",
        },
        success: "#34D399",
        danger: "#F87171",
        warning: "#FBBF24",
        gold: "#FBBF24",
      },
      fontFamily: {
        display: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(118, 87, 255, 0.35)",
        "glow-gold": "0 0 16px rgba(251, 191, 36, 0.3)",
      },
      backgroundImage: {
        rune: "linear-gradient(115deg, #7657ff, #b465ff)",
      },
    },
  },
  plugins: [],
};
