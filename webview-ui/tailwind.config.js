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
        border: "var(--vscode-input-border)",
        input: "var(--vscode-input-background)",
        ring: "var(--vscode-focusBorder)",
        background: "var(--vscode-editor-background)",
        foreground: "var(--vscode-editor-foreground)",
        primary: {
          DEFAULT: "var(--vscode-button-background)",
          foreground: "var(--vscode-button-foreground)",
        },
        secondary: {
          DEFAULT: "var(--vscode-button-secondaryBackground)",
          foreground: "var(--vscode-button-secondaryForeground)",
        },
        destructive: {
          DEFAULT: "var(--vscode-errorForeground)",
          foreground: "var(--vscode-editor-foreground)",
        },
        muted: {
          DEFAULT: "var(--vscode-disabledForeground)",
          foreground: "var(--vscode-disabledForeground)",
        },
        accent: {
          DEFAULT: "var(--vscode-activityBar-activeBorder)",
          foreground: "var(--vscode-activityBar-foreground)",
        },
        popover: {
          DEFAULT: "var(--vscode-menu-background)",
          foreground: "var(--vscode-menu-foreground)",
        },
        card: {
          DEFAULT: "var(--vscode-editor-inactiveSelectionBackground)",
          foreground: "var(--vscode-editor-foreground)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
