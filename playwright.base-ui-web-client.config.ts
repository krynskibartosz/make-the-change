import { defineConfig } from 'playwright/test'

const runBaseUiWebClientE2E = process.env.RUN_BASE_UI_WEB_CLIENT_E2E === '1'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['base-ui-*.spec.ts'],
  fullyParallel: false,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  reporter: 'list',
  use: {
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: runBaseUiWebClientE2E
    ? {
        command: 'pnpm --filter @make-the-change/web-client dev',
        url: 'http://127.0.0.1:3001',
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
})
