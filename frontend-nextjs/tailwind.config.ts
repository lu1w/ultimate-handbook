import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
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

        /* Self-defined colours */
        white: {
          DEFAULT: 'var(--col-white-100)',
          op: 'rgb(var(--base-white))', // for specify opcacity, e.g. bg-white-op/90 set background 90% white
        },
        black: {
          DEFAULT: 'var(--col-black-100)',
          op: 'rgb(var(--base-black))', // for specify opcacity
        },
        link: 'var(--col-link-100)',
        home: {
          background: 'var(--col-heritage-25)',
        },
        subject: {
          DEFAULT: 'var(--col-heritage-25)',
          core: 'var(--col-blue-dark-50)',
          discipline: 'var(--col-blue-light-50)',
          compulsory: 'var(--col-pink-50)',
          breadth: 'var(--col-yellow-50)',
        },
        search: {
          header: 'var(--col-heritage-100)',
          muted: 'var(--col-heritage-50)',
        },
        planner: {
          header: 'var(--col-heritage-100)',
          sheet: 'var(--col-heritage-25)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
