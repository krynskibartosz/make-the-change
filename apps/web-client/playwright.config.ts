import { defineConfig, devices, type Project } from '@playwright/test'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'
const serverURL = process.env.PLAYWRIGHT_SERVER_URL || baseURL

const hasProjectFlag = (value: string) => {
  if (process.argv.includes(`--project=${value}`)) return true
  const flagIndex = process.argv.indexOf('--project')
  if (flagIndex === -1) return false
  const nextArg = process.argv[flagIndex + 1]
  return Boolean(nextArg && nextArg.split(',').includes(value))
}

const includeSeeding = hasProjectFlag('seeding')

const projects: Project[] = [
  {
    name: 'setup',
    testMatch: /.*\.setup\.ts/,
  },
  {
    name: 'chromium',
    dependencies: ['setup'],
    testMatch: /specs\/.*\.spec\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
      launchOptions: {
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
  },
]

if (includeSeeding) {
  projects.push({
    name: 'seeding',
    testMatch: /seed\/.*\.spec\.ts/,
    dependencies: ['setup'],
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/user.json',
      headless: false,
      launchOptions: {
        slowMo: 150,
        args: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
  })
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000,
  expect: {
    timeout: 15000,
  },
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  outputDir: 'test-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects,
  webServer: {
    command: 'pnpm dev',
    url: serverURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
