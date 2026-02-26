#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium, devices } from 'playwright'

const BASE_URL = process.env.FARM_MINERALS_BASE_URL ?? 'http://localhost:3001'
const OUTPUT_DIR = path.join(process.cwd(), 'output/playwright/farmminerals/parity')

const targets = [
  {
    name: 'desktop',
    route: '/en/hero-lab/farmminerals',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'mobile',
    route: '/en/hero-lab/farmminerals',
    device: devices['iPhone 12'],
  },
  {
    name: 'source-desktop',
    route: '/farmminerals/index.html',
    viewport: { width: 1440, height: 900 },
  },
  {
    name: 'source-mobile',
    route: '/farmminerals/index.html',
    device: devices['iPhone 12'],
  },
]

async function capture() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })

  try {
    for (const target of targets) {
      const context = await browser.newContext(
        target.device ? { ...target.device } : { viewport: target.viewport },
      )
      const page = await context.newPage()

      await page.goto(`${BASE_URL}${target.route}`, { waitUntil: 'load' })
      await page.waitForTimeout(2000)
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${target.name}.png`),
        fullPage: true,
        timeout: 120000,
      })

      await context.close()
      console.log(`Captured ${target.name}`)
    }
  } finally {
    await browser.close()
  }

  console.log(`Saved screenshots in ${OUTPUT_DIR}`)
}

capture().catch((error) => {
  console.error(error)
  process.exit(1)
})
