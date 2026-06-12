const fs = require('fs')
const path = require('path')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file))
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts')) {
      results.push(file)
    }
  })
  return results
}

const files = walk(path.join(__dirname, 'src'))

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')
  if (content.includes("'use client'") || content.includes('"use client"')) {
    // Check if it's already at the very top
    if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
      content = content.replace(/'use client';?\r?\n?/g, '')
      content = content.replace(/"use client";?\r?\n?/g, '')
      content = "'use client'\n" + content
      fs.writeFileSync(file, content, 'utf8')
      console.log('Fixed use client in: ' + file)
    }
  }
})
