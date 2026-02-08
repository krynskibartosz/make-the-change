import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()

const toPosixPath = (value) => value.split(path.sep).join('/')

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
      continue
    }
    if (!entry.isFile()) continue
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue
    files.push(fullPath)
  }
  return files
}

const findViolations = ({ files, ruleName, shouldFlag }) => {
  const violations = []
  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index]
      const result = shouldFlag(line, filePath)
      if (!result) continue
      violations.push({
        ruleName,
        file: toPosixPath(path.relative(repoRoot, filePath)),
        line: index + 1,
        message: result,
      })
    }
  }
  return violations
}

const uiRoot = path.join(repoRoot, 'packages/core/src/shared/ui')
const uiFiles = walk(uiRoot)

const isInDir = (filePath, dirPath) => {
  const rel = path.relative(dirPath, filePath)
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel)
}

const violations = [
  ...findViolations({
    files: uiFiles.filter((filePath) => !isInDir(filePath, path.join(uiRoot, 'next'))),
    ruleName: 'core-ui-next-imports',
    shouldFlag: (line) => {
      if (/from\s+['"]next\//.test(line) || /import\(\s*['"]next\//.test(line)) {
        return "Do not import `next/*` outside `packages/core/src/shared/ui/next`."
      }
      return null
    },
  }),
  ...findViolations({
    files: uiFiles.filter((filePath) => !isInDir(filePath, path.join(uiRoot, 'forms'))),
    ruleName: 'core-ui-rhf-imports',
    shouldFlag: (line) => {
      if (/from\s+['"]react-hook-form['"]/.test(line) || /import\(\s*['"]react-hook-form['"]/.test(line)) {
        return "Do not import `react-hook-form` outside `packages/core/src/shared/ui/forms` (use `@make-the-change/core/ui/rhf`)."
      }
      return null
    },
  }),
]

if (violations.length > 0) {
  // Group by rule for readability.
  const byRule = new Map()
  for (const violation of violations) {
    const existing = byRule.get(violation.ruleName) ?? []
    existing.push(violation)
    byRule.set(violation.ruleName, existing)
  }

  console.error('UI boundary checks failed:\n')
  for (const [ruleName, ruleViolations] of byRule.entries()) {
    console.error(`- ${ruleName}`)
    for (const v of ruleViolations) {
      console.error(`  - ${v.file}:${v.line} — ${v.message}`)
    }
    console.error('')
  }

  process.exit(1)
}

console.log('UI boundary checks passed.')

