import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const targetDir = path.join(root, 'apps/web-client/src')
const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const directImportPattern =
  /(?:from\s+['"]@base-ui\/react(?:\/[^'"]*)?['"]|require\(\s*['"]@base-ui\/react(?:\/[^'"]*)?['"]\s*\))/

function walkFiles(dirPath, output = []) {
  const entries = readdirSync(dirPath)
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      walkFiles(fullPath, output)
      continue
    }

    if (supportedExtensions.has(path.extname(fullPath))) {
      output.push(fullPath)
    }
  }
  return output
}

const files = walkFiles(targetDir)
const violations = []

for (const filePath of files) {
  const source = readFileSync(filePath, 'utf8')
  if (!directImportPattern.test(source)) {
    continue
  }

  const lines = source.split('\n')
  lines.forEach((line, index) => {
    if (directImportPattern.test(line)) {
      violations.push({
        filePath,
        line: index + 1,
        source: line.trim(),
      })
    }
  })
}

if (violations.length > 0) {
  console.error('Direct @base-ui/react imports are not allowed in apps/web-client/src.')
  for (const violation of violations) {
    const relativePath = path.relative(root, violation.filePath)
    console.error(`- ${relativePath}:${violation.line} -> ${violation.source}`)
  }
  process.exit(1)
}

console.log('No direct @base-ui/react imports found in apps/web-client/src.')
