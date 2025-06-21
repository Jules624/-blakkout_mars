/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Palette de couleurs pour le thème hacker/glitch
        'blakkout': {
          'primary': '#00ff00', // Vert hacker
          'secondary': '#ff00ff', // Magenta glitch
          'accent': '#00ffff', // Cyan accent
          'background': '#0a0a0a', // Noir profond
          'foreground': '#f0f0f0', // Blanc cassé
          'error': '#ff0000', // Rouge erreur
          'muted': '#1a1a1a', // Gris foncé
          'overlay': 'rgba(0, 0, 0, 0.75)', // Overlay semi-transparent
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        // Effet de glitch pour le texte
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        // Effet de TV blackout
        "tv-blackout": {
          "0%": { opacity: "1" },
          "2%": { opacity: "0.8" },
          "4%": { opacity: "0.9" },
          "8%": { opacity: "0.1" },
          "9%": { opacity: "0.9" },
          "12%": { opacity: "0.8" },
          "18%": { opacity: "0.1" },
          "20%": { opacity: "0.9" },
          "25%": { opacity: "0.8" },
          "30%": { opacity: "0.1" },
          "35%": { opacity: "0.9" },
          "40%": { opacity: "1" },
          "100%": { opacity: "1" },
        },
        // Effet de scan ligne CRT
        "scan-line": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        // Effet de terminal typing
        "terminal-typing": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        // Effet de rotation 3D
        "rotate-3d": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glitch": "glitch 0.5s infinite",
        "tv-blackout": "tv-blackout 5s infinite",
        "scan-line": "scan-line 8s linear infinite",
        "terminal-typing": "terminal-typing 3.5s steps(40, end)",
        "rotate-3d": "rotate-3d 15s linear infinite",
      },
      fontFamily: {
        'mono': ['Space Mono', 'monospace'],
        'glitch': ['VT323', 'monospace'],
        'display': ['Orbitron', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url('/assets/images/noise.svg')",
        'grid': "url('/assets/images/grid.svg')",
        'circuit': "url('/assets/images/circuit-pattern.svg')",
      },
      // Ajout des propriétés pour les effets 3D
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}