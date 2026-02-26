#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

const REPO_ROOT = process.cwd()
const SOURCE_HTML = path.join(REPO_ROOT, 'output/playwright/farmminerals/home.html')
const SOURCE_CSS = path.join(REPO_ROOT, 'output/playwright/farmminerals/site.css')
const TARGET_ROOT = path.join(REPO_ROOT, 'apps/web-client/public/farmminerals')
const TARGET_MIRROR = path.join(TARGET_ROOT, '_mirror')
const TARGET_HTML = path.join(TARGET_ROOT, 'index.html')
const TARGET_CSS = path.join(TARGET_ROOT, 'site.css')

const ALLOWED_HOSTS = new Set([
  'www.farmminerals.com',
  'farmminerals.com',
  'farm-minerals.b-cdn.net',
  'cdn.prod.website-files.com',
  'd3e54v103j8qbb.cloudfront.net',
  'unpkg.com',
  'cdn.jsdelivr.net',
])

function extractUrlsFromHtml(html) {
  const urls = new Set()
  const quotedValueRegex = /["']([^"']*https:\/\/[^"']+)["']/g

  for (const match of html.matchAll(quotedValueRegex)) {
    const value = match[1]

    for (const nested of value.matchAll(/https:\/\/[^,\s"'<>]+/g)) {
      urls.add(nested[0])
    }
  }

  return urls
}

function extractUrlsFromCss(css) {
  const urls = new Set()
  let cursor = 0

  while (cursor < css.length) {
    const start = css.indexOf('url(', cursor)
    if (start === -1) break

    let i = start + 4
    let depth = 1
    let inQuote = ''
    let escaped = false
    let raw = ''

    while (i < css.length && depth > 0) {
      const char = css[i]

      if (escaped) {
        raw += char
        escaped = false
        i += 1
        continue
      }

      if (char === '\\') {
        raw += char
        escaped = true
        i += 1
        continue
      }

      if (inQuote) {
        if (char === inQuote) inQuote = ''
        raw += char
        i += 1
        continue
      }

      if (char === '"' || char === "'") {
        inQuote = char
        raw += char
        i += 1
        continue
      }

      if (char === '(') {
        depth += 1
        raw += char
        i += 1
        continue
      }

      if (char === ')') {
        depth -= 1
        if (depth === 0) break
        raw += char
        i += 1
        continue
      }

      raw += char
      i += 1
    }

    cursor = i + 1

    let token = raw.trim()
    token = token.replace(/^['"]|['"]$/g, '')
    token = token.replace(/\\([()'"])/g, '$1')

    if (token.startsWith('https://')) urls.add(token)
  }

  return urls
}

function filterAllowedUrls(urls) {
  return [...urls].filter((value) => {
    try {
      const url = new URL(value)
      return ALLOWED_HOSTS.has(url.hostname)
    } catch {
      return false
    }
  })
}

function toLocalWebPath(remoteUrl) {
  const url = new URL(remoteUrl)
  let pathname = url.pathname

  if (pathname.endsWith('/')) pathname += 'index.html'
  if (!pathname || pathname === '/') pathname = '/index.html'

  const searchSuffix = url.search
    ? `__q_${crypto.createHash('sha1').update(url.search).digest('hex').slice(0, 8)}`
    : ''

  const relativePath = `${url.hostname}${pathname}${searchSuffix}`
  return `/farmminerals/_mirror/${relativePath}`
}

function toLocalFilePath(localWebPath) {
  const relative = localWebPath.replace(/^\/farmminerals\/_mirror\//, '')
  const decodedRelative = relative
    .split('/')
    .map((segment) => {
      try {
        return decodeURIComponent(segment)
      } catch {
        return segment
      }
    })
    .join('/')

  return path.join(TARGET_MIRROR, decodedRelative)
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

async function downloadAll(urls) {
  const results = []
  const concurrency = 8
  let index = 0

  async function worker() {
    while (true) {
      const current = index
      index += 1
      if (current >= urls.length) return

      const remoteUrl = urls[current]
      const localWebPath = toLocalWebPath(remoteUrl)
      const localFilePath = toLocalFilePath(localWebPath)

      await ensureDir(localFilePath)

      try {
        const response = await fetch(remoteUrl)

        if (!response.ok) {
          results.push({ remoteUrl, localWebPath, ok: false, reason: `HTTP ${response.status}` })
          continue
        }

        const bytes = Buffer.from(await response.arrayBuffer())
        await fs.writeFile(localFilePath, bytes)
        results.push({ remoteUrl, localWebPath, ok: true })
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Unknown error'
        results.push({ remoteUrl, localWebPath, ok: false, reason })
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()))
  return results
}

function rewriteContent(content, replacements) {
  let output = content

  for (const { remoteUrl, localWebPath } of replacements) {
    output = output.split(remoteUrl).join(localWebPath)
    const escapedVariant = remoteUrl.replace(/\(/g, '\\(').replace(/\)/g, '\\)')
    if (escapedVariant !== remoteUrl) {
      output = output.split(escapedVariant).join(localWebPath)
    }
  }

  return output
}

async function main() {
  const [html, css] = await Promise.all([
    fs.readFile(SOURCE_HTML, 'utf8'),
    fs.readFile(SOURCE_CSS, 'utf8'),
  ])

  const urls = new Set([...extractUrlsFromHtml(html), ...extractUrlsFromCss(css)])
  const filteredUrls = filterAllowedUrls(urls).sort()

  await fs.mkdir(TARGET_ROOT, { recursive: true })
  await fs.mkdir(TARGET_MIRROR, { recursive: true })

  const downloadResults = await downloadAll(filteredUrls)
  const successful = downloadResults.filter((entry) => entry.ok)
  const failed = downloadResults.filter((entry) => !entry.ok)

  let rewrittenHtml = rewriteContent(html, successful)
  const rewrittenCss = rewriteContent(css, successful)

  rewrittenHtml = rewrittenHtml.replace(
    /href="[^"]*farm-minerals\.webflow\.shared[^"]*\.css[^"]*"/,
    'href="/farmminerals/site.css"',
  )
  rewrittenHtml = rewrittenHtml.replace(/src="\s+\/farmminerals\/_mirror/g, 'src="/farmminerals/_mirror')
  rewrittenHtml = rewrittenHtml.replace(/\s+integrity="[^"]*"/g, '')
  rewrittenHtml = rewrittenHtml.replace(/\s+crossorigin="[^"]*"/g, '')

  await Promise.all([fs.writeFile(TARGET_HTML, rewrittenHtml), fs.writeFile(TARGET_CSS, rewrittenCss)])

  console.log(`Downloaded: ${successful.length}/${filteredUrls.length}`)
  if (failed.length > 0) {
    console.log('Failed resources:')
    for (const entry of failed) {
      console.log(`- ${entry.remoteUrl} (${entry.reason})`)
    }
  }
  console.log(`Wrote ${TARGET_HTML}`)
  console.log(`Wrote ${TARGET_CSS}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
