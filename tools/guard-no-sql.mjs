import { readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const ignoredDirs = new Set([
  '.git',
  '.next',
  '.turbo',
  '.vercel',
  'build',
  'dist',
  'node_modules',
  'out',
])

async function walk(directory, results) {
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    const relativePath = path.relative(root, absolutePath)

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        await walk(absolutePath, results)
      }
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.sql')) {
      results.push(relativePath)
    }
  }
}

const sqlFiles = []
await walk(root, sqlFiles)

if (sqlFiles.length > 0) {
  console.error('SQL files are not allowed in this repository.')
  console.error('Use the Supabase MCP server as the database source of truth.')
  for (const file of sqlFiles.sort()) {
    console.error(`- ${file}`)
  }
  process.exit(1)
}

console.log('No SQL files detected.')
