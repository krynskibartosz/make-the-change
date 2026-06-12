const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  }
  return results;
}

const dirsToScan = [
  path.join(__dirname, 'src', 'app'),
  path.join(__dirname, 'src', 'features')
];

let files = [];
for (const dir of dirsToScan) {
  files = files.concat(walk(dir));
}

let modifiedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace p-5, px-5, -mx-5 with 4 equivalents inside classNames
  // We don't want to replace random text, only tailwind classes
  // A class is usually preceded by a space, quote, or backtick, and followed by space, quote, or backtick.
  
  content = content.replace(/(["'`\s])p-5(["'`\s])/g, '$1p-4$2');
  content = content.replace(/(["'`\s])px-5(["'`\s])/g, '$1px-4$2');
  content = content.replace(/(["'`\s])-mx-5(["'`\s])/g, '$1-mx-4$2');
  content = content.replace(/(["'`\s])sm:p-5(["'`\s])/g, '$1sm:p-4$2');
  content = content.replace(/(["'`\s])sm:px-5(["'`\s])/g, '$1sm:px-4$2');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
  }
}

console.log(`Standardized padding in ${modifiedCount} files.`);
