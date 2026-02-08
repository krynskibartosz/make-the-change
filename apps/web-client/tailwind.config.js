/** @type {import('tailwindcss').Config} */
import { sharedConfig } from '@make-the-change/core/tailwind.config'

export default {
  ...sharedConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/core/src/shared/ui/**/*.{js,jsx,ts,tsx}',
    '../../packages/core/src/features/**/*.{ts,tsx}',
  ],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}
