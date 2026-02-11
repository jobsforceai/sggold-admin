import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f4efe5",
        panel: "#fffdf8",
        ink: "#161616",
        accent: "#a67922",
        silver: "#6b7280"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 20%, rgba(166,121,34,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(107,114,128,0.12), transparent 35%)"
      },
      boxShadow: {
        soft: "0 10px 35px rgba(22, 22, 22, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
