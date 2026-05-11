/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#08B44D",
        "primary-dark": "#00963F",
        "primary-light": "#EAF7EC",
        "text-primary": "#1A1A1A",
        "text-secondary": "#7A7A7A",
        "border-soft": "#EAEAEA",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        card: "22px",
        btn: "18px",
        input: "18px",
        top: "40px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
        "soft-lg": "0 8px 30px rgba(0,0,0,0.08)",
        green: "0 8px 24px rgba(8,180,77,0.25)",
      },
      maxWidth: {
        app: "430px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
