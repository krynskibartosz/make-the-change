const fs = require('node:fs')
const path = require('node:path')

const files = [
  'src/app/(screens)/ajouter-heures/page.tsx',
  'src/app/(screens)/ajouter-tache/page.tsx',
  'src/app/(screens)/depenses/[id]/editer/page.tsx',
  'src/app/(screens)/materiaux/[id]/editer/page.tsx',
  'src/app/(screens)/photos/ajouter/page.tsx',
  'src/app/(screens)/roadmap-viewer/page.tsx',
  'src/app/(screens)/taches/[id]/editer/page.tsx',
  'src/features/board/components/kanban-board.tsx',
  'src/features/planning/components/timeline-view.tsx',
]

files.forEach((f) => {
  const fullPath = path.join(__dirname, f)
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8')
    content = content.replace(/<Form\b/g, '<form')
    content = content.replace(/<\/Form>/g, '</form>')
    content = content.replace(/import Form from 'next\/form'\r?\n/, '')
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`Reverted ${f}`)
  }
})
