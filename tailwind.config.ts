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
        primary: "#1978e5",
        "text-primary": "#111418",
        "text-secondary": "#637488",
        "surface-gray": "#f0f2f4",
        border: "#dce0e5",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
