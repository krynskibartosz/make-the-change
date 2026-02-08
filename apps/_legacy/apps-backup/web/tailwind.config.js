/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'background-light-base': 'var(--background-light-base)',
        'surface-light-base': 'var(--surface-light-base)',
        'text-light-primary': 'var(--text-light-primary)',
        'text-light-secondary': 'var(--text-light-secondary)',
        'border-light-subtle': 'var(--border-light-subtle)',
        'background-base': 'var(--background-base)',
        'surface-1': 'var(--surface-level-1)',
        'surface-2': 'var(--surface-level-2)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'border-subtle': 'var(--border-subtle)',
      },
      boxShadow: {
        'glow-md': '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
};
