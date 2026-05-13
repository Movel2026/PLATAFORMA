import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── SISTEMA DE MARCA MOVEL ───────────────────────────────
        // Escala oficial de Movel Blue (degradado protagonista)
        "movel": {
          950: "#050E26",   // Night
          900: "#0B1E4E",   // Movel Blue (oficial)
          800: "#0E2A6B",
          700: "#123A8E",
          600: "#1B57C0",
          500: "#2D6EE0",
          400: "#3F8CFF",   // Sky (acento de apoyo)
          300: "#6FA7FF",
          200: "#A5C6FF",
          100: "#D7E5FF",
          50:  "#EEF4FF",
        },
        // Neutrales del sistema
        "night":  "#050E26",
        "cloud":  "#F4F2EC",
        "ink":    "#15171D",
        "mute":   "#7A8195",
        // Acentos de apoyo (uso limitado)
        "sky":    "#3F8CFF",
        "lime":   "#C7F154",
        "sunset": "#FF6B3D",
        "sand":   "#E8C97A",
        "mint":   "#3CCF91",
        // Legacy aliases (compatibilidad con código existente)
        primary: "#0B1E4E",
        "text-primary": "#15171D",
        "text-secondary": "#7A8195",
        "surface-gray": "#F4F2EC",
        border: "#dce0e5",
      },
      fontFamily: {
        // Display: titulares, 900 italic uppercase
        display: ["var(--font-archivo-black)", "Arial Black", "sans-serif"],
        // Sans: UI y body
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        // Mono: VINs, kilometrajes, IDs
        mono:    ["var(--font-jetbrains)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "movel-gradient":      "linear-gradient(135deg, #0B1E4E 0%, #123A8E 50%, #2D6EE0 100%)",
        "movel-gradient-soft": "linear-gradient(135deg, #123A8E 0%, #2D6EE0 50%, #3F8CFF 100%)",
        "movel-gradient-dark": "linear-gradient(135deg, #050E26 0%, #0B1E4E 50%, #123A8E 100%)",
        "sky-gradient":        "linear-gradient(135deg, #2D6EE0 0%, #3F8CFF 100%)",
      },
      boxShadow: {
        "movel":    "0 8px 28px -8px rgba(11, 30, 78, 0.35)",
        "movel-lg": "0 20px 48px -12px rgba(11, 30, 78, 0.45)",
        "sky":      "0 8px 24px -6px rgba(63, 140, 255, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
