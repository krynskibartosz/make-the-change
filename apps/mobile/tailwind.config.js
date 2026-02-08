/** @type {import('tailwindcss').Config} */
import { sharedConfig } from '@make-the-change/core/tailwind.config'
import nativewindPreset from 'nativewind/preset'

export default {
  ...sharedConfig,
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    '../../packages/core/src/shared/ui/**/*.{js,jsx,ts,tsx}',
    '../../packages/core/src/features/**/*.{ts,tsx}',
  ],
  presets: [nativewindPreset],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
      // Mobile specific overrides if needed, essentially merging safely
    },
  },
  plugins: [],
}
