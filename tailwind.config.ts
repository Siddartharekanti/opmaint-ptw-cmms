import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          orange: "#F97316",
          red: "#EF4444",
          amber: "#F59E0B",
          yellow: "#EAB308",
          green: "#10B981",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          dark: "#0F172A",
          slate: "#1E293B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
