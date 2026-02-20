import { spawnSync } from 'node:child_process'

const ROOT = 'src'
const checkMode = process.argv.includes('--check')

const metrics = [
  {
    key: 'react_fc',
    label: 'React.FC / FC<...>',
    pattern: '\\bReact\\.FC\\b|\\bFC<',
    comparator: 'eq',
    target: 0,
  },
  {
    key: 'as_unknown_as',
    label: 'as unknown as',
    pattern: 'as unknown as',
    comparator: 'eq',
    target: 0,
  },
  {
    key: 'dangerously_set_inner_html',
    label: 'dangerouslySetInnerHTML',
    pattern: 'dangerouslySetInnerHTML',
    comparator: 'eq',
    target: 0,
  },
  {
    key: 'component_props',
    label: 'ComponentProps*',
    pattern: '\\bComponentProps(?:WithRef|WithoutRef)?\\b',
    comparator: 'gte',
    target: 10,
  },
  {
    key: 'satisfies',
    label: 'satisfies',
    pattern: '\\bsatisfies\\b',
    comparator: 'gte',
    target: 15,
  },
  {
    key: 'extract',
    label: 'Extract<...>',
    pattern: '\\bExtract\\s*<',
    comparator: 'gte',
    target: 1,
  },
  {
    key: 'exclude',
    label: 'Exclude<...>',
    pattern: '\\bExclude\\s*<',
    comparator: 'gte',
    target: 1,
  },
  {
    key: 'noinfer',
    label: 'NoInfer<...>',
    pattern: '\\bNoInfer\\s*<',
    comparator: 'gte',
    target: 1,
  },
]

function countPattern(pattern) {
  const result = spawnSync('rg', ['-o', '--pcre2', pattern, ROOT], {
    encoding: 'utf8',
  })

  if (result.status === 1) {
    return 0
  }

  if (result.status !== 0) {
    process.stderr.write(result.stderr || 'Failed to run rg\n')
    process.exit(result.status || 1)
  }

  const output = result.stdout.trim()
  if (!output) return 0
  return output.split('\n').length
}

function compare(value, comparator, target) {
  if (comparator === 'eq') return value === target
  return value >= target
}

const rows = metrics.map((metric) => {
  const value = countPattern(metric.pattern)
  const pass = compare(value, metric.comparator, metric.target)
  return {
    ...metric,
    value,
    pass,
  }
})

for (const row of rows) {
  const operator = row.comparator === 'eq' ? '=' : '>='
  process.stdout.write(`${row.label}: ${row.value} (target ${operator} ${row.target})\n`)
}

if (!checkMode) {
  process.exit(0)
}

const failed = rows.filter((row) => !row.pass)
if (failed.length === 0) {
  process.stdout.write('\nAll TypeScript metrics checks passed.\n')
  process.exit(0)
}

process.stderr.write('\nTypeScript metrics check failed:\n')
for (const row of failed) {
  const operator = row.comparator === 'eq' ? '=' : '>='
  process.stderr.write(`- ${row.label}: got ${row.value}, expected ${operator} ${row.target}\n`)
}

process.exit(1)
