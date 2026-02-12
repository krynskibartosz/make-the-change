import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const uiRoot = path.join(root, 'packages/core/src/shared/ui')
const exceptionsPath = path.join(uiRoot, 'base-ui-exceptions.ts')
const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const rawInteractivePattern = /<(button|input|select|textarea)(\s|>)/g

function normalize(filePath) {
  return filePath.replaceAll('\\', '/')
}

function loadStringArrayConstant(source, constantName) {
  const matcher = new RegExp(`${constantName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`)
  const match = source.match(matcher)
  if (!match) {
    throw new Error(`Could not locate ${constantName} in base-ui-exceptions.ts`)
  }
  return Array.from(match[1].matchAll(/'([^']+)'/g), (value) => value[1])
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

const exceptionsSource = readFileSync(exceptionsPath, 'utf8')
const rawInteractiveAllowlist = new Set(loadStringArrayConstant(exceptionsSource, 'BASE_UI_RAW_INTERACTIVE_ALLOWLIST'))

const files = walkFiles(uiRoot)
const violations = []

for (const filePath of files) {
  const relativePath = normalize(path.relative(uiRoot, filePath))
  const normalizedAbsolutePath = normalize(filePath)

  if (normalizedAbsolutePath.includes('/base/')) {
    continue
  }

  if (relativePath === 'base-ui-exceptions.ts') {
    continue
  }

  if (relativePath.includes('/__tests__/') || /\.test\.[cm]?[jt]sx?$/.test(relativePath) || /\.spec\.[cm]?[jt]sx?$/.test(relativePath)) {
    continue
  }

  if (rawInteractiveAllowlist.has(relativePath)) {
    continue
  }

  const source = readFileSync(filePath, 'utf8')
  const lines = source.split('\n')

  lines.forEach((line, index) => {
    rawInteractivePattern.lastIndex = 0
    if (!rawInteractivePattern.test(line)) {
      return
    }

    violations.push({
      filePath: path.relative(root, filePath),
      line: index + 1,
      source: line.trim(),
    })
  })
}

if (violations.length > 0) {
  console.error('Raw interactive elements are not allowed in packages/core/src/shared/ui outside base/**.')
  console.error('Allowed by registry (BASE_UI_RAW_INTERACTIVE_ALLOWLIST):')
  for (const allowedPath of rawInteractiveAllowlist) {
    console.error(`- packages/core/src/shared/ui/${allowedPath}`)
  }
  console.error('')
  console.error('Violations:')
  for (const violation of violations) {
    console.error(`- ${violation.filePath}:${violation.line} -> ${violation.source}`)
  }
  process.exit(1)
}

console.log('Core UI raw interactive guard OK (no raw button/input/select/textarea outside base/).')
