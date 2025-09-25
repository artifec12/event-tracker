/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}", // include this if you keep UI components separately
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // example color
        "primary-foreground": "#ffffff",
        secondary: "#6b7280",
        "secondary-foreground": "#ffffff",
        destructive: "#ef4444",
        background: "#f9fafb",
        accent: "#6366f1",
        "accent-foreground": "#ffffff",
        ring: "#2563eb",
      },
    },
  },
  plugins: [],
};
