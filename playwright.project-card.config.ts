import { defineConfig } from 'playwright/test'

const runProjectCardE2E = process.env.RUN_PROJECT_CARD_E2E === '1'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['project-card-*.spec.ts'],
  fullyParallel: false,
  timeout: 30_000,
  expect: {
    timeout: 7_500,
  },
  reporter: 'list',
  use: {
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: runProjectCardE2E
    ? [
        {
          command: 'pnpm --filter @make-the-change/web dev',
          url: 'http://127.0.0.1:3000',
          reuseExistingServer: true,
          timeout: 120_000,
        },
        {
          command: 'pnpm --filter @make-the-change/web-client dev',
          url: 'http://127.0.0.1:3001',
          reuseExistingServer: true,
          timeout: 120_000,
        },
      ]
    : undefined,
})
