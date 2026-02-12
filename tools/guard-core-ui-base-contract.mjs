import { readFileSync } from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const contractPath = path.join(projectRoot, 'packages/core/src/shared/ui/base-ui-contract.ts')
const indexPath = path.join(projectRoot, 'packages/core/src/shared/ui/index.ts')

function loadContractComponents(source) {
  const match = source.match(/BASE_UI_COMPONENTS\s*=\s*\[([\s\S]*?)\]\s*as const/)
  if (!match) {
    throw new Error('Could not locate BASE_UI_COMPONENTS in base-ui-contract.ts')
  }

  return Array.from(match[1].matchAll(/'([^']+)'/g), (value) => value[1])
}

function escapeForRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const contractSource = readFileSync(contractPath, 'utf8')
const indexSource = readFileSync(indexPath, 'utf8')
const components = loadContractComponents(contractSource)

const missingExports = components.filter((component) => {
  const matcher = new RegExp(`\\b${escapeForRegex(component)}\\b`)
  return !matcher.test(indexSource)
})

if (missingExports.length > 0) {
  console.error('Base UI contract is not fully exported from @make-the-change/core/ui.')
  console.error('Missing exports:')
  for (const component of missingExports) {
    console.error(`- ${component}`)
  }
  process.exit(1)
}

console.log(`Base UI export contract OK (${components.length}/${components.length}).`)
