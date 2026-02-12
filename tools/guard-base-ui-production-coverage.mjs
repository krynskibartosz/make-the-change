import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const contractPath = path.join(root, 'packages/core/src/shared/ui/base-ui-contract.ts')
const usageRoot = path.join(root, 'apps/web-client/src')
const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'])
const importPattern =
  /import\s*{([\s\S]*?)}\s*from\s*['"]@make-the-change\/core\/ui['"]/gm

function loadContractComponents(source, contractName) {
  const matcher = new RegExp(`${contractName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`)
  const match = source.match(matcher)
  if (!match) {
    throw new Error(`Could not locate ${contractName} in base-ui-contract.ts`)
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

function parseImportedSymbols(source) {
  const symbols = new Set()
  const matches = source.matchAll(importPattern)

  for (const match of matches) {
    const importBlock = match[1]
    const items = importBlock
      .split(',')
      .map((rawItem) => rawItem.replace(/\s+/g, ' ').trim())
      .filter(Boolean)

    for (const item of items) {
      const normalizedItem = item.replace(/^type\s+/, '')
      const [importedName] = normalizedItem.split(/\s+as\s+/)
      if (importedName) {
        symbols.add(importedName.trim())
      }
    }
  }

  return symbols
}

const contractSource = readFileSync(contractPath, 'utf8')
const productionComponents = loadContractComponents(contractSource, 'BASE_UI_PRODUCTION_COMPONENTS')
const coveredComponents = new Set()

const files = walkFiles(usageRoot)
for (const filePath of files) {
  const normalizedPath = filePath.replaceAll('\\', '/')
  if (normalizedPath.includes('/admin/_ui/base-ui/')) {
    continue
  }

  const source = readFileSync(filePath, 'utf8')
  const importedSymbols = parseImportedSymbols(source)

  for (const symbol of importedSymbols) {
    if (productionComponents.includes(symbol)) {
      coveredComponents.add(symbol)
    }
  }
}

const missing = productionComponents.filter((component) => !coveredComponents.has(component))

if (missing.length > 0) {
  console.error('Base UI production usage coverage check failed for web-client.')
  console.error('Missing imports from @make-the-change/core/ui for:')
  for (const component of missing) {
    console.error(`- ${component}`)
  }
  process.exit(1)
}

console.log(
  `Base UI production usage coverage OK in web-client (${coveredComponents.size}/${productionComponents.length}).`,
)
