const fs = require('fs');
const path = require('path');

const filePath = './apps/web-client/src/lib/academy/content/units/chapter-1/sun.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find all option texts and check their length
const optionRegex = /text:\s*['"]([^'"]+)['"]/g;
let match;
let violations = [];

while ((match = optionRegex.exec(content)) !== null) {
  const fullMatch = match[0];
  const text = match[1];
  if (text.length > 50) {
    violations.push({ fullMatch, text, length: text.length });
  }
}

console.log('Found violations:', violations.length);
violations.forEach(v => {
  console.log(`"${v.text}" (${v.length} chars)`);
});

// Auto-fix: truncate to 50 chars
let fixedContent = content;
violations.forEach(v => {
  const truncated = v.text.substring(0, 47) + '...';
  const newFullMatch = v.fullMatch.replace(v.text, truncated);
  fixedContent = fixedContent.replace(v.fullMatch, newFullMatch);
  console.log(`Fixed: "${v.text}" -> "${truncated}"`);
});

if (violations.length > 0) {
  fs.writeFileSync(filePath, fixedContent);
  console.log('File updated successfully');
} else {
  console.log('No violations found');
}
