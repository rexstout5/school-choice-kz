import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#132238",
        primary: "#2563eb",
        mint: "#14b8a6",
        cream: "#fff7ed",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(37, 99, 235, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
