import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: 'var(--font-roboto)',
        jetbrains_mono: 'var(--font-jetbrains_mono)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        darkBorder: '#000',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        white: 'hsl(var(--white))',
        black: 'hsl(var(--black))',
        green: 'hsl(var(--green))',
        pink: 'hsl(var(--pink))',
        purple: 'hsl(var(--purple))',
        orange: 'hsl(var(--orange))',
        yellow: 'hsl(var(--yellow))',
        lightBlue: 'hsl(var(--light-blue))',
        deepPurple: 'hsl(var(--deep-purple))',
        blue: 'hsl(var(--blue))',
        red: 'hsl(var(--red))',
      },
      boxShadow: {
        light: '0px 6px 0px 0px #000',
        dark: '0px 6px 0px 0px #000',
      },
      translate: {
        boxShadowX: '0px',
        boxShadowY: '6px',
      },
      animation: {
        shake: 'shake 0.5s infinite',
      },
      keyframes: {
        shake: {
          '0%': {transform: 'translate(1px, 1px) rotate(0deg)'},
          '10%': {transform: 'translate(-1px, -2px) rotate(-1deg)'},
          '20%': {transform: 'translate(-3px, 0px) rotate(1deg)'},
          '30%': {transform: 'translate(3px, 2px) rotate(0deg)'},
          '40%': {transform: 'translate(1px, -1px) rotate(1deg)'},
          '50%': {transform: 'translate(-1px, 2px) rotate(-1deg)'},
          '60%': {transform: 'translate(-3px, 1px) rotate(0deg)'},
          '70%': {transform: 'translate(3px, 1px) rotate(-1deg)'},
          '80%': {transform: 'translate(-1px, -1px) rotate(1deg)'},
          '90%': {transform: 'translate(1px, 2px) rotate(0deg)'},
          '100%': {transform: 'translate(1px, -2px) rotate(-1deg)'},
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
