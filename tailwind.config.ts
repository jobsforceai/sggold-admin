import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        panel: "#141414",
        "panel-alt": "#1a1a1a",
        ink: "#f5f5f5",
        accent: "#d4a843",
        "accent-dim": "#a67922",
        silver: "#9ca3af",
        border: "#2a2a2a"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(212,168,67,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(156,163,175,0.05), transparent 35%)"
      },
      boxShadow: {
        soft: "0 10px 35px rgba(0, 0, 0, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
