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
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      results.push(file)
    }
  })
  return results
}

const targetDirs = [path.join(__dirname, 'src/app/(screens)'), path.join(__dirname, 'src/features')]

let files = []
targetDirs.forEach((dir) => {
  if (fs.existsSync(dir)) files = files.concat(walk(dir))
})

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')
  if (content.match(/<form\b/) || content.includes('</form>')) {
    if (!content.includes("import Form from 'next/form'")) {
      content = "import Form from 'next/form'\n" + content
    }
    content = content.replace(/<form\b/g, '<Form').replace(/<\/form>/g, '</Form>')
    fs.writeFileSync(file, content, 'utf8')
    console.log('Updated Form in ' + file)
  }
})

const actionFiles = {
  'src/actions/zone-actions.ts': ['createZone', 'updateZone', 'deleteZone'],
  'src/actions/team-actions.ts': ['createPerson', 'updatePerson', 'deletePerson'],
  'src/actions/material-actions.ts': ['createMaterialMovement'],
}

Object.entries(actionFiles).forEach(([relPath, operations]) => {
  const file = path.join(__dirname, relPath)
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8')
    if (!content.includes("import { after } from 'next/server'")) {
      content = content.replace(
        /'use server'\r?\n/,
        "'use server'\n\nimport { after } from 'next/server'\n",
      )
    }
    operations.forEach((op) => {
      const regex = new RegExp(`(await mockClarusRepository\\.${op}\\(.*?\\)\\r?\\n)`, 'g')
      content = content.replace(
        regex,
        `$1    after(async () => { console.log('[BACKGROUND AUDIT] Operation ${op} completed.') })\n`,
      )
    })
    fs.writeFileSync(file, content, 'utf8')
    console.log('Updated Actions in ' + file)
  }
})
