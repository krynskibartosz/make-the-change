import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const uiRoot = path.join(root, 'packages/core/src/shared/ui')
const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const directImportPattern =
  /(?:from\s+['"]@base-ui\/react(?:\/[^'"]*)?['"]|require\(\s*['"]@base-ui\/react(?:\/[^'"]*)?['"]\s*\))/

const allowlistedOutsideBase = new Set([
  'progress.tsx',
])

function normalize(filePath) {
  return filePath.replaceAll('\\', '/')
}

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

const files = walkFiles(uiRoot)
const violations = []

for (const filePath of files) {
  const normalizedAbsolutePath = normalize(filePath)
  const relativePath = normalize(path.relative(uiRoot, filePath))

  if (normalizedAbsolutePath.includes('/base/')) {
    continue
  }

  if (allowlistedOutsideBase.has(relativePath)) {
    continue
  }

  const source = readFileSync(filePath, 'utf8')
  if (!directImportPattern.test(source)) {
    continue
  }

  const lines = source.split('\n')
  lines.forEach((line, index) => {
    if (directImportPattern.test(line)) {
      violations.push({
        filePath: path.relative(root, filePath),
        line: index + 1,
        source: line.trim(),
      })
    }
  })
}

if (violations.length > 0) {
  console.error('Direct @base-ui/react imports are only allowed in packages/core/src/shared/ui/base/**.')
  console.error('Allowed outside base/:')
  for (const allowedPath of allowlistedOutsideBase) {
    console.error(`- packages/core/src/shared/ui/${allowedPath}`)
  }
  console.error('')
  console.error('Violations:')
  for (const violation of violations) {
    console.error(`- ${violation.filePath}:${violation.line} -> ${violation.source}`)
  }
  process.exit(1)
}

console.log(
  'Core UI direct Base UI primitive import guard OK (no direct @base-ui/react imports outside base/).',
)
