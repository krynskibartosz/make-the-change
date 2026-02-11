import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const marketingRoot = path.join(root, 'apps/web-client/src/app/[locale]/(marketing)')
const targetExtensions = new Set(['.ts', '.tsx'])

const literalColorPattern = /#(?:[0-9A-Fa-f]{3,8})\b|(?:rgb|hsl)a?\((?![^)]*var\()[^)]*\)/g
const inlineStyleColorPattern =
  /style=\{\{[^}]*\b(?:color|background(?:Color)?|border(?:Color)?|boxShadow)\b[^}]*\}\}/gs
const fixedPaletteClassPattern =
  /(?:from|via|to|bg|text|border|shadow|ring|stroke|fill)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-[0-9]{1,3})?(?:\/(?:[0-9]{1,3}|\[[^\]]+\]))?/g

async function walk(directory, files) {
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await walk(absolutePath, files)
      continue
    }

    const ext = path.extname(entry.name)
    if (entry.isFile() && targetExtensions.has(ext)) {
      files.push(absolutePath)
    }
  }
}

function getLineNumber(source, index) {
  return source.slice(0, index).split('\n').length
}

const files = []
await walk(marketingRoot, files)

const violations = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relativePath = path.relative(root, file)

  for (const match of source.matchAll(literalColorPattern)) {
    violations.push({
      file: relativePath,
      line: getLineNumber(source, match.index ?? 0),
      kind: 'literal-color',
      value: match[0],
    })
  }

  for (const match of source.matchAll(inlineStyleColorPattern)) {
    violations.push({
      file: relativePath,
      line: getLineNumber(source, match.index ?? 0),
      kind: 'inline-style-color',
      value: 'style={{ ...color/background... }}',
    })
  }

  for (const match of source.matchAll(fixedPaletteClassPattern)) {
    violations.push({
      file: relativePath,
      line: getLineNumber(source, match.index ?? 0),
      kind: 'fixed-palette-class',
      value: match[0],
    })
  }
}

if (violations.length > 0) {
  console.error('Hardcoded marketing colors are not allowed.')
  console.error('Use shared marketing tokens from packages/core/src/shared/ui/globals.css.')
  for (const violation of violations) {
    console.error(`- ${violation.file}:${violation.line} [${violation.kind}] ${violation.value}`)
  }
  process.exit(1)
}

console.log('No hardcoded marketing colors detected.')
